<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use App\Models\User;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create Permissions
        $permissions = [
            'view dashboard',
            'manage products',
            'manage categories',
            'manage suppliers',
            'manage customers',
            'manage warehouses',
            'create inward gatepass',
            'view inward gatepass',
            'create outward gatepass',
            'view outward gatepass',
            'manage stock transfer',
            'adjust stock',
            'view reports',
            'manage users',
            'manage settings',
        ];

        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission]);
        }

        // Create Roles and Assign Permissions
        $admin = Role::create(['name' => 'Admin']);
        $admin->givePermissionTo(Permission::all());

        $manager = Role::create(['name' => 'Manager']);
        $manager->givePermissionTo([
            'view dashboard',
            'manage products',
            'create inward gatepass',
            'create outward gatepass',
            'view reports',
        ]);

        $warehouse_staff = Role::create(['name' => 'Warehouse Staff']);
        $warehouse_staff->givePermissionTo([
            'create inward gatepass',
            'view inward gatepass',
            'create outward gatepass',
            'view outward gatepass',
        ]);

        $viewer = Role::create(['name' => 'Viewer']);
        $viewer->givePermissionTo([
            'view dashboard',
            'view reports',
        ]);

        // Assign Admin role to user ID 1 (or your user)
        $user = User::find(1);
        $user?->assignRole('Admin');
    }
}
