<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Register DomPDF
        $this->app->register(\Barryvdh\DomPDF\ServiceProvider::class);

        // Register Barcode (Milon)
        $this->app->register(\Milon\Barcode\BarcodeServiceProvider::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        // Optional: Add facades for easier use
        if (!class_exists('Pdf')) {
            class_alias(\Barryvdh\DomPDF\Facade\Pdf::class, 'Pdf');
        }

        if (!class_exists('DNS1D')) {
            class_alias(\Milon\Barcode\Facades\DNS1DFacade::class, 'DNS1D');
        }

        if (!class_exists('DNS2D')) {
            class_alias(\Milon\Barcode\Facades\DNS2DFacade::class, 'DNS2D');
        }
    }
}
