<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Project;
use App\Models\Warehouse;
use App\Models\User;
use App\Models\InwardGatePassItem;

class InwardGatePass extends Model
{
    /** @use HasFactory<\Database\Factories\InwardGatePassFactory> */
    use HasFactory;

    protected $fillable = [
        'client_id',
        'gate_pass_no',
        'project_id',
        'vehicle_no',
        'driver_name',
        'remarks',
        'status',
        'received_by',
        'received_at',
        'created_by',
    ];
        
    protected $guarded = ['id'];

    protected $casts = [
        'received_at' => 'datetime',
        'status' => 'string',
    ];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }
   
    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function receivedBy()
    {
        return $this->belongsTo(User::class, 'received_by');
    }

    public function items()
    {
        return $this->hasMany(InwardGatePassItem::class);
    }

    public function client()
    {
        return $this->belongsTo(Client::class);
    }
}
