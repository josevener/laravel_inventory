<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\PullOut;
use App\Models\PullOutItem;
use App\Models\Project;
use App\Models\Product;
use App\Models\User;
use App\Models\Client;
use Carbon\Carbon;

class PullOutSeeder extends Seeder
{
    public function run(): void
    {
        // Sample data - assume some IDs exist
        $user = User::firstOrCreate(['name' => 'Test User', 'email' => 'test@example.com', 'password' => bcrypt('password'), 'client_id' => 1]);

        $project = Project::firstOrCreate(['name' => 'Test Project', 'company_name' => 'Test Company', 'client_id' => 1]);

        $product1 = Product::firstOrCreate(['sku' => 'TEST-001', 'name' => 'Test Product 1', 'category_id' => 1, 'unit_id' => 1, 'client_id' => 1, 'current_stock' => 100]);

        $product2 = Product::firstOrCreate(['sku' => 'TEST-002', 'name' => 'Test Product 2', 'category_id' => 1, 'unit_id' => 1, 'client_id' => 1, 'current_stock' => 50]);

        // Create Pull Out
        $pullOut = PullOut::create([
            'client_id' => 1, // Zentrix Solutions
            'gate_pass_no' => 3000,
            'project_id' => $project->id,
            'vehicle_no' => 'TEST-VEH-001',
            'driver_name' => 'Test Driver',
            'remarks' => 'Test remarks',
            'status' => 'completed',
            'issued_by' => $user->id,
            'issued_at' => Carbon::now(),
            'created_by' => $user->id,
        ]);

        // Create Items
        PullOutItem::create([
            'client_id' => 1, // Zentrix Solutions
            'pull_out_id' => $pullOut->id,
            'product_id' => $product1->id,
            'quantity' => 10,
        ]);

        PullOutItem::create([
            'client_id' => 1, // Zentrix Solutions
            'pull_out_id' => $pullOut->id,
            'product_id' => $product2->id,
            'quantity' => 5,
        ]);

        // Decrement stock
        $product1->decrement('current_stock', 10);
        $product2->decrement('current_stock', 5);
    }
}