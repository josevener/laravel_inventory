<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>{{ $company['name'] ?? "SSI Metal Corp." }} — Gate Pass {{ $gatePass->gate_pass_no }}</title>
    <style>
        @page {
            margin: 0px;
            size: letter;
        }

        body {
            font-family: Arial, Helvetica, sans-serif;
            font-size: 9pt;
            margin: 10px 20px;
        }

        .bold { font-weight: bold; }
        .italic { font-style: italic; }
        .text-center { text-align: center; }

        /* HEADER */
        .header-container {
            position: relative;
            width: 100%;
            height: 80px;
        }

        .header-left {
            position: absolute;
            left: 0;
            top: 5px;
        }

        .qr-code-img {
            width: 70px;
            height: 70px;
        }

        .header-center {
            width: 100%;
            text-align: center;
            position: absolute;
            top: 0;
            left: 0;
        }

        .header-right {
            position: absolute;
            right: 0;
            top: 0;
            text-align: right;
            width: 200px;
        }

        .company-name {
            font-size: 20pt;
            font-weight: bold;
            letter-spacing: 1px;
            text-transform: uppercase;
            margin-bottom: 0;
            line-height: 1.2;
        }

        .location-name {
            font-size: 10pt;
            margin-bottom: 2px;
        }

        .doc-title {
            font-size: 18pt;
            font-weight: bold;
            text-transform: uppercase;
            margin-top: 0;
            line-height: 1.2;
        }

        .control-number-large {
            font-size: 24pt;
            font-weight: bold;
        }

        /* INLINE DATE */
        .date-line {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            gap: 8px;
            margin-top: 8px;
            font-size: 10pt;
        }

        .date-underline {
            border-bottom: 1px solid black;
            min-width: 120px;
            text-align: center;
            padding: 0 5px;
            font-weight: bold;
        }

        /* AUTH SECTION */
        .auth-wrapper {
            width: 100%;
            margin-top: 5px; 
        }

        .auth-line {
            margin-bottom: 8px;
            line-height: 1.5;
        }

        .input-fill {
            border-bottom: 1px solid black;
            display: inline-block;
            font-weight: bold;
            text-align: center;
        }

        /* ITEMS TABLE - REDUCED BOTTOM MARGIN */
        .item-table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0 0 0; /* Removed bottom margin */
        }

        .item-table th {
            border-top: 1px solid black;
            border-bottom: 1px solid black;
            padding: 8px 5px;
            text-align: left;
            font-weight: bold;
            text-transform: uppercase;
            font-size: 9pt;
            background-color: #f9f9f9;
        }

        .item-table td {
            padding: 6px 5px; /* Slightly reduced vertical padding */
            vertical-align: top;
            font-size: 8pt;
        }

        .item-table th:first-child,
        .item-table td:first-child {
            text-align: center;
            width: 18%;
        }

        .item-table th:last-child,
        .item-table td:last-child {
            text-align: right;
            width: 28%;
            padding-right: 10px;
        }

        .intended-for-text {
            position: absolute;
            font-weight: bold;
            font-size: 9pt;
            color: #000;
            text-align: right;
            line-height: 1.3;
            pointer-events: none;
        }

        /* HASH LINE - MINIMAL TOP MARGIN ONLY */
        .hash-line {
            text-align: center;
            color: #555;
            font-size: 9pt;
            margin: 8px 0 20px 0; /* Only 8px top, keeps it tight to table */
            letter-spacing: -1px;
        }

        /* FOOTER */
        .footer-wrap {
            width: 100%;
            border-top: 1px solid black;
            padding-top: 15px;
            position: relative;
        }

        .footer-note {
            position: absolute;
            top: -12px;
            left: 0;
            background-color: #fff;
            padding-right: 10px;
            font-weight: bold;
            font-size: 10pt;
        }

        .col-left { float: left; width: 48%; }
        .col-right { float: right; width: 48%; }
        .clearfix::after { content: ""; clear: both; display: table; }

        table.sig-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 5px;
        }

        table.sig-table td {
            padding-bottom: 5px;
            vertical-align: bottom;
        }

        .label-col { width: 90px; font-weight: bold; font-size: 9pt; }
        .colon-col { width: 10px; font-weight: bold; }
        .line-col {
            border-bottom: 1px solid black;
            height: 16px;
            position: relative;
        }

        .sig-value {
            position: absolute;
            bottom: 2px;
            left: 5px;
            font-weight: normal;
        }

        .signature-overlay {
            position: absolute;
            right: 0px;
            bottom: 150px;
            opacity: 0.7;
            transform: rotate(-10deg);
            z-index: -1;
        }
    </style>
</head>
<body>

    <div class="header-container">
        <div class="header-left">
            <img src="data:image/svg+xml;base64,{{ $qrCode }}" class="qr-code-img" alt="QR Code">
        </div>

        <div class="header-center">
            <div class="company-name">{{ $company['name'] ?? "SSI Metal Corp." }}</div>
            <div class="location-name">Quezon City</div>
            <div class="doc-title">GATE PASS</div>
        </div>

        <div class="header-right">
            <div class="control-number-large">{{ $gatePass->gate_pass_no }}</div>
            
            <div class="date-line">
                <span>Date:</span>
                <span class="date-underline">
                    {{ \Carbon\Carbon::parse($gatePass->created_at)->format('F d, Y') }}
                </span>
            </div>
        </div>
    </div>

    <div class="auth-wrapper">
        <div class="bold" style="margin-bottom: 15px;">
            To: The Guard on Duty
        </div>

        <div class="auth-line">
            This will authorize the bearer: 
            <span class="input-fill" style="width: 73%;">{{ $gatePass->authorized_bearer ?? '—' }}</span>
        </div>
        
        <div class="auth-line">
            of 
            <span class="input-fill" style="width: 55%;">{{ $gatePass->client->name }}</span> 
            to pass with the following:
        </div>
    </div>

    <table class="item-table">
        <thead>
            <tr>
                <th>QTY/UNIT</th>
                <th>DESCRIPTION</th>
                <th>INTENDED FOR</th>
            </tr>
        </thead>
        <tbody>
            @forelse($gatePass->items as $index => $item)
                <tr>
                    <td style="font-weight: bold;">*{{ $item->quantity }} {{ $item->product->unit->short_name ?? 'Pc' }}</td>
                    <td style="font-weight: bold;">*{{ $item->product->name }} {{ $item->product->sku }}</td>
                    <td>
                        @if (
                            $gatePass->project && 
                            (($loop->count === 1 && $loop->last) || $loop->remaining === 1)
                        )
                            <div class="intended-for-text">
                                *For {{ $gatePass->project->company_name }} Project<br>
                                <small>{{ $gatePass->project->project_started ?? "C-" . $gatePass->project->created_at->format('Y-m-d') }}</small>
                            </div>
                        @endif
                    </td>
                </tr>
            @empty
                <tr>
                    <td colspan="3" class="text-center italic">No items</td>
                </tr>
            @endforelse
        </tbody>
    </table>

    <div class="hash-line">
        ################################################## nothing follows ##################################################
    </div>

    <div class="footer-wrap clearfix">
        <div class="footer-note">Note: To be returned</div>

        <div class="col-left">
            <table class="sig-table">
                <tr>
                    <td class="label-col">Destination</td>
                    <td class="colon-col">:</td>
                    <td class="line-col"></td>
                </tr>
                <tr>
                    <td class="label-col">Carrier</td>
                    <td class="colon-col">:</td>
                    <td class="line-col"><span class="sig-value">bearer</span></td>
                </tr>
                <tr>
                    <td class="label-col">Checked by</td>
                    <td class="colon-col">:</td>
                    <td class="line-col"></td>
                </tr>
                <tr>
                    <td colspan="3" class="text-center" style="font-size: 8pt; padding-top:2px;">(GUARD on DUTY)</td>
                </tr>
                <tr>
                    <td class="label-col">Received by</td>
                    <td class="colon-col">:</td>
                    <td class="line-col"></td>
                </tr>
                <tr>
                    <td colspan="3" style="font-size: 8pt; font-style: italic; text-align: center;">Signature over Printed Name</td>
                </tr>
            </table>
        </div>

        <div class="col-right">
            <table class="sig-table">
                <tr>
                    <td class="label-col">Issued by</td>
                    <td class="colon-col">:</td>
                    <td class="line-col"><span class="sig-value">mdp.</span></td>
                </tr>
                <tr>
                    <td class="label-col">CHECKED BY</td>
                    <td class="colon-col">:</td>
                    <td class="line-col"><span class="sig-value">mdf.</span></td>
                </tr>
                <tr>
                    <td class="label-col">NOTED BY</td>
                    <td class="colon-col">:</td>
                    <td class="line-col"><span class="sig-value">4-6</span></td>
                </tr>
                <tr><td colspan="3" style="height: 15px;"></td></tr> 
                <tr>
                    <td class="label-col">APPROVED BY</td>
                    <td class="colon-col">:</td>
                    <td class="line-col"><span class="sig-value">DCA.</span></td>
                </tr>
            </table>
        </div>
    </div>

    <svg class="signature-overlay" width="100" height="50" viewBox="0 0 100 50">
        <path d="M10,25 Q30,5 50,25 T90,25" stroke="darkblue" fill="none" stroke-width="2" />
        <circle cx="50" cy="25" r="15" stroke="darkblue" fill="none" stroke-width="1" />
    </svg>

</body>
</html>