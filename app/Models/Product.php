<?php

namespace App\Models;

use App\Models\ProductSerial;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    /** @use HasFactory<\Database\Factories\ProductFactory> */
    use HasFactory;

    protected $fillable = [
        'client_id',
        'sku',
        'name',
        'category_id',
        'unit_id',
        'current_stock',
        'reorder_level',
        'cost_price',
        'selling_price',
        'description',
    ];

    protected $casts = [
        'cost_price' => 'decimal:2',
        'selling_price' => 'decimal:2',
    ];

    protected $guarded = ['id'];

    public function client()
    {
        return $this->belongsTo(Client::class);
    }
    
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function unit()
    {
        return $this->belongsTo(Unit::class);
    }
    
    public function serials()
    {
        return $this->hasMany(ProductSerial::class);
    }

    // Current stock = count of available serials
    public function getIsLowStockAttribute()
    {
        return $this->current_stock > 0 && $this->current_stock < $this->reorder_level;
    }

    public function getIsOutOfStockAttribute()
    {
        return $this->current_stock === 0;
    }
}
