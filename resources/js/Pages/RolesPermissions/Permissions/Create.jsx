import { useForm } from "@inertiajs/react"
import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card"
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { Shield } from "lucide-react"
import { Link } from "@inertiajs/react"
import { useSafeRoute } from "@/hooks/useSafeRoute"

export default function PermissionCreate() {
  const safeRoute = useSafeRoute()

  const { data, setData, post, processing, errors } = useForm({
    name: "",
    group: "",
  })

  const submit = (e) => {
    e.preventDefault()
    post(safeRoute("permissions.store"))
  }

  return (
    <AuthenticatedLayout
      breadCrumbLink={safeRoute("permissions.index")}
      breadCrumbLinkText="Permissions"
      breadCrumbPage="Create Permission"
    >
      <div className="w-full mx-auto">
        <div className="flex items-center gap-4 mb-4">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Shield className="h-8 w-8" />
            Create Permission
          </h1>
        </div>

        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>Add New Permission</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-6">
              <div>
                <Label htmlFor="name">Permission Name *</Label>
                <Input
                  id="name"
                  value={data.name}
                  onChange={(e) => setData("name", e.target.value)}
                  placeholder="e.g. edit products"
                  className="mt-2"
                />
                {errors.name && (
                  <p className="text-sm text-destructive mt-2">{errors.name}</p>
                )}
              </div>

              <div>
                <Label htmlFor="group">Group *</Label>
                <Input
                  id="group"
                  value={data.group}
                  onChange={(e) => setData("group", e.target.value)}
                  placeholder="e.g. Products"
                  className="mt-2"
                />
                {errors.group && (
                  <p className="text-sm text-destructive mt-2">{errors.group}</p>
                )}
              </div>

              <div className="flex gap-3">
                <Button type="submit" disabled={processing}>
                  {processing ? "Creating..." : "Create Permission"}
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