<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ProjectController extends Controller
{
    public function index()
    {
        $projects = Project::query()
        ->where('client_id', Auth::user()->client_id)
        ->withCount('gatePasses')
        ->orderBy('company_name')
        ->orderBy('name')
        ->get();

        return Inertia::render('Projects/Index', [
            'projects' => $projects
        ]);
    }

    public function create()
    {
        return Inertia::render('Projects/Create');
    }

    public function store($client, Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|max:255',
            'name' => 'required|string|max:255',
            'company_name' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:50',
            'email' => 'nullable|email|max:255',
            'address' => 'nullable|string|max:500',
            'project_started' => 'nullable|string|max:255',
            'is_active' => 'sometimes|boolean',
        ]);

        $validated['client_id'] = Auth::user()->client_id;
        
        Project::create($validated);

        return redirect()->route('projects.index', ['client' => $client])
            ->with('success', 'Project created successfully.');
    }

    public function edit($client, Project $project)
    {
        return Inertia::render('Projects/Edit', [
            'project' => $project
        ]);
    }

    public function update(Request $request, $client, Project $project)
    {
        $validated = $request->validate([
            'code' => 'required|string|max:255',
            'name' => 'required|string|max:255',
            'company_name' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:50',
            'email' => 'nullable|email|max:255',
            'address' => 'nullable|string|max:500',
            'project_started' => 'nullable|string|max:255',
            'is_active' => 'sometimes|boolean',
        ]);

        $project->update($validated);

        return redirect()->route('projects.index', ['client' => $client])
            ->with('success', 'Project updated.');
    }

    public function destroy($client, Project $project)
    {
        if ($project->gatePasses()->exists()) {
            return back()->with('error', 'Cannot delete project with existing gate passes.');
        }

        DB::transaction(function () use ($project) {
            $project->update([
                'code' => $project->code . '_deleted_' . $project->id,
            ]);

            $project->delete();
        });

        return redirect()->route('projects.index', ['client' => $client])
            ->with('success', 'Project deleted.');
    }
}