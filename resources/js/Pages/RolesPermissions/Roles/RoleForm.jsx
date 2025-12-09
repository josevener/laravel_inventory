import { useForm } from "@inertiajs/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { Link } from "@inertiajs/react"
import { useSafeRoute } from "@/hooks/useSafeRoute"

export default function RoleForm({ role = null, permissions, rolePermissions = [] }) {
  const isEdit = !!role
  const safeRoute = useSafeRoute()

  const { data, setData, post, put, processing, errors, reset } = useForm({
    name: role?.name || "",
    permissions: rolePermissions.map(p => p.id || p), // ensure we store IDs only
  })

  const togglePermission = (id) => {
    setData("permissions", 
      data.permissions.includes(id)
        ? data.permissions.filter((p) => p !== id)
        : [...data.permissions, id]
    )
  }

  const toggleSubgroup = (subgroupPerms) => {
    const allIds = subgroupPerms.map(p => p.id)
    const hasAllSelected = allIds.every(id => data.permissions.includes(id))

    if (hasAllSelected) {
      // Remove all from this subgroup
      setData("permissions", data.permissions.filter(id => !allIds.includes(id)))
    } else {
      // Add all missing ones
      setData("permissions", Array.from(new Set([...data.permissions, ...allIds])))
    }
  }

  const submit = (e) => {
    e.preventDefault()
    if (isEdit) {
      put(safeRoute("roles.update", { role: role.id }))
    } else {
      post(safeRoute("roles.store"), {
        onSuccess: () => reset(), // optional: clear form after success
      })
    }
  }

  return (
    <AuthenticatedLayout
      breadCrumbLink={safeRoute("roles.index")}
      breadCrumbLinkText="Roles"
      breadCrumbPage={isEdit ? "Edit Role" : "Create Role"}
    >
      {/* WRAP EVERYTHING IN A <form> TAG */}
      <form onSubmit={submit} className="w-full mx-auto space-y-6">
        {/* Role Name */}
        <Card>
          <CardHeader>
            <CardTitle>Role Name</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              value={data.name}
              onChange={(e) => setData("name", e.target.value)}
              placeholder="e.g. Warehouse Manager"
              required
            />
            {errors.name && <p className="text-sm text-destructive mt-2">{errors.name}</p>}
          </CardContent>
        </Card>

        {/* Permissions Accordion */}
        <Card>
          <CardHeader>
            <CardTitle>Permissions</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="multiple" className="space-y-4">
              {Object.entries(permissions).map(([groupName, subgroups]) => (
                <AccordionItem key={groupName} value={groupName}>
                  <AccordionTrigger className="text-lg font-semibold bg-gray-50 p-2 rounded-md">
                    {groupName}
                  </AccordionTrigger>

                  <AccordionContent className="pt-2 pl-4 space-y-4">
                    {Object.entries(subgroups).map(([subgroupName, perms]) => (
                      <AccordionItem key={subgroupName || "default"} value={subgroupName || "default"}>
                        <AccordionTrigger className="font-medium bg-gray-100 p-2 rounded-md flex items-center justify-start gap-4">
                          {/* Subgroup "Select All" Checkbox */}
                          <Checkbox
                            checked={perms.every(p => data.permissions.includes(p.id))}
                            indeterminate={
                              !perms.every(p => data.permissions.includes(p.id)) &&
                              perms.some(p => data.permissions.includes(p.id))
                            }
                            onCheckedChange={() => toggleSubgroup(perms)}
                          />
                          <span>{subgroupName || "General"}</span>
                        </AccordionTrigger>

                        <AccordionContent className="pl-8 pt-3 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                          {perms.map((perm) => (
                            <div
                              key={perm.id}
                              className="flex items-center gap-2 p-2 bg-white rounded-md shadow-sm hover:bg-gray-50 transition"
                            >
                              <Checkbox
                                id={`perm-${perm.id}`}
                                checked={data.permissions.includes(perm.id)}
                                onCheckedChange={() => togglePermission(perm.id)}
                              />
                              <Label htmlFor={`perm-${perm.id}`} className="cursor-pointer text-sm">
                                {perm.name}
                              </Label>
                            </div>
                          ))}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button type="submit" size="lg" disabled={processing}>
            {processing ? "Saving..." : isEdit ? "Update Role" : "Create Role"}
          </Button>
          <Button type="button" variant="outline" asChild>
            <Link href={safeRoute("roles.index")}>Cancel</Link>
          </Button>
        </div>
      </form>
    </AuthenticatedLayout>
  )
}