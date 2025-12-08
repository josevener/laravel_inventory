<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductWarehouse extends Model
{
    protected $fillable = [
        'client_id',
    ];
    protected $table = 'product_warehouse';
    protected $guarded = ['id'];

    public function product() { 
        return $this->belongsTo(Product::class); 
    }
    public function warehouse() { 
        return $this->belongsTo(Warehouse::class); 
    }
}
