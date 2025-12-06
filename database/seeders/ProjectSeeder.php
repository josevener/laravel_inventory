<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Project;

class ProjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Project::create(['code' => 'Rajesh Traders', 'name' => 'Rajesh Traders', 'company_name' => 'Rajesh & Sons', 'phone' => '9876543210']);
        Project::create(['code' => 'Shree Cement Ltd', 'name' => 'Shree Cement Ltd', 'company_name' => 'Shree Cement', 'gst_number' => '27AAECS1234H1Z5']);
    }
}
