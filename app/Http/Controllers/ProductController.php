<?php

namespace App\Http\Controllers;

use App\Models\Brand;
use App\Models\Product;
use App\Models\Category;
use App\Models\Unit;
use App\Services\SkuService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::where('client_id', Auth::user()->client_id)
            ->with(['category', 'unit', 'serials'])
            ->orderBy('name')
            ->get();

        return Inertia::render('Products/Index', [
            'products' => $products
        ]);
    }

    public function list(Request $request)
    {
        $query = Product::query()
            ->select('id', 'sku', 'name', 'current_stock', 'reorder_level', 'unit_id', 'category_id', 'active')
            ->with([
                'unit:id,name,short_name', 
                'category:id,code,name',
                'serials'
            ])
            ->where('client_id', Auth::user()->client_id)
            ->orderBy('sku')
            ->orderBy('name');

        // Apply search if provided
        if ($request->has('q') && $request->filled('q')) {
            $search = $request->q;
            $query->where(function ($q) use ($search) {
                $q->where('sku', 'like', "%{$search}%")
                    ->orWhere('name', 'like', "%{$search}%");
            });
        }

        // Paginate: 20 per page (you can adjust)
        // $products = $query->paginate(20);
        $products = $query->paginate(1000);

        return response()->json($products);
    }

    public function create()
    {
        $clientId = Auth::user()->client_id;
        $isBrandEnable = Auth::user()->client->is_brand_enable;
        $isPosEnable = Auth::user()->client->is_pos_enable;
        $isOthersEnable = Auth::user()->client->is_others_enable;

        return Inertia::render('Products/ProductForm', [
            'categories' => Category::where('client_id', $clientId)
                ->orderBy('name')
                ->get(['id', 'name']),

            'units' => Unit::where('client_id', $clientId)
                ->orderBy('name')
                ->get(['id', 'name', 'short_name']),

            'brands' => Brand::where('client_id', $clientId)
                ->orderBy('name')
                ->get(['id', 'name']),

            'enable_brands' => (bool) $isBrandEnable,
            'enable_pos' => (bool) $isPosEnable,
            'enable_others' => (bool) $isOthersEnable,
        ]);
    }

    public function store($client, Request $request)
    {
        $clientId = Auth::user()->client_id;

        $isPosEnable = Auth::user()->client->is_pos_enable;
        $skuService = new SkuService();

        $validated = $request->validate([
            'sku' => [
                'nullable',
                'string',
                'max:50',
                Rule::unique('products')
                    ->where(fn($q) => $q->where('client_id', $clientId)),
            ],
            'name' => 'required|string|max:255',
            'category_id' => [
                'required',
                'integer',
                function ($attribute, $value, $fail) use ($clientId) {
                    if ((int) $value === -1) return; // allow "Others"
            
                    if (!Category::where('client_id', $clientId)->whereKey($value)->exists()) {
                        $fail('The selected category is invalid.');
                    }
                },
            ],
            'unit_id' => [
                'required',
                'integer',
                function ($attribute, $value, $fail) use ($clientId) {
                    if ((int) $value === -1) return; // allow "Others"
            
                    if (!Unit::where('client_id', $clientId)->whereKey($value)->exists()) {
                        $fail('The selected unit is invalid.');
                    }
                },
            ],
            'brand_id' => [
                'nullable',
                'integer',
                function ($attribute, $value, $fail) use ($clientId) {
                    if ($value === null) return;
                    if ((int) $value === -1) return; // allow "Others"
            
                    if (!Brand::where('client_id', $clientId)->whereKey($value)->exists()) {
                        $fail('The selected brand is invalid.');
                    }
                },
            ],
            'current_stock' => 'required|integer|min:0',
            'reorder_level' => 'required|integer|min:0',
            'cost_price' => [
                $isPosEnable ? 'required' : 'nullable',
                'numeric',
                $isPosEnable ? 'min:1' : 'min:0',
            ],
            'selling_price' => [
                'nullable',
                'numeric',
                'min:0',
        
                // if cost_price is present, selling_price must be >= cost_price
                Rule::when(
                    request()->filled('cost_price'),
                    ['gte:cost_price']
                ),
            ],
            'description' => 'nullable|string',
            'status' => 'required|boolean',
        ]);

        $validated['client_id'] = Auth::user()->client_id;

        $validated['category_id'] = ((int) $validated['category_id'] === -1)
            ? null
            : (int) $validated['category_id'];
        
        $validated['unit_id'] = ((int) $validated['unit_id'] === -1)
            ? null
            : (int) $validated['unit_id'];

        $validated['brand_id'] = isset($validated['brand_id']) && ((int) $validated['brand_id'] === -1)
            ? null
            : (isset($validated['brand_id']) ? (int) $validated['brand_id'] : null);

        $validated['sku'] = trim($validated['sku'] ?? '');

        if ($validated['sku'] === '') {
            $category = $validated['category_id']
                ? Category::where('client_id', $clientId)->find($validated['category_id'])
                : null;

            $unit = $validated['unit_id']
                ? Unit::where('client_id', $clientId)->find($validated['unit_id'])
                : null;

            $brand = $validated['brand_id']
                ? Brand::where('client_id', $clientId)->find($validated['brand_id'])
                : null;

            $categoryCode = $category?->code ?? 'OT';
            $unitCode = $unit?->short_name ?? 'OT';

            $isBrandEnable = (bool) Auth::user()->client->is_brand_enable;
            $brandCode = ($isBrandEnable && $brand) ? $brand->code : null;

            $validated['sku'] = $skuService->generate(
                $clientId,
                $categoryCode,
                $unitCode,
                $brandCode
            );
        }

        Product::create($validated);

        return redirect()->route('products.index', ['client' => $client])
            ->with('success', 'Product created successfully.');
    }

    public function show($client, Product $product)
    {
        $product->load(['category', 'unit', 'serials']);

        return Inertia::render('Products/Show', [
            'product' => $product
        ]);
    }

    public function edit($client, Product $product)
    {
        $product->load(['category', 'unit']);

        $clientId = Auth::user()->client_id;

        $isBrandEnable = Auth::user()->client->is_brand_enable;
        $isPosEnable = Auth::user()->client->is_pos_enable;
        $isOthersEnable = Auth::user()->client->is_others_enable;

        return Inertia::render('Products/ProductForm', [
            'product' => $product,

            'categories' => Category::where('client_id', $clientId)
                ->orderBy('name')
                ->get(['id', 'name']),

            'units' => Unit::where('client_id', $clientId)
                ->orderBy('name')
                ->get(['id', 'name', 'short_name']),

            'brands' => Brand::where('client_id', $clientId)
                ->orderBy('name')
                ->get(['id', 'name']),

            'enable_brands' => (bool) $isBrandEnable,
            'enable_pos' => (bool) $isPosEnable,
            'enable_others' => (bool) $isOthersEnable,
        ]);
    }

    public function update(Request $request, $client, Product $product)
    {
        $clientId = Auth::user()->client_id;

        $isBrandEnable = Auth::user()->client->is_brand_enable;
        $isPosEnable = Auth::user()->client->is_pos_enable;
        $isOthersEnable = Auth::user()->client->is_others_enable;

        $validated = $request->validate([
            'sku' => [
                'nullable',
                'string',
                'max:50',
                Rule::unique('products')
                    ->where(fn($q) => $q->where('client_id', $clientId))
                    ->ignore($product->id),
            ],
            'name' => 'required|string|max:255',
            'category_id' => [
                'required',
                'integer',
                function ($attribute, $value, $fail) use ($clientId) {
                    if ((int) $value === -1) return; // allow "Others"
            
                    if (!Category::where('client_id', $clientId)->whereKey($value)->exists()) {
                        $fail('The selected category is invalid.');
                    }
                },
            ],
            'unit_id' => [
                'required',
                'integer',
                function ($attribute, $value, $fail) use ($clientId) {
                    if ((int) $value === -1) return; // allow "Others"
            
                    if (!Unit::where('client_id', $clientId)->whereKey($value)->exists()) {
                        $fail('The selected unit is invalid.');
                    }
                },
            ],
            'brand_id' => [
                'nullable',
                'integer',
                function ($attribute, $value, $fail) use ($clientId) {
                    if ($value === null) return;
                    if ((int) $value === -1) return; // allow "Others"
            
                    if (!Brand::where('client_id', $clientId)->whereKey($value)->exists()) {
                        $fail('The selected brand is invalid.');
                    }
                },
            ],
            'current_stock' => 'required|integer|min:0',
            'reorder_level' => 'required|integer|min:0',
            'cost_price' => [
                $isPosEnable ? 'required' : 'nullable',
                'numeric',
                $isPosEnable ? 'min:1' : 'min:0',
            ],
            'selling_price' => [
                'nullable',
                'numeric',
                'min:0',
        
                // if cost_price is present, selling_price must be >= cost_price
                Rule::when(
                    request()->filled('cost_price'),
                    ['gte:cost_price']
                ),
            ],
            'description' => 'nullable|string',
            'status' => 'required|boolean',
        ]);

        $validated['category_id'] = ((int) $validated['category_id'] === -1)
            ? null
            : (int) $validated['category_id'];
        
        $validated['unit_id'] = ((int) $validated['unit_id'] === -1)
            ? null
            : (int) $validated['unit_id'];

        $validated['brand_id'] = isset($validated['brand_id']) && ((int) $validated['brand_id'] === -1)
            ? null
            : (isset($validated['brand_id']) ? (int) $validated['brand_id'] : null);

        $skuService = new SkuService();

        $validated['sku'] = trim($validated['sku'] ?? '');
        
        if ($validated['sku'] === '') {
            $category = $validated['category_id']
                ? Category::where('client_id', $clientId)->find($validated['category_id'])
                : null;
        
            $unit = $validated['unit_id']
                ? Unit::where('client_id', $clientId)->find($validated['unit_id'])
                : null;
        
            $brand = $validated['brand_id']
                ? Brand::where('client_id', $clientId)->find($validated['brand_id'])
                : null;
        
            $categoryCode = $category?->code ?? 'OT';
            $unitCode = $unit?->short_name ?? 'OT';
        
            $isBrandEnable = (bool) Auth::user()->client->is_brand_enable;
            $brandCode = ($isBrandEnable && $brand) ? $brand->code : null;
        
            $validated['sku'] = $skuService->generate(
                $clientId,
                $categoryCode,
                $unitCode,
                $brandCode
            );
        }
            
        $product->update($validated);

        return redirect()->route('products.index', ['client' => $client])
            ->with('success', 'Product updated successfully.');
    }

    public function destroy($client, Product $product)
    {
        DB::transaction(function () use ($product) {
            $product->update([
                'sku' => $product->sku . '_deleted_' . $product->id,
            ]);

            $product->delete();
        });

        return redirect()->route('products.index', ['client' => $client])
            ->with('success', 'Product deleted.');
    }

    public function search(Request $request)
    {
        $query = Product::query()
            ->with('unit')
            ->select('products.id', 'products.sku', 'products.name', 'products.reorder_level', 'unit_id')
            ->where('client_id', Auth::user()->client_id)
            ->where(function ($q) use ($request) {
                $q->where('sku', 'LIKE', "%{$request->q}%")
                    ->orWhere('name', 'LIKE', "%{$request->q}%");
            });

        // if ($request->filled('warehouse_id')) {
        //     $query->addSelect([
        //         'current_stock' => DB::table('product_warehouse')
        //             ->whereColumn('product_id', 'products.id')
        //             ->where('warehouse_id', $request->warehouse_id)
        //             ->select('current_stock')
        //             ->limit(1)
        //     ]);
        // }

        $products = $query->limit(15)->get();

        return response()->json(
            $products->map(fn($p) => [
                'id' => $p->id,
                'sku' => $p->sku,
                'name' => $p->name,
                'unit_short' => $p->unit->short_name ?? 'Pc',
                'current_stock' => (int) ($p->current_stock ?? 0),
                'reorder_level' => $p->reorder_level,
            ])
        );
    }
}
