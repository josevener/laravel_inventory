import React from "react"
import { Head, Link, router } from "@inertiajs/react"
import { format } from "date-fns"
import { Truck, Search, Filter, Printer, Plus, FolderOpen } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { useSafeRoute } from "@/hooks/useSafeRoute"
import { EmptyState } from "@/components/custom/EmptyState"

export default function GatepassIndex({ gatePasses, filters, projects, type }) {
  const statusColors = {
    pending:   "bg-yellow-100 text-yellow-800",
    received:  "bg-green-100 text-green-800",
    partial:   "bg-orange-100 text-orange-800",
    completed: "bg-blue-100 text-blue-800",
  }
  const safeRoute = useSafeRoute()

  // Simple Pagination Component
  const Pagination = ({ links }) => {
    if (!links || links.length <= 3) return null

    return (
      <div className="flex justify-center gap-2 mt-8">
        {links.map((link, i) => (
          <Button
            key={i}
            variant={link.active ? "default" : "outline"}
            size="sm"
            disabled={!link.url}
            onClick={() => link.url && router.visit(link.url, { preserveState: true })}
            dangerouslySetInnerHTML={{ __html: link.label }}
          />
        ))}
      </div>
    )
  }

  return (
    <AuthenticatedLayout>
      <Head title={`${type === 'dispatch' ? 'Dispatch' : 'Pull Out'} Gate Passes`} />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Truck className="h-10 w-10 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">
                {type === 'dispatch' ? 'Dispatch' : 'Pull Out'} Gate Passes</h1>
              <p className="text-muted-foreground">Manage outgoing stock {type === 'dispatch' ? 'dispatches' : 'pull-outs'}</p>
            </div>
          </div>
          <Button asChild>
            <Link href={safeRoute(`gatepass.${type}.create`)}>
              <Plus className="mr-2 h-4 w-4" />
              New {type === 'dispatch' ? 'Dispatch' : 'Pull Out'} Gate Pass
            </Link>
          </Button>
        </div>

        {/* Filters */}
        {gatePasses.data.length > 0 ? (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by No, Authorized bearer, project..."
                      defaultValue={filters.search || ""}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          const params = new URLSearchParams(window.location.search)
                          params.set("search", e.target.value.trim())
                          router.get(safeRoute(`gatepass.${type}.index`), params, { preserveState: true })
                        }
                      }}
                      className="pl-10"
                    />
                  </div>

                  {/* project Filter */}
                  <Select
                    value={filters.project || ""}
                    onValueChange={(value) => {
                      const params = new URLSearchParams(window.location.search)
                      if (value && value !== "all") {
                        params.set("project", value)
                      } else {
                        params.delete("project")
                      }
                      router.get(safeRoute(`gatepass.${type}.index`), params, { preserveState: true })
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Projects" />
                    </SelectTrigger>
                    <SelectContent>
                      {/* Use value="all" instead of value="" */}
                      <SelectItem value="all">All Projects</SelectItem>
                      {projects.map(s => (
                        <SelectItem key={s.id} value={s.id.toString()}>
                          {s.company_name || s.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Status Filter */}
                  <Select
                    value={filters.status || ""}
                    onValueChange={(value) => {
                      const params = new URLSearchParams(window.location.search)
                      if (value && value !== "all") {
                        params.set("status", value)
                      } else {
                        params.delete("status")
                      }
                      router.get(safeRoute(`gatepass.${type}.index`), params, { preserveState: true })
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="received">Received</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Clear */}
                  <Button
                    variant="outline"
                    onClick={() => router.get(safeRoute(`gatepass.${type}.index`))}
                  >
                    Clear Filters
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* List Table */}
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Gate Pass No</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Project</TableHead>
                      <TableHead>Autorized Bearer</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {gatePasses.data.map((gp) => (
                        <TableRow key={gp.id}>
                          <TableCell className="font-mono font-bold text-primary">
                            {gp.gate_pass_no}
                          </TableCell>
                          <TableCell>{format(new Date(gp.created_at), "dd MMM yyyy, hh:mm a")}</TableCell>
                          <TableCell>
                            {gp.project.company_name || gp.project.name}
                          </TableCell>
                          <TableCell className="font-mono">{gp.authorized_bearer ?? "—"}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">{gp.items_count}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={statusColors[gp.status] || "bg-gray-100 text-gray-800"}>
                              {gp.status.charAt(0).toUpperCase() + gp.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                const link = document.createElement('a')
                                link.href = safeRoute(`gatepass.${type}.print_gatepass`, { gatepass: gp.id })
                                link.target = "_blank"
                                link.rel = "noopener noreferrer"
                                document.body.appendChild(link)
                                link.click()
                                document.body.removeChild(link)
                              }}
                            >
                              <Printer className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    }
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </>
        ) : (
          <EmptyState
            icon={FolderOpen}
            title="No Gate Passes Yet"
            description="You haven't created any gate passes yet. Get started by creating your first gate pass."
            primaryAction={{ label: "Create Gate Pass", onClick: () => router.visit(safeRoute(`gatepass.${type}.create`)) }}
            // secondaryAction={{ label: "Import Unit", onClick: () => openImportModal() }}
            // learnMoreHref="https://docs.example.com/units"
          />
        )}

        {/* Pagination */}
        <Pagination links={gatePasses.links} />
      </div>
    </AuthenticatedLayout>
  )
}