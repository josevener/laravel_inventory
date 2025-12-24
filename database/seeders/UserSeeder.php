<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'first_name' => 'Zentrix',
            'last_name' => 'Solutions',
            'email' => 'zentrixsolutions@gmail.com',
            'email_verified_at' => now(),
            'remember_token' => Str::random(10),
            'password' => Hash::make('ZentrixSolutions024##!!'),
            'client_id' => 1,
        ]);

        User::create([
            'first_name' => 'SSI Metal',
            'last_name' => 'Corp.',
            'email' => 'admin@gmail.com',
            'email_verified_at' => now(),
            'remember_token' => Str::random(10),
            'password' => Hash::make('admin12345678'),
            'client_id' => 2,
        ]);
    }
}
