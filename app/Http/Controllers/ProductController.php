<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Warehouse;
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

    public function search(Request $request)
    {
        $query = Product::query()
            ->with('unit')
            ->select('products.id', 'products.sku', 'products.name', 'products.reorder_level', 'unit_id')
            ->where('sku', 'LIKE', "%{$request->q}%")
            ->orWhere('name', 'LIKE', "%{$request->q}%");

        if ($request->filled('warehouse_id')) {
            $query->addSelect([
                'current_stock' => DB::table('product_warehouse')
                    ->whereColumn('product_id', 'products.id')
                    ->where('warehouse_id', $request->warehouse_id)
                    ->select('current_stock')
                    ->limit(1)
            ]);
        }

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