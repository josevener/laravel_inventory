<?php

namespace App\Http\Controllers;

use App\Models\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

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
        return Inertia::render('Companies/Show');
    }

    public function show($client, Client $company)
    {
        $company->load([
            'roles:id,client_id,name,guard_name',
            'users:id,client_id,first_name,middle_name,last_name,email', 
            'products:id,client_id,sku,name,category_id,unit_id,current_stock,reorder_level,cost_price,selling_price', 
            'projects:id,client_id,code,name,company_name,phone,email,address,project_started,is_active', 
            'warehouses:id,client_id,code,name,address,manager,is_active', 
            'gatePasses:id,client_id,project_id,gate_pass_no,authorized_bearer,type,remarks,status,received_by,created_by,is_active'
        ]);

        return Inertia::render('Companies/Show', ['client' => $company]);
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
            'is_enable_dispatch_gatepass' => 'boolean',
            'is_enable_pullout_gatepass' => 'boolean',
            'is_enable_warehouses' => 'boolean',
            'is_superadmin' => 'boolean',
            'is_brand_enable' => 'boolean',
            'is_pos_enable' => 'boolean',
            'is_others_enable' => 'boolean',

            // New related items (arrays)
            'new_users' => 'nullable|array',
            'new_users.*.first_name' => 'required|string|max:100',
            'new_users.*.last_name' => 'required|string|max:100',
            'new_users.*.email' => 'required|email|unique:users,email',
            'new_users.*.password' => 'required|string|min:8',

            'new_products' => 'nullable|array',
            'new_products.*.sku' => 'required|string|max:50|unique:products,sku',
            'new_products.*.name' => 'required|string|max:255',
            'new_products.*.current_stock' => 'nullable|integer|min:0',
            'new_products.*.selling_price' => 'nullable|numeric|min:0',

            'new_projects' => 'nullable|array',
            'new_projects.*.code' => 'required|string|max:50',
            'new_projects.*.name' => 'required|string|max:255',
            'new_projects.*.company_name' => 'nullable|string|max:255',
            'new_projects.*.is_active' => 'boolean',

            'new_roles' => 'nullable|array',
            'new_roles.*.name' => 'required|string|max:255',
            'new_roles.*.guard_name' => 'required|string|max:255',
        ]);

        DB::transaction(function () use ($validated) {
            // 1. Create the main client/company
            $client = Client::create($validated);

            // 2. Create new users (assuming you have a User model and relation)
            if (!empty($validated['new_users'])) {
                foreach ($validated['new_users'] as $userData) {
                    $client->users()->create([
                        'first_name' => $userData['first_name'],
                        'last_name' => $userData['last_name'],
                        'email' => $userData['email'],
                        'password' => bcrypt($userData['password']),
                        // add any other fields (role, etc.)
                    ]);
                }
            }

            // 3. Create new products (assuming Product model + relation)
            if (!empty($validated['new_products'])) {
                foreach ($validated['new_products'] as $productData) {
                    $client->products()->create($productData);
                }
            }

            // 4. Create new projects (assuming Project model)
            if (!empty($validated['new_projects'])) {
                foreach ($validated['new_projects'] as $projectData) {
                    $client->projects()->create($projectData);
                }
            }

            // 5. Create new roles (assuming Role model — adjust as needed)
            if (!empty($validated['new_roles'])) {
                foreach ($validated['new_roles'] as $roleData) {
                    // If roles are global (not per client), use Role::create()
                    // If roles are per client, use $client->roles()->create()
                    $role = $client->roles()->create($roleData);

                    $role->syncPermissions($validated['permissions']);
                }
            }
        });

        return redirect()->route('companies.index', ['client' => $client])
            ->with('success', 'Client and related items created successfully.');
    }

    public function edit($client, Client $company)
    {
        return Inertia::render('Companies/CompanyForm', [
            'client' => $company
        ]);
    }

    public function update(Request $request, $client, Client $company)
    {
        // dd($request->all());

        try {
            $validated = $request->validate([
                'code' => 'required|string|max:20|unique:clients,code,' . $company->id,
                'name' => 'required|string|max:100',
                'contact_person' => 'nullable|string|max:100',
                'email' => 'nullable|email|max:100',
                'phone' => 'nullable|string|max:20',
                'address' => 'nullable|string|max:500',
                'is_enable_dispatch_gatepass' => 'boolean',
                'is_enable_pullout_gatepass' => 'boolean',
                'is_enable_warehouses' => 'boolean',
                'is_superadmin' => 'boolean',
                'is_brand_enable' => 'boolean',
                'is_pos_enable' => 'boolean',
                'is_others_enable' => 'boolean',
                'is_active' => 'boolean',
    
                // New related items (same validation)
                'new_users' => 'nullable|array',
                'new_users.*.first_name' => 'required|string|max:100',
                'new_users.*.last_name' => 'required|string|max:100',
                'new_users.*.email' => 'required|email|unique:users,email',
                'new_users.*.password' => 'required|string|min:8',
    
                'new_products' => 'nullable|array',
                'new_products.*.sku' => 'required|string|max:50|unique:products,sku',
                'new_products.*.name' => 'required|string|max:255',
                'new_products.*.current_stock' => 'nullable|integer|min:0',
                'new_products.*.selling_price' => 'nullable|numeric|min:0',
    
                'new_projects' => 'nullable|array',
                'new_projects.*.code' => 'required|string|max:50',
                'new_projects.*.name' => 'required|string|max:255',
                'new_projects.*.company_name' => 'nullable|string|max:255',
                'new_projects.*.is_active' => 'boolean',
    
                'new_roles' => 'nullable|array',
                'new_roles.*.name' => 'required|string|max:255',
                'new_roles.*.guard_name' => 'required|string|max:255',
            ]);
    

            DB::transaction(function () use ($validated, $company) {
                // Update main client
                $company->update($validated);
                

                // Create new users
                if (!empty($validated['new_users'])) {
                    foreach ($validated['new_users'] as $userData) {
                        $company->users()->create([
                            'first_name' => $userData['first_name'],
                            'last_name' => $userData['last_name'],
                            'email' => $userData['email'],
                            'password' => bcrypt($userData['password']),
                        ]);
                    }
                }
    
                // Create new products
                if (!empty($validated['new_products'])) {
                    foreach ($validated['new_products'] as $productData) {
                        $company->products()->create($productData);
                    }
                }
    
                // Create new projects
                if (!empty($validated['new_projects'])) {
                    foreach ($validated['new_projects'] as $projectData) {
                        $company->projects()->create($projectData);
                    }
                }
    
                // Create new roles (adjust based on your role model)
                if (!empty($validated['new_roles'])) {
                    foreach ($validated['new_roles'] as $roleData) {
                        // Example: global roles or per-client
                        // Role::create($roleData);
                        $role = $company->roles()->create($roleData);

                        $role->syncPermissions($validated['permissions']);
                    }
                }
            });
    
            return redirect()->route('companies.index', [
                    'client' => $company->code,
                ])
                ->with('success', 'Client and related items updated successfully.');
        } catch (\Exception $e) {
            return redirect()->route('companies.index', ['client'=> $company->code])
                ->with('error', $e->getMessage());
        }
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