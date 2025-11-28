<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Warehouse;

class WarehouseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // In any seeder or tinker
        Warehouse::firstOrCreate(['name' => 'Main Warehouse', 'code' => 'WH-0001', 'address' => '123 Factory St']);
        Warehouse::firstOrCreate(['name' => 'Branch Warehouse', 'code' => 'WH-0002', 'address' => '456 Market Rd']);
    }
}
