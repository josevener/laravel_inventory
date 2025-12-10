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
                    'name' => $request->user()->name,
                    'email' => $request->user()->email,
                    'roles' => $request->user()->getRoleNames(),
                    'permissions' => $request->user()->getAllPermissions()->pluck('name'),
                    'client' => $request->user()->client ? [
                        'id' => $request->user()->client->id,
                        'name' => $request->user()->client->name,
                        'code' => $request->user()->client->code,
                        'is_enable_inward_gatepass' => $request->user()->client->is_enable_inward_gatepass,
                        'is_enable_outward_gatepass' => $request->user()->client->is_enable_outward_gatepass,
                        'is_enable_warehouses' => $request->user()->client->is_enable_warehouses,
                        'is_superadmin' => $request->user()->client->is_superadmin,
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
