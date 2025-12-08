<?php

namespace App\Http\Controllers;

use App\Exports\UsersExport;
use App\Imports\UsersImport;
use App\Models\User;
use App\Models\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index()
    {
        $authClient = Auth::user()->client;

        $query = User::with(['client', 'roles'])
            ->withCount('roles')
            ->orderBy('name');

        // If the client is NOT superadmin, restrict by client_id
        if (!$authClient->is_superadmin) {
            $query->where('client_id', $authClient->id);
        }

        $users = $query->get()->map(fn($user) => [
            'id' => $user->id,
            'name' => $user->name,
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
        $roles = Role::all(['id', 'name']);

        return Inertia::render('Users/UserForm', [
            'clients' => $clients,
            'roles' => $roles
        ]);
    }

    public function store($client, Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'client_id' => 'sometimes|exists:clients,id',
            'roles' => 'required|array',
            'roles.*' => 'exists:roles,id',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'client_id' => $validated['client_id'] ?? Auth::user()->client_id,
        ]);

        $user->syncRoles($validated['roles']);

        return redirect()->route('users.index', ['client' => $client])
            ->with('success', "User '{$user->name}' created successfully.");
    }

    public function edit($client, User $user)
    {
        $user->load('roles');
        $clients = Client::orderBy('name')->get(['id', 'name', 'code']);
        $roles = Role::all(['id', 'name']);

        return Inertia::render('Users/UserForm', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
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
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:8|confirmed',
            'client_id' => 'required|exists:clients,id',
            'roles' => 'required|array',
            'roles.*' => 'exists:roles,id',
        ]);

        $user->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => $validated['password'] ? Hash::make($validated['password']) : $user->password,
            'client_id' => $validated['client_id'],
        ]);

        $user->syncRoles($validated['roles']);

        return redirect()->route('users.index', ['client' => $client])
            ->with('success', "User '{$user->name}' updated.");
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

    // In UserController.php

    // public function export()
    // {
    //     $csv = "Name,Email,Client,Roles,Joined\n";
    //     foreach (User::with(['client', 'roles'])->get() as $user) {
    //         $csv .= "\"{$user->name}\",\"{$user->email}\",\"{$user->client?->name}\",\"{$user->role_list}\",\"{$user->created_at}\"\n";
    //     }

    //     return response($csv)
    //         ->header('Content-Type', 'text/csv')
    //         ->header('Content-Disposition', 'attachment; filename=users.csv');
    // }
    public function export($client)
    {
        return Excel::download(new UsersExport, 'users.xlsx');
    }

    // public function import(Request $request)
    // {
    //     $request->validate([
    //         'file' => 'required|mimes:csv,txt'
    //     ]);

    //     // Simple CSV import (you can improve with Laravel Excel)
    //     $file = $request->file('file');
    //     $handle = fopen($file, "r");
    //     fgetcsv($handle); // skip header

    //     while (($data = fgetcsv($handle)) !== false) {
    //         [$name, $email, $clientName, $rolesStr, $password] = $data;

    //         $client = Client::where('name', 'like', "%$clientName%")->first();
    //         if (!$client)
    //             continue;

    //         $user = User::updateOrCreate(
    //             ['email' => $email],
    //             [
    //                 'name' => $name,
    //                 'password' => Hash::make($password ?: 'password123'),
    //                 'client_id' => $client->id,
    //             ]
    //         );

    //         $roles = array_filter(array_map('trim', explode(',', $rolesStr)));
    //         $user->syncRoles($roles);
    //     }

    //     fclose($handle);

    //     return back()->with('success', 'Users imported!');
    // }
    public function import($client, Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls'
        ]);

        Excel::import(new UsersImport, $request->file('file'));

        return redirect()->route('users.index', ['client' => $client])
            ->with('success', 'Users imported successfully!');
    }
}