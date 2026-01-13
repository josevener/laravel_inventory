<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Project;
use App\Models\GatePass;
use App\Models\GatePassItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

class GatePassController extends Controller
{
    /**
     * Detect gate pass type based on route
     */
    private function detectType(Request $request): string
    {
        if ($request->routeIs('gatepass.dispatch.*')) return 'dispatch';
        if ($request->routeIs('gatepass.pullout.*')) return 'pullout';
        abort(404, 'Invalid gatepass type');
    }

    /**
     * List gate passes
     */
    public function index(Request $request)
    {
        $type = $this->detectType($request);
        $authClient = Auth::user()->client;

        $query = GatePass::with(['project', 'createdBy'])
            ->where('type', $type)
            ->withCount('items')
            ->latest();

        if (!$authClient->is_superadmin) {
            $query->where('client_id', $authClient->id);
        }

        // Apply filters
        if ($request->filled('status')) $query->where('status', $request->status);
        if ($request->filled('project')) $query->where('project_id', $request->project);
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('gate_pass_no', 'LIKE', "%{$search}%")
                    ->orWhere('authorized_bearer', 'LIKE', "%{$search}%")
                    ->orWhereHas('project', fn($q) => $q->where('company_name', 'LIKE', "%{$search}%")
                    ->orWhere('name', 'LIKE', "%{$search}%"));
            });
        }

        $gatePasses = $query->paginate(15)->withQueryString();

        $projects = Project::where('client_id', $authClient->id)
            ->orderBy('company_name')->get(['id', 'company_name', 'name']);

        return Inertia::render('GatePass/Index', [
            'type' => $type,
            'gatePasses' => $gatePasses,
            'filters' => $request->only(['status', 'project', 'search']),
            'projects' => $projects,
        ]);
    }

    /**
     * Show create form
     */
    public function create(Request $request)
    {
        $type = $this->detectType($request);
        $authClient = Auth::user()->client;
        $today = now()->startOfDay();

        $todayCount = GatePass::where('client_id', $authClient->id)
            ->where('type', 'dispatch' )
            ->whereDate('created_at', $today)
            ->count();

        $nextNumber = 30000 + $todayCount;

        $projects = Project::where('client_id', $authClient->id)
            ->orderBy('company_name')->get(['id', 'name', 'company_name']);

        return Inertia::render('GatePass/Create', [
            'type' => $type,
            'projects' => $projects,
            'nextNumber' => $nextNumber,
        ]);
    }

    /**
     * Store gate pass
     */
    public function store($client, Request $request)
    {
        $type = $this->detectType($request);

        $validated = $request->validate([
            'project_id' => 'required|exists:projects,id',
            'authorized_bearer' => 'required|string|max:255',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        /**
         * DISPATCH validation (warehouse stock)
         */
        if ($type === 'dispatch') {
            foreach ($validated['items'] as $item) {
                $product = Product::find($item['product_id']);

                if ($item['quantity'] > $product->current_stock) {
                    return back()
                        ->withInput()
                        ->withErrors([
                            'items' => "Cannot dispatch {$item['quantity']} of {$product->name}. Only {$product->current_stock} in stock."
                        ]);
                }
            }
        }

        /**
         * PULLOUT validation (project stock)
         */
        if ($type === 'pullout') {
            foreach ($validated['items'] as $item) {

                $available = GatePassItem::query()
                    ->join('gate_passes', 'gate_pass_items.gate_pass_id', '=', 'gate_passes.id')
                    ->where('gate_passes.project_id', $validated['project_id'])
                    ->where('gate_passes.client_id', Auth::user()->client_id)
                    ->where('gate_pass_items.product_id', $item['product_id'])
                    ->selectRaw("
                        SUM(
                            CASE 
                                WHEN gate_passes.type = 'dispatch' THEN quantity
                                WHEN gate_passes.type = 'pullout' THEN -quantity
                                ELSE 0
                            END
                        )
                    ")
                    ->value('available');

                Log::info($available);
                
                if ($item['quantity'] > $available) {
                    return back()
                        ->withInput()
                        ->withErrors([
                            'items' => 'Pullout quantity exceeds dispatched quantity for this project.'
                        ]);
                }
            }
        }

        DB::transaction(function () use ($validated, $request, $type) {
            // Create Gate Pass
            $gatePass = GatePass::create([
                'gate_pass_no' => $type === "dispatch" ? $request->nextNumber : null,
                'project_id' => $validated['project_id'],
                'authorized_bearer' => $validated['authorized_bearer'],
                'type' => $type,
                'created_by' => Auth::id(),
                'status' => 'completed',
                'received_at' => now(),
                'client_id' => Auth::user()->client_id,
            ]);

            // Create items and adjust stock
            foreach ($validated['items'] as $item) {
                GatePassItem::create([
                    'gate_pass_id' => $gatePass->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'client_id' => Auth::user()->client_id,
                ]);

                $product = Product::find($item['product_id']);

                if ($type === 'dispatch') {
                    $product->decrement('current_stock', $item['quantity']);
                } 
                else {
                    $product->increment('current_stock', $item['quantity']);
                }
            }
        });

        return redirect()
            ->route("gatepass.{$type}.index", ['client' => $client])
            ->with('success', ucfirst($type) . " Gate Pass {$request->nextNumber} created successfully!");
    }

    /**
     * Print gate pass PDF
     */
    public function print_gatepass($client, Request $request, GatePass $gatepass)
    {
        $type = $this->detectType($request);

        $gatepass->load(['project', 'client', 'items.product.unit', 'createdBy']);

        $company = [
            'name' => $gatepass->client->name ?? config('app.name', 'Zentrix Solutions.'),
            'address' => $gatepass->client->address ?? 'Quezon City',
        ];

        $qrCode = base64_encode(
            QrCode::format('svg')->size(140)->errorCorrection('H')
                ->generate(route("gatepass.{$type}.print_gatepass", ['gatepass' => $gatepass->id, 'client' => $client]))
        );

        $pdf = Pdf::loadView('pdf.gatepass', [
            'gatePass' => $gatepass,
            'company' => $company,
            'qrCode' => $qrCode,
        ])
            ->setPaper('letter', 'portrait')
            ->setOptions([
                'defaultFont' => 'DejaVu Sans',
                'isRemoteEnabled' => true,
                'isHtml5ParserEnabled' => true,
            ]);

        return $pdf->stream("DGP-{$gatepass->created_at}-{$gatepass->gate_pass_no}.pdf");
    }

    public function dispatchedItems($client, Project $project)
    {
        $clientId = Auth::user()->client_id;

        // Tenant safety
        abort_if($project->client_id !== $clientId, 403);

        $items = GatePassItem::query()
            ->select(
                'product_id',
                DB::raw("
                SUM(
                    CASE 
                        WHEN gate_passes.type = 'dispatch' THEN quantity
                        WHEN gate_passes.type = 'pullout' THEN -quantity
                        ELSE 0
                    END
                ) as available_quantity
            ")
            )
            ->join('gate_passes', 'gate_pass_items.gate_pass_id', '=', 'gate_passes.id')
            ->where('gate_passes.client_id', $clientId)
            ->where('gate_passes.project_id', $project->id)
            ->where('gate_passes.status', 'completed')
            ->groupBy('product_id')
            ->having('available_quantity', '>', 0)
            ->with([
                'product:id,sku,name,current_stock,reorder_level,unit_id',
                'product.unit:id,short_name',
            ])
            ->get()
            ->map(fn($row) => [
                'id' => $row->product->id,
                'sku' => $row->product->sku,
                'name' => $row->product->name,
                'current_stock' => $row->available_quantity,
                'dispatched_qty' => $row->available_quantity,
                'unit_short' => $row->product->unit->short_name,
            ]);

        return response()->json($items);
    }
}
