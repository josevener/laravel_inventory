import React from "react"
import { Head, Link, useForm } from "@inertiajs/react"
import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select"
import { Textarea } from "@/Components/ui/textarea"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/Components/ui/tooltip"
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { Info, Package } from "lucide-react"
import { useSafeRoute } from "@/hooks/useSafeRoute"
import { Checkbox } from "@/Components/ui/checkbox"

export default function ProductForm({ product, categories, units, brands, enable_brands, enable_pos, enable_others }) {
  const safeRoute = useSafeRoute()
  const isEdit = !!product

  const { data, setData, post, put, processing, errors } = useForm({
    sku: product?.sku || "",
    name: product?.name || "",
    category_id: product?.category_id?.toString() || "",
    unit_id: product?.unit_id?.toString() || "",
    ...(enable_brands ? { brand_id: product?.brand_id?.toString() || "" } : {}),
    ...(enable_pos ? { cost_price: product?.cost_price || 0, selling_price: product?.selling_price || 0 } : {}),
    current_stock: product?.current_stock || 0,
    reorder_level: product?.reorder_level || 10,
    description: product?.description || "",
    status: product?.status || true,
  })
  const handleSubmit = (e) => {
    e.preventDefault()

    if (isEdit) {
      put(safeRoute("products.update", { product: product.id }))
      return
    }

    post(safeRoute("products.store"))
  }

  return (
    <AuthenticatedLayout
      breadCrumbLink={safeRoute("products.index")}
      breadCrumbLinkText="Products"
      breadCrumbPage={isEdit ? "Edit Product" : "Create Product"}
    >
      <Head title={isEdit ? "Edit Product" : "Create Product"} />

      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-background border-b">
        <h1 className="text-2xl font-semibold flex items-center mb-2 gap-2">
          <Package className="h-6 w-6 text-primary" />
          {isEdit ? "Edit Product" : "Create New Product"}
        </h1>
      </div>

      <div className="w-full mx-auto">
        <form onSubmit={handleSubmit}>
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left */}
            <div className="space-y-2">
              <div>
                <Label htmlFor="sku" className="flex items-center gap-2">
                  Stock Keeping Unit <span>(SKU)</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          className="inline-flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground transition"
                        >
                          <Info className="h-4 w-4" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="font-medium">SKU</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Unique product code used for tracking inventory and sales.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <Input
                  id="sku"
                  value={data.sku}
                  onChange={(e) => setData("sku", e.target.value)}
                  placeholder="Leave blank to auto-generate, or enter your own unique SKU."
                  className="mt-1.5 font-mono"
                />
                {errors.sku && <p className="text-sm text-destructive mt-1.5">{errors.sku}</p>}
              </div>

              <div>
                <Label htmlFor="name">Product Name <span className="text-destructive">*</span></Label>
                <Input
                  id="name"
                  value={data.name}
                  onChange={(e) => setData("name", e.target.value)}
                  placeholder="e.g. OPC 53 Grade Cement"
                  className="mt-1.5"
                />
                {errors.name && <p className="text-sm text-destructive mt-1.5">{errors.name}</p>}
              </div>

              <div>
                <Label className="flex items-center gap-2">
                  Category <span className="text-destructive">*</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          className="inline-flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground transition"
                        >
                          <Info className="h-4 w-4" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="font-medium">Category</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Select "Others" if the category is not listed.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <Select value={data.category_id} onValueChange={(v) => setData("category_id", v)}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Choose category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id.toString()}>
                        {cat.name}
                      </SelectItem>
                    ))}

                    {enable_others && (
                      <SelectItem value="-1">Others</SelectItem>
                    )}
                  </SelectContent>
                </Select>
                {enable_others && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Tip: Choose <span className="font-medium">Others</span> if not found.
                  </p>
                )}
                {errors.category_id && <p className="text-sm text-destructive mt-1.5">{errors.category_id}</p>}
              </div>

              <div>
                <Label className="flex items-center gap-2">
                  Unit <span className="text-destructive">*</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          className="inline-flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground transition"
                        >
                          <Info className="h-4 w-4" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="font-medium">Unit</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Select "Others" if the unit is not listed.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
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

                    {enable_others && (
                      <SelectItem value="-1">Others</SelectItem>
                    )}
                  </SelectContent>
                </Select>
                {enable_others && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Tip: Choose <span className="font-medium">Others</span> if not found.
                  </p>
                )}
                {errors.unit_id && <p className="text-sm text-destructive mt-1.5">{errors.unit_id}</p>}
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  id="active"
                  checked={!!data.status}
                  onCheckedChange={(checked) => setData("status", !!checked)}
                />
                <Label htmlFor="active">
                  This product is {data.status ? "active" : "inactive"}
                </Label>
              </div>
              
              {enable_brands && (
                <div>
                  <Label className="flex items-center gap-2">
                    Brand <span className="text-muted-foreground">(Optional)</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            className="inline-flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground transition"
                          >
                            <Info className="h-4 w-4" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="font-medium">Brand</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Select "Others" if the brand is not listed.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </Label>
                  <Select value={data.brand_id} onValueChange={(v) => setData("brand_id", v)}>
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Choose brand" />
                    </SelectTrigger>
                    <SelectContent>
                      {brands.map((brand) => (
                        <SelectItem key={brand.id} value={brand.id.toString()}>
                          {brand.name}
                        </SelectItem>
                      ))}

                      {enable_others && (
                        <SelectItem value="-1">Others</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  {enable_others && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Tip: Choose <span className="font-medium">Others</span> if not found.
                    </p>
                  )}
                  {errors.brand_id && <p className="text-sm text-destructive mt-1.5">{errors.brand_id}</p>}
                </div>
              )}
            </div>

            {/* Right */}
            <div className="space-y-2">
              <div>
                <Label htmlFor="current_stock">Initial Stock</Label>
                <Input
                  id="current_stock"
                  type="number"
                  min="0"
                  value={data.current_stock}
                  onChange={(e) => setData("current_stock", e.target.value)}
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="reorder_level">Reorder Level <span className="text-destructive">*</span></Label>
                <Input
                  id="reorder_level"
                  type="number"
                  min="0"
                  value={data.reorder_level}
                  onChange={(e) => setData("reorder_level", e.target.value)}
                  className="mt-1.5"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Alert when stock falls below this number
                </p>
              </div>

              {enable_pos && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="cost_price">Cost Price</Label>
                    <Input
                      id="cost_price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={data.cost_price}
                      onChange={(e) => setData("cost_price", e.target.value)}
                      className="mt-1.5"
                    />
                    {errors.cost_price && <p className="text-sm text-destructive mt-1.5">{errors.cost_price}</p>}
                  </div>

                  <div>
                    <Label htmlFor="selling_price">Selling Price</Label>
                    <Input
                      id="selling_price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={data.selling_price}
                      onChange={(e) => setData("selling_price", e.target.value)}
                      className="mt-1.5"
                    />
                    {errors.selling_price && <p className="text-sm text-destructive mt-1.5">{errors.selling_price}</p>}
                  </div>
                </div>
              )}

              <div>
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={data.description}
                  onChange={(e) => setData("description", e.target.value)}
                  placeholder="Add details..."
                  rows={5}
                  className="mt-1.5 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Fixed Bottom Bar */}
          <div className="fixed bottom-0 left-0 right-0 bg-background border-t">
            <div className="max-w-5xl mx-auto px-6 py-4 flex justify-end gap-3">
              <Button type="button" variant="outline" size="lg" asChild>
                <Link href={safeRoute("products.index")}>Cancel</Link>
              </Button>
              <Button type="submit" size="lg" disabled={processing}>
                {isEdit
                  ? (processing ? "Updating..." : "Update Product")
                  : (processing ? "Creating..." : "Create Product")}
              </Button>
            </div>
          </div>
          <div className="h-28" />
        </form>
      </div>
    </AuthenticatedLayout>
  )
}