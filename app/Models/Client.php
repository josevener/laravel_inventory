<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Client extends Model
{
    use SoftDeletes, HasFactory;

    protected $fillable = [
        "code",
        "name",
        'contact_person',
        'email',
        'phone',
        'address',
        "is_enable_inward_gatepass",
        "is_enable_outward_gatepass",
        'is_enable_warehouses',
        "is_superadmin",
    ];

    protected $casts = [
        "is_enable_inward_gatepass"=> "boolean",
        "is_enable_outward_gatepass"=> "boolean",
    ];

    public function users()
    {
        return $this->hasMany(User::class);
    }

    public function products()
    {
        return $this->hasMany(Product::class);
    }

    public function inwardGatePass()
    {
        return $this->hasMany(InwardGatePass::class);
    }

    public function outwardGatePass()
    {
        return $this->hasMany(OutwardGatePass::class);
    }

    public function projects()
    {
        return $this->hasMany(Project::class);
    }

    public function warehouses()
    {
        return $this->hasMany(Warehouse::class);
    }
    
    public function getIsActiveAttribute()
    {
        return !$this->trashed();
    }
}
