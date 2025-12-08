<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProductSerialController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\InwardGatePassController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\PullOutController;
use App\Http\Controllers\RolePermissionController;
use App\Http\Controllers\UnitController;
use App\Http\Controllers\UserController;
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

Route::prefix('{client}')->middleware(['auth', 'verify.client'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard.index');

    Route::resource('/companies', ClientController::class);

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    
    // Route::get('/products', [ProductController::class, 'index'])->name('products.index');
    // Route::get('/products/create', [ProductController::class, 'create'])->name('products.create');
    // Route::post('/products', [ProductController::class, 'store'])->name('products.store');
    // Route::get('/products/{product}/show', [ProductController::class, 'show'])->name('products.show');
    // Route::get('/products/{product}/edit', [ProductController::class, 'edit'])->name('products.edit');
    // Route::put('/products/{product}', [ProductController::class, 'update'])->name('products.update');
    // Route::delete('/products/{product}', [ProductController::class, 'destroy'])->name('products.destroy');
    Route::get('/products/search', [ProductController::class, 'search'])->name('products.search');
    Route::resource('/products', ProductController::class);

    Route::get('/gatepass/inward',[ InwardGatePassController::class, 'index'] )->name('gatepass.inward.index');
    Route::get('/gatepass/inward/create', [InwardGatePassController::class, 'create'])->name('gatepass.inward.create');
    Route::post('/gatepass/inward', [InwardGatePassController::class, 'store'])->name('gatepass.inward.store');

    Route::resource('/categories', CategoryController::class);
    Route::resource('/projects', ProjectController::class);
    Route::resource('/units', UnitController::class);
    
    Route::post('/product-serials', [ProductSerialController::class, 'store'])->name('product-serials.store');
    Route::delete('/product-serials/{serial}', [ProductSerialController::class, 'destroy'])->name('product-serials.destroy');

    Route::resource('/pull_out', PullOutController::class);
    
    Route::prefix('roles-permissions')->group(function () {
        Route::get('/', [RolePermissionController::class, 'index'])->name('roles-permissions.index');
        Route::resource('/roles', RoleController::class);
        Route::resource('/permissions', PermissionController::class);
    });

    Route::post('/users/import', [UserController::class, 'import'])->name('users.import');
    Route::get('/users/export', [UserController::class, 'export'])->name('users.export');
    Route::resource('/users', UserController::class);
});

Route::prefix('{client}')->middleware(['verify.client'])->group(function () {
    Route::get('/gatepass/inward/{gatepass}/print_gatepass', [InwardGatePassController::class, 'print_gatepass'])->name('gatepass.inward.print_gatepass');
    Route::get('/gatepass/inward/print-payslip', [InwardGatePassController::class, 'printPayslipMonthly'])->name('gatepass.inward.printPayslipMonthly');
});

// Route::get('/permissions', [PermissionController::class, 'index'])->name('permissions.index');

require __DIR__.'/auth.php';
