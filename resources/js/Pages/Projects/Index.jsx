import React, { useState } from "react"
import { Head, Link, router } from "@inertiajs/react"
import { Plus, Building2, Phone, Mail, MapPin, BadgeCheck, Edit, Trash2, FolderOpen } from "lucide-react"
import { Button } from "@/Components/ui/button"
import { Card, CardContent, CardHeader } from "@/Components/ui/card"
import { Badge } from "@/Components/ui/badge"
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import DeleteConfirmDialog from "@/Components/custom/DeleteConfirmDialog"
import { useSafeRoute } from "@/hooks/useSafeRoute"
import { EmptyState } from "@/Components/custom/EmptyState"

export default function Index({ projects }) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deletingProject, setDeletingProject] = useState(null)
  const safeRoute = useSafeRoute()

  const openDelete = (project) => {
    setDeletingProject(project)
    setDeleteDialogOpen(true)
  }

  const handleDelete = () => {
    router.delete(safeRoute("projects.destroy", { project: deletingProject.id }), {
      onFinish: () => setDeleteDialogOpen(false),
      preserveScroll: true,
    })
  }

  return (
    <AuthenticatedLayout>
      <Head title="Projects" />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
            <p className="text-muted-foreground">Manage your projects and vendors</p>
          </div>
          <Button asChild>
            <Link href={safeRoute("projects.create")}>
              <Plus className="mr-2 h-4 w-4" />
              Add Project
            </Link>
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.length > 0 ? (
            projects.map((project) => (
              <Card key={project.id} className="relative">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-5 w-5 text-muted-foreground" />
                        <h3 className="font-semibold text-lg">
                          {project.company_name || project.name}
                        </h3>
                      </div>
                      {project.company_name && (
                        <p className="text-sm text-muted-foreground">Contact: {project.name}</p>
                      )}
                      <div className="flex items-center gap-2 text-sm">
                        <code className="text-xs font-mono bg-muted px-2 py-1 rounded">
                          {project.code}
                        </code>
                        <Badge variant={project.is_active ? "default" : "secondary"}>
                          {project.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  {project.phone && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      {project.phone}
                    </div>
                  )}
                  {project.email && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      {project.email}
                    </div>
                  )}
                  {project.address && (
                    <div className="flex items-start gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 mt-0.5" />
                      <span className="line-clamp-2">{project.address}</span>
                    </div>
                  )}
                  {project.project_started && (
                    <div className="flex items-center gap-2 text-xs">
                      <BadgeCheck className="h-3.5 w-3.5 text-green-600" />
                      PRJ: {project.project_started}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t">
                    <span className="text-xs text-muted-foreground">
                      {project.gate_passes_count} gate passes
                    </span>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" asChild>
                        <Link href={safeRoute("projects.edit", { project: project.id })}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        disabled={project.gate_passes_count > 0}
                        onClick={() => openDelete(project)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
          ))) : (
            <div className="flex items-center justify-center col-span-full">
              <EmptyState
                icon={FolderOpen}
                title="No Projects Yet"
                description="You haven't created any projects yet. Get started by creating your first project."
                primaryAction={{ label: "Create Project", onClick: () => router.visit(safeRoute("projects.create")) }}
                // secondaryAction={{ label: "Import Projects", onClick: () => openImportModal() }}
                // learnMoreHref="https://docs.example.com/projects"
              />
            </div>
          )}
        </div>

        <DeleteConfirmDialog
          isOpen={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          onConfirm={handleDelete}
          title="Delete project"
          description="This project will be permanently removed."
          itemName={deletingProject?.company_name || deletingProject?.name}
          confirmText="Delete project"
        />
      </div>
    </AuthenticatedLayout>
  )
}