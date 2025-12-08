<?php

namespace App\Http\Controllers;

use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class RoleController extends Controller
{
    public function index()
    {
        $roles = Role::with('permissions')
            ->where('client_id', Auth::user()->client_id)
            ->withCount('users')
            ->withCount('permissions as permissions_count')
            ->get();

        return Inertia::render('RolesPermissions/Roles/Index', [
            'roles' => $roles
        ]);
    }

    public function create()
    {
        $query = Permission::query();

        // If NOT superadmin → hide Manage Companies
        if (!Auth::user()->client->is_superadmin) {
            $query->where('name', '!=', 'Manage Companies');
        }

        // Nested grouping: group → subgroup → permissions
        $permissions = $query->get()
            ->groupBy(fn($p) => $p->group ?? 'General')
            ->map(function ($group) {
                return $group->groupBy(fn($p) => $p->subgroup ?? ''); // subgroup if exists
            });

        return Inertia::render('RolesPermissions/Roles/RoleForm', [
            'permissions' => $permissions
        ]);
    }

    public function store($client, Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:50|unique:roles,name',
            'permissions' => 'required|array',
            'permissions.*' => 'exists:permissions,id',
        ]);

        $role = Role::create([
            'name' => $validated['name'],
            'client_id' => Auth::user()->client_id
        ]);

        $role->syncPermissions($validated['permissions']);

        return redirect()->route('roles.index', ['client' => $client])
            ->with('success', "Role '{$role->name}' created.");
    }

    public function edit($client, Role $role)
    {
        $role->load('permissions');

        $query = Permission::query();

        if (!Auth::user()->client->is_superadmin) {
            $query->where('name', '!=', 'Manage Companies');
        }

        // Nested grouping: group → subgroup → permissions
        $permissions = $query->get()
            ->groupBy(fn($p) => $p->group ?? 'General')
            ->map(function ($group) {
                return $group->groupBy(fn($p) => $p->subgroup ?? ''); // subgroup if exists
            });

        return Inertia::render('RolesPermissions/Roles/RoleForm', [
            'role' => $role,
            'permissions' => $permissions,
            'rolePermissions' => $role->permissions->pluck('id')->toArray(),
        ]);
    }

    public function update(Request $request, $client, Role $role)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:50|unique:roles,name,' . $role->id,
            'permissions' => 'required|array',
            'permissions.*' => 'exists:permissions,id',
        ]);

        $role->update(['name' => $validated['name']]);
        $role->syncPermissions($validated['permissions']);

        return redirect()->route('roles.index', ['client' => $client])
            ->with('success', "Role '{$role->name}' updated.");
    }

    public function destroy($client, Role $role)
    {
        if ($role->users()->exists()) {
            return back()->with('error', 'Cannot delete role assigned to users.');
        }

        $role->delete();

        return redirect()->route('roles.index', ['client' => $client])
            ->with('success', 'Role deleted.');
    }
}