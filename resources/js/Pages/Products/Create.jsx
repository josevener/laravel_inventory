import React from "react"
import { Head, Link, useForm } from "@inertiajs/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { ArrowLeft, Package } from "lucide-react"

export default function Create({ categories, units }) {
  const { data, setData, post, processing, errors } = useForm({
    sku: "",
    name: "",
    category_id: "",
    unit_id: "",
    reorder_level: 10,
    description: "",
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    post(route("products.store"))
  }

  return (
    <AuthenticatedLayout
      breadCrumbLink="/products"
      breadCrumbLinkText="Products"
      breadCrumbPage="New Product"
    >
      <Head title="Create Product" />

      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-background border-b">
        <div className="flex items-center justify-between py-4 px-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href={route("products.index")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Products
              </Link>
            </Button>
          </div>
          <h1 className="text-2xl font-semibold flex items-center gap-2">
            <Package className="h-6 w-6 text-primary" />
            Create New Product
          </h1>
          <div className="w-[100px]" /> {/* Spacer for balance */}
        </div>
      </div>

      <div className="w-full mx-auto">
        <form onSubmit={handleSubmit}>
          {/* Main Form Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left Column */}
            <div className="space-y-6">
              <div>
                <Label htmlFor="sku">
                  SKU <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="sku"
                  value={data.sku}
                  onChange={(e) => setData("sku", e.target.value)}
                  placeholder="e.g. PROD-001"
                  className="mt-1.5"
                />
                {errors.sku && <p className="text-sm text-destructive mt-1.5">{errors.sku}</p>}
              </div>

              <div>
                <Label htmlFor="name">
                  Product Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  value={data.name}
                  onChange={(e) => setData("name", e.target.value)}
                  placeholder="e.g. Wireless Mouse"
                  className="mt-1.5"
                />
                {errors.name && <p className="text-sm text-destructive mt-1.5">{errors.name}</p>}
              </div>

              <div>
                <Label>
                  Category <span className="text-destructive">*</span>
                </Label>
                <Select value={data.category_id} onValueChange={(v) => setData("category_id", v)}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Choose a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id.toString()}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category_id && <p className="text-sm text-destructive mt-1.5">{errors.category_id}</p>}
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div>
                <Label>
                  Unit <span className="text-destructive">*</span>
                </Label>
                <Select value={data.unit_id} onValueChange={(v) => setData("unit_id", v)}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {units.map((unit) => (
                      <SelectItem key={unit.id} value={unit.id.toString()}>
                        {unit.name} ({unit.short_name})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.unit_id && <p className="text-sm text-destructive mt-1.5">{errors.unit_id}</p>}
              </div>

              <div>
                <Label htmlFor="reorder_level">
                  Reorder Level <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="reorder_level"
                  type="number"
                  min="0"
                  value={data.reorder_level}
                  onChange={(e) => setData("reorder_level", e.target.value)}
                  className="mt-1.5"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Notify when stock falls below this number
                </p>
              </div>

              <div>
                <Label htmlFor="description">Description <span className="text-muted-foreground">(Optional)</span></Label>
                <Textarea
                  id="description"
                  value={data.description}
                  onChange={(e) => setData("description", e.target.value)}
                  placeholder="Add any additional details about this product..."
                  rows={5}
                  className="mt-1.5 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Sticky Action Bar - Always Visible */}
          <div className="fixed bottom-0 left-0 right-0 bg-background border-t">
            <div className="max-w-5xl mx-auto px-6 py-4 flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                asChild
                size="lg"
                className="min-w-[120px]"
              >
                <Link href={route("products.index")}>Cancel</Link>
              </Button>
              <Button
                type="submit"
                size="lg"
                disabled={processing}
                className="min-w-[160px]"
              >
                {processing ? "Creating..." : "Create Product"}
              </Button>
            </div>
          </div>

          {/* Bottom padding to prevent content from being hidden under fixed bar */}
          <div className="h-28" />
        </form>
      </div>
    </AuthenticatedLayout>
  )
}