<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolePermissionController extends Controller
{
    public function index()
    {
        $permissions = Permission::all();
        $roles = Role::with('permissions')
            ->where('client_id', Auth::user()->client_id)
            ->get();

        return Inertia::render('RolesPermissions/Index', [
            'permissions' => $permissions,
            'roles' => $roles,
        ]);
    }
}
