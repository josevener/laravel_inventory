<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Supplier;
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
        $query = InwardGatePass::with(['supplier', 'warehouse', 'createdBy'])
            ->withCount('items')
            ->latest();

        // Filters
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }
        if ($request->filled('supplier')) {
            $query->where('supplier_id', $request->supplier);
        }
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('gate_pass_no', 'LIKE', "%{$search}%")
                    ->orWhere('vehicle_no', 'LIKE', "%{$search}%")
                    ->orWhereHas('supplier', fn($q) => $q->where('company_name', 'LIKE', "%{$search}%"));
            });
        }

        $gatePasses = $query->paginate(15)->withQueryString();

        return Inertia::render('GatePass/Inward/Index', [
            'gatePasses' => $gatePasses,
            'filters' => $request->only(['status', 'supplier', 'search']),
            'suppliers' => Supplier::orderBy('company_name')->get(['id', 'company_name']),
        ]);
    }

    public function create()
    {
        return Inertia::render('GatePass/Inward/Create', [
            'suppliers' => Supplier::all(['id', 'name', 'company_name']),
            'warehouses' => Warehouse::where('is_active', true)->get(['id', 'name']),
            'nextNumber' => 'IGP-' . now()->format('Y') . '-' . str_pad(InwardGatePass::count() + 1, 5, '0', STR_PAD_LEFT),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'supplier_id' => 'required|exists:suppliers,id',
            'warehouse_id' => 'required|exists:warehouses,id',
            'vehicle_no' => 'required|string',
            'driver_name' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        DB::transaction(function () use ($validated, $request) {
            $gatePass = InwardGatePass::create([
                'gate_pass_no' => $request->nextNumber ?? ('IGP-' . now()->format('Y') . '-' . str_pad(InwardGatePass::count() + 1, 5, '0', STR_PAD_LEFT)),
                'supplier_id' => $validated['supplier_id'],
                'warehouse_id' => $validated['warehouse_id'],
                'vehicle_no' => $validated['vehicle_no'],
                'driver_name' => $request->driver_name,
                'created_by' => Auth::id(),
                'status' => 'pending',
            ]);

            foreach ($validated['items'] as $item) {
                InwardGatePassItem::create([
                    'inward_gate_pass_id' => $gatePass->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                ]);
            }

            // Optional: Auto-receive on save
            // $this->receiveGatePass($gatePass);
        });

        return redirect()->route('gatepass.inward.index')->with('success', 'Inward Gate Pass created!');
    }

    // public function print(InwardGatePass $gatePass)
    // {
    //     // Eager load everything
    //     $gatePass->load(['supplier', 'warehouse', 'items.product.unit', 'createdBy']);

    //     // Generate QR Code (opens the gate pass in browser)
    //     $qrCode = base64_encode(QrCode::format('svg')->size(120)->generate(route('gatepass.inward.print', $gatePass)));

    //     // Generate Barcode (Code 128)
    //     $barcode = base64_encode(DNS1D::getBarcodePNG($gatePass->gate_pass_no, 'C128', 2, 60));

    //     $pdf = Pdf::loadView('pdf.inward-gate-pass', [
    //         'gatePass' => $gatePass,
    //         'qrCode' => $qrCode,
    //         'barcode' => $barcode,
    //         'company' => [
    //             'name' => config('app.name', 'Your Company'),
    //             'address' => '123 Industrial Area, Mumbai - 400001',
    //             'phone' => '+91 98765 43210',
    //             'email' => 'info@yourcompany.com',
    //             'gst' => '27AAACY1234D1Z5',
    //             'logo' => public_path('logo.png'), // Put your logo in public/logo.png
    //         ]
    //     ]);

    //     // return $pdf->stream('Inward-Gate-Pass-' . $gatePass->gate_pass_no . '.pdf');
    //     return $pdf
    //         ->setPaper('a4')
    //         ->stream('Inward-Gate-Pass-' . $gatePass->gate_pass_no . '.pdf', [
    //             'Attachment' => false  // This forces inline display (opens in browser)
    //         ]);
    // }

    public function print(InwardGatePass $gatePass)
    {
        $gatePass->load(['supplier', 'warehouse', 'items.product.unit', 'createdBy']);

        // QR Code (SVG)
        $qrCode = base64_encode(
            QrCode::format('svg')
                ->size(130)
                ->generate(route('gatepass.inward.print', $gatePass))
        );

        // Barcode (Code 128)
        $barcode = base64_encode(
            DNS1D::getBarcodePNG($gatePass->gate_pass_no, 'C128', 3, 70)
        );

        $pdf = Pdf::loadView('pdf.inward-gate-pass', [
            'gatePass' => $gatePass,
            'qrCode'   => $qrCode,
            'barcode'  => $barcode,
            'company'  => [
                'name'    => config('app.name', 'Your Company'),
                'address' => '123 Industrial Area, Mumbai - 400001',
                'phone'   => '+91 98765 43210',
                'email'   => 'info@yourcompany.com',
                'gst'     => '27AAACY1234D1Z5',
                'logo'    => public_path('logo.png'),
            ]
        ])->setPaper('a4', 'portrait');

        // THIS FORCES DOWNLOAD — user gets file in Downloads folder
        return $pdf->download('IGP-' . $gatePass->gate_pass_no . '.pdf');
    }

    public function printPayslipMonthly()
    {
        $employee = (object) [
            'name'        => 'John Michael Santos',
            'designation' => 'Software Engineer',
            'department'  => 'IT Department',
            'date_joined' => '2021-06-15',
        ];

        // CUTOFF 1
        $cutoff1 = [
            'period'        => 'Nov 01–15, 2024',
            'worked_days'   => 10,
            'earnings'      => [
                'Basic Salary' => 15000,
                'Allowance'    => 1000,
                'OT Pay'       => 1200,
            ],
            'deductions'    => [
                'SSS' => 300,
                'PHIC' => 200,
                'HDMF' => 100,
            ],
        ];

        $cutoff1['total_earnings']   = array_sum($cutoff1['earnings']);
        $cutoff1['total_deductions'] = array_sum($cutoff1['deductions']);
        $cutoff1['net_pay']          = $cutoff1['total_earnings'] - $cutoff1['total_deductions'];


        // CUTOFF 2
        $cutoff2 = [
            'period'        => 'Nov 16–30, 2024',
            'worked_days'   => 10,
            'earnings'      => [
                'Basic Salary' => 15000,
                'Allowance'    => 1000,
                'Holiday Pay'  => 1500,
            ],
            'deductions'    => [
                'SSS' => 300,
                'PHIC' => 200,
                'HDMF' => 100,
                'Tax' => 500,
            ],
        ];

        $cutoff2['total_earnings']   = array_sum($cutoff2['earnings']);
        $cutoff2['total_deductions'] = array_sum($cutoff2['deductions']);
        $cutoff2['net_pay']          = $cutoff2['total_earnings'] - $cutoff2['total_deductions'];

        $company = [
            'name'    => config('app.name', 'Zentrix Solutions Inc.'),
            'address' => 'Unit 402, TechHub Building, Quezon City, NCR 1109',
        ];

        return Pdf::loadView('pdf.payslip-monthly', [
            'employee' => $employee,
            'company'  => $company,
            'cutoff1'  => $cutoff1,
            'cutoff2'  => $cutoff2,
        ])->setPaper('a4', 'portrait')
            ->download(now().'Payslip-FullMonth.pdf');
    }
}
