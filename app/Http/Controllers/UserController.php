<?php

namespace App\Http\Controllers;

use App\Exports\UsersExport;
use App\Imports\UsersImport;
use App\Models\User;
use App\Models\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Hash;
use Maatwebsite\Excel\Validators\ValidationException;
use Throwable;

class UserController extends Controller
{
    public function index()
    {
        $authClient = Auth::user()->client;

        $query = User::with(['client', 'roles'])
            ->withCount('roles')
            ->orderBy('last_name');

        // If the client is NOT superadmin, restrict by client_id
        if (!$authClient->is_superadmin) {
            $query->where('client_id', $authClient->id);
        }

        $users = $query->get()->map(fn($user) => [
            'id' => $user->id,
            'first_name' => $user->first_name,
            'middle_name' => $user->middle_name,
            'last_name' => $user->last_name,
            'email' => $user->email,
            'client' => $user->client?->name,
            'roles' => $user->roles->pluck('name'),
            'role_list' => $user->role_list,
            'created_at' => $user->created_at->format('M d, Y'),
        ]);

        return Inertia::render('Users/Index', [
            'users' => $users
        ]);
    }

    public function create()
    {
        $clients = Client::orderBy('name')->get(['id', 'name', 'code']);
        $roles = Role::where('client_id', Auth::user()->client_id)
            ->get(['id', 'name']);

        return Inertia::render('Users/UserForm', [
            'clients' => $clients,
            'roles' => $roles
        ]);
    }

    public function store($client, Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'middle_name' => 'nullable|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'client_id' => 'sometimes|exists:clients,id',
            'roles' => 'required|array',
            'roles.*' => 'exists:roles,id',
        ]);

        $clientId = $validated['client_id'] ?? Auth::user()->client_id;

        $user = User::create([
            'first_name' => $validated['first_name'],
            'middle_name' => $validated['middle_name'],
            'last_name' => $validated['last_name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'client_id' => $clientId,
        ]);

        /**
         * If client_id is provided,
         * ensure roles exist for that client and assign them.
         */
        if (isset($validated['client_id'])) {

            $tenantRoles = [];

            foreach ($validated['roles'] as $roleId) {

                $role = Role::findOrFail($roleId);

                $tenantRole = Role::where('name', $role->name)
                    ->where('client_id', $clientId)
                    ->first();

                if (!$tenantRole) {
                    $tenantRole = Role::create([
                        'client_id' => $clientId,
                        'name' => $role->name,
                        'guard_name' => 'web',
                    ]);

                    Log::info("Created tenant role: " . $tenantRole->name . " for client_id: " . $clientId);
                    $tenantRole->syncPermissions($role->permissions);
                    Log::info("Synced permissions to tenant role: " . $tenantRole->name);
                }

                $tenantRoles[] = $tenantRole;
            }

            $user->syncRoles($tenantRoles);
        } else {
            // default existing behavior (root/global roles)
            $user->syncRoles($validated['roles']);
        }

        return redirect()->route('users.index', ['client' => $client])
            ->with('success', "User '{$user->name}' created successfully.");
    }

    public function edit($client, User $user)
    {
        $user->load('roles');
        $clients = Client::orderBy('name')->get(['id', 'name', 'code']);
        $roles = Role::where('client_id', Auth::user()->client_id)
            ->get(['id', 'name']);

        return Inertia::render('Users/UserForm', [
            'user' => [
                'id' => $user->id,
                'first_name' => $user->first_name,
                'middle_name' => $user->middle_name,
                'last_name' => $user->last_name,
                'email' => $user->email,
                'client_id' => $user->client_id,
                'client_name' => $user->client?->name,
                'roles' => $user->roles->pluck('id')->toArray(),
            ],
            'clients' => $clients,
            'roles' => $roles,
        ]);
    }

    public function update(Request $request, $client, User $user)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'middle_name' => 'nullable|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:8',
            'client_id' => 'required|exists:clients,id',
            'roles' => 'nullable|array',
            'roles.*' => 'exists:roles,id',
        ]);

        $user->update([
            'first_name' => $validated['first_name'],
            'middle_name' => $validated['middle_name'],
            'last_name' => $validated['last_name'],
            'email' => $validated['email'],
            'password' => $validated['password'] ? Hash::make($validated['password']) : $user->password,
            'client_id' => $validated['client_id'],
        ]);

        $user->syncRoles($validated['roles']);

        return redirect()->route('users.index', ['client' => $client])
            ->with('success', "'{$user->first_name} {$user->last_name}'s information has been updated successfully.");
    }

    public function destroy($client, User $user)
    {
        if ($user->id === Auth::id()) {
            return back()->with('error', 'You cannot delete yourself.');
        }

        $user->delete();

        return redirect()->route('users.index', ['client' => $client])
            ->with('success', 'User deleted.');
    }

    public function export($client)
    {
        return Excel::download(new UsersExport, 'User Lists.xlsx');
    }

    public function import($client, Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls'
        ]);
    
        $importer = new UsersImport();
    
        try {
            Excel::import($importer, $request->file('file'));
    
            return redirect()
                ->route('users.index', ['client' => $client])
                ->with('success', 'Users import completed!')
                ->with('import_summary', [
                    'imported' => $importer->imported,
                    'updated' => $importer->updated,
                    'skipped' => $importer->skipped,
                    'imported_rows' => $importer->importedRows,
                    'updated_rows' => $importer->updatedRows,
                    'skipped_rows' => $importer->skippedRows,
                ]);
        }
        catch (ValidationException $e) {
            $errors = [];
    
            foreach ($e->failures() as $failure) {
                foreach ($failure->errors() as $error) {
                    $errors[] = "Row {$failure->row()}: {$error}";
                }
            }
    
            return redirect()
                ->back()
                ->with('errors', $errors);
        }
        catch (Throwable $e) {
            return redirect()
                ->back()
                ->with('errors', ['Import failed: ' . $e->getMessage()]);
        }
    }
}
