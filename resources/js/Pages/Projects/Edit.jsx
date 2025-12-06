import { useForm } from "@inertiajs/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent } from "@/components/ui/card"
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { ArrowLeft, Building2 } from "lucide-react"
import { Link } from "@inertiajs/react"

export default function Edit({ project }) {
  const { data, setData, put, processing, errors } = useForm({
    name: project.name || "",
    company_name: project.company_name || "",
    phone: project.phone || "",
    email: project.email || "",
    address: project.address || "",
    gst_number: project.gst_number || "",
    is_active: project.is_active || true,
  })
  
  const submit = (e) => {
    e.preventDefault()
    put(route("projects.update", project.id))
  }

  return (
    <AuthenticatedLayout>
      <div className="w-full mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="sm" asChild>
            <Link href={route("projects.index")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Link>
          </Button>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Building2 className="h-8 w-8" />
            Update Project
          </h1>
        </div>

        <Card>
          <CardContent className="pt-6">
            <form onSubmit={submit} className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Contact Person *</Label>
                  <Input
                    id="name"
                    value={data.name}
                    onChange={(e) => setData("name", e.target.value)}
                    placeholder="John Doe"
                  />
                  {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
                </div>

                <div>
                  <Label htmlFor="company_name">Company Name</Label>
                  <Input
                    id="company_name"
                    value={data.company_name}
                    onChange={(e) => setData("company_name", e.target.value)}
                    placeholder="ABC Electronics Ltd."
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={data.phone}
                    onChange={(e) => setData("phone", e.target.value)}
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={data.email}
                    onChange={(e) => setData("email", e.target.value)}
                    placeholder="john@abcelectronics.com"
                  />
                  {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="gst_number">GST Number</Label>
                  <Input
                    id="gst_number"
                    value={data.gst_number}
                    onChange={(e) => setData("gst_number", e.target.value.toUpperCase())}
                    placeholder="22AAAAA0000A1Z5"
                  />
                </div>

                <div>
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={data.address}
                    onChange={(e) => setData("address", e.target.value)}
                    rows={4}
                    placeholder="123 Business Street, Mumbai..."
                  />
                </div>

                <div className="flex items-center space-x-3">
                  <Switch
                    id="is_active"
                    checked={data.is_active}
                    onCheckedChange={(checked) => setData("is_active", checked)}
                  />
                  <Label htmlFor="is_active">Active project</Label>
                </div>
              </div>

              <div className="md:col-span-2 flex gap-3 pt-6 border-t">
                <Button type="submit" size="lg" disabled={processing}>
                  {processing ? "Creating..." : "Edit project"}
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href={route("projects.index")}>Cancel</Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  )
}