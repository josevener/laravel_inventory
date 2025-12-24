<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Spatie\Permission\PermissionRegistrar;

class SetPermissionTeam
{
    public function handle(Request $request, Closure $next): mixed
    {
        if ($user = $request->user()) {
            // Adjust this based on how your User model gets the client_id
            // Common patterns:
            $clientId = $user->client_id ?? $user->client?->id;

            if ($clientId) {
                app(PermissionRegistrar::class)->setPermissionsTeamId($clientId);
            }
        }

        return $next($request);
    }
}