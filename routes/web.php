<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\InwardGatePassController;
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
    Route::get('/products/search', [ProductController::class, 'search']);

    Route::get('gatepass/inward',[ InwardGatePassController::class, 'index'] )->name('gatepass.inward.index');
    Route::get('gatepass/inward/create', [InwardGatePassController::class, 'create'])->name('gatepass.inward.create');
    Route::post('gatepass/inward/store', [InwardGatePassController::class, 'store'])->name('gatepass.inward.store');
});

Route::get('gatepass/inward/print-payslip', [InwardGatePassController::class, 'printPayslipMonthly'])->name('gatepass.inward.printPayslipMonthly');

require __DIR__.'/auth.php';
