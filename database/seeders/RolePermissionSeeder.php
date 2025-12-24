<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use App\Models\User;
use App\Models\Client;
use App\Providers\PermissionServiceProvider; // Not needed, but for reference
use Spatie\Permission\PermissionRegistrar;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        // -----------------------------
        // 1. Create Global Permissions (shared across all clients)
        // -----------------------------
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

        // Create permissions (idempotent)
        foreach ($permissions as $group => $items) {
            foreach ($items as $subgroup => $perms) {
                if (is_array($perms)) {
                    foreach ($perms as $permissionName) {
                        Permission::firstOrCreate(
                            [
                                'name'       => $permissionName,
                                'guard_name' => 'web',
                            ],
                            [
                                'group'    => $group,
                                'subgroup' => $subgroup,
                            ]
                        );
                    }
                }
            }
        }

        // -----------------------------
        // 2. Define Role Configurations
        // -----------------------------
        $rolesConfig = [
            'Super Admin' => 'all',

            'Admin' => [
                'View Dashboard',
                'View Inward Gatepass',
                'View Outward Gatepass',
                'View Products',
                'View Reports',

                'Create Inward Gatepass',
                'Create Outward Gatepass',
                'Generate Inward Gatepass',
                'Generate Outward Gatepass',
            ],

            'Manager' => [
                'View Dashboard',
                'View Products',
                'Create Inward Gatepass',
                'Create Outward Gatepass',
                'View Reports',
            ],

            'Warehouse Staff' => [
                'View Inward Gatepass',
                'Create Inward Gatepass',
                'Generate Inward Gatepass',
                'View Outward Gatepass',
                'Create Outward Gatepass',
                'Generate Outward Gatepass',
            ],

            'Viewer' => [
                'View Dashboard',
                'View Reports',
            ],
        ];

        // -----------------------------
        // 3. Seed Roles for Specific Clients
        // -----------------------------
        $clientsToSeed = [
            1 => ['Admin', 'Manager', 'Warehouse Staff', 'Viewer'],
        ];

        foreach ($clientsToSeed as $clientId => $roleNames) {
            if (!Client::find($clientId)) {
                continue;
            }

            foreach ($roleNames as $roleName) {
                $role = Role::firstOrCreate([
                    'name'       => $roleName,
                    'guard_name' => 'web',
                    'client_id'  => $clientId,
                ]);

                $permissionList = $rolesConfig[$roleName] ?? [];

                if ($permissionList === 'all') {
                    $role->syncPermissions(Permission::all());
                } else {
                    $role->syncPermissions($permissionList);
                }
            }
        }

        // -----------------------------
        // 4. Assign Roles to Users (with temporary team context)
        // -----------------------------
        $userAssignments = [
            1 => ['client_id' => 1, 'role' => 'Admin'],
            2 => ['client_id' => 1, 'role' => 'Admin'],
        ];

        foreach ($userAssignments as $userId => $assignment) {
            $user = User::find($userId);
            if (!$user) {
                continue;
            }

            $role = Role::where([
                'name'       => $assignment['role'],
                'client_id'  => $assignment['client_id'],
                'guard_name' => 'web',
            ])->first();

            if ($role) {
                // Temporarily set the current team for this assignment
                app(PermissionRegistrar::class)->setPermissionsTeamId($assignment['client_id']);

                // Now assign the role (by name, model, or ID — all work)
                $user->assignRole($role);

                // Optional: clear the current team after (not required in seeder)
                // app(PermissionRegistrar::class)->setPermissionsTeamId(null);
            }
        }
    }
}