<?php

namespace App\Http\Controllers;

use App\Models\Client;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ClientController extends Controller
{
    public function index()
    {
        $clients = Client::orderBy('name')->get();

        return Inertia::render('Companies/Index', [
            // 'clients' => $clients->map(fn($c) => [
            //     'id' => $c->id,
            //     'code' => $c->code,
            //     'name' => $c->name,
            //     'contact_person' => $c->contact_person,
            //     'email' => $c->email,
            //     'phone' => $c->phone,
            //     'address' => $c->address,
            //     'is_superadmin' => $c->is_superadmin,
            //     'users_count' => $c->users()->count(),
            //     'products_count' => $c->products()->count(),
            //     'is_active' => $c->is_active,
            //     'created_at' => $c->created_at->format('M d, Y'),
            // ])
            'clients' => $clients,
        ]);
    }

    public function create()
    {
        return Inertia::render('Companies/CompanyForm');
    }

    public function store($client, Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|max:20|unique:clients,code',
            'name' => 'required|string|max:100',
            'contact_person' => 'nullable|string|max:100',
            'email' => 'nullable|email|max:100',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:500',
            'is_enable_inward_gatepass' => 'boolean',
            'is_enable_outward_gatepass' => 'boolean',
            'is_enable_warehouses' => 'boolean',
            'is_superadmin' => 'boolean',
        ]);

        Client::create($validated);

        return redirect()->route('companies.index', ['client' => $client])
            ->with('success', 'Client created successfully.');
    }

    public function edit($client, Client $company)
    {
        return Inertia::render('Companies/CompanyForm', [
            'client' => $company
        ]);
    }

    public function update(Request $request, $client, Client $company)
    {
        $validated = $request->validate([
            'code' => 'required|string|max:20|unique:clients,code,' . $company->id,
            'name' => 'required|string|max:100',
            'contact_person' => 'nullable|string|max:100',
            'email' => 'nullable|email|max:100',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:500',
            'is_enable_inward_gatepass' => 'boolean',
            'is_enable_outward_gatepass' => 'boolean',
            'is_enable_warehouses' => 'boolean',
            'is_superadmin' => 'boolean',
        ]);

        $company->update($validated);

        return redirect()->route('companies.index', ['client' => $company->code])
            ->with('success', 'Client updated.');
    }

    public function destroy($client, Client $company)
    {
        if ($company->users()->exists() || $company->products()->exists()) {
            return back()->with('error', 'Cannot delete client with users or products.');
        }

        $company->delete();

        return redirect()->route('companies.index', ['client' => $client])
            ->with('success', 'Client deleted.');
    }
}