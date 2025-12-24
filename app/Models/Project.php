<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Project extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'client_id',
        'code',
        'name',
        'company_name',
        'phone',
        'email',
        'address',
        'project_started',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function client()
    {
        return $this->belongsTo(Client::class);
    }
    
    public function gatePasses()
    {
        return $this->hasMany(GatePass::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}