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

export default function InwardIndex({ gatePasses, filters, suppliers }) {
  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    received: "bg-green-100 text-green-800",
    partial: "bg-orange-100 text-orange-800",
  }

  // Built-in Pagination Component (no import needed)
  function Pagination({ links }) {
    if (!links || links.length <= 3) return null;

    return (
      <div className="flex justify-center gap-1 mt-8">
        {links.map((link, i) => (
          <Button
            key={i}
            variant={link.active ? "default" : "outline"}
            size="sm"
            disabled={!link.url}
            onClick={() => link.url && router.visit(link.url, { preserveState: true })}
            dangerouslySetInnerHTML={{ __html: link.label }}
            className="min-w-10"
          />
        ))}
      </div>
    )
  }

  return (
    <>
      <Head title="Inward Gate Passes" />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Truck className="h-10 w-10 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Inward Gate Passes</h1>
              <p className="text-muted-foreground">Manage incoming stock receipts</p>
            </div>
          </div>
          <Button asChild>
            <Link href="/gatepass/inward/create">
              <Plus className="mr-2 h-4 w-4" />
              New Inward Gate Pass
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
                  placeholder="Search by No / Vehicle / Supplier"
                  defaultValue={filters.search || ""}
                  onKeyUp={(e) => {
                    if (e.key === "Enter") {
                      const params = new URLSearchParams(window.location.search)
                      params.set("search", e.target.value)
                      router.get("/gatepass/inward", params)
                    }
                  }}
                  className="pl-10"
                />
              </div>

              <Select
                value={filters.supplier || ""}
                onValueChange={(value) => {
                  const params = new URLSearchParams(window.location.search)
                  value ? params.set("supplier", value) : params.delete("supplier")
                  router.get("/gatepass/inward", params)
                }}
              >
                <SelectTrigger><SelectValue placeholder="All Suppliers" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Suppliers</SelectItem>
                  {suppliers.map(s => (
                    <SelectItem key={s.id} value={s.id.toString()}>
                      {s.company_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={filters.status || ""}
                onValueChange={(value) => {
                  const params = new URLSearchParams(window.location.search)
                  value ? params.set("status", value) : params.delete("status")
                  router.get("/gatepass/inward", params)
                }}
              >
                <SelectTrigger><SelectValue placeholder="All Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="received">Received</SelectItem>
                  <SelectItem value="partial">Partial</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" onClick={() => router.get("/gatepass/inward")}>
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* List */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Gate Pass No</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Warehouse</TableHead>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Print</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {gatePasses.data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                      No gate passes found.
                    </TableCell>
                  </TableRow>
                ) : (
                  gatePasses.data.map((gp) => (
                    <TableRow key={gp.id}>
                      <TableCell className="font-mono font-bold text-primary">
                        {gp.gate_pass_no}
                      </TableCell>
                      <TableCell>{format(new Date(gp.created_at), "dd MMM yyyy")}</TableCell>
                      <TableCell>{gp.supplier.company_name || gp.supplier.name}</TableCell>
                      <TableCell>{gp.warehouse.name}</TableCell>
                      <TableCell>{gp.vehicle_no}</TableCell>
                      <TableCell><Badge variant="secondary">{gp.items_count}</Badge></TableCell>
                      <TableCell>
                        <Badge className={statusColors[gp.status]}>
                          {gp.status.charAt(0).toUpperCase() + gp.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            // Create invisible link → click it → force download → no Inertia
                            const link = document.createElement('a')
                            link.href = `/gatepass/inward/${gp.id}/print`
                            link.download = `IGP-${gp.gate_pass_no}.pdf`  // Forces download
                            link.target = '_blank'
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

        {/* Built-in Pagination */}
        <Pagination links={gatePasses.links} />
      </div>
    </>
  )
}