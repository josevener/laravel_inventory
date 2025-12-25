import { useForm } from "@inertiajs/react"
import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card"
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { ArrowLeft, Shield } from "lucide-react"
import { Link } from "@inertiajs/react"
import { useSafeRoute } from "@/hooks/useSafeRoute"

export default function PermissionEdit({ permission }) {
  const safeRoute = useSafeRoute()

  const { data, setData, put, processing, errors } = useForm({
    name: permission.name || "",
    group: permission.group || "",
  })

  const submit = (e) => {
    e.preventDefault()
    put(safeRoute("permissions.update", { permission: permission.id }))
  }

  return (
    <AuthenticatedLayout
      breadCrumbLink={safeRoute("permissions.index")}
      breadCrumbLinkText="Permissions"
      breadCrumbPage="Edit Permission"
    >
      <div className="w-full mx-auto">
        <div className="flex items-center gap-4 mb-4">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Shield className="h-8 w-8" />
            Edit Permission
          </h1>
        </div>

        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>Edit Permission</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-6">
              <div>
                <Label htmlFor="name">Permission Name *</Label>
                <Input
                  id="name"
                  value={data.name}
                  onChange={(e) => setData("name", e.target.value)}
                  placeholder="e.g. delete products"
                  className="mt-2"
                />
                {errors.name && (
                  <p className="text-sm text-destructive mt-2">{errors.name}</p>
                )}
              </div>

              <div className="flex gap-3">
                <Button type="submit" disabled={processing}>
                  {processing ? "Updating..." : "Update Permission"}
                </Button>
                <Button variant="outline" asChild>
                  <Link href={safeRoute("permissions.index")}>
                    Cancel
                  </Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  )
}