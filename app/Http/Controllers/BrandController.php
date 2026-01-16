<?php

namespace App\Http\Controllers;

use App\Models\Brand;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class BrandController extends Controller
{
    public function index()
    {
        $brands = Brand::with('products')
            ->where('client_id', Auth::user()->client_id)
            ->orderBy('name')
            ->get();

        return Inertia::render('Brands/Index', [
            'brands' => $brands
        ]);
    }

    public function create()
    {
        return Inertia::render('Brands/Create');
    }

    public function store($client, Request $request)
    {
        $clientId = Auth::user()->client_id;

        $validated = $request->validate([
            'code' => [
                'nullable',
                'string',
                'max:20',
                Rule::unique('brands')
                    ->where(fn ($q) => $q
                        ->where('client_id', $clientId)
                        ->whereNull('deleted_at')
                    ),
            ],
            'name' => [
                'required',
                'string',
                'max:100',
                Rule::unique('brands')
                    ->where(fn ($q) => $q
                        ->where('client_id', $clientId)
                        ->whereNull('deleted_at')
                    ),
            ],
            'logo_path' => 'nullable|string|max:255',
            'website' => 'nullable|string|max:255',
            'description' => 'nullable|string|max:1000',
        ]);

        $validated['client_id'] = Auth::user()->client_id;

        Brand::create($validated);

        return redirect()->route('brands.index', [ 'client' => $client])
            ->with('success', 'Brand created successfully.');
    }

    public function edit($client, Brand $brand)
    {
        return Inertia::render('Brands/Edit', [
            'brand' => $brand
        ]);
    }

    public function update(Request $request, $client, Brand $brand)
    {
        $clientId = Auth::user()->client_id;

        $validated = $request->validate([
            'code' => [
                'nullable',
                'string',
                'max:20',
                Rule::unique('brands')
                    ->ignore($brand->id)
                    ->where(fn ($q) => $q
                        ->where('client_id', $clientId)
                        ->whereNull('deleted_at')
                    ),
            ],
            'name' => [
                'required',
                'string',
                'max:100',
                Rule::unique('brands')
                    ->ignore($brand->id)
                    ->where(fn ($q) => $q
                        ->where('client_id', $clientId)
                        ->whereNull('deleted_at')
                    ),
            ],
            'description' => 'nullable|string|max:1000',
        ]);

        $brand->update($validated);

        return redirect()->route('brands.index', ['client' => $client])
            ->with('success', 'Brand updated successfully.');
    }

    public function destroy($client, Brand $brand)
    {
        if ($brand->products()->count() > 0) {
            return back()->withErrors(['delete' => 'Cannot delete brand with products assigned.']);
        }

        DB::transaction(function () use ($brand) {
            $brand->update([
                'code' => $brand->code . '_deleted_' . $brand->id,
                'name' => $brand->name . '_deleted_' . $brand->id,
            ]);

            $brand->delete();
        });

        return redirect()->route('brands.index', ['client' => $client])
            ->with('success', 'Brand deleted.');
    }
}
