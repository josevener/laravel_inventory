<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductSerial extends Model
{
    protected $fillable = [
        'client_id',
        'product_id', 
        'serial_no', 
        'is_available'
    ];

    protected $casts = [
        'is_available' => 'boolean',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}