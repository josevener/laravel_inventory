<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Supplier extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'code',
        'name',
        'company_name',
        'phone',
        'email',
        'address',
        'gst_number',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    // Auto generate code like SUP-001, SUP-002...
    // protected static function boot()
    // {
    //     parent::boot();

    //     static::creating(function ($supplier) {
    //         $latest = self::withTrashed()->max('id') ?? 0;
    //         $supplier->code = 'SUP-' . str_pad($latest + 1, 3, '0', STR_PAD_LEFT);
    //     });
    // }

    public function gatePasses()
    {
        return $this->hasMany(InwardGatePass::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}