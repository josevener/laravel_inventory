<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Project extends Model
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

    public function gatePasses()
    {
        return $this->hasMany(InwardGatePass::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}