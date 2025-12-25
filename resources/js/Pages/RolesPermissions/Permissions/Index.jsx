import { Head, Link, router } from "@inertiajs/react"
import { Plus, Shield, Trash2, Edit, Folder, FolderOpen } from "lucide-react"
import { Button } from "@/Components/ui/button"
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/Components/ui/accordion"
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { useSafeRoute } from "@/hooks/useSafeRoute"

export default function PermissionsIndex({ permissions }) {
  const safeRoute = useSafeRoute()

  return (
    <AuthenticatedLayout
      breadCrumbLink={safeRoute("roles-permissions.index")}
      breadCrumbLinkText={"Roles & Permissions"}
      breadCrumbPage={"Permissions"}
    >
      <Head title="Permissions" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Permissions</h1>
            <p className="text-muted-foreground">Manage system permissions</p>
          </div>
          <Button asChild>
            <Link href={safeRoute("permissions.create")}>
              <Plus className="mr-2 h-4 w-4" /> Add Permission
            </Link>
          </Button>
        </div>

        {/* GROUP ACCORDION */}
        <Accordion type="multiple" className="space-y-4">
          {Object.entries(permissions).map(([groupName, subgroups]) => (
            <AccordionItem key={groupName} value={groupName}>
              <AccordionTrigger className="text-xl font-semibold bg-gray-50 p-3 rounded-md flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                {groupName}
                <span className="ml-auto text-sm text-muted-foreground">
                  {Object.keys(subgroups).length} {Object.keys(subgroups).length > 1 ? "subgroups" : "subgroup"}
                </span>
              </AccordionTrigger>

              <AccordionContent className="pt-2">
                {/* SUBGROUP ACCORDION */}
                <Accordion type="multiple" className="space-y-2 pl-4 border-l border-gray-200">
                  {Object.entries(subgroups).map(([subgroupName, perms]) => (
                    <AccordionItem key={subgroupName || "default"} value={subgroupName || "default"}>
                      <AccordionTrigger className="flex items-center gap-2 font-medium bg-gray-100 p-2 rounded-md hover:bg-gray-200">
                        <Folder className="h-4 w-4 text-muted-foreground" />
                        {subgroupName ?? "General"}
                        <span className="ml-auto text-sm text-muted-foreground">{perms.length} permissions</span>
                      </AccordionTrigger>

                      <AccordionContent className="pl-6 pt-2 space-y-2">
                        {perms.map((perm) => (
                          <div
                            key={perm.id}
                            className="flex items-center justify-between p-2 bg-white rounded-md shadow-sm hover:bg-gray-50 transition"
                          >
                            <span className="font-medium">{perm.name}</span>

                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                              <Button size="sm" variant="ghost" asChild>
                                <Link href={safeRoute("permissions.edit", { permission: perm.id })}>
                                  <Edit className="h-4 w-4" />
                                </Link>
                              </Button>

                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-destructive"
                                onClick={() =>
                                  router.delete(
                                    safeRoute("permissions.destroy", { permission: perm.id })
                                  )
                                }
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </AuthenticatedLayout>
  )
}
