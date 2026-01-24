<?php

namespace App\Exports;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithColumnWidths;

class UsersExport implements FromCollection, WithHeadings, WithMapping, WithColumnWidths
{
    public function collection()
    {
        return User::query()
            ->select(['id', 'first_name', 'last_name', 'email', 'client_id'])
            ->with('roles')
            ->where('client_id', Auth::user()->client_id)
            ->orderBy('first_name')
            ->orderBy('last_name')
            ->get();
    }

    public function headings(): array
    {
        return [
            'FirstName',
            'LastName',
            'EmailAddress',
            'Roles',
        ];
    }

    public function map($user): array
    {
        return [
            $user->first_name,
            $user->last_name,
            $user->email,
            $user->getRoleNames()->implode(', '),
        ];
    }

    public function columnWidths(): array
    {
        return [
            'A' => 18,
            'B' => 18,
            'C' => 30,
            'D' => 35,
        ];
    }
}