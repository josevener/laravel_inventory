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

    public function __construct()
    {
        $this->brandEnabled = (bool) Auth::user()?->client?->is_brand_enable;
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
        $headers = [
            'ProductName',
        ];

        if ($this->brandEnabled) {
            $headers[] = 'Brand';
        }

        return array_merge($headers, [
            'Category',
            'Unit',
            'CurrentStock',
            'ReorderLevel',
            'CostPrice',
            'SellingPrice',
        ]);
    }

    public function map($product): array
    {
        $row = [
            $product->name,
        ];

        if ($this->brandEnabled) {
            $row[] = $product->brand?->name;
        }

        return array_merge($row, [
            $product->category?->name,
            $product->unit?->short_name,
            $product->current_stock,
            $product->reorder_level,
            $product->cost_price,
            $product->selling_price,
        ]);
    }

    public function columnWidths(): array
    {
        if ($this->brandEnabled) {
            return [
                'A' => 30, // ProductName
                'B' => 18, // Brand
                'C' => 18, // Category
                'D' => 15, // Unit
                'E' => 15, // CurrentStock
                'F' => 15, // ReorderLevel
                'G' => 15, // CostPrice
                'H' => 15, // SellingPrice
            ];
        }

        return [
            'A' => 30, // ProductName
            'B' => 18, // Category
            'C' => 15, // Unit
            'D' => 15, // CurrentStock
            'E' => 15, // ReorderLevel
            'F' => 15, // CostPrice
            'G' => 15, // SellingPrice
        ];
    }
}