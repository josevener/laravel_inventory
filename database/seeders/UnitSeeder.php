<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Unit;

class UnitSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Unit::insert([
            ['name' => 'Piece', 'short_name' => 'Pc', 'client_id' => 1],
            ['name' => 'Box', 'short_name' => 'Box', 'client_id' => 1],
            ['name' => 'Kilogram', 'short_name' => 'Kg', 'client_id' => 1],
            ['name' => 'Liter', 'short_name' => 'Ltr', 'client_id' => 1],
        ]);
    }
}
