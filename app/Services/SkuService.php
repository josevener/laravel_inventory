<?php

namespace App\Services;

use App\Models\Product;

class SkuService
{
    public function generate(int $clientId, string $categoryCode, string $unitCode, ?string $brandCode = null): string
    {
      $categoryCode = strtoupper($categoryCode);
      $unitCode = strtoupper($unitCode);
      $brandCode = $brandCode ? strtoupper($brandCode) : null;

      $base = $brandCode
          ? "{$categoryCode}-{$unitCode}-{$brandCode}"
          : "{$categoryCode}-{$unitCode}";

      // get latest sku for this client + base
      $lastSku = Product::where('client_id', $clientId)
          ->where('sku', 'like', $base . '-%')
          ->orderBy('sku', 'desc')
          ->value('sku');

      $next = 1;

      if ($lastSku) {
          $parts = explode('-', $lastSku);
          $next = ((int) end($parts)) + 1;
      }

      return $base . '-' . str_pad($next, 6, '0', STR_PAD_LEFT);
    }
}