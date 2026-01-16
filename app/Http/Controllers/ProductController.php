<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use App\Models\Unit;
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
            ->select('id', 'sku', 'name', 'current_stock', 'reorder_level', 'unit_id', 'category_id')
            ->with([
                'unit:id,name,short_name', 
                'category:id,code,name',
                'serials'
            ])
            ->where('client_id', Auth::user()->client_id)
            ->orderBy('sku');

        // Apply search if provided
        if ($request->has('q') && $request->filled('q')) {
            $search = $request->q;
            $query->where(function ($q) use ($search) {
                $q->where('sku', 'like', "%{$search}%")
                    ->orWhere('name', 'like', "%{$search}%");
            });
        }

        // Paginate: 20 per page (you can adjust)
        $products = $query->paginate(20);

        return response()->json($products);
    }

    public function create()
    {
        return Inertia::render('Products/Create', [
            'categories' => Category::where('client_id', Auth::user()->client_id)
                ->orderBy('name')
                ->get(['id', 'name']),

            'units' => Unit::where('client_id', Auth::user()->client_id)
                ->orderBy('name')
                ->get(['id', 'name', 'short_name']),
        ]);
    }

    public function store($client, Request $request)
    {
        $clientId = Auth::user()->client_id;

        $validated = $request->validate([
            'sku' => [
                'required',
                'string',
                'max:50',
                Rule::unique('products')
                    ->where(fn($q) => $q->where('client_id', $clientId)),
            ],
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'unit_id' => 'required|exists:units,id',
            'current_stock' => 'required|integer|min:0',
            'reorder_level' => 'required|integer|min:0',
            'cost_price' => 'nullable|numeric|min:0',
            'selling_price' => 'nullable|numeric|min:0',
            'description' => 'nullable|string',
        ]);

        $validated['client_id'] = Auth::user()->client_id;

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

        return Inertia::render('Products/Edit', [
            'product' => $product,
            'categories' => Category::where('client_id', Auth::user()->client_id)
                ->orderBy('name')
                ->get(['id', 'name']),

            'units' => Unit::where('client_id', Auth::user()->client_id)
                ->orderBy('name')
                ->get(['id', 'name', 'short_name']),
        ]);
    }

    public function update(Request $request, $client, Product $product)
    {
        $clientId = Auth::user()->client_id;

        $validated = $request->validate([
            'sku' => [
                'required',
                'string',
                'max:50',
                Rule::unique('products')
                    ->where(fn($q) => $q->where('client_id', $clientId))
                    ->ignore($product->id),
            ],
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'unit_id' => 'required|exists:units,id',
            'current_stock' => 'required|integer|min:0',
            'reorder_level' => 'required|integer|min:0',
            'cost_price' => 'nullable|numeric|min:0',
            'selling_price' => 'nullable|numeric|min:0',
            'description' => 'nullable|string',
        ]);

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
