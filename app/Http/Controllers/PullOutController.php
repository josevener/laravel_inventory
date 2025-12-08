<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Project;
use App\Models\PullOut;
use App\Models\PullOutItem;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Barryvdh\DomPDF\Facade\Pdf;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

class PullOutController extends Controller
{
    public function index(Request $request)
    {
        $query = PullOut::with(['project', 'createdBy'])
            ->where('client_id', Auth::user()->client_id)
            ->withCount('items')
            ->latest();

        // Filters
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('project')) {
            $query->where('project_id', $request->project);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('gate_pass_no', 'LIKE', "%{$search}%")
                    ->orWhere('vehicle_no', 'LIKE', "%{$search}%")
                    ->orWhere('driver_name', 'LIKE', "%{$search}%")
                    ->orWhereHas('project', fn($q) => $q->where('company_name', 'LIKE', "%{$search}%")->orWhere('name', 'LIKE', "%{$search}%"));
            });
        }

        $pullOuts = $query->paginate(15)->withQueryString();

        return Inertia::render('PullOut/Index', [
            'pullOuts' => $pullOuts,
            'filters'  => $request->only(['status', 'project', 'search']),
            'projects' => Project::where('client_id', Auth::user()->client_id)
                ->orderBy('company_name')
                ->get(['id', 'company_name', 'name']),
        ]);
    }

    public function create()
    {
        $today = now()->startOfDay();

        // Count how many pull outs were created today
        $todayCount = PullOut::whereDate('created_at', $today)->count();

        // Start from 3000 every day
        $nextNumber = 3000 + $todayCount;

        return Inertia::render('PullOut/Create', [
            'projects'   => Project::where('client_id', Auth::user()->client_id)
                ->get(['id', 'name', 'company_name']),
            'nextNumber' => $nextNumber,
        ]);
    }

    public function store($client, Request $request)
    {
        $validated = $request->validate([
            'project_id'   => 'required|exists:projects,id',
            'vehicle_no'    => 'required|string|max:20',
            'driver_name'   => 'nullable|string|max:100',
            'items'         => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity'   => 'required|integer|min:1',
        ]);

        DB::transaction(function () use ($validated, $request) {
            // 1. Create the Pull Out
            $pullOut = PullOut::create([
                'gate_pass_no' => $request->nextNumber,
                'project_id'   => $validated['project_id'],
                'vehicle_no'   => $validated['vehicle_no'],
                'driver_name'  => $validated['driver_name'],
                'created_by'   => Auth::id(),
                'status'       => 'completed',
                'issued_at'    => now(),
                'client_id'    => Auth::user()->client_id,
            ]);

            // 2. Create items and decrement stock
            foreach ($validated['items'] as $item) {
                PullOutItem::create([
                    'pull_out_id' => $pullOut->id,
                    'product_id'  => $item['product_id'],
                    'quantity'    => $item['quantity'],
                    'client_id'   => Auth::user()->client_id,
                ]);

                // Decrement stock
                Product::where('id', $item['product_id'])
                    ->decrement('current_stock', $item['quantity']);
            }
        });

        return redirect()->route('pull_out.index', ['client_id', $client])
            ->with('success', "Pull Out {$request->nextNumber} created and stock issued successfully!");
    }

    public function print_gatepass($client, PullOut $pullOut)
    {
        // Load relationships
        $pullOut->load([
            'project',
            'items.product.unit',
            'createdBy',
        ]);

        // Company info
        $company = [
            'name'    => config('app.name', 'SSI Metal Corp.'),
            'address' => 'Quezon City',
        ];

        // QR Code
        $qrCode = base64_encode(
            QrCode::format('svg')
                ->size(140)
                ->errorCorrection('H')
                ->generate(route('pull_out.print_gatepass', [
                    'pull_out' => $pullOut->id,
                    'client' => $client,
                ]))
        );

        $pdf = Pdf::loadView('pdf.pull_out', [
            'pullOut' => $pullOut,
            'company' => $company,
            'qrCode'  => $qrCode,
        ])
            ->setPaper('letter', 'portrait')
            ->setOptions([
                'defaultFont' => 'DejaVu Sans',
                'isRemoteEnabled' => true,
                'isHtml5ParserEnabled' => true,
            ]);

        return $pdf->stream("PO-{$pullOut->gate_pass_no}.pdf");
    }
}