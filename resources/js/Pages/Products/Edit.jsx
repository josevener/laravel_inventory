import React from "react"
import { Head, Link, useForm } from "@inertiajs/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { ArrowLeft } from "lucide-react"

export default function Edit({ product, categories, units }) {
  const { data, setData, put, processing, errors } = useForm({
    sku: product.sku || "",
    name: product.name || "",
    category_id: product.category_id?.toString() || "",
    unit_id: product.unit_id?.toString() || "",
    reorder_level: product.reorder_level || 10,
    description: product.description || "",
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    put(route("products.update", product.id))
  }

  return (
    <AuthenticatedLayout>
      <Head title="Create Product" />

      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href={route("products.index")}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Edit Product</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="sku">SKU *</Label>
            <Input
              id="sku"
              value={data.sku}
              onChange={(e) => setData("sku", e.target.value)}
              placeholder="PROD-001"
            />
            {errors.sku && <p className="text-sm text-destructive mt-1">{errors.sku}</p>}
          </div>

          <div>
            <Label htmlFor="name">Product Name *</Label>
            <Input
              id="name"
              value={data.name}
              onChange={(e) => setData("name", e.target.value)}
            />
            {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
          </div>

          <div>
            <Label>Category *</Label>
            <Select value={data.category_id} onValueChange={(v) => setData("category_id", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat.id} value={cat.id.toString()}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category_id && <p className="text-sm text-destructive mt-1">{errors.category_id}</p>}
          </div>

          <div>
            <Label>Unit *</Label>
            <Select value={data.unit_id} onValueChange={(v) => setData("unit_id", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                {units.map(unit => (
                  <SelectItem key={unit.id} value={unit.id.toString()}>
                    {unit.name} ({unit.short_name})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.unit_id && <p className="text-sm text-destructive mt-1">{errors.unit_id}</p>}
          </div>

          <div>
            <Label htmlFor="reorder_level">Reorder Level *</Label>
            <Input
              id="reorder_level"
              type="number"
              value={data.reorder_level}
              onChange={(e) => setData("reorder_level", e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={data.description}
              onChange={(e) => setData("description", e.target.value)}
              rows={4}
            />
          </div>

          <div className="flex gap-3">
            <Button type="submit" disabled={processing}>
              Create Product
            </Button>
            <Button variant="outline" asChild>
              <Link href={route("products.index")}>Cancel</Link>
            </Button>
          </div>
        </form>
      </div>
    </AuthenticatedLayout>
  )
}