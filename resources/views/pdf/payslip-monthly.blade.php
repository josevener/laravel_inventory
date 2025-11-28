<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>{{ $employee->name }} Payslip</title>

    <style>
        body { 
            font-family: DejaVu Sans, sans-serif; 
            margin: 0; 
            padding: 18px; 
            color: #000; 
            font-size: 11px;
        }

        .container { max-width: 780px; margin: 0 auto; }

        .section { 
            padding-bottom: 18px;
            border-bottom: 1px dashed #777; 
            margin-bottom: 18px;
        }

        /* Smaller header */
        .header { text-align: center; margin-bottom: 8px; }
        .header h1 { margin: 0; font-size: 16px; font-weight: bold; }
        .header h2 { margin: 2px 0 0; font-size: 11px; }
        .header div { margin-top: 2px; font-size: 10px; }

        /* More compact info grid */
        .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            margin-top: 8px;
            font-size: 10px;
        }

        .info-row { margin-bottom: 2px; }
        .info-label { font-weight: bold; }

        /* Table compact layout */
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th { 
            padding: 4px 0; 
            text-align: left; 
            border-bottom: 1px solid #000; 
            font-size: 10px; 
        }
        td { 
            padding: 3px 0; 
            font-size: 10px; 
        }

        /* Totals compressed */
        .totals {
            display: grid;
            grid-template-columns: 1fr 1fr;
            margin-top: 6px;
            font-size: 11px;
            font-weight: bold;
        }

        .netpay-box {
            text-align: center;
            margin-top: 8px;
            font-size: 14px;
            font-weight: bold;
        }

        .netpay-text {
            text-align: center;
            font-size: 9px;
            margin-top: 2px;
        }

        .note {
            text-align: center;
            margin-top: 8px;
            font-size: 9px;
        }
    </style>

</head>
<body>

<div class="container">

    <!-- ========== FIRST CUTOFF ========== -->
    <div class="section">
        <div class="header">
            <h1>{{ $company['name'] }}</h1>
            <h2>{{ $company['address'] }}</h2>
            <div>Payslip — 1st Cutoff</div>
            <div>{{ $cutoff1['period'] }}</div>
        </div>

        <div class="info-grid">
            <div>
                <div class="info-row"><span class="info-label">Employee: </span>{{ $employee->name }}</div>
                <div class="info-row"><span class="info-label">Department: </span>{{ $employee->department }}</div>
                <div class="info-row"><span class="info-label">Designation: </span>{{ $employee->designation }}</div>
            </div>

            <div>
                <div class="info-row"><span class="info-label">Date Joined: </span>{{ $employee->date_joined }}</div>
                <div class="info-row"><span class="info-label">Worked Days: </span>{{ $cutoff1['worked_days'] }}</div>
            </div>
        </div>

        <table>
            <thead>
                <tr>
                    <th>Earnings</th><th>Amount</th>
                    <th>Deductions</th><th>Amount</th>
                </tr>
            </thead>
            <tbody>
                @php $max = max(count($cutoff1['earnings']), count($cutoff1['deductions'])); @endphp
                @for($i = 0; $i < $max; $i++)
                    <tr>
                        <td>{{ array_keys($cutoff1['earnings'])[$i] ?? '' }}</td>
                        <td>{{ array_values($cutoff1['earnings'])[$i] ?? '' }}</td>

                        <td>{{ array_keys($cutoff1['deductions'])[$i] ?? '' }}</td>
                        <td>{{ array_values($cutoff1['deductions'])[$i] ?? '' }}</td>
                    </tr>
                @endfor
            </tbody>
        </table>

        <div class="totals">
            <div>Total Earnings: {{ number_format($cutoff1['total_earnings']) }}</div>
            <div>Total Deductions: {{ number_format($cutoff1['total_deductions']) }}</div>
        </div>
        <div class="totals">
            <div></div>
            <div>Net Pay: {{ number_format($cutoff1['net_pay']) }}</div>
        </div>

        <div class="netpay-box">{{ number_format($cutoff1['net_pay']) }}</div>
        <div class="netpay-text">{{ \NumberFormatter::create('en', \NumberFormatter::SPELLOUT)->format($cutoff1['net_pay']) }}</div>
    </div>

    <!-- ========== SECOND CUTOFF ========== -->
    <div class="section">
        <div class="header">
            <h1>{{ $company['name'] }}</h1>
            <h2>{{ $company['address'] }}</h2>
            <div>Payslip — 2nd Cutoff</div>
            <div>{{ $cutoff2['period'] }}</div>
        </div>

        <div class="info-grid">
            <div>
                <div class="info-row"><span class="info-label">Employee: </span>{{ $employee->name }}</div>
                <div class="info-row"><span class="info-label">Department: </span>{{ $employee->department }}</div>
                <div class="info-row"><span class="info-label">Designation: </span>{{ $employee->designation }}</div>
            </div>

            <div>
                <div class="info-row"><span class="info-label">Date Joined: </span>{{ $employee->date_joined }}</div>
                <div class="info-row"><span class="info-label">Worked Days: </span>{{ $cutoff2['worked_days'] }}</div>
            </div>
        </div>

        <table>
            <thead>
                <tr>
                    <th>Earnings</th><th>Amount</th>
                    <th>Deductions</th><th>Amount</th>
                </tr>
            </thead>
            <tbody>
                @php $max = max(count($cutoff2['earnings']), count($cutoff2['deductions'])); @endphp
                @for($i = 0; $i < $max; $i++)
                    <tr>
                        <td>{{ array_keys($cutoff2['earnings'])[$i] ?? '' }}</td>
                        <td>{{ array_values($cutoff2['earnings'])[$i] ?? '' }}</td>

                        <td>{{ array_keys($cutoff2['deductions'])[$i] ?? '' }}</td>
                        <td>{{ array_values($cutoff2['deductions'])[$i] ?? '' }}</td>
                    </tr>
                @endfor
            </tbody>
        </table>

        <div class="totals">
            <div>Total Earnings: {{ number_format($cutoff2['total_earnings']) }}</div>
            <div>Total Deductions: {{ number_format($cutoff2['total_deductions']) }}</div>
        </div>
        <div class="totals">
            <div></div>
            <div>Net Pay: {{ number_format($cutoff2['net_pay']) }}</div>
        </div>

        <div class="netpay-box">{{ number_format($cutoff2['net_pay']) }}</div>
        <div class="netpay-text">{{ \NumberFormatter::create('en', \NumberFormatter::SPELLOUT)->format($cutoff2['net_pay']) }}</div>
    </div>

    <div class="note">This is a system-generated payslip. No signature needed.</div>
</div>

</body>
</html>
