// Edit.jsx
import { useForm } from "@inertiajs/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { ArrowLeft } from "lucide-react"
import { Link } from "@inertiajs/react"
import { Card, CardContent } from "@/components/ui/card"
import { useSafeRoute } from "@/hooks/useSafeRoute"

export default function Edit({ category }) {
  const { data, setData, put, processing, errors } = useForm({
    code: category.code || "",
    name: category.name || "",
    description: category.description || "",
  })
  const safeRoute = useSafeRoute()

  const submit = (e) => {
    e.preventDefault()
    put(safeRoute("categories.update", { category: category.id }))
  }

  return (
    <AuthenticatedLayout
      breadCrumbLink={safeRoute("categories.index")}
      breadCrumbLinkText="Categories"
      breadCrumbPage="Edit Category"
    >
      <div className="w-full mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold">Edit Category</h1>
        </div>

        <Card className="max-w-2xl">
          <CardContent className="pt-6">
            <form onSubmit={submit} className="space-y-6">
              <div>
                <Label htmlFor="code">Code *</Label>
                <Input
                  id="code"
                  value={data.code}
                  onChange={(e) => setData("code", e.target.value)}
                  placeholder="CAT-001"
                />
                {errors.code && <p className="text-sm text-destructive mt-1">{errors.code}</p>}
              </div>

              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={data.name}
                  onChange={(e) => setData("name", e.target.value)}
                  placeholder="Electronics"
                />
                {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
              </div>

              <div>
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={data.description}
                  onChange={(e) => setData("description", e.target.value)}
                  rows={4}
                  placeholder="Devices, gadgets, and accessories..."
                />
              </div>

              <div className="flex gap-3">
                <Button type="submit" disabled={processing}>
                  {processing ? "Creating..." : "Edit Category"}
                </Button>
                <Button variant="outline" asChild>
                  <Link href={safeRoute("categories.index")}>Cancel</Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  )
}