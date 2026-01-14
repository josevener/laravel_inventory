<?php

namespace App\Http\Controllers;

use App\Models\ProductSerial;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProductSerialController extends Controller
{
   public function store(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'serial_no'  => 'required|string|max:255|unique:product_serials,serial_no',
        ]);

        $productId = $validated['product_id'];
        $clientId  = Auth::user()->client_id;

        $currentStock = \App\Models\Product::where('id', $productId)
            ->where('client_id', $clientId)
            ->value('current_stock');

        $serialCount = ProductSerial::where('product_id', $productId)
            ->where('client_id', $clientId)
            ->count();

        if ($serialCount >= $currentStock) {
            return back()
                ->withErrors([
                    'serial_no' => 'Cannot add more serials than current stock.'
                ])
                ->with([
                    'error' => 'Cannot add more serials than current stock.'
                ]);
        }

        ProductSerial::create([
            'product_id' => $productId,
            'serial_no'  => $validated['serial_no'],
            'client_id'  => $clientId,
        ]);

        return back()->with('success', 'Serial number added.');
    }

    public function destroy(ProductSerial $serial)
    {
        $serial->delete();

        return back()->with('success', 'Serial removed.');
    }
}
