<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Unit;
use App\Models\Product;
use App\Models\ProductWarehouse;
use App\Models\Warehouse;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Ensure Categories exist (create if not)
        $categoryNames = [
            'Cement & Concrete',
            'Steel & TMT',
            'Bricks & Blocks',
            'Sand & Aggregates',
            'Paints',
            'Electrical',
            'Plumbing',
            'Tiles',
        ];

        foreach ($categoryNames as $name) {
            Category::firstOrCreate(
                ['name' => $name, 'code' => $name],
            );
        }

        // 2. Ensure Units exist
        $units = [
            'Pc'   => 'Piece',
            'Bag'  => 'Bag',
            'Box'  => 'Box',
            'Cubic Ft' => 'Cubic Feet',
            'Ltr'  => 'Liter',
            'Mtr'  => 'Meter',
        ];

        foreach ($units as $short => $full) {
            Unit::firstOrCreate(
                ['short_name' => $short],
                ['name' => $full]
            );
        }

        // 3. Get fresh data
        $categories = Category::pluck('id', 'name');
        $units      = Unit::pluck('id', 'short_name');

        // 4. Products data
        $products = [
            ['serial_no' => 'CEM-001', 'name' => 'OPC 53 Grade Cement',           'cat' => 'Cement & Concrete', 'unit' => 'Bag',      'cost' => 375,  'sell' => 420,  'reorder' => 100],
            ['serial_no' => 'CEM-002', 'name' => 'PPC Cement',                    'cat' => 'Cement & Concrete', 'unit' => 'Bag',      'cost' => 355,  'sell' => 395,  'reorder' => 120],
            ['serial_no' => 'CEM-003', 'name' => 'White Cement',                 'cat' => 'Cement & Concrete', 'unit' => 'Bag',      'cost' => 850,  'sell' => 950,  'reorder' => 20],

            ['serial_no' => 'TMT-008', 'name' => 'TMT Bar 8mm',                  'cat' => 'Steel & TMT',       'unit' => 'Pc',       'cost' => 520,  'sell' => 620,  'reorder' => 200],
            ['serial_no' => 'TMT-010', 'name' => 'TMT Bar 10mm',                 'cat' => 'Steel & TMT',       'unit' => 'Pc',       'cost' => 680,  'sell' => 780,  'reorder' => 150],
            ['serial_no' => 'TMT-012', 'name' => 'TMT Bar 12mm',                 'cat' => 'Steel & TMT',       'unit' => 'Pc',       'cost' => 850,  'sell' => 950,  'reorder' => 120],
            ['serial_no' => 'TMT-016', 'name' => 'TMT Bar 16mm',                 'cat' => 'Steel & TMT',       'unit' => 'Pc',       'cost' => 1380, 'sell' => 1550, 'reorder' => 80],
            ['serial_no' => 'TMT-020', 'name' => 'TMT Bar 20mm',                 'cat' => 'Steel & TMT',       'unit' => 'Pc',       'cost' => 2180, 'sell' => 2450, 'reorder' => 50],

            ['serial_no' => 'BRK-001', 'name' => 'Red Clay Brick 9x4x3',         'cat' => 'Bricks & Blocks',   'unit' => 'Pc',       'cost' => 6.5,  'sell' => 11,   'reorder' => 5000],
            ['serial_no' => 'BRK-002', 'name' => 'Fly Ash Brick',                'cat' => 'Bricks & Blocks',   'unit' => 'Pc',       'cost' => 5.8,  'sell' => 10,   'reorder' => 6000],
            ['serial_no' => 'AAC-001', 'name' => 'AAC Block 600x200x200',        'cat' => 'Bricks & Blocks',   'unit' => 'Pc',       'cost' => 85,   'sell' => 120,  'reorder' => 300],

            ['serial_no' => 'SND-001', 'name' => 'River Sand (Fine)',            'cat' => 'Sand & Aggregates', 'unit' => 'Cubic Ft', 'cost' => 48,   'sell' => 75,   'reorder' => 300],
            ['serial_no' => 'SND-002', 'name' => 'M-Sand (Crushed)',             'cat' => 'Sand & Aggregates', 'unit' => 'Cubic Ft', 'cost' => 52,   'sell' => 80,   'reorder' => 250],
            ['serial_no' => 'AGG-020', 'name' => '20mm Aggregate',               'cat' => 'Sand & Aggregates', 'unit' => 'Cubic Ft', 'cost' => 45,   'sell' => 70,   'reorder' => 400],

            ['serial_no' => 'PNT-001', 'name' => 'Asian Paints Apex 20L',        'cat' => 'Paints',            'unit' => 'Ltr',      'cost' => 4850, 'sell' => 5800, 'reorder' => 15],
            ['serial_no' => 'PNT-002', 'name' => 'Interior Emulsion 10L',        'cat' => 'Paints',            'unit' => 'Ltr',      'cost' => 2100, 'sell' => 2650, 'reorder' => 25],

            ['serial_no' => 'ELE-001', 'name' => 'Finolex Wire 1.5 sq.mm',       'cat' => 'Electrical',        'unit' => 'Mtr',      'cost' => 18,   'sell' => 28,   'reorder' => 1000],

            ['serial_no' => 'TIL-001', 'name' => 'Vitrified Tiles 600x600',      'cat' => 'Tiles',             'unit' => 'Box',      'cost' => 720,  'sell' => 980,  'reorder' => 30],
            ['serial_no' => 'TIL-002', 'name' => 'Ceramic Wall Tiles 300x600',   'cat' => 'Tiles',             'unit' => 'Box',      'cost' => 480,  'sell' => 680,  'reorder' => 40],

            ['serial_no' => 'PLB-001', 'name' => 'PVC Pipe 1 inch (Supreme)',    'cat' => 'Plumbing',          'unit' => 'Pc',       'cost' => 185,  'sell' => 250,  'reorder' => 100],
        ];

        foreach ($products as $p) {
            Product::create([
                'serial_no'            => $p['serial_no'],
                'name'           => $p['name'],
                'category_id'    => $categories[$p['cat']],
                'unit_id'        => $units[$p['unit']],
                'cost_price'     => $p['cost'],
                'selling_price'  => $p['sell'],
                'reorder_level'  => $p['reorder'],
            ]);
        }
    }
}