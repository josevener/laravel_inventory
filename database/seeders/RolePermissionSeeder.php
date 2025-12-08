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

        $permissions = [
            'Productivity' => [
                'Dashboard' => [
                    'View Dashboard',
                    'Generate Dashboard',
                ],
            ],

            'Maintenance' => [
                'Products' => [
                    'View Products',
                    'Create Product',
                    'Edit Product',
                    'Delete Product',
                ],

                'Companies' => [
                    'View Companies',
                    'Create Company',
                    'Edit Company',
                    'Delete Company',
                ],

                'Categories' => [
                    'View Categories',
                    'Create Category',
                    'Edit Category',
                    'Delete Category',
                ],

                'Projects' => [
                    'View Projects',
                    'Create Project',
                    'Edit Project',
                    'Delete Project',
                ],

                'Units' => [
                    'View Units',
                    'Create Unit',
                    'Edit Unit',
                    'Delete Unit',
                ],

                'Inward Gatepass' => [
                    'View Inward Gatepass',
                    'Create Inward Gatepass',
                    'Generate Inward Gatepass',
                ],

                'Outward Gatepass' => [
                    'View Outward Gatepass',
                    'Create Outward Gatepass',
                    'Generate Outward Gatepass',
                ],

                'Users' => [
                    'View Users',
                    'Create User',
                    'Edit User',
                    'Delete User',
                    'Import User',
                    'Export User',
                ],
            ],

            'Reports & Settings' => [
                'Reports' => [
                    'View Reports',
                    'Generate Reports',
                ],
                'Settings' => [
                    'View Settings'
                ]
            ],
        ];

        // foreach ($permissions as $group => $perms) {
        //     foreach ($perms as $permission) {
        //         Permission::create([
        //             'name' => $permission,
        //             'group' => $group,
        //         ]);
        //     }
        // }

        foreach ($permissions as $group => $items) {

            foreach ($items as $subgroup => $perms) {
        
                // CASE 1: Subgroup with array of permissions
                if (is_array($perms)) {
        
                    foreach ($perms as $permission) {
                        Permission::create([
                            'name' => $permission,
                            'group' => $group,
                            'subgroup' => $subgroup,
                        ]);
                    }
        
                } else {
                    // CASE 2: No subgroup, direct list of permissions
                    Permission::create([
                        'name' => $perms,
                        'group' => $group,
                        'subgroup' => null,
                    ]);
                }
            }
        }

        // Create Roles and Assign Permissions
        $admin = Role::create([
            'name' => 'Admin',
            'client_id' => 1, // Zentrix Solutions
        ]);
        $admin->givePermissionTo(Permission::all());

        $manager = Role::create([
            'name' => 'Manager',
            'client_id' => 1, // Zentrix Solutions
        ]);
        $manager->givePermissionTo([
            'View Dashboard',
            'View Products',
            'Create Inward Gatepass',
            'Create Outward Gatepass',
            'View Reports',
        ]);

        $warehouse_staff = Role::create([
            'name' => 'Warehouse Staff',
            'client_id' => 1, // Zentrix Solutions
        ]);
        $warehouse_staff->givePermissionTo([
            'Create Inward Gatepass',
            'View Inward Gatepass',
            'Create Outward Gatepass',
            'View Outward Gatepass',
        ]);

        $viewer = Role::create([
            'name' => 'Viewer',
            'client_id' => 1, // Zentrix Solutions
        ]);
        $viewer->givePermissionTo([
            'View Dashboard',
            'View Reports',
        ]);

        // Assign Admin role to user ID 1 (or your user)
        $user = User::find(1);
        $user?->assignRole('Admin');

        $user = User::find(2);
        $user?->assignRole('Admin');
    }
}
