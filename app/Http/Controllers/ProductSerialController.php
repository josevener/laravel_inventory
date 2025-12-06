<?php

namespace App\Http\Controllers;

use App\Models\ProductSerial;
use Illuminate\Http\Request;

class ProductSerialController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'serial_no'  => 'required|string|max:255|unique:product_serials,serial_no',
        ]);

        ProductSerial::create($validated);

        return back()->with('success', 'Serial number added.');
    }

    public function destroy(ProductSerial $serial)
    {
        $serial->delete();

        return back()->with('success', 'Serial removed.');
    }
}
