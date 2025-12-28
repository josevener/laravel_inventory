<?php

namespace App\Imports;

use App\Models\User;
use App\Models\Client;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Illuminate\Support\Facades\Hash;

class UsersImport implements ToModel, WithHeadingRow
{
    public function model(array $row)
    {
        // Find client by name or code
        $client = Client::where('name', 'like', "%{$row['client']}%")
            ->orWhere('code', $row['client'])
            ->first();

        if (!$client) return null;

        $user = User::updateOrCreate(
            ['email' => $row['email']],
            [
                'first_name' => $row['first_name'],
                'last_name' => $row['last_name'],
                'password' => Hash::make($row['password'] ?? '12345678'),
                'client_id' => $client->id,
            ]
        );

        // Sync roles
        $roles = array_filter(array_map('trim', explode(',', $row['roles'] ?? '')));
        if (!empty($roles)) {
            $user->syncRoles($roles);
        }

        return $user;
    }
}