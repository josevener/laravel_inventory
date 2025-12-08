<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::with('products')
            ->where('client_id', Auth::user()->client_id)
            ->orderBy('name')
            ->get();

        return Inertia::render('Categories/Index', [
            'categories' => $categories
        ]);
    }

    public function create()
    {
        return Inertia::render('Categories/Create');
    }

    public function store($client, Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|max:20|unique:categories,code',
            'name' => 'required|string|max:100|unique:categories,name',
            'description' => 'nullable|string|max:1000',
        ]);

        $validated['client_id'] = Auth::user()->client_id;

        Category::create($validated);

        return redirect()->route('categories.index', [ 'client' => $client])
            ->with('success', 'Category created successfully.');
    }

    public function edit($client, Category $category)
    {
        return Inertia::render('Categories/Edit', [
            'category' => $category
        ]);
    }

    public function update(Request $request, $client, Category $category)
    {
        $validated = $request->validate([
            'code' => 'required|string|max:20|unique:categories,code,' . $category->id,
            'name' => 'required|string|max:100|unique:categories,name,' . $category->id,
            'description' => 'nullable|string|max:1000',
        ]);

        $category->update($validated);

        return redirect()->route('categories.index', ['client' => $client])
            ->with('success', 'Category updated successfully.');
    }

    public function destroy($client, Category $category)
    {
        if ($category->products()->count() > 0) {
            return back()->withErrors(['delete' => 'Cannot delete category with products assigned.']);
        }

        $category->delete();

        return redirect()->route('categories.index', ['client' => $client])
            ->with('success', 'Category deleted.');
    }
}