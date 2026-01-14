<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Sale;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class POSController extends Controller
{
    public function index()
    {
        $products = Product::where('client_id', Auth::user()->client_id)
            ->where('is_active', true)
            ->select('id', 'name', 'sku', 'selling_price', 'current_stock')
            ->orderBy('name')
            ->get();

        return Inertia::render('PointOfSale/Index', [
            'products' => $products
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'items' => 'required|array|min:1',
            'items.*.id' => 'required|exists:products,id',
            'items.*.qty' => 'required|integer|min:1',
            'payment_method' => 'required|in:cash,card',
            'cash_received' => 'nullable|numeric',
        ]);

        DB::transaction(function () use ($request) {
            $subtotal = collect($request->items)
                ->sum(fn ($i) => $i['price'] * $i['qty']);

            $sale = Sale::create([
                'client_id' => Auth::user()->client_id,
                'user_id' => Auth::id(),
                'payment_method' => $request->payment_method,
                'subtotal' => $subtotal,
                'tax' => 0,
                'discount' => 0,
                'total' => $subtotal,
                'cash_received' => $request->cash_received,
                'change' => $request->payment_method === 'cash'
                    ? $request->cash_received - $subtotal
                    : null,
            ]);

            foreach ($request->items as $item) {
                $product = Product::lockForUpdate()->find($item['id']);

                if ($product->stock < $item['qty']) {
                    throw new \Exception('Insufficient stock');
                }

                $product->decrement('stock', $item['qty']);

                $sale->items()->create([
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'product_code' => $product->code,
                    'price' => $product->price,
                    'qty' => $item['qty'],
                    'total' => $product->price * $item['qty'],
                ]);
            }
        });

        return back()->with('success', 'Sale completed successfully.');
    }
}