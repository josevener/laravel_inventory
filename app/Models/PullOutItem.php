<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PullOutItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'client_id',
        'pull_out_id',
        'product_id',
        'quantity',
    ];

    protected $guarded = ['id'];

    public function pullOut()
    {
        return $this->belongsTo(PullOut::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function client()
    {
        return $this->belongsTo(Client::class);
    }
}