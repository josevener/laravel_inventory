<?php

namespace App\Exports;

use App\Models\Product;
use Illuminate\Support\Facades\Auth;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithColumnWidths;

class ProductsExport implements FromCollection, WithHeadings, WithMapping, WithColumnWidths
{
    protected bool $brandEnabled;
    protected bool $posEnabled;

    public function __construct()
    {
        $this->brandEnabled = (bool) Auth::user()?->client?->is_brand_enable;
        $this->posEnabled   = (bool) Auth::user()?->client?->is_pos_enable;
    }

    public function collection()
    {
        $with = [
            'category:id,code,name',
            'unit:id,name,short_name',
        ];

        if ($this->brandEnabled) {
            $with[] = 'brand:id,code,name';
        }

        return Product::query()
            ->select([
                'id',
                'name',
                'sku',
                'status',
                'current_stock',
                'reorder_level',
                'brand_id',
                'category_id',
                'unit_id',
                'cost_price',
                'selling_price',
                'client_id',
            ])
            ->with($with)
            ->where('client_id', Auth::user()->client_id)
            ->orderBy('name')
            ->get();
    }

    public function headings(): array
    {
        $headers = ['ProductName'];

        if ($this->brandEnabled) {
            $headers[] = 'Brand';
        }

        $headers[] = 'Category';
        $headers[] = 'Unit';
        $headers[] = 'CurrentStock';
        $headers[] = 'ReorderLevel';

        if ($this->posEnabled) {
            $headers[] = 'CostPrice';
            $headers[] = 'SellingPrice';
        }

        return $headers;
    }

    public function map($product): array
    {
        $row = [$product->name];

        if ($this->brandEnabled) {
            $row[] = $product->brand?->name;
        }

        $row[] = $product->category?->name;
        $row[] = $product->unit?->short_name;
        $row[] = $product->current_stock;
        $row[] = $product->reorder_level;

        if ($this->posEnabled) {
            $row[] = $product->cost_price;
            $row[] = $product->selling_price;
        }

        return $row;
    }

    public function columnWidths(): array
    {
        $cols = [];

        $cols['A'] = 30; // ProductName
        $next = 'B';

        if ($this->brandEnabled) {
            $cols[$next] = 18; // Brand
            $next++;
        }

        $cols[$next++] = 18; // Category
        $cols[$next++] = 15; // Unit
        $cols[$next++] = 15; // CurrentStock
        $cols[$next++] = 15; // ReorderLevel

        if ($this->posEnabled) {
            $cols[$next++] = 15; // CostPrice
            $cols[$next++] = 15; // SellingPrice
        }

        return $cols;
    }
}