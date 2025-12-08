<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\ProductWarehouse;

class Warehouse extends Model
{
    /** @use HasFactory<\Database\Factories\WarehouseFactory> */
    use HasFactory;

    protected $fillable = [
        'client_id',
    ];
    
    protected $guarded = ['id'];

    public function stocks()
    {
        return $this->hasMany(ProductWarehouse::class);
    }
}
