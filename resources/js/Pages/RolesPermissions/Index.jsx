import React from "react"
import { Head, Link, usePage } from "@inertiajs/react"
import { Shield, Key, Users, Plus, ArrowRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { useSafeRoute } from "@/hooks/useSafeRoute"

export default function Index({ roles, permissions }) {
  const safeRoute = useSafeRoute()
  const { auth } = usePage().props
  const isSuperAdmin = auth?.user?.client?.is_superadmin ? true : false

  // permissions is grouped object → convert to array
  const allPermissions = Object.values(permissions).flat()
  const totalPermissions = allPermissions.length

  // Grouped count for display
  const groupedPermissions = Object.entries(permissions).reduce((acc, [group, perms]) => {
    acc[group] = perms.length
    return acc
  }, {})

  // Most used role
  const mostUsedRole = roles.length > 0
    ? roles.reduce((a, b) => (a.users_count > b.users_count ? a : b))
    : null

  return (
    <AuthenticatedLayout>
      <Head title="Roles & Permissions" />

      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Shield className="h-10 w-10 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight">Roles & Permissions</h1>
              <p className="text-lg text-muted-foreground">
                Manage access control for your application
              </p>
            </div>
          </div>

          {/* Create New */}
          <div className="grid gap-4 md:grid-cols-2">
            {isSuperAdmin && (
              <Button asChild size="lg" variant="outline">
                <Link href={safeRoute("permissions.create")} className="gap-2">
                  <Plus className="h-8 w-8" />
                  <span>Create New Permission</span>
                </Link>
              </Button>
            )}
            <Button asChild size="lg">
              <Link href={safeRoute("roles.create")} className="gap-2">
                <Plus className="h-8 w-8" />
                <span>Create New Role</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Roles</CardTitle>
              <Users className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{roles.length}</div>
              <p className="text-xs text-muted-foreground">
                {roles.filter(r => r.users_count > 0).length} in use
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Permissions</CardTitle>
              <Key className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalPermissions}</div>
              <p className="text-xs text-muted-foreground">
                {Object.keys(groupedPermissions).length} groups
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Most Used Role</CardTitle>
              <Shield className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mostUsedRole?.name || "—"}
              </div>
              <p className="text-xs text-muted-foreground">
                {mostUsedRole ? `${mostUsedRole.users_count} users` : "No roles yet"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-3">
                  <Users className="h-6 w-6" />
                  Roles
                </span>
                <Badge variant="secondary">{roles.length}</Badge>
              </CardTitle>
              <CardDescription>Define user roles and assign permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {roles.slice(0, 4).map((role) => (
                  <div key={role.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{role.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {role.permissions_count || 0} permissions • {role.users_count} users
                      </p>
                    </div>
                  </div>
                ))}
                {roles.length > 4 && (
                  <p className="text-sm text-muted-foreground">
                    +{roles.length - 4} more roles
                  </p>
                )}
              </div>
              <Button asChild className="w-full mt-6">
                <Link href={safeRoute("roles.index")}>
                  Manage Roles <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {isSuperAdmin && (
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-3">
                    <Key className="h-6 w-6" />
                    Permissions
                  </span>
                  <Badge variant="secondary">{totalPermissions}</Badge>
                </CardTitle>
                <CardDescription>Granular access control for features</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(groupedPermissions)
                    .slice(0, 5)
                    .map(([group, count]) => (
                      <div key={group} className="flex items-center justify-between">
                        <span className="font-medium">{group}</span>
                        <Badge variant="outline">{count}</Badge>
                      </div>
                    ))}
                  {Object.keys(groupedPermissions).length > 5 && (
                    <p className="text-sm text-muted-foreground">
                      +{Object.keys(groupedPermissions).length - 5} more groups
                    </p>
                  )}
                </div>
                <Button asChild variant="outline" className="w-full mt-6">
                  <Link href={safeRoute("permissions.index")}>
                    Manage Permissions <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AuthenticatedLayout>
  )
}