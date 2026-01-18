import React, { useEffect, useRef, useState } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import {
  Users,
  Package,
  Shield,
  UserCog,
  Edit,
  Save,
  X,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Card, CardContent } from "@/Components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import { Checkbox } from "@/Components/ui/checkbox";
import { useSafeRoute } from "@/hooks/useSafeRoute";
import GuestLayout from "@/Layouts/GuestLayout";

import UsersTab from "./Partials/UsersTab";
import ProductsTab from "./Partials/ProductsTab";
import ProjectsTab from "./Partials/ProjectsTab";
import RolesTab from "./Partials/RolesTab";

export default function ClientShow({ client }) {
  const safeRoute = useSafeRoute();
  const isNew = !client?.id;

  const [mode, setMode] = useState(isNew ? "edit" : "view");
  const [newUsers, setNewUsers] = useState([]);
  const [newProducts, setNewProducts] = useState([]);
  const [newProjects, setNewProjects] = useState([]);
  const [newRoles, setNewRoles] = useState([]);
  const formRef = useRef(null);

  const { data, setData, put, post, processing, errors, reset, transform } = useForm({
    code: client?.code || "",
    name: client?.name || "",
    contact_person: client?.contact_person || "",
    email: client?.email || "",
    phone: client?.phone || "",
    address: client?.address || "",
    is_enable_dispatch_gatepass: client?.is_enable_dispatch_gatepass ?? true,
    is_enable_pullout_gatepass: client?.is_enable_pullout_gatepass ?? true,
    is_enable_warehouses: client?.is_enable_warehouses ?? false,
    is_superadmin: client?.is_superadmin ?? false,
    is_brand_enable: client?.is_brand_enable ?? false,
    is_pos_enable: client?.is_pos_enable ?? false,
    is_others_enable: client?.is_others_enable ?? false,
    is_active: client?.is_active ?? true,

    new_users: [],
    new_products: [],
    new_projects: [],
    new_roles: [],
  });

  useEffect(() => {
    if (client) {
      reset({
        code: client.code || "",
        name: client.name || "",
        contact_person: client.contact_person || "",
        email: client.email || "",
        phone: client.phone || "",
        address: client.address || "",
        is_enable_dispatch_gatepass: client.is_enable_dispatch_gatepass ?? true,
        is_enable_pullout_gatepass: client.is_enable_pullout_gatepass ?? true,
        is_enable_warehouses: client.is_enable_warehouses ?? false,
        is_superadmin: client.is_superadmin ?? false,
        is_brand_enable: client.is_brand_enable ?? false,
        is_pos_enable: client.is_pos_enable ?? false,
        is_others_enable: client.is_others_enable ?? false,
        is_active: client.is_active ?? true,

        new_users: [],
        new_products: [],
        new_projects: [],
        new_roles: [],
      });
    }
  }, [client, reset]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // setData((prev) => ({
    //   ...prev,
    //   new_users: newUsers,
    //   new_products: newProducts,
    //   new_projects: newProjects,
    //   new_roles: newRoles,
    // }));


    transform((data) => ({
      ...data,
      new_users: newUsers,
      new_products: newProducts,
      new_projects: newProjects,
      new_roles: newRoles,
    }));

    if (isNew) {
      post(safeRoute("companies.store"), { 
        onSuccess: () => setMode("view"),
        onError: (err) => console.error("Save error:", err),
      });
    } 
    else {
      put(safeRoute("companies.update", { company: client.id }), {
        onSuccess: () => setMode("view"),
        onError: (err) => console.error("Save error:", err),
      });
    }
  };
  
  const handleCancel = () => {
    if (isNew) {
      window.location.href = safeRoute("companies.index");
    } 
    else {
      reset();
      setNewUsers([]);
      setNewProducts([]);
      setNewProjects([]);
      setNewRoles([]);
      setMode("view");
    }
  };

  const isEditing = mode === "edit";

  return (
    <GuestLayout>
      <Head title={isNew ? "New Client" : `Client — ${client?.name}` || "Client Details"} />

      {/* Sticky Header */}
      <div className="sticky top-0 z-20 bg-gray-100/95 backdrop-blur-sm border-b border-border pb-4 px-4 lg:px-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 max-w-screen-2xl mx-auto">
          <div className="flex items-center gap-4">
            <Button variant="outline" className="hover:bg-gray-300" asChild>
              <Link href={safeRoute("companies.index")}>
                <ArrowLeft className="h-8 w-8" />
              </Link>
            </Button>

            <div className="flex items-center gap-3">
              <div>
                <h1 className="text-xl font-bold tracking-tight">
                  {client?.name || "New Client"}
                  {!!data.is_superadmin && (
                    <Shield className="inline ml-2 h-5 w-5 text-purple-600" />
                  )}
                </h1>
                <code className="bg-muted py-0.5 rounded font-mono text-sm">
                  {client?.code || "—"}
                </code>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isEditing ? (
              <>
                <Button
                  onClick={() => {
                    if (formRef.current) {
                      formRef.current.requestSubmit(); // triggers form's onSubmit
                    }
                  }}
                  disabled={processing}
                  className="gap-1.5"
                >
                  {processing ? "Saving..." : <><Save className="h-4 w-4" /> Save</>}
                </Button>
                <Button 
                  type="button"
                  variant="outline" 
                  onClick={handleCancel} 
                  className="gap-1.5"
                >
                  <X className="h-4 w-4" /> Cancel
                </Button>
              </>
            ) : (
              !isNew && (
                <Button 
                  type="button"
                  onClick={() => setMode("edit")} 
                  className="gap-1.5"
                >
                  <Edit className="h-4 w-4" /> Edit Client
                </Button>
              )
            )}
          </div>
        </div>
      </div>

      {/* Main Content - Full height card with internal scrolling */}
      <div className="pt-2">
        <Card className="border shadow-sm h-[calc(100vh-120px)] flex flex-col overflow-hidden">
          <CardContent className="flex-1 p-0 overflow-hidden">
            <div className="h-full overflow-auto p-6 lg:p-8">
              <form ref={formRef} onSubmit={handleSubmit} className="h-full">
                <div className="grid lg:grid-cols-2 gap-8 xl:gap-12 h-full">
                  {/* LEFT COLUMN - Form + Permissions */}
                  <div className="space-y-2 overflow-y-auto px-4 border-r border-border/40 lg:border-r">
                    <div>
                      <h2 className="text-lg font-semibold mb-4">Company Information</h2>

                      <div className="space-y-2">
                        {/* Access Code + Company Name */}
                        <div className="grid sm:grid-cols-2 gap-5">
                          <div>
                            <Label className="text-sm">Access Code *</Label>
                            {isEditing ? (
                              <Input
                                value={data.code}
                                onChange={(e) => setData("code", e.target.value)}
                                placeholder="SSI001"
                                className="font-mono mt-1.5 h-10"
                              />
                            ) : (
                              <div className="mt-1.5 h-10 flex items-center font-mono bg-muted/50 px-3 rounded-md border">
                                {client?.code || "—"}
                              </div>
                            )}
                            {errors.code && isEditing && (
                              <p className="text-xs text-destructive mt-1">{errors.code}</p>
                            )}
                          </div>

                          <div>
                            <Label className="text-sm">Company Name *</Label>
                            {isEditing ? (
                              <Input
                                value={data.name}
                                onChange={(e) => setData("name", e.target.value)}
                                placeholder="Company Name"
                                className="mt-1.5 h-10"
                              />
                            ) : (
                              <div className="mt-1.5 h-10 flex items-center px-3 rounded-md border bg-muted/50">
                                {client?.name || "—"}
                              </div>
                            )}
                            {errors.name && isEditing && (
                              <p className="text-xs text-destructive mt-1">{errors.name}</p>
                            )}
                          </div>
                        </div>

                        {/* Contact Person + Email */}
                        <div className="grid sm:grid-cols-2 gap-5">
                          <div>
                            <Label className="text-sm">Contact Person</Label>
                            {isEditing ? (
                              <Input
                                value={data.contact_person}
                                onChange={(e) => setData("contact_person", e.target.value)}
                                placeholder="John Doe"
                                className="mt-1.5 h-10"
                              />
                            ) : (
                              <div className="mt-1.5 h-10 flex items-center px-3 border bg-muted/50 rounded-md">
                                {client?.contact_person || "—"}
                              </div>
                            )}
                          </div>

                          <div>
                            <Label className="text-sm">Email</Label>
                            {isEditing ? (
                              <Input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData("email", e.target.value)}
                                placeholder="contact@company.com"
                                className="mt-1.5 h-10"
                              />
                            ) : (
                              <div className="mt-1.5 h-10 flex items-center px-3 border bg-muted/50 rounded-md">
                                {client?.email || "—"}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Phone + Address */}
                        <div className="grid sm:grid-cols-2 gap-5">
                          <div>
                            <Label className="text-sm">Phone</Label>
                            {isEditing ? (
                              <Input
                                value={data.phone}
                                onChange={(e) => setData("phone", e.target.value)}
                                placeholder="+63 912 345 6789"
                                className="mt-1.5 h-10"
                              />
                            ) : (
                              <div className="mt-1.5 h-10 flex items-center px-3 border bg-muted/50 rounded-md">
                                {client?.phone || "—"}
                              </div>
                            )}
                          </div>

                          <div>
                            <Label className="text-sm">Address</Label>
                            {isEditing ? (
                              <Textarea
                                value={data.address}
                                onChange={(e) => setData("address", e.target.value)}
                                rows={4}
                                placeholder="Full address..."
                                className="mt-1.5 resize-none"
                              />
                            ) : (
                              <div className="mt-1.5 p-3 min-h-[100px] border bg-muted/50 rounded-md whitespace-pre-wrap text-sm">
                                {client?.address || "—"}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Active Checkbox */}
                        <div>
                          <label className="flex items-center gap-2">
                            <Checkbox
                              checked={data.is_active}
                              onCheckedChange={(v) => setData("is_active", v)}
                              disabled={!isEditing}
                            />
                            <span className="text-sm font-medium">Active</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Features & Permissions */}
                    <div className="pt-6 border-t">
                      <h2 className="text-lg font-semibold mb-4">Features & Permissions</h2>
                      <div className="grid gap-4 sm:grid-cols-2">
                        {[
                          { key: "is_pos_enable", label: "Point of Sale" },
                          { key: "is_brand_enable", label: "Brands" },
                          { key: "is_enable_dispatch_gatepass", label: "Dispatch Gate Pass" },
                          { key: "is_enable_pullout_gatepass", label: "Pull Out Gate Pass" },
                          { key: "is_others_enable", label: "Others" },
                          { key: "is_enable_warehouses", label: "Warehouses Management" },
                          {
                            key: "is_superadmin",
                            label: "Super Admin Access",
                            highlight: true,
                          },
                        ].map(({ key, label, highlight }) => (
                          <label key={key} className="flex items-center gap-3">
                            <Checkbox
                              checked={data[key]}
                              onCheckedChange={(v) => setData(key, v)}
                              disabled={!isEditing}
                            />
                            <span
                              className={`text-sm ${highlight ? "text-purple-700 font-medium" : ""}`}
                            >
                              {label}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* RIGHT COLUMN - Tabs */}
                  {!isNew && (
                    <div className="flex flex-col h-full w-full overflow-auto">
                      <h2 className="text-lg font-semibold mb-4">Company Resources</h2>

                      <Tabs defaultValue="users" className="flex-1 flex flex-col">
                        <TabsList className="grid w-full sm:w-auto grid-cols-4 mb-4">
                          <TabsTrigger value="users" className="gap-2">
                            <Users className="h-4 w-4" /> Users
                          </TabsTrigger>
                          <TabsTrigger value="products" className="gap-2">
                            <Package className="h-4 w-4" /> Products
                          </TabsTrigger>
                          <TabsTrigger value="projects" className="gap-2">
                            <UserCog className="h-4 w-4" /> Projects
                          </TabsTrigger>
                          <TabsTrigger value="roles" className="gap-2">
                            <UserCog className="h-4 w-4" /> Roles
                          </TabsTrigger>
                        </TabsList>

                        <div className="flex-1 overflow-hidden pr-2">
                          <TabsContent value="users" className="mt-0 h-full">
                            <div className="h-full overflow-auto py-2">
                              <UsersTab 
                                users={client?.users || []}
                                newUsers={newUsers}
                                setNewUsers={setNewUsers}
                                isEditing={isEditing}
                              />
                            </div>
                          </TabsContent>

                          <TabsContent value="products" className="mt-0 h-full">
                            <div className="h-full overflow-auto py-2">
                              <ProductsTab 
                                products={client?.products || []}
                                newProducts={newProducts}
                                setNewProducts={setNewProducts}
                                isEditing={isEditing} 
                              />
                            </div>
                          </TabsContent>

                          <TabsContent value="projects" className="mt-0 h-full">
                            <div className="h-full overflow-auto py-2">
                              <ProjectsTab 
                                projects={client?.projects || []}
                                newProjects={newProjects}
                                setNewProjects={setNewProjects}
                                isEditing={isEditing}
                              />
                            </div>
                          </TabsContent>

                          <TabsContent value="roles" className="mt-0 h-full">
                            <div className="h-full overflow-auto py-2">
                              <RolesTab 
                                roles={client?.roles || []} 
                                newRoles={newRoles}
                                setNewRoles={setNewRoles}
                                isEditing={isEditing}
                              />
                            </div>
                          </TabsContent>
                        </div>
                      </Tabs>
                    </div>
                  )}
                </div>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </GuestLayout>
  );
}