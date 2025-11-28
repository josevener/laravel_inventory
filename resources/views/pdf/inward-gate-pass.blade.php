<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Inward Gate Pass - {{ $gatePass->gate_pass_no }}</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; margin: 0; padding: 20px; color: #333; }
        .container { max-width: 800px; margin: 0 auto; border: 3px solid #1e40af; border-radius: 12px; overflow: hidden; }
        .header { background: #1e40af; color: white; padding: 20px; text-align: center; }
        .header h1 { margin: 0; font-size: 28px; }
        .header h2 { margin: 8px 0 0; font-size: 20px; font-weight: normal; }
        .content { padding: 30px; background: #f8fafc; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
        .info-box { background: white; padding: 15px; border-radius: 8px; border-left: 4px solid #1e40af; }
        .info-box h3 { margin: 0 0 10px; color: #1e40af; font-size: 14px; text-transform: uppercase; }
        .barcode { text-align: center; margin: 20px 0; }
        .barcode img { height: 70px; }
        .qr-code { text-align: center; margin: 20px 0; }
        .qr-code img { width: 120px; height: 120px; border: 8px solid white; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; background: white; }
        th { background: #1e40af; color: white; padding: 12px; text-align: left; }
        td { padding: 12px; border-bottom: 1px solid #e2e8f0; }
        tr:nth-child(even) { background: #f8fafc; }
        .footer { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-top: 50px; }
        .signature { text-align: center; border-top: 2px solid #333; padding-top: 10px; margin-top: 60px; }
        .logo { height: 80px; margin-bottom: 10px; }
        .text-center { text-align: center; }
        .text-bold { font-weight: bold; }
        .text-lg { font-size: 18px; }
        .mt-4 { margin-top: 16px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            @if(file_exists($company['logo']))
                <img src="{{ $company['logo'] }}" class="logo" alt="Company Logo">
            @endif
            <h1>{{ $company['name'] }}</h1>
            <h2>INWARD GATE PASS</h2>
        </div>

        <div class="content">
            <!-- Gate Pass No + Date + Barcode -->
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <div>
                    <h1 style="margin:0; font-size:36px; color:#1e40af;">
                        {{ $gatePass->gate_pass_no }}
                    </h1>
                    <p style="margin:5px 0 0; color:#666;">
                        Date: {{ \Carbon\Carbon::parse($gatePass->created_at)->format('d M Y h:i A') }}
                    </p>
                </div>
                <div class="barcode">
                    <img src="data:image/png;base64,{{ $barcode }}" alt="Barcode">
                    <div style="margin-top:8px; font-weight:bold;">{{ $gatePass->gate_pass_no }}</div>
                </div>
            </div>

            <!-- Info Grid -->
            <div class="info-grid">
                <div class="info-box">
                    <h3>Supplier Details</h3>
                    <div class="text-bold text-lg">{{ $gatePass->supplier->company_name ?? $gatePass->supplier->name }}</div>
                    <div>Phone: {{ $gatePass->supplier->phone ?? '—' }}</div>
                    <div>GST: {{ $gatePass->supplier->gst_number ?? '—' }}</div>
                </div>
                <div class="info-box">
                    <h3>Receiving Warehouse</h3>
                    <div class="text-bold text-lg">{{ $gatePass->warehouse->name }}</div>
                    <div>{{ $gatePass->warehouse->address ?? '' }}</div>
                </div>
            </div>

            <div class="info-grid">
                <div class="info-box">
                    <h3>Vehicle & Driver</h3>
                    <div><strong>Vehicle No:</strong> {{ strtoupper($gatePass->vehicle_no) }}</div>
                    <div><strong>Driver:</strong> {{ $gatePass->driver_name ?? '—' }}</div>
                </div>
                <div class="info-box">
                    <h3>Status & Created By</h3>
                    <div><strong>Status:</strong> 
                        <span style="padding:4px 12px; border-radius:4px; background:#10b981; color:white;">
                            {{ ucfirst($gatePass->status) }}
                        </span>
                    </div>
                    <div><strong>Created By:</strong> {{ $gatePass->createdBy->name }}</div>
                </div>
            </div>

            <!-- Items Table -->
            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Product</th>
                        <th>SKU</th>
                        <th>Unit</th>
                        <th class="text-center">Quantity</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($gatePass->items as $index => $item)
                    <tr>
                        <td>{{ $loop->iteration }}</td>
                        <td class="text-bold">{{ $item->product->name }}</td>
                        <td>{{ $item->product->sku }}</td>
                        <td>{{ $item->product->unit->short_name ?? 'Pc' }}</td>
                        <td class="text-center text-bold" style="font-size:18px;">
                            {{ $item->quantity }}
                        </td>
                    </tr>
                    @endforeach
                </tbody>
            </table>

            <!-- QR Code -->
            <div class="qr-code">
                <img src="data:image/svg+xml;base64,{{ $qrCode }}" alt="QR Code">
                <div class="mt-4">Scan to view online</div>
            </div>

            <!-- Signatures -->
            <div class="footer">
                <div class="signature">
                    <div>_________________________</div>
                    <div class="text-bold">Security Officer</div>
                    <div>Name & Signature</div>
                </div>
                <div class="signature">
                    <div>_________________________</div>
                    <div class="text-bold">Receiver / Store In-Charge</div>
                    <div>Name & Signature</div>
                </div>
            </div>

            <div class="text-center" style="margin-top:40px; color:#666; font-size:12px;">
                {{ $company['name'] }} • {{ $company['address'] }} • GST: {{ $company['gst'] }}
            </div>
        </div>
    </div>
</body>
</html>