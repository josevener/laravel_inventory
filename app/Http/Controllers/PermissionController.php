<?php

namespace App\Http\Controllers;

use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;
use Spatie\Permission\Models\Permission;
use Inertia\Inertia;

class PermissionController extends Controller
{
    public function index()
    {
        $permissions = Permission::all()
            ->groupBy('group')
            ->map(function ($group) {
                return $group->groupBy('subgroup');
            });

        return Inertia::render('RolesPermissions/Permissions/Index', [
            'permissions' => $permissions
        ]);
    }

    public function create()
    {
        return Inertia::render('RolesPermissions/Permissions/Create');
    }

    public function store($client, Request $request)
    {
        $clientId = Auth::user()->client_id;

        app(\Spatie\Permission\PermissionRegistrar::class)->forgetCachedPermissions();

        $validated = $request->validate([
            'name' => [
            'required',
            'string',
            Rule::unique('permissions')
                ->where(fn ($q) => $q->where('client_id', $clientId)),
            ],
            'group' => 'nullable|string|max:255',
        ]);

        $permissions = Permission::create($validated);

        Log::info("permissions: " . $permissions);
        return redirect()->route('permissions.index', ['client' => $client])
            ->with('success', 'Permission created.');
    }

    public function edit($client, Permission $permission)
    {
        return Inertia::render('RolesPermissions/Permissions/Edit', [
            'permission' => $permission
        ]);
    }

    public function update(Request $request, $client, Permission $permission)
    {
        app(\Spatie\Permission\PermissionRegistrar::class)->forgetCachedPermissions();
        
        $clientId = Auth::user()->client_id;
        
        $validated = $request->validate([
            'name' => [
            'required',
            'string',
            Rule::unique('permissions')
                ->where(fn ($q) => $q->where('client_id', $clientId))
                ->ignore($permission->id),
            ],
            'group' => "nullable|string|max:255"
        ]);

        $permission->update($validated);

        return redirect()->route('permissions.index', ['client' => $client])
            ->with('success', 'Permission updated.');
    }

    public function destroy($client, Permission $permission)
    {
        app(\Spatie\Permission\PermissionRegistrar::class)->forgetCachedPermissions();

        // if ($permission->roles()->exists()) {
        //     return back()->with('error', 'Cannot delete permission assigned to roles.');
        // }

        $permission->delete();

        return redirect()->route('permissions.index', ['client' => $client])
            ->with('success', 'Permission deleted.');
    }
}