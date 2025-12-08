import { useForm, usePage } from "@inertiajs/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { ArrowLeft, UserPlus } from "lucide-react"
import { Link } from "@inertiajs/react"
import { useSafeRoute } from "@/hooks/useSafeRoute"

export default function UserForm({ user = null, clients, roles }) {
  const isEdit = !!user
  const safeRoute = useSafeRoute()
  const { auth } = usePage().props

  const isSuperAdmin = auth?.user?.client?.is_superadmin ? true : false

  const { data, setData, post, put, processing, errors } = useForm({
    name: user?.name || "",
    email: user?.email || "",
    password: "",
    password_confirmation: "",
    client_id: user?.client_id || auth?.user?.client_id,
    roles: user?.roles || [],
  })

  const submit = (e) => {
    e.preventDefault()
    const url = isEdit
      ? safeRoute("users.update", { user: user.id })
      : safeRoute("users.store")

    const method = isEdit ? put : post
    method(url)
  }

  return (
    <AuthenticatedLayout
      breadCrumbLink={safeRoute("users.index")}
      breadCrumbLinkText="Users"
      breadCrumbPage={`${isEdit ? "Edit User" : "Create User"}`}
    >
      <div className="w-full mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <UserPlus className="h-8 w-8" />
            {isEdit ? "Edit User" : "Create User"}
          </h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>User Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label>Name *</Label>
                  <Input
                    value={data.name}
                    onChange={(e) => setData("name", e.target.value)}
                    placeholder="John Doe"
                  />
                  {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
                </div>

                <div>
                  <Label>Email *</Label>
                  <Input
                    type="email"
                    value={data.email}
                    onChange={(e) => setData("email", e.target.value)}
                    placeholder="john@example.com"
                  />
                  {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label>{isEdit ? "New Password (optional)" : "Password"} *</Label>
                  <Input
                    type="password"
                    value={data.password}
                    onChange={(e) => setData("password", e.target.value)}
                    placeholder={isEdit ? "Leave blank to keep current" : "••••••••"}
                  />
                  {errors.password && <p className="text-sm text-destructive mt-1">{errors.password}</p>}
                </div>

                <div>
                  <Label>Confirm Password *</Label>
                  <Input
                    type="password"
                    value={data.password_confirmation}
                    onChange={(e) => setData("password_confirmation", e.target.value)}
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {isSuperAdmin && (
                <div>
                  <Label>Client *</Label>
                  <Select value={data.client_id} onValueChange={(v) => setData("client_id", v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select client" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id.toString()}>
                          {client.name} ({client.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.client_id && <p className="text-sm text-destructive mt-1">{errors.client_id}</p>}
                </div>
              )}

              <div>
                <Label>Roles *</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-3">
                  {roles.map((role) => (
                    <label key={role.id} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={data.roles.includes(role.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setData("roles", [...data.roles, role.id])
                          } else {
                            setData("roles", data.roles.filter((id) => id !== role.id))
                          }
                        }}
                        className="h-4 w-4"
                      />
                      <span className="text-sm font-medium">{role.name}</span>
                    </label>
                  ))}
                </div>
                {errors.roles && <p className="text-sm text-destructive mt-2">{errors.roles}</p>}
              </div>

              <div className="flex gap-3 pt-6">
                <Button type="submit" size="lg" disabled={processing}>
                  {processing ? "Saving..." : (isEdit ? "Update User" : "Create User")}
                </Button>
                <Button variant="outline" asChild>
                  <Link href={safeRoute("users.index")}>Cancel</Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  )
}