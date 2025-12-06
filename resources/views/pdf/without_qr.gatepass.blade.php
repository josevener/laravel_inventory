<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>SSI Metal Corp - Gate Pass #{{ $gatePass->gate_pass_no }}</title>
    <style>
        /* PDF PAGE SETTINGS */
        @page {
            margin: 0px;
            size: letter; /* 8.5in x 11in */
        }

        body {
            font-family: Arial, Helvetica, sans-serif;
            font-size: 11pt;
            margin: 30px 40px;
        }

        /* HELPER CLASSES */
        .bold { font-weight: bold; }
        .italic { font-style: italic; }
        .text-center { text-align: center; }

        /* HEADER LAYOUT */
        .header-container {
            position: relative; 
            width: 100%; 
            /* Reduced height since we compacted the text */
            height: 80px; 
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
        
        /* COMPACT HEADER STYLES */
        .company-name {
            font-size: 16pt;
            font-weight: bold;
            letter-spacing: 1px;
            text-transform: uppercase;
            margin-bottom: 0px; /* Removed whitespace */
            line-height: 1.2;
        }

        .location-name {
            font-size: 10pt;
            margin-bottom: 2px; /* Very small gap */
            line-height: 1;
        }

        .doc-title {
            font-size: 20pt;
            font-weight: bold;
            text-transform: uppercase;
            margin-top: 0px; /* Removed whitespace */
            line-height: 1.2;
        }

        /* LARGE CONTROL NUMBER STYLE */
        .control-number-large {
            font-size: 24pt; /* Increased Size */
            font-weight: bold;
            color: #000;
        }

        /* AUTH TEXT WRAPPER */
        .auth-wrapper {
            margin-bottom: 10px;
            width: 100%;
            /* Reduced margin-top to pull content closer to header */
            margin-top: 30px; 
        }

        .auth-line {
            margin-bottom: 8px;
            width: 100%;
            line-height: 1.5;
        }
        
        .input-fill {
            border-bottom: 1px solid black;
            display: inline-block;
            font-weight: bold;
            text-align: center;
        }

        /* MAIN ITEMS TABLE */
        .item-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
            margin-bottom: 15px;
        }

        .item-table th {
            border-top: 1px solid black;
            border-bottom: 1px solid black;
            padding: 8px 5px;
            text-align: left;
            font-weight: bold;
            text-transform: uppercase;
            font-size: 10pt;
            background-color: #f9f9f9;
        }

        .item-table td {
            padding: 6px 5px;
            vertical-align: top;
            font-size: 10pt;
        }

        .item-table th:first-child, .item-table td:first-child {
            text-align: center;
            width: 15%;
        }

        /* SEPARATOR */
        .hash-line {
            text-align: center;
            color: #555;
            font-size: 9pt;
            margin: 20px 0;
            letter-spacing: -1px;
        }

        .project-ref {
            text-align: right;
            font-size: 9pt;
            font-weight: bold;
            margin-bottom: 20px;
        }

        /* FOOTER LAYOUT */
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

        /* SIGNATURE ROWS */
        table.sig-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 5px;
        }
        
        table.sig-table td {
            padding-bottom: 5px;
            vertical-align: bottom;
        }

        .label-col { width: 90px; font-weight: bold; font-size: 10pt; }
        .colon-col { width: 10px; font-weight: bold; }
        .line-col {
            border-bottom: 1px solid black;
            height: 18px;
            position: relative;
        }

        .sig-value {
            position: absolute;
            bottom: 2px;
            left: 5px;
            font-weight: normal;
        }

        /* Signature Overlay */
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
        
        <div class="header-center">
            <div class="company-name">{{ $company['name'] ?? "SSI Metal Corp."}}</div>
            <div class="location-name">Quezon City</div>
            <div class="doc-title">GATE PASS</div>
        </div>

        <div class="header-right">
            <div style="margin-bottom: 5px;">
                <span class="control-number-large">{{ $gatePass->gate_pass_no }}</span>
            </div>
            <div>
                <span>Date:</span>
                <span style="border-bottom: 1px solid black; display: inline-block; min-width: 100px; text-align: center;">
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
            <span class="input-fill" style="width: 73%;">{{ $gatePass->driver_name ?? '—' }}</span>
        </div>
        
        <div class="auth-line">
            of 
            <span class="input-fill" style="width: 55%;">SSI METAL CORP.</span> 
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
            @foreach($gatePass->items as $index => $item)
                <tr>
                    <td class="font-weight: bold;">*{{ $item->quantity }}</span> {{ $item->product->unit->short_name ?? 'Pc' }}</td>
                    <td class="font-weight: bold;">*{{ $item->product->name }} {{ $item->product->sku }}</td>
                    <td></td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <div class="hash-line">
        ################################################## nothing follows ##################################################
    </div>

    <div class="project-ref">
        <div>*For HARAYA Project</div>
        <div>C2025-07-006</div>
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
                <tr><td colspan="3" style="height: 10px;"></td></tr> 
                <tr>
                    <td class="label-col">Received by</td>
                    <td class="colon-col">:</td>
                    <td class="line-col"></td>
                </tr>
                <tr>
                    <td colspan="3" style="font-size: 8pt; font-style: italic;">Signature over Printed Name</td>
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