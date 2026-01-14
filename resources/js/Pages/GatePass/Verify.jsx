import React from "react"
import { Head } from "@inertiajs/react"
import { Badge } from "@/Components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card"

export default function Verify({ gatePass }) {
  const statusColors = {
    pending:   "bg-yellow-100 text-yellow-800",
    received:  "bg-green-100 text-green-800",
    completed: "bg-blue-100 text-blue-800",
  }

  return (
    <>
      <Head title="Gate Pass Verification" />

      <div className="min-h-screen bg-muted flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Gate Pass Verification
              <Badge className={statusColors[gatePass.status]}>
                {gatePass.status.toUpperCase()}
              </Badge>
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <strong>Type:</strong> {gatePass.type.toUpperCase()}
              </div>

              {gatePass.gate_pass_no && (
                <div>
                  <strong>Gate Pass No:</strong> {gatePass.gate_pass_no}
                </div>
              )}

              <div>
                <strong>Project:</strong>{" "}
                {gatePass.project.company_name || gatePass.project.name}
              </div>

              <div>
                <strong>Authorized Bearer:</strong>{" "}
                {gatePass.authorized_bearer}
              </div>

              <div>
                <strong>Date:</strong>{" "}
                {new Date(gatePass.created_at).toLocaleString()}
              </div>

              <div>
                <strong>Created By:</strong>{" "}
                {gatePass.created_by?.name ?? "System"}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Items</h3>
              <table className="w-full border text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="border p-2">No</th>
                    <th className="border p-2">Description</th>
                    <th className="border p-2">Qty</th>
                    <th className="border p-2">Unit</th>
                  </tr>
                </thead>
                <tbody>
                  {gatePass.items.map((item, idx) => (
                    <tr key={item.id} className="text-center">
                      <td className="border p-2">{++idx}</td>
                      <td className="border p-2">{item.product.name}</td>
                      <td className="border p-2">{item.quantity}</td>
                      <td className="border p-2">
                        {item.product.unit.short_name}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="text-xs text-muted-foreground text-center pt-4">
              This page is system-generated. Any altered document is invalid.
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
