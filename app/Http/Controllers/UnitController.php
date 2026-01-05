<?php

namespace App\Http\Controllers;

use App\Models\Unit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class UnitController extends Controller
{
    public function index()
    {
        $clientId = Auth::user()->client_id;

        $units = Unit::with('products')
            ->where('client_id', $clientId)
            // ->whereHas('products', function ($query) use ($clientId) {
            //     $query->where('client_id', $clientId);
            // })
            ->orderBy('name')
            ->get();

        return Inertia::render('Units/Index', [
            'units' => $units
        ]);
    }

    public function create()
    {
        return Inertia::render('Units/Create');
    }

    public function store($client, Request $request)
    {
        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:50',
                Rule::unique('units', 'name')
                    ->whereNull('deleted_at')
                    ->where('client_id', Auth::user()->client_id),
            ],
            'short_name' => [
                'required',
                'string',
                'max:10',
                Rule::unique('units', 'short_name')
                    ->whereNull('deleted_at')
                    ->where('client_id', Auth::user()->client_id),
            ],
        ]);

        $validated['client_id'] = Auth::user()->client_id;

        Unit::create($validated);

        return redirect()->route('units.index', ['client' => $client])
            ->with('success', 'Unit created successfully.');
    }

    public function edit($client, Unit $unit)
    {
        return Inertia::render('Units/Edit', [
            'unit' => $unit
        ]);
    }


    public function update(Request $request, $client, Unit $unit)
    {
        $clientId = Auth::user()->client_id;

        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:50',
                Rule::unique('units', 'name')
                    ->ignore($unit->id)
                    ->where(
                        fn($q) =>
                        $q->whereNull('deleted_at')
                            ->where('client_id', $clientId)
                    ),
            ],
            'short_name' => [
                'required',
                'string',
                'max:10',
                Rule::unique('units', 'short_name')
                    ->ignore($unit->id)
                    ->where(
                        fn($q) =>
                        $q->whereNull('deleted_at')
                            ->where('client_id', $clientId)
                    ),
            ],
        ]);

        $unit->update($validated);

        return redirect()
            ->route('units.index', ['client' => $client])
            ->with('success', 'Unit updated successfully.');
    }

    public function destroy($client, Unit $unit)
    {
        if ($unit->products()->exists()) {
            return back()->withErrors(['delete' => 'Cannot delete unit used by products.']);
        }

        $unit->delete();

        return redirect()->route('units.index', ['client' => $client])
            ->with('success', 'Unit deleted.');
    }
}
