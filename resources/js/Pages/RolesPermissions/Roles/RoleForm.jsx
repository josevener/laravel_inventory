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

  const { data, setData, post, put, processing, errors } = useForm({
    name: role?.name || "",
    permissions: rolePermissions,
  })

  const togglePermission = (id) => {
    setData(
      "permissions",
      data.permissions.includes(id)
        ? data.permissions.filter((p) => p !== id)
        : [...data.permissions, id]
    )
  }

  const toggleSubgroup = (subgroupPerms) => {
    const allIds = subgroupPerms.map(p => p.id)
    const hasAllSelected = allIds.every(id => data.permissions.includes(id))

    if (hasAllSelected) {
      setData("permissions", data.permissions.filter(id => !allIds.includes(id)))
    } else {
      setData("permissions", Array.from(new Set([...data.permissions, ...allIds])))
    }
  }

  const submit = (e) => {
    e.preventDefault()
    isEdit
      ? put(safeRoute("roles.update", { role: role.id }))
      : post(safeRoute("roles.store"))
  }

  return (
    <AuthenticatedLayout
      breadCrumbLink={safeRoute("roles.index")}
      breadCrumbLinkText="Roles"
      breadCrumbPage={isEdit ? "Edit Role" : "Create Role"}
    >
      <div className="w-full mx-auto space-y-6">
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

                  <AccordionContent className="pt-2 pl-4 space-y-2">
                    {Object.entries(subgroups).map(([subgroupName, perms]) => (
                      <AccordionItem key={subgroupName || "default"} value={subgroupName || "default"}>
                        <AccordionTrigger className="font-medium bg-gray-100 p-2 rounded-md flex items-center justify-start gap-4">
                          {/* Subgroup Select All */}
                          <Checkbox
                            checked={perms.every(p => data.permissions.includes(p.id))}
                            onCheckedChange={() => toggleSubgroup(perms)}
                            className="ml-2"
                          />

                          <span>{subgroupName ?? "General"}</span>
                        </AccordionTrigger>

                        <AccordionContent className="pl-4 pt-2 grid grid-cols-2 md:grid-cols-3 gap-3">
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
                              <Label htmlFor={`perm-${perm.id}`} className="cursor-pointer">
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
          <Button variant="outline" asChild>
            <Link href={safeRoute("roles.index")}>Cancel</Link>
          </Button>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
