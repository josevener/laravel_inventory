<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InwardGatePassItem extends Model
{
    /** @use HasFactory<\Database\Factories\InwardGatePassItemFactory> */
    use HasFactory;

    protected $fillable = [
        'client_id',
        'inward_gate_pass_id',
        'product_id',
        'quantity',
    ];

    public function gatePass()
    {
        return $this->belongsTo(InwardGatePass::class, 'inward_gate_pass_id');
    }
    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
