<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payslip extends Model
{
     // public function printPayslipMonthly()
    // {
    //     $employee = (object) [
    //         'name'        => 'John Michael Santos',
    //         'designation' => 'Software Engineer',
    //         'department'  => 'IT Department',
    //         'd   ate_joined' => '2021-06-15',
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
}
