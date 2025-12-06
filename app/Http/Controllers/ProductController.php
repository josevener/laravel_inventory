<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductSerial;
use App\Models\Category;
use App\Models\Unit;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::with(['category', 'unit', 'serials'])
            ->orderBy('name')
            ->get();

        return Inertia::render('Products/Index', [
            'products' => $products
        ]);
    }

    public function create()
    {
        return Inertia::render('Products/Create', [
            'categories' => Category::all(['id', 'name']),
            'units' => Unit::all(['id', 'name', 'short_name']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'sku' => 'required|string|max:50|unique:products,sku',
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'unit_id' => 'required|exists:units,id',
            'current_stock' => 'required|integer|min:0',
            'reorder_level' => 'required|integer|min:0',
            'cost_price' => 'nullable|numeric|min:0',
            'selling_price' => 'nullable|numeric|min:0',
            'description' => 'nullable|string',
        ]);

        Product::create($validated);

        return redirect()->route('products.index')->with('success', 'Product created successfully.');
    }

    public function show(Product $product)
    {
        $product->load(['category', 'unit', 'serials']);

        return Inertia::render('Products/Show', [
            'product' => $product
        ]);
    }

    public function edit(Product $product)
    {
        $product->load(['category', 'unit']);

        return Inertia::render('Products/Edit', [
            'product' => $product,
            'categories' => Category::select('id', 'name')->get(),
            'units' => Unit::select('id', 'name', 'short_name')->get(),
        ]);
    }

    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'sku' => 'required|string|max:50|unique:products,sku,' . $product->id,
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

        return redirect()->route('products.index')->with('success', 'Product updated successfully.');
    }

    public function destroy(Product $product)
    {
        $product->delete();

        return redirect()->route('products.index')->with('success', 'Product deleted.');
    }

    public function search(Request $request)
    {
        $query = Product::query()
            ->with('unit')
            ->select('products.id', 'products.sku', 'products.name', 'products.reorder_level', 'unit_id')
            ->where('sku', 'LIKE', "%{$request->q}%")
            ->orWhere('name', 'LIKE', "%{$request->q}%");

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
