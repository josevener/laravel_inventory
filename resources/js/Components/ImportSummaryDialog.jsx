import { useEffect, useMemo, useState } from "react"
import { usePage } from "@inertiajs/react"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"

export default function ImportSummaryDialog() {
  const { flash } = usePage().props
  const import_summary = flash?.import_summary
  const [open, setOpen] = useState(false)

  const summary = useMemo(() => import_summary ?? null, [import_summary])

  useEffect(() => {
    if (summary) setOpen(true)
  }, [summary])

  if (!summary) return null

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Import Summary</DialogTitle>
        </DialogHeader>

        <div className="flex flex-wrap gap-2">
          <Badge variant="default">Imported: {summary.imported}</Badge>
          <Badge variant="secondary">Updated: {summary.updated}</Badge>
          <Badge variant="outline">Skipped: {summary.skipped}</Badge>
        </div>

        <div className="space-y-4 max-h-[420px] overflow-auto pr-1">
          {/* Imported */}
          <div>
            <p className="font-semibold mb-2">✅ Imported</p>
            {summary.imported_rows?.length ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {summary.imported_rows.map((u, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{u.name}</TableCell>
                        <TableCell className="text-muted-foreground">{u.email}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No new users imported.</p>
            )}
          </div>

          {/* Updated */}
          <div>
            <p className="font-semibold mb-2">♻️ Updated</p>
            {summary.updated_rows?.length ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {summary.updated_rows.map((u, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{u.name}</TableCell>
                        <TableCell className="text-muted-foreground">{u.email}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No users updated.</p>
            )}
          </div>

          {/* Skipped */}
          <div>
            <p className="font-semibold mb-2">⏭️ Skipped</p>
            {summary.skipped_rows?.length ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Reason</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {summary.skipped_rows.map((u, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{u.name || "—"}</TableCell>
                        <TableCell className="text-muted-foreground">{u.email || "—"}</TableCell>
                        <TableCell className="text-muted-foreground">{u.reason || "Skipped"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No skipped rows.</p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button onClick={() => setOpen(false)}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}