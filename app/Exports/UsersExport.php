<?php

namespace App\Exports;

use App\Models\User;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class UsersExport implements FromCollection, WithHeadings, WithMapping
{
    public function collection()
    {
        return User::with(['client', 'roles'])->get();
    }

    public function headings(): array
    {
        return [
            'Name',
            'Email',
            // 'Client',
            'Roles',
            'Joined Date',
        ];
    }

    public function map($user): array
    {
        return [
            $user->name,
            $user->email,
            // $user->client?->name ?? '—',
            $user->getRoleNames()->implode(', '),
            $user->created_at->format('M d, Y'),
        ];
    }
}