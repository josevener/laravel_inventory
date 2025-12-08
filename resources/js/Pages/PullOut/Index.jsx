import React from "react"
import { Head, Link, router } from "@inertiajs/react"
import { format } from "date-fns"
import { Truck, Search, Filter, Printer, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { useSafeRoute } from "@/hooks/useSafeRoute"

export default function PullOutIndex({ pullOuts, filters, projects }) {
  const statusColors = {
    pending:   "bg-yellow-100 text-yellow-800",
    issued:    "bg-green-100 text-green-800",
    partial:   "bg-orange-100 text-orange-800",
    completed: "bg-blue-100 text-blue-800",
  }
  const safeRoute = useSafeRoute()

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
      <Head title="Pull Out" />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Truck className="h-10 w-10 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Pull Out</h1>
              <p className="text-muted-foreground">Issue materials from inventory</p>
            </div>
          </div>
          <Button asChild>
            <Link href={safeRoute("pull_out.create")}>
              <Plus className="mr-2 h-4 w-4" />
              New Pull Out
            </Link>
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by No, Vehicle, Driver..."
                  defaultValue={filters.search || ""}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const params = new URLSearchParams(window.location.search)
                      params.set("search", e.target.value.trim())
                      router.get(safeRoute("pull_out.index"), params, { preserveState: true })
                    }
                  }}
                  className="pl-10"
                />
              </div>

              <Select
                value={filters.project || ""}
                onValueChange={(value) => {
                  const params = new URLSearchParams(window.location.search)
                  value ? params.set("project", value) : params.delete("project")
                  router.get(safeRoute("pull_out.index"), params, { preserveState: true })
                }}
              >
                <SelectTrigger><SelectValue placeholder="All Projects" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Projects</SelectItem>
                  {projects.map(p => (
                    <SelectItem key={p.id} value={p.id.toString()}>
                      {p.company_name || p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={filters.status || ""}
                onValueChange={(value) => {
                  const params = new URLSearchParams(window.location.search)
                  value ? params.set("status", value) : params.delete("status")
                  router.get(safeRoute("pull_out.index"), params, { preserveState: true })
                }}
              >
                <SelectTrigger><SelectValue placeholder="All Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="issued">Issued</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" onClick={() => router.get(safeRoute("pull_out.index"))}>
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pull Out No</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Driver</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Print</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pullOuts.data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                      No pull outs found.
                    </TableCell>
                  </TableRow>
                ) : (
                  pullOuts.data.map((po) => (
                    <TableRow key={po.id}>
                      <TableCell className="font-mono font-bold text-primary">{po.gate_pass_no}</TableCell>
                      <TableCell>{format(new Date(po.created_at), "dd MMM yyyy")}</TableCell>
                      <TableCell>{po.project.company_name || po.project.name}</TableCell>
                      <TableCell className="font-mono">{po.vehicle_no}</TableCell>
                      <TableCell>{po.driver_name || "—"}</TableCell>
                      <TableCell><Badge variant="secondary">{po.items_count}</Badge></TableCell>
                      <TableCell>
                        <Badge className={statusColors[po.status] || "bg-gray-100"}>
                          {po.status.charAt(0).toUpperCase() + po.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            const link = document.createElement('a')
                            link.href = safeRoute("pull_out.print_gatepass", { pullOut: po.id })
                            link.target = "_blank"
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
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Pagination links={pullOuts.links} />
      </div>
    </AuthenticatedLayout>
  )
}