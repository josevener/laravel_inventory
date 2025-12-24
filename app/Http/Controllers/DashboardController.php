<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\GatePass;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $client = $user->client;

        // Only superadmin sees all clients
        $isSuperAdmin = $user->hasRole('superadmin');

        // Stats
        $stats = [
            'total_clients' => $isSuperAdmin ? Client::count() : 1,
            'active_users' => $isSuperAdmin ? User::count() : $client->users()->count(),
            'total_products' => Product::when(!$isSuperAdmin, fn($q) => $q->where('client_id', $client->id))->count(),
            'low_stock_products' => Product::when(!$isSuperAdmin, fn($q) => $q->where('client_id', $client->id))
                ->whereColumn('current_stock', '<', 'reorder_level')
                ->where('current_stock', '>', 0)
                ->count(),
            'out_of_stock_products' => Product::when(!$isSuperAdmin, fn($q) => $q->where('client_id', $client->id))
                ->where('current_stock', 0)
                ->count(),
            'dispatch_today' => GatePass::whereDate('created_at', today())
                ->where('type', 'dispatch')
                ->when(!$isSuperAdmin, fn($q) => $q->where('client_id', $client->id))
                ->count(),
            'pullout_today' => GatePass::whereDate('created_at', today())
                ->where('type', 'pullout')
                ->when(!$isSuperAdmin, fn($q) => $q->where('client_id', $client->id))
                ->count(),
        ];

        // Recent Activity
        $recentDispatch = GatePass::where('type', 'dispatch')
            ->with(['project', 'createdBy'])
            ->when(!$isSuperAdmin, fn($q) => $q->where('client_id', $client->id))
            ->latest()
            ->take(5)
            ->get();

        $recentPullout = GatePass::where('type', 'pullout')
            ->with(['project', 'createdBy'])
            ->when(!$isSuperAdmin, fn($q) => $q->where('client_id', $client->id))
            ->latest()
            ->take(5)
            ->get();

        // Stock Overview Chart Data (Last 7 days)
        $stockData = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = now()->subDays($i)->format('Y-m-d');
            $label = now()->subDays($i)->format('M d');

            $stockData[] = [
                'date' => $label,
                'dispatch' => GatePass::where('type', 'dispatch')
                    ->join('gate_pass_items', 'gate_passes.id', '=', 'gate_pass_items.gate_pass_id')
                    ->whereDate('gate_passes.created_at', $date)
                    ->when(!$isSuperAdmin, fn($q) => $q->where('gate_passes.client_id', $client->id))
                    ->sum('quantity'),
                'pullout' => GatePass::where('type', 'pullout')
                    ->join('gate_pass_items', 'gate_passes.id', '=', 'gate_pass_items.gate_pass_id')
                    ->whereDate('gate_passes.created_at', $date)
                    ->when(!$isSuperAdmin, fn($q) => $q->where('gate_passes.client_id', $client->id))
                    ->sum('quantity'),
            ];
        }

        return Inertia::render('Dashboard', [
            'stats' => $stats,
            'recentDispatch' => $recentDispatch,
            'recentPullout' => $recentPullout,
            'stockData' => $stockData,
            'isSuperAdmin' => $isSuperAdmin,
            'clientName' => $client->name,
        ]);
    }
}
