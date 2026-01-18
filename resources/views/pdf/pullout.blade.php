<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>{{ $company['name'] ?? 'SSI Metal Corp.' }} — Pull Out</title>

    <style>
        @page {
            size: letter;
            margin: 12mm;
        }

        body {
            font-family: Arial, Helvetica, sans-serif;
            font-size: 10pt;
            color: #000;
        }

        .bold { font-weight: bold; }
        .text-center { text-align: center; }

        /* HEADER */
        .header {
            position: relative;
            margin-bottom: 20px;
        }

        .header h1 {
            margin: 0;
            font-size: 20pt;
            letter-spacing: 1px;
        }

        .header small {
            font-size: 9pt;
        }

        .qr {
            position: absolute;
            right: 0;
            top: 0;
            width: 70px;
            height: 70px;
        }

        /* INFO */
        .info {
            margin-bottom: 15px;
            line-height: 1.6;
        }

        .label {
            display: inline-block;
            width: 120px;
            font-weight: bold;
        }

        /* TABLE */
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }

        th, td {
            border: 1px solid #000;
            padding: 6px;
        }

        th {
            background: #f2f2f2;
            text-transform: uppercase;
            font-size: 9pt;
        }

        /* FOOTER */
        .hash-line {
            margin: 15px 0;
            text-align: center;
            font-size: 9pt;
            color: #555;
        }

        .signatures {
            margin-top: 40px;
            width: 100%;
        }

        .sign-col {
            width: 48%;
            display: inline-block;
            vertical-align: top;
            text-align: center;
        }

        .sign-line {
            border-top: 1px solid #000;
            margin-top: 40px;
            padding-top: 4px;
        }
    </style>
</head>
<body>

    <!-- HEADER -->
    <div class="header text-center">
        <h1>{{ $company['name'] ?? 'SSI Metal Corp.' }}</h1>
        <small>PULL OUT SLIP</small>

        <img
            src="data:image/svg+xml;base64,{{ $qrCode }}"
            class="qr"
            alt="QR Code"
        />
    </div>

    <!-- INFO -->
    <div class="info">
        <div>
            <span class="label">Date:</span>
            {{ \Carbon\Carbon::parse($gatePass->created_at)->format('F d, Y') }}
        </div>

        <div>
            <span class="label">Project:</span>
            {{ $gatePass->project->company_name ?? $gatePass->project->name }}
        </div>

        <div>
            <span class="label">Authorized Bearer:</span>
            {{ $gatePass->authorized_bearer }}
        </div>
    </div>

    <!-- ITEMS -->
    <table>
        <thead>
            <tr>
                <th style="width:40px;">#</th>
                <th>Description</th>
                <th style="width:120px;">Quantity</th>
            </tr>
        </thead>
        <tbody>
            @forelse($gatePass->items as $index => $item)
                <tr>
                    <td class="text-center">{{ $index + 1 }}</td>
                    <td>
                        <strong>{{ $item->product->name }}</strong><br>

                        @if($item->product->sku)
                            <small>SKU: {{ $item->product->sku }}</small>
                        @endif
                    </td>

                    <td class="text-center">
                        {{ $item->quantity }} {{ $item->product->unit->short_name ?? '(Others)' }}
                    </td>
                </tr>
            @empty
                <tr>
                    <td colspan="3" class="text-center italic">No pull out items</td>
                </tr>
            @endforelse
        </tbody>
    </table>

    <!-- HASH -->
    <div class="hash-line">
        ############################ NOTHING FOLLOWS ############################
    </div>

    <!-- SIGNATURES -->
    <div class="signatures">
        <div class="sign-col">
            <div class="sign-line">Released By</div>
        </div>

        <div class="sign-col" style="float:right;">
            <div class="sign-line">Received By</div>
        </div>
    </div>

</body>
</html>