import React, { useState } from "react"
import { Head, Link, router, useForm, usePage } from "@inertiajs/react"
import { 
  Plus, Users, Shield, Trash2, Edit, Search, Download, Upload
} from "lucide-react"
import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import { Badge } from "@/Components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/Components/ui/dialog"
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { useSafeRoute } from "@/hooks/useSafeRoute"
import useHasPermission from "@/hooks/useHasPermission"
import ImportSummaryDialog from "@/Components/ImportSummaryDialog"

export default function Index({ users: initialUsers }) {
  const [search, setSearch] = useState("")
  const [openImport, setOpenImport] = useState(false)
  const safeRoute = useSafeRoute()
  const { auth, flash } = usePage().props
  const import_summary = flash?.import_summary
  const hasPermission = useHasPermission()

  const isSuperAdmin = auth?.user?.client?.is_superadmin ? true : false

  const { data, setData, post, processing, errors } = useForm({
    file: null,
  })

  const filteredUsers = initialUsers.filter(user =>
    user.first_name.toLowerCase().includes(search.toLowerCase()) ||
    user.middle_name?.toLowerCase().includes(search.toLowerCase()) ||
    user.last_name.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase()) ||
    user.client?.toLowerCase().includes(search.toLowerCase()) ||
    user.role_list?.toLowerCase().includes(search.toLowerCase())
  )

  const submitImport = (e) => {
    e.preventDefault()

    post(safeRoute("users.import"), {
      forceFormData: true,
      onSuccess: () => setOpenImport(false),
    })
  }
  
  return (
    <AuthenticatedLayout>
      <Head title="Users" />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Users className="h-10 w-10 text-primary" />
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Users</h1>
              <p className="text-muted-foreground">Manage system users and access</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 w-64"
              />
            </div>

            {/* Export Button */}
            {hasPermission("Export User") && (
              <Button variant="outline" onClick={() => window.location.href = safeRoute("users.export")}>
                <Download className="mr-2 h-4 w-4" />
                Export Excel
              </Button>
            )}

            {/* Import Button */}
            {hasPermission("Import User") && (
              <Button variant="outline" onClick={() => setOpenImport(true)}>
                <Upload className="mr-2 h-4 w-4" />
                Import Excel
              </Button>
            )}

            <Button asChild>
              <Link href={safeRoute("users.create")}>
                <Plus className="mr-2 h-4 w-4" />
                Add User
              </Link>
            </Button>
          </div>
        </div>

        {/* Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Users ({filteredUsers.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="rounded-md border max-h-[calc(100vh-250px)] overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    {isSuperAdmin && <TableHead>Client</TableHead>}
                    <TableHead>Roles</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="border-collapse">
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.first_name} {user.middle_name} {user.last_name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      {isSuperAdmin && (
                        <TableCell>
                          <Badge variant="outline">{user.client || "—"}</Badge>
                        </TableCell>
                      )}
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {user.roles.length === 0 ? (
                            <Badge variant="secondary">No role</Badge>
                          ) : (
                            user.roles.map((role) => (
                              <Badge key={role} variant="secondary">
                                <Shield className="h-3 w-3 mr-1" />
                                {role}
                              </Badge>
                            ))
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {user.created_at}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="ghost" asChild>
                            <Link href={safeRoute("users.edit", { user: user.id })}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                          {user.id !== auth.user.id && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-destructive"
                              onClick={() => confirm("Delete user?") && 
                                router.delete(safeRoute("users.destroy", { user: user.id }))
                              }
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Import Dialog */}
      <Dialog open={openImport} onOpenChange={setOpenImport}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import Users</DialogTitle>
          </DialogHeader>
          <form onSubmit={submitImport} encType="multipart/form-data">
            <Input
              type="file"
              accept=".xlsx,.xls"
              onChange={(e) => setData("file", e.target.files[0])}
              required
            />

            {errors.file && <p className="text-sm text-destructive mt-2">{errors.file}</p>}

            <div className="flex justify-end gap-3 mt-4">
              <Button type="button" variant="outline" onClick={() => setOpenImport(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={processing}>
                {processing ? "Importing..." : "Import Excel"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {import_summary && (
        <ImportSummaryDialog />
      )}
    </AuthenticatedLayout>
  )
}