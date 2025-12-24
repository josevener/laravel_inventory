<?php

use App\Http\Middleware\VerifyClientExists;
use App\Http\Middleware\SetPermissionTeam; // Add this import
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // First: Append SetPermissionTeam EARLY (after auth, before Inertia)
        $middleware->web(append: [
            SetPermissionTeam::class,
        ]);

        // Then: Inertia and other late middlewares
        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
        ]);

        // Register route middleware alias
        $middleware->alias([
            'verify.client' => VerifyClientExists::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
