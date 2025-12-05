<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Warehouse;
use App\Models\Category;
use App\Models\Unit;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::with(['category', 'unit'])
            ->with(['warehouses' => fn($q) => $q->withPivot('current_stock')])
            ->withCount([
                'warehouses as low_stock_count' => fn($q) =>
                $q->whereColumn('product_warehouse.current_stock', '<', 'products.reorder_level')
            ])
            ->addSelect([
                'total_stock' => DB::table('product_warehouse')
                    ->whereColumn('product_id', 'products.id')
                    ->selectRaw('COALESCE(SUM(current_stock), 0)')
            ])
            ->orderBy('total_stock')
            ->get();

        $warehouses = Warehouse::where('is_active', true)
            ->select('id', 'name', 'code')
            ->get();

        return Inertia::render('Products/Index', [
            'products' => $products,
            'warehouses' => $warehouses,
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
            'serial_no' => 'required|unique:products,sku',
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'unit_id' => 'required|exists:units,id',
            'reorder_level' => 'required|integer|min:0',
            'description' => 'nullable|string',
        ]);

        Product::create($validated);

        return redirect()->route('products.index')->with('success', 'Product created successfully.');
    }

    public function edit(Product $product)
    {
        $product->load(['category', 'unit']);

        return Inertia::render('Products/Edit', [
            'product' => $product,
            'categories' => Category::all(['id', 'name']),
            'units' => Unit::all(['id', 'name', 'short_name']),
        ]);
    }

    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'serial_no' => 'required|unique:products,sku,' . $product->id,
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'unit_id' => 'required|exists:units,id',
            'reorder_level' => 'required|integer|min:0',
            'description' => 'nullable|string',
        ]);

        $product->update($validated);

        return redirect()->route('products.index')->with('success', 'Product updated successfully.');
    }

    public function destroy(Product $product)
    {
        // Optional: Prevent delete if stock exists or used in gatepasses
        // if ($product->warehouses()->sum('pivot.current_stock') > 0) {
        //     return back()->with('error', 'Cannot delete product with stock.');
        // }

        $product->delete();

        return redirect()->route('products.index')->with('success', 'Product deleted.');
    }

    public function search(Request $request)
    {
        $query = Product::query()
            ->with('unit')
            ->select('products.id', 'products.serial_no', 'products.name', 'products.reorder_level', 'unit_id')
            ->where('serial_no', 'LIKE', "%{$request->q}%")
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
                'serial_no' => $p->serial_no,
                'name' => $p->name,
                'unit_short' => $p->unit->short_name ?? 'Pc',
                'current_stock' => (int) ($p->current_stock ?? 0),
                'reorder_level' => $p->reorder_level,
            ])
        );
    }
}
