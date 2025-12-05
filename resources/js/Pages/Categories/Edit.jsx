// Edit.jsx
import { useForm } from "@inertiajs/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { ArrowLeft } from "lucide-react"
import { Link } from "@inertiajs/react"

export default function Edit() {
  const { data, setData, post, processing, errors } = useForm({
    code: "",
    name: "",
    description: "",
  })

  const submit = (e) => {
    e.preventDefault()
    post(route("categories.update"))
  }

  return (
    <AuthenticatedLayout>
      <div className="max-w-2xl mx-auto space-y-8 py-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href={route("categories.index")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Edit Category</h1>
        </div>

        <Card>
          <CardContent className="pt-6">
            <form onSubmit={submit} className="space-y-6">
              <div>
                <Label htmlFor="code">Code *</Label>
                <Input
                  id="code"
                  value={data.code}
                  onChange={(e) => setData("code", e.target.value.toUpperCase())}
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
                  <Link href={route("categories.index")}>Cancel</Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  )
}