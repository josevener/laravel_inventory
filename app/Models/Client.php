<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Permission\Models\Role;

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
        "is_enable_dispatch_gatepass",
        "is_enable_pullout_gatepass",
        'is_enable_warehouses',
        "is_superadmin",
        'is_active'
    ];

    protected $casts = [
        "is_enable_dispatch_gatepass"=> "boolean",
        "is_enable_pullout_gatepass"=> "boolean",
    ];

    public function roles()
    {
        return $this->hasMany(Role::class);
    }
    
    public function users()
    {
        return $this->hasMany(User::class);
    }

    public function products()
    {
        return $this->hasMany(Product::class);
    }

    public function categories()
    {
        return $this->hasMany(Category::class);
    }

    public function units()
    {
        return $this->hasMany(Unit::class);
    }

    public function gatePasses()
    {
        return $this->hasMany(GatePass::class);
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
