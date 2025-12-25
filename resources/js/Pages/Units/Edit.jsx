import { useForm } from "@inertiajs/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { Link } from "@inertiajs/react"
import { useSafeRoute } from "@/hooks/useSafeRoute"

export default function Edit({ unit }) {
  const { data, setData, put, processing, errors } = useForm({
    name: unit.name || "",
    short_name: unit.short_name || "",
  })
  const safeRoute = useSafeRoute()

  const submit = (e) => {
    e.preventDefault()
    put(safeRoute("units.update", { unit: unit.id }))
  }

  return (
    <AuthenticatedLayout
      breadCrumbLink={safeRoute("units.index")}
      breadCrumbLinkText="Units"
      breadCrumbPage="Edit Unit"
    >
      <div className="w-full mx-auto py-8">
        <div className="flex items-center gap-4 mb-8">
          <h1 className="text-3xl font-bold">Edit Unit</h1>
        </div>

        <Card className="max-w-2xl">
          <CardContent className="pt-6">
            <form onSubmit={submit} className="space-y-6">
              <div>
                <Label htmlFor="name">Unit Name *</Label>
                <Input
                  id="name"
                  value={data.name}
                  onChange={(e) => setData("name", e.target.value)}
                  placeholder="e.g. Kilogram"
                />
                {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
              </div>

              <div>
                <Label htmlFor="short_name">Short Name *</Label>
                <Input
                  id="short_name"
                  value={data.short_name}
                  onChange={(e) => setData("short_name", e.target.value)}
                  placeholder="e.g. Kg"
                  className="font-mono"
                />
                {errors.short_name && <p className="text-sm text-destructive mt-1">{errors.short_name}</p>}
              </div>

              <div className="flex gap-3">
                <Button type="submit" disabled={processing}>
                  {processing ? "Creating..." : "Edit Unit"}
                </Button>
                <Button variant="outline" asChild>
                  <Link href={safeRoute("units.index")}>Cancel</Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  )
}