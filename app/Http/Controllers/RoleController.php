<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{
    public function index()
    {
        $roles = Role::select('id', 'name')
            ->with('permissions')->get();

        return response()->json($roles);
    }
}
