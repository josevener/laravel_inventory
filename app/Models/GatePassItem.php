<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GatePassItem extends Model
{
    /** @use HasFactory<\Database\Factories\GatePassItemFactory> */
    use HasFactory;

    protected $fillable = [
        'client_id',
        'gate_pass_id',
        'product_id',
        'quantity',
    ];

    public function gatePass()
    {
        return $this->belongsTo(GatePass::class, 'gate_pass_id');
    }
    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
