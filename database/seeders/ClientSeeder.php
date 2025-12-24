<?php

namespace Database\Seeders;

use App\Models\Client;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ClientSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Client::firstOrCreate([
            "code"=> "zentrix",
            "name"=> "Zentrix Solutions",
            "is_enable_dispatch_gatepass"=> true,
            "is_enable_pullout_gatepass"=> true,
            "is_enable_warehouses"=> true,
            "is_superadmin"=> true,
        ]);

        Client::firstOrCreate([
            "code"=> "ssimp",
            "name"=> "SSI Metal Corp.",
            "is_enable_dispatch_gatepass"=> true,
            "is_enable_pullout_gatepass"=> true,
            "is_enable_warehouses"=> false,
            "is_superadmin"=> false,
        ]);
        
    }
}
