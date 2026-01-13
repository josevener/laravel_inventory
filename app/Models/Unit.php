<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Unit extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'client_id',
        'name', 
        'short_name'
    ];

    protected $casts = [
        'name' => 'string',
        'short_name' => 'string',
    ];

    public function client()
    {
        return $this->belongsTo(Client::class);
    }
    
    public function products()
    {
        return $this->hasMany(Product::class);
    }
}