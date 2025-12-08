<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\InwardGatePass;
use App\Models\InwardGatePassItem;
use App\Models\Product;
use App\Models\PullOut;
use App\Models\PullOutItem;
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
            'inward_today' => InwardGatePass::whereDate('created_at', today())
                ->when(!$isSuperAdmin, fn($q) => $q->where('client_id', $client->id))
                ->count(),
            'outward_today' => PullOut::whereDate('created_at', today())
                ->when(!$isSuperAdmin, fn($q) => $q->where('client_id', $client->id))
                ->count(),
        ];

        // Recent Activity
        $recentInward = InwardGatePass::with(['project', 'createdBy'])
            ->when(!$isSuperAdmin, fn($q) => $q->where('client_id', $client->id))
            ->latest()
            ->take(5)
            ->get();

        $recentOutward = PullOut::with(['project', 'createdBy'])
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
                'inward' => InwardGatePassItem::join('inward_gate_passes', 'inward_gate_pass_items.inward_gate_pass_id', '=', 'inward_gate_passes.id')
                    ->whereDate('inward_gate_passes.created_at', $date)
                    ->when(!$isSuperAdmin, fn($q) => $q->where('inward_gate_passes.client_id', $client->id))
                    ->sum('quantity'),
                'outward' => PullOutItem::join('pull_outs', 'pull_out_items.pull_out_id', '=', 'pull_outs.id')
                    ->whereDate('pull_outs.created_at', $date)
                    ->when(!$isSuperAdmin, fn($q) => $q->where('pull_outs.client_id', $client->id))
                    ->sum('quantity'),
            ];
        }

        return Inertia::render('Dashboard', [
            'stats' => $stats,
            'recentInward' => $recentInward,
            'recentOutward' => $recentOutward,
            'stockData' => $stockData,
            'isSuperAdmin' => $isSuperAdmin,
            'clientName' => $client->name,
        ]);
    }
}
