<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Project;
use App\Models\User;
use App\Models\PullOutItem;

class PullOut extends Model
{
    use HasFactory;

    protected $fillable = [
        'client_id',
        'gate_pass_no',
        'project_id',
        'vehicle_no',
        'driver_name',
        'remarks',
        'status',
        'issued_by',
        'issued_at',
        'created_by',
    ];

    protected $guarded = ['id'];

    protected $casts = [
        'issued_at' => 'datetime',
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

    public function issuedBy()
    {
        return $this->belongsTo(User::class, 'issued_by');
    }

    public function items()
    {
        return $this->hasMany(PullOutItem::class);
    }

    public function client()
    {
        return $this->belongsTo(Client::class);
    }
}