<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SSI Metal Corp - Gate Pass</title>
    <style>
        /* General Reset and Page Setup */
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            background-color: #f0f0f0;
            font-family: Arial, Helvetica, sans-serif;
            font-size: 12pt;
            display: flex;
            justify-content: center;
        }

        /* The Paper Sheet */
        .page {
            background-color: white;
            width: 216mm; /* A4 Width */
            min-height: 297mm; /* A4 Height */
            padding: 30px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
            position: relative;
        }

        /* Helper Classes */
        .text-center { text-align: center; }
        .text-right { text-align: right; }
        .bold { font-weight: bold; }
        .underline { border-bottom: 1px solid black; display: inline-block; padding-left: 5px; padding-right: 5px;}
        .full-width { width: 100%; }

        /* Header Section */
        .header {
            position: relative;
            margin-bottom: 30px;
        }

        .company-name {
            font-size: 16pt;
            font-weight: bold;
            letter-spacing: 1px;
        }

        .location {
            font-size: 10pt;
            margin-bottom: 10px;
        }

        .doc-title {
            font-size: 20pt;
            font-weight: bold;
            margin-top: 5px;
            text-transform: uppercase;
        }

        .top-right-info {
            position: absolute;
            top: 0;
            right: 0;
            text-align: right;
            width: 250px;
        }

        .control-number {
            font-size: 18pt;
            font-weight: bold;
            border-bottom: 2px solid black;
            display: inline-block;
            width: 100%;
            text-align: center;
            margin-bottom: 5px;
        }

        .date-line {
            display: flex;
            justify-content: space-between;
            font-size: 10pt;
        }

        .date-val {
            border-bottom: 1px solid black;
            flex-grow: 1;
            text-align: center;
            margin-left: 5px;
        }

        /* Addressee */
        .addressee {
            margin-bottom: 20px;
            font-weight: bold;
        }

        /* Authorization Text */
        .auth-block {
            display: flex;
            flex-wrap: wrap;
            align-items: baseline;
            margin-bottom: 5px;
            line-height: 1.6;
        }
        
        .auth-line {
            border-bottom: 1px solid black;
            text-align: center;
            padding: 0 10px;
            font-style: italic;
            font-weight: bold;
        }

        /* Table Section */
        .item-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
            margin-bottom: 10px;
        }

        .item-table th {
            border-top: 1px solid black;
            border-bottom: 1px solid black;
            padding: 5px;
            text-align: left;
            font-weight: bold;
            text-transform: uppercase;
            font-size: 10pt;
        }

        .item-table td {
            padding: 4px 5px;
            vertical-align: top;
            font-size: 11pt;
        }
        
        /* Specific column alignments */
        .item-table th:first-child, .item-table td:first-child {
            text-align: center;
            width: 15%;
        }

        .item-table td:nth-child(2) {
            font-style: italic;
            font-weight: bold;
        }

        /* Separator */
        .hash-line {
            text-align: center;
            color: #555;
            font-size: 9pt;
            margin: 10px 0;
            letter-spacing: -1px;
        }

        .project-ref {
            text-align: right;
            font-size: 9pt;
            font-weight: bold;
            margin-bottom: 40px;
        }

        /* Footer / Signatures */
        .footer-grid {
            display: grid;
            grid-template-columns: 1fr 1fr; /* Two main columns */
            gap: 40px;
            border-top: 1px solid black; /* Note: To be returned line */
            padding-top: 5px;
        }

        .footer-note {
            grid-column: 1 / -1;
            font-weight: bold;
            font-size: 10pt;
            margin-bottom: 10px;
            margin-top: -25px; /* Pull up above the border */
            background: white;
            width: fit-content;
            padding-right: 10px;
        }

        .sig-row {
            display: flex;
            margin-bottom: 8px;
            align-items: flex-start;
            font-size: 10pt;
        }

        .sig-label {
            font-weight: bold;
            width: 110px; /* Fixed width for labels */
            flex-shrink: 0;
        }

        .sig-line {
            border-bottom: 1px solid black;
            flex-grow: 1;
            height: 18px; /* Height to align with text */
            position: relative;
        }
        
        .sig-value {
            position: absolute;
            bottom: 2px;
            left: 5px;
        }

        /* Signature Overlay Simulation */
        .signature-overlay {
            position: absolute;
            right: 80px;
            bottom: 140px;
            opacity: 0.7;
            transform: rotate(-10deg);
            pointer-events: none;
        }

        /* Print Settings */
        @media print {
            body { 
                background: none; 
                padding: 0;
            }
            .page { 
                box-shadow: none; 
                width: 100%;
                height: auto;
            }
        }
    </style>
</head>
<body>

    <div class="page">
        <div class="header">
            <div class="text-center">
                <div class="company-name">{{ $company['name'] }}</div>
                <div class="location">{{ $company['address'] }}</div>
                <div class="doc-title">GATE PASS</div>
            </div>

            <div class="top-right-info">
                <div class="control-number">{{ $gatePass->gate_pass_no }}</div>
                <div class="date-line">
                    <span>Date:</span>
                    <span class="date-val">
                        {{ \Carbon\Carbon::parse($gatePass->created_at)->format('d M Y h:i A') }}
                    </span>
                </div>
            </div>
        </div>

        <div class="addressee">
            To : The Guard on Duty
        </div>

        <div class="auth-block">
            <span>This wil be authorized the bearer :</span>
            <span class="auth-line" style="width: 200px;">Edwin Gamban</span>
        </div>
        <div class="auth-block">
            <span>of.</span>
            <span class="auth-line" style="width: 200px;">{{ $company['name'] }}</span>
            <span>to pass with the following:</span>
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
                @foreach($gatePass->items as $index => $item)
                    <tr>
                        <td class="text-center text-bold" style="font-size:18px;">
                            {{ $item->quantity }} &nbsp;&nbsp; {{ $item->product->unit->short_name ?? 'Pc' }}
                        </td>
                        <td class="text-bold">
                            {{ $item->product->name }} &nbsp;&nbsp; {{ $item->product->sku }}
                        </td>
                        <td>{{ $item->product->name }} &nbsp;&nbsp; {{ $item->product->sku }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>

        <div class="hash-line">
            ##########################################nothing follows##########################################
        </div>

        <div class="project-ref">
            <div>*For {{ $gatePass->warehouse->name }}</div>
            <div>{{ $gatePass->supplier->gst_number ?? '—' }}</div>
        </div>

        <div class="footer-note">Note: To be returned</div>
        
        <div class="footer-grid">
            <div class="left-col">
                <div class="sig-row">
                    <div class="sig-label">Destination</div>
                    <div class="sig-label" style="width: 10px">:</div>
                    <div class="sig-line"></div>
                </div>
                <div class="sig-row">
                    <div class="sig-label">Carrier</div>
                    <div class="sig-label" style="width: 10px">:</div>
                    <div class="sig-line"><span class="sig-value">bearer</span></div>
                </div>
                <div class="sig-row">
                    <div class="sig-label">Checked by</div>
                    <div class="sig-label" style="width: 10px">:</div>
                    <div class="sig-line"></div>
                </div>
                <div class="sig-row">
                    <div class="sig-line text-center" style="border: none; font-size: 9pt;">(GUARD on DUTY)</div>
                </div>
                <br>
                <div class="sig-row">
                    <div class="sig-label">Received by</div>
                    <div class="sig-label" style="width: 10px">:</div>
                    <div class="sig-line"></div>
                </div>
                <div class="sig-row">
                    <div style="font-size: 9pt; font-style: italic;">Signature over Printed Name</div>
                </div>
            </div>

            <div class="right-col">
                <div class="sig-row">
                    <div class="sig-label">Issued by</div>
                    <div class="sig-label" style="width: 10px">:</div>
                    <div class="sig-line"><span class="sig-value">mdp.</span></div>
                </div>
                <div class="sig-row">
                    <div class="sig-label">CHECKED BY</div>
                    <div class="sig-label" style="width: 10px">:</div>
                    <div class="sig-line"><span class="sig-value">mdf.</span></div>
                </div>
                <div class="sig-row">
                    <div class="sig-label">NOTED BY</div>
                    <div class="sig-label" style="width: 10px">:</div>
                    <div class="sig-line"><span class="sig-value">4-6</span></div>
                </div>
                <br>
                <div class="sig-row">
                    <div class="sig-label">APPROVED BY</div>
                    <div class="sig-label" style="width: 10px">:</div>
                    <div class="sig-line"><span class="sig-value">DCA.</span></div>
                </div>
            </div>
        </div>

        <svg class="signature-overlay" width="100" height="50" viewBox="0 0 100 50">
            <path d="M10,25 Q30,5 50,25 T90,25" stroke="darkblue" fill="none" stroke-width="2" />
            <circle cx="50" cy="25" r="15" stroke="darkblue" fill="none" stroke-width="1" />
        </svg>

    </div>
</body>
</html>