<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Project;
use App\Models\Warehouse;
use App\Models\InwardGatePass;
use App\Models\InwardGatePassItem;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Barryvdh\DomPDF\Facade\Pdf;
use SimpleSoftwareIO\QrCode\Facades\QrCode;
use DNS1D;

class InwardGatePassController extends Controller
{
    public function index(Request $request)
    {
        $authClient = Auth::user()->client;

        $query = InwardGatePass::with(['project', 'createdBy'])
            ->withCount('items')
            ->latest();

        // If client is NOT superadmin → restrict by client_id
        if (!$authClient->is_superadmin) {
            $query->where('client_id', $authClient->id);
        }

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
                    ->orWhereHas('project', function ($q) use ($search) {
                        $q->where('company_name', 'LIKE', "%{$search}%")
                            ->orWhere('name', 'LIKE', "%{$search}%");
                    });
            });
        }

        $gatePasses = $query->paginate(15)->withQueryString();

        return Inertia::render('GatePass/Inward/Index', [
            'gatePasses' => $gatePasses,
            'filters' => $request->only(['status', 'project', 'search']),
            'projects' => Project::when(
                !$authClient->is_superadmin,
                fn($q) =>
                $q->where('client_id', $authClient->id)
            )
                ->orderBy('company_name')
                ->get(['id', 'company_name', 'name']),
        ]);
    }

    public function create()
    {
        $authClient = Auth::user()->client;

        $today = now()->startOfDay();

        // Tenant-safe numbering
        $todayCount = InwardGatePass::where('client_id', $authClient->id)
            ->whereDate('created_at', $today)
            ->count();

        $nextNumber = 3000 + $todayCount;

        return Inertia::render('GatePass/Inward/Create', [
            'projects' => Project::when(
                !$authClient->is_superadmin,
                fn($q) =>
                $q->where('client_id', $authClient->id)
            )
                ->orderBy('company_name')
                ->get(['id', 'name', 'company_name']),
            'nextNumber' => $nextNumber,
        ]);
    }

    public function store($client, Request $request)
    {
        $validated = $request->validate([
            'project_id' => 'required|exists:projects,id',
            'vehicle_no' => 'required|string|max:20',
            'driver_name' => 'nullable|string|max:100',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        DB::transaction(function () use ($validated, $request) {
            // 1. Create the Inward Gate Pass
            $gatePass = InwardGatePass::create([
                'gate_pass_no' => $request->nextNumber,
                'project_id' => $validated['project_id'],
                'vehicle_no' => $validated['vehicle_no'],
                'driver_name' => $validated['driver_name'],
                'created_by' => Auth::id(),
                'status' => 'completed', // Auto-complete since no warehouse approval needed
                'received_at' => now(),
                'client_id' => Auth::user()->client_id,
            ]);

            // 2. Create items
            foreach ($validated['items'] as $item) {
                InwardGatePassItem::create([
                    'inward_gate_pass_id' => $gatePass->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'client_id' => Auth::user()->client_id,
                ]);

                // 3. Update product stock immediately
                $product = Product::find($item['product_id']);
                $product->increment('current_stock', $item['quantity']);
            }
        });

        return redirect()
            ->route('gatepass.inward.index', [
                'client' => $client,
            ])
            ->with('success', "Inward Gate Pass {$request->nextNumber} created and stock received successfully!");
    }

    // public function printPayslipMonthly()
    // {
    //     $employee = (object) [
    //         'name'        => 'John Michael Santos',
    //         'designation' => 'Software Engineer',
    //         'department'  => 'IT Department',
    //         'date_joined' => '2021-06-15',
    //     ];

    //     // CUTOFF 1
    //     $cutoff1 = [
    //         'period'        => 'Nov 01–15, 2024',
    //         'worked_days'   => 10,
    //         'earnings'      => [
    //             'Basic Salary' => 15000,
    //             'Allowance'    => 1000,
    //             'OT Pay'       => 1200,
    //         ],
    //         'deductions'    => [
    //             'SSS' => 300,
    //             'PHIC' => 200,
    //             'HDMF' => 100,
    //         ],
    //     ];

    //     $cutoff1['total_earnings']   = array_sum($cutoff1['earnings']);
    //     $cutoff1['total_deductions'] = array_sum($cutoff1['deductions']);
    //     $cutoff1['net_pay']          = $cutoff1['total_earnings'] - $cutoff1['total_deductions'];


    //     // CUTOFF 2
    //     $cutoff2 = [
    //         'period'        => 'Nov 16–30, 2024',
    //         'worked_days'   => 10,
    //         'earnings'      => [
    //             'Basic Salary' => 15000,
    //             'Allowance'    => 1000,
    //             'Holiday Pay'  => 1500,
    //         ],
    //         'deductions'    => [
    //             'SSS' => 300,
    //             'PHIC' => 200,
    //             'HDMF' => 100,
    //             'Tax' => 500,
    //         ],
    //     ];

    //     $cutoff2['total_earnings']   = array_sum($cutoff2['earnings']);
    //     $cutoff2['total_deductions'] = array_sum($cutoff2['deductions']);
    //     $cutoff2['net_pay']          = $cutoff2['total_earnings'] - $cutoff2['total_deductions'];

    //     $company = [
    //         'name'    => config('app.name', 'Zentrix Solutions Inc.'),
    //         'address' => 'Unit 402, TechHub Building, Quezon City, NCR 1109',
    //     ];

    //     return Pdf::loadView('pdf.payslip-monthly', [
    //         'employee' => $employee,
    //         'company'  => $company,
    //         'cutoff1'  => $cutoff1,
    //         'cutoff2'  => $cutoff2,
    //     ])->setPaper('a4', 'portrait')
    //         ->download(now() . 'Payslip-FullMonth.pdf');
    // }

    public function print_gatepass($client, InwardGatePass $gatepass)
    {
        // Load all needed relationships
        $gatepass->load([
            'project',
            'items.product.unit',
            'createdBy',
        ]);

        // Company info from config (recommended way)
        $company = [
            'name' => config('app.name', 'SSI Metal Corp.'),
            'address' => 'Quezon City',
        ];

        // Generate QR Code (SVG → Base64)
        $qrCode = base64_encode(
            QrCode::format('svg')
                ->size(140)
                ->errorCorrection('H')
                ->generate(route('gatepass.inward.print_gatepass', [
                    'gatepass' => $gatepass->id,
                    'client' => $client
                ]))
        );

        // Optional: Generate Barcode (using DNS1D or similar)
        // $barcode = base64_encode(\DNS1D::getBarcodePNG($gatepass->gate_pass_no, 'C128', 2, 60));

        // Load PDF View
        $pdf = Pdf::loadView('pdf.gatepass', [
            'gatePass' => $gatepass,
            'company' => $company,
            'qrCode' => $qrCode,
            // 'barcode'  => $barcode ?? null,
        ])
            ->setPaper('letter', 'portrait')
            ->setOptions([
                'defaultFont' => 'DejaVu Sans',
                'isRemoteEnabled' => true,
                'isHtml5ParserEnabled' => true,
            ]);

        // Stream as downloadable PDF
        return $pdf->stream("IGP-{$gatepass->gate_pass_no}.pdf");
    }
}
