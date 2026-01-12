<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProductSerialController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\GatePassController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\PullOutController;
use App\Http\Controllers\RolePermissionController;
use App\Http\Controllers\UnitController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    if (Auth::check()) {
        return redirect()->route('dashboard.index', ['client' => Auth::user()->client->code]);
    }

    // Redirect guests to the login page
    return redirect()->route('login');
});

Route::prefix('{client}')->middleware(['auth', 'verify.client'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard.index');

    Route::resource('/companies', ClientController::class);

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/products/search', [ProductController::class, 'search'])->name('products.search');
    Route::get('/products/list', [ProductController::class, 'list'])->name('products.list');
    Route::resource('/products', ProductController::class);

    Route::prefix('gatepass')->group(function () {
        Route::prefix('dispatch')->group(function () {
            Route::get('/', [GatePassController::class, 'index'])->name('gatepass.dispatch.index');
            Route::get('/create', [GatePassController::class, 'create'])->name('gatepass.dispatch.create');
            Route::post('/', [GatePassController::class, 'store'])->name('gatepass.dispatch.store');
        });

        Route::prefix('pullout')->group(function () {
            Route::get('/', [GatePassController::class, 'index'])->name('gatepass.pullout.index');
            Route::get('/create', [GatePassController::class, 'create'])->name('gatepass.pullout.create');
            Route::post('/', [GatePassController::class, 'store'])->name('gatepass.pullout.store');
        });

        Route::get('/projects/{project}/dispatched_items', [GatePassController::class, 'dispatchedItems'])
            ->name('gatepass.project.dispatched_items');
    });


    Route::resource('/categories', CategoryController::class);
    Route::resource('/projects', ProjectController::class);
    Route::resource('/units', UnitController::class);

    Route::post('/product-serials', [ProductSerialController::class, 'store'])->name('product-serials.store');
    Route::delete('/product-serials/{serial}', [ProductSerialController::class, 'destroy'])->name('product-serials.destroy');

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
    Route::prefix('gatepass')->group(function () {
        Route::prefix('dispatch')->group(function () {
            Route::get('/{gatepass}/print_gatepass', [GatePassController::class, 'print_gatepass'])->name('gatepass.dispatch.print_gatepass');
        });

        Route::prefix('pullout')->group(function () {
            Route::get('/{gatepass}/print_gatepass', [GatePassController::class, 'print_gatepass'])->name('gatepass.pullout.print_gatepass');
        });
    });
});

// Route::get('/permissions', [PermissionController::class, 'index'])->name('permissions.index');

require __DIR__ . '/auth.php';
