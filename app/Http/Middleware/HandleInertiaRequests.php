<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Tighten\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        // return [
        //     ...parent::share($request),
        //     'auth' => [
        //         'user' => $request->user(),
        //     ],
        // ];
        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $request->user() ? [
                    'id' => $request->user()->id,
                    'first_name' => $request->user()->first_name,
                    'middle_name' => $request->user()->middle_name,
                    'last_name' => $request->user()->last_name,
                    'email' => $request->user()->email,
                    // Lazy-load roles and permissions AFTER team middleware runs
                    'roles' => fn () => $request->user()->getRoleNames(),
                    'permissions' => fn () => $request->user()->getAllPermissions()->pluck('name')->toArray(),
                    'client' => $request->user()->client ? [
                        'id' => $request->user()->client->id,
                        'name' => $request->user()->client->name,
                        'code' => $request->user()->client->code,
                        'is_enable_dispatch_gatepass' => $request->user()->client->is_enable_dispatch_gatepass,
                        'is_enable_pullout_gatepass' => $request->user()->client->is_enable_pullout_gatepass,
                        'is_enable_warehouses' => $request->user()->client->is_enable_warehouses,
                        'is_superadmin' => $request->user()->client->is_superadmin,
                        'is_brand_enable' => $request->user()->client->is_brand_enable,
                        'is_pos_enable' => $request->user()->client->is_pos_enable,
                        'is_others_enable' => $request->user()->client->is_others_enable,
                    ] : null,
                ] : null,
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error'   => fn () => $request->session()->get('error'),
                'warning' => fn () => $request->session()->get('warning'),
                'info'    => fn () => $request->session()->get('info'),
            ],

            'ziggy' => function () use ($request) {
                $ziggy = (new Ziggy)->toArray();
            
                if ($request->user() && $request->user()->client) {
                    $ziggy['url'] = $request->url();
                    // $ziggy['url'] = url($request->user()->client->code);
                }
            
                return $ziggy;
            },
        ]);
    }
}
