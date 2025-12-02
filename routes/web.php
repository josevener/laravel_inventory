<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\InwardGatePassController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\PermissionController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    
    Route::get('/products', [ProductController::class, 'index'])->name('products.index');
    Route::get('/products/create', [ProductController::class, 'create'])->name('products.create');
    Route::post('/products', [ProductController::class, 'store'])->name('products.store');
    Route::get('/products/{product}/show', [ProductController::class, 'show'])->name('products.show');
    Route::get('/products/{product}/edit', [ProductController::class, 'edit'])->name('products.edit');
    Route::put('/products/{product}', [ProductController::class, 'update'])->name('products.update');
    Route::delete('/products/{product}', [ProductController::class, 'destroy'])->name('products.destroy');
    Route::get('/products/search', [ProductController::class, 'search']);

    Route::get('/gatepass/inward',[ InwardGatePassController::class, 'index'] )->name('gatepass.inward.index');
    Route::get('/gatepass/inward/create', [InwardGatePassController::class, 'create'])->name('gatepass.inward.create');
    Route::post('/gatepass/inward', [InwardGatePassController::class, 'store'])->name('gatepass.inward.store');
    Route::get('/gatepass/inward/{gatePass}/print', [InwardGatePassController::class, 'print'])->name('gatepass.inward.print');
});

Route::get('/gatepass/inward/print-payslip', [InwardGatePassController::class, 'printPayslipMonthly'])->name('gatepass.inward.printPayslipMonthly');
Route::get('/roles', [RoleController::class, 'index'])->name('roles.index');
Route::get('/permissions', [PermissionController::class, 'index'])->name('permissions.index');
require __DIR__.'/auth.php';
