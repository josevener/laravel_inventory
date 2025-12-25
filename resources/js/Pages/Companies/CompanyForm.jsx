import { useForm } from "@inertiajs/react"
import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"
import { Textarea } from "@/Components/ui/textarea"
import { Switch } from "@/Components/ui/switch"
import { Card, CardContent } from "@/Components/ui/card"
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { Building2 } from "lucide-react"
import { Link } from "@inertiajs/react"
import { useSafeRoute } from "@/hooks/useSafeRoute"

export default function CompanyForm({ client = null }) {
  const isEdit = !!client
  const safeRoute = useSafeRoute()

  const { data, setData, post, put, processing, errors } = useForm({
    code: client?.code || "",
    name: client?.name || "",
    contact_person: client?.contact_person || "",
    email: client?.email || "",
    phone: client?.phone || "",
    address: client?.address || "",
    is_enable_inward_gatepass: client?.is_enable_inward_gatepass ?? true,
    is_enable_outward_gatepass: client?.is_enable_outward_gatepass ?? true,
    is_enable_warehouses: client?.is_enable_warehouses ?? false,
    is_superadmin: client?.is_superadmin ?? false,
  })

  const submit = (e) => {
    e.preventDefault()
    if (isEdit) {
      put(safeRoute("companies.update", { company: client.id }))
    } else {
      post(safeRoute("companies.store"))
    }
  }

  return (
    <AuthenticatedLayout
      breadCrumbLink={safeRoute("companies.index")}
      breadCrumbLinkText="Companies"
      breadCrumbPage={`${isEdit ? "Edit Company" : "Create Company"}`}
    >
      <div className="w-full mx-auto">
        <div className="flex items-center gap-4 mb-2">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Building2 className="h-8 w-8" />
            {isEdit ? "Edit Client" : "Create New Client"}
          </h1>
        </div>

        <Card>
          <CardContent className="pt-2">
            <form onSubmit={submit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Label>Client Code *</Label>
                  <Input
                    value={data.code}
                    onChange={(e) => setData("code", e.target.value)}
                    placeholder="SSI001"
                    className="font-mono"
                  />
                  {errors.code && <p className="text-sm text-destructive mt-1">{errors.code}</p>}
                </div>

                <div className="space-y-4">
                  <Label>Company Name *</Label>
                  <Input
                    value={data.name}
                    onChange={(e) => setData("name", e.target.value)}
                    placeholder="SSI Metal Corp."
                  />
                  {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label>Contact Person</Label>
                  <Input
                    value={data.contact_person}
                    onChange={(e) => setData("contact_person", e.target.value)}
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={data.email}
                    onChange={(e) => setData("email", e.target.value)}
                    placeholder="contact@ssimetal.com"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label>Phone</Label>
                  <Input
                    value={data.phone}
                    onChange={(e) => setData("phone", e.target.value)}
                    placeholder="+63 912 345 6789"
                  />
                </div>
              </div>

              <div>
                <Label>Address</Label>
                <Textarea
                  value={data.address}
                  onChange={(e) => setData("address", e.target.value)}
                  rows={3}
                  placeholder="Full address..."
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Features</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="flex items-center space-x-3">
                    <Switch
                      checked={data.is_enable_inward_gatepass}
                      onCheckedChange={(v) => setData("is_enable_inward_gatepass", v)}
                    />
                    <Label>Inward Gate Pass</Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Switch
                      checked={data.is_enable_outward_gatepass}
                      onChange={(v) => setData("is_enable_outward_gatepass", v)}
                    />
                    <Label>Outward Gate Pass</Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Switch
                      checked={data.is_enable_warehouses}
                      onCheckedChange={(v) => setData("is_enable_warehouses", v)}
                    />
                    <Label>Warehouses</Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Switch
                      checked={data.is_superadmin}
                      onCheckedChange={(v) => setData("is_superadmin", v)}
                    />
                    <Label className="text-purple-600 font-medium">Super Admin</Label>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-6">
                <Button type="submit" size="lg" disabled={processing}>
                  {processing ? "Saving..." : (isEdit ? "Update Client" : "Create Client")}
                </Button>
                <Button variant="outline" asChild>
                  <Link href={safeRoute("companies.index")}>Cancel</Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  )
}