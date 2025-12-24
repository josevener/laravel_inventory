<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Project;
use App\Models\User;
use App\Models\GatePassItem;

class GatePass extends Model
{
    /** @use HasFactory<\Database\Factories\GatePassFactory> */
    use HasFactory;

    protected $fillable = [
        'client_id',
        'gate_pass_no',
        'type',
        'project_id',
        'authorized_bearer',
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
        return $this->hasMany(GatePassItem::class);
    }

    public function client()
    {
        return $this->belongsTo(Client::class);
    }
}
