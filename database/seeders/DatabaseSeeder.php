<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */

    protected static ?string $password;

    public function run(): void
    {
        $this->call([
            ClientSeeder::class,
            UserSeeder::class,
            ProductSeeder::class,
            ProjectSeeder::class,
            UnitSeeder::class,
            InwardGatePassSeeder::class,
            InwardGatePassItemSeeder::class,
            WarehouseSeeder::class,
            RolePermissionSeeder::class,
        ]);
    }
}
