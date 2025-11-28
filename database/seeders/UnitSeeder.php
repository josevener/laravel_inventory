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
            ['name' => 'Piece', 'short_name' => 'Pc'],
            ['name' => 'Box', 'short_name' => 'Box'],
            ['name' => 'Kilogram', 'short_name' => 'Kg'],
            ['name' => 'Liter', 'short_name' => 'Ltr'],
        ]);
    }
}
