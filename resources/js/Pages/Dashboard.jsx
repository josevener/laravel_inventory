import React from "react"
import { Head, Link, usePage } from "@inertiajs/react"
import { format } from "date-fns"
import { 
  Package, 
  Truck, 
  ArrowDownCircle, 
  ArrowUpCircle, 
  AlertTriangle,
  Building2,
  Activity
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import { useSafeRoute } from "@/hooks/useSafeRoute"

export default function Dashboard({ 
  stats, 
  recentDispatch, 
  recentPullout, 
  stockData,
  clientName 
}) {
  const { auth } = usePage().props
  const safeRoute = useSafeRoute()
  const isSuperAdmin = auth?.user?.client?.is_superadmin ? true : false

  return (
    <AuthenticatedLayout>
      <Head title="Dashboard" />

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          {/* Header */}
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Welcome back!</h1>
            <p className="text-xl text-muted-foreground mt-2">
              {isSuperAdmin ? "System Overview" : `Managing ${clientName}`}
            </p>
          </div>
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button asChild>
                  <Link href={safeRoute("gatepass.dispatch.create")}>
                    <Truck className="mr-2 h-4 w-4" /> New Dispatch
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href={safeRoute("gatepass.pullout.create")}>
                    <Truck className="mr-2 h-4 w-4" /> New Pull Out
                  </Link>
                </Button>
                <Button asChild variant="secondary">
                  <Link href={safeRoute("products.index")}>
                    <Package className="mr-2 h-4 w-4" /> View Products
                  </Link>
                </Button>
                {isSuperAdmin && (
                  <Button asChild variant="outline">
                    <Link href={safeRoute("companies.index")}>
                      <Building2 className="mr-2 h-4 w-4" /> Manage Companies
                    </Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.total_products}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Across all projects
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
              <AlertTriangle className="h-5 w-5 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">{stats.low_stock_products}</div>
              <p className="text-xs text-muted-foreground mt-1">Need attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-destructive">{stats.out_of_stock_products}</div>
              <p className="text-xs text-muted-foreground mt-1">Urgent restock needed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Activity</CardTitle>
              <Activity className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {stats.dispatch_today + stats.pullout_today}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.dispatch_today} in • {stats.pullout_today} out
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Stock Movement Chart */}
        <Card className="col-span-full">
          <CardHeader>
            <CardTitle>Stock Movement (Last 7 Days)</CardTitle>
            <CardDescription>Dispatch vs Pull Out quantities</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stockData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="dispatch" stroke="#10b981" name="Dispatch" strokeWidth={3} />
                <Line type="monotone" dataKey="pullout" stroke="#ef4444" name="Pull Out" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Recent Dispatch */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowDownCircle className="h-5 w-5 text-green-600" />
                Recent Dispatch Gate Passes
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentDispatch.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No recent dispatch</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>No</TableHead>
                      <TableHead>Project</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentDispatch.map((gp) => (
                      <TableRow key={gp.id}>
                        <TableCell className="font-mono font-bold">{gp.gate_pass_no}</TableCell>
                        <TableCell>{gp.project.name}</TableCell>
                        <TableCell><Badge variant="secondary">{gp.items_count}</Badge></TableCell>
                        <TableCell>{format(new Date(gp.created_at), "MMM dd, hh:mm a")}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* Recent Pull Out */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowUpCircle className="h-5 w-5 text-red-600" />
                Recent Pull Outs
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentPullout.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No recent pull outs</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>No</TableHead>
                      <TableHead>Project</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentPullout.map((po) => (
                      <TableRow key={po.id}>
                        <TableCell className="font-mono font-bold">{po.gate_pass_no}</TableCell>
                        <TableCell>{po.project.name}</TableCell>
                        <TableCell><Badge variant="secondary">{po.items_count}</Badge></TableCell>
                        <TableCell>{format(new Date(po.created_at), "MMM dd, hh:mm a")}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}