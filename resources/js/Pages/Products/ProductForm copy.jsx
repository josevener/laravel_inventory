import React from "react"
import { Head, Link, useForm } from "@inertiajs/react"
import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select"
import { Textarea } from "@/Components/ui/textarea"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/Components/ui/tooltip"
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { Info, Package, Image as ImageIcon } from "lucide-react"
import { useSafeRoute } from "@/hooks/useSafeRoute"

export default function ProductForm({ product, categories, units, brands, enable_brands, enable_pos, enable_others }) {
  const safeRoute = useSafeRoute()
  const isEdit = !!product

  const defaultCategoryId = (() => {
    if (!isEdit) return ""
    if (product?.category_id === null || product?.category_id === undefined) {
      return enable_others ? "-1" : ""
    }
    return product?.category_id?.toString() || ""
  })()

  const defaultUnitId = (() => {
    if (!isEdit) return ""
    if (product?.unit_id === null || product?.unit_id === undefined) {
      return enable_others ? "-1" : ""
    }
    return product?.unit_id?.toString() || ""
  })()

  const defaultBrandId = (() => {
    if (!enable_brands) return undefined
    if (!isEdit) return ""
    if (product?.brand_id === null || product?.brand_id === undefined) {
      return enable_others ? "-1" : ""
    }
    return product?.brand_id?.toString() || ""
  })()

  const [imagePreview, setImagePreview] = React.useState(product?.image_path || "")
  const [clientErrors, setClientErrors] = React.useState({})

  const { data, setData, post, put, processing, errors } = useForm({
    sku: product?.sku || "",
    name: product?.name || "",
    category_id: defaultCategoryId,
    unit_id: defaultUnitId,
    ...(enable_brands ? { brand_id: defaultBrandId ?? "" } : {}),
    ...(enable_pos ? { cost_price: product?.cost_price ?? "", selling_price: product?.selling_price ?? "" } : {}),
    current_stock: product?.current_stock ?? 0,
    reorder_level: product?.reorder_level ?? 10,
    description: product?.description || "",
    image: null,
  })

  const validateForm = () => {
    const newErrors = {}

    // SKU
    if (!data.sku || !data.sku.trim()) {
      newErrors.sku = "SKU is required."
    }

    // Name
    if (!data.name || !data.name.trim()) {
      newErrors.name = "Product name is required."
    }

    // Category
    if (!data.category_id) {
      newErrors.category_id = "Category is required."
    }

    if (!enable_others && data.category_id === "-1") {
      newErrors.category_id = "Others is disabled in preferences."
    }

    // Unit
    if (!data.unit_id) {
      newErrors.unit_id = "Unit is required."
    }

    if (!enable_others && data.unit_id === "-1") {
      newErrors.unit_id = "Others is disabled in preferences."
    }

    // Brand (only if enabled)
    if (enable_brands) {
      if (!enable_others && data.brand_id === "-1") {
        newErrors.brand_id = "Others is disabled in preferences."
      }
    }

    // Stock
    if (data.current_stock === "" || data.current_stock === null) {
      newErrors.current_stock = "Initial stock is required."
    } else if (Number.isNaN(Number(data.current_stock))) {
      newErrors.current_stock = "Initial stock must be a valid number."
    } else if (Number(data.current_stock) < 0) {
      newErrors.current_stock = "Initial stock must be 0 or greater."
    }

    // Reorder
    if (data.reorder_level === "" || data.reorder_level === null) {
      newErrors.reorder_level = "Reorder level is required."
    } else if (Number.isNaN(Number(data.reorder_level))) {
      newErrors.reorder_level = "Reorder level must be a valid number."
    } else if (Number(data.reorder_level) < 0) {
      newErrors.reorder_level = "Reorder level must be 0 or greater."
    }

    // POS Prices (only if enabled)
    if (enable_pos) {
      const cost = Number(data.cost_price)
      const sell = Number(data.selling_price)

      if (data.cost_price === "" || data.cost_price === null || Number.isNaN(cost)) {
        newErrors.cost_price = "Cost price is required."
      } else if (cost < 0) {
        newErrors.cost_price = "Cost price must be 0 or greater."
      }

      if (data.selling_price === "" || data.selling_price === null || Number.isNaN(sell)) {
        newErrors.selling_price = "Selling price is required."
      } else if (sell < 0) {
        newErrors.selling_price = "Selling price must be 0 or greater."
      }

      if (!Number.isNaN(cost) && !Number.isNaN(sell) && sell < cost) {
        newErrors.selling_price = "Selling price must be greater than or equal to cost price."
      }
    }

    // Image Validation
    if (data.image) {
      const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"]
      const maxSizeMB = 5
      const maxBytes = maxSizeMB * 1024 * 1024

      if (!allowedTypes.includes(data.image.type)) {
        newErrors.image = "Invalid image type. Allowed: JPG, PNG, WEBP."
      }

      if (data.image.size > maxBytes) {
        newErrors.image = `Image must be ${maxSizeMB}MB or below.`
      }
    }

    setClientErrors(newErrors)

    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    setClientErrors({})

    const isValid = validateForm()
    if (!isValid) return

    const options = {
      forceFormData: true,
    }

    if (isEdit) {
      put(safeRoute("products.update", { product: product.id }), options)
      return
    }

    post(safeRoute("products.store"), options)
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
                <Label htmlFor="sku">SKU <span className="text-destructive">*</span></Label>
                <Input
                  id="sku"
                  name="sku"
                  value={data.sku}
                  onChange={(e) => setData("sku", e.target.value)}
                  placeholder="e.g. CEM-001"
                  className="mt-1.5 font-mono"
                />
                {(errors.sku || clientErrors.sku) && (
                  <p className="text-sm text-destructive mt-1.5">{errors.sku || clientErrors.sku}</p>
                )}
              </div>

              <div>
                <Label htmlFor="name">Product Name <span className="text-destructive">*</span></Label>
                <Input
                  id="name"
                  name="name"
                  value={data.name}
                  onChange={(e) => setData("name", e.target.value)}
                  placeholder="e.g. OPC 53 Grade Cement"
                  className="mt-1.5"
                />
                {(errors.name || clientErrors.name) && (
                  <p className="text-sm text-destructive mt-1.5">{errors.name || clientErrors.name}</p>
                )}
              </div>

              <div>
                <Label className="flex items-center gap-2">
                  Category <span className="text-destructive">*</span>

                  {enable_others && (
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
                  )}
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
                {(errors.category_id || clientErrors.category_id) && (
                  <p className="text-sm text-destructive mt-1.5">{errors.category_id || clientErrors.category_id}</p>
                )}
              </div>

              <div>
                <Label className="flex items-center gap-2">
                  Unit <span className="text-destructive">*</span>

                  {enable_others && (
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
                  )}
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
                {(errors.unit_id || clientErrors.unit_id) && (
                  <p className="text-sm text-destructive mt-1.5">{errors.unit_id || clientErrors.unit_id}</p>
                )}
              </div>

              {enable_brands && (
                <div>
                  <Label className="flex items-center gap-2">
                    Brand <span className="text-muted-foreground">(Optional)</span>

                    {enable_others && (
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
                    )}
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
                  {(errors.brand_id || clientErrors.brand_id) && (
                    <p className="text-sm text-destructive mt-1.5">{errors.brand_id || clientErrors.brand_id}</p>
                  )}
                </div>
              )}
            </div>

            {/* Right */}
            <div className="space-y-2">
              <div>
                <Label htmlFor="current_stock">Initial Stock</Label>
                <Input
                  id="current_stock"
                  name="current_stock"
                  type="number"
                  min="0"
                  value={data.current_stock}
                  onChange={(e) => {
                    const value = e.target.value
                    setData("current_stock", value === "" ? "" : Number(value))
                  }}
                  className="mt-1.5"
                />
                {(errors.current_stock || clientErrors.current_stock) && (
                  <p className="text-sm text-destructive mt-1.5">{errors.current_stock || clientErrors.current_stock}</p>
                )}
              </div>

              <div>
                <Label htmlFor="reorder_level">Reorder Level <span className="text-destructive">*</span></Label>
                <Input
                  id="reorder_level"
                  name="reorder_level"
                  type="number"
                  min="0"
                  value={data.reorder_level}
                  onChange={(e) => {
                    const value = e.target.value
                    setData("reorder_level", value === "" ? "" : Number(value))
                  }}
                  className="mt-1.5"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Alert when stock falls below this number
                </p>
                {(errors.reorder_level || clientErrors.reorder_level) && (
                  <p className="text-sm text-destructive mt-1.5">{errors.reorder_level || clientErrors.reorder_level}</p>
                )}
              </div>

              {enable_pos && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cost_price">Cost Price <span className="text-destructive">*</span></Label>
                    <Input
                      id="cost_price"
                      name="cost_price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={data.cost_price}
                      onChange={(e) => setData("cost_price", e.target.value)}
                      className="mt-1.5"
                    />
                    {(errors.cost_price || clientErrors.cost_price) && (
                      <p className="text-sm text-destructive mt-1.5">{errors.cost_price || clientErrors.cost_price}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="selling_price">Selling Price <span className="text-destructive">*</span></Label>
                    <Input
                      id="selling_price"
                      name="selling_price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={data.selling_price}
                      onChange={(e) => setData("selling_price", e.target.value)}
                      className="mt-1.5"
                    />
                    {(errors.selling_price || clientErrors.selling_price) && (
                      <p className="text-sm text-destructive mt-1.5">{errors.selling_price || clientErrors.selling_price}</p>
                    )}
                  </div>
                </div>
              )}

              <div>
                <Label className="flex items-center gap-2">
                  Product Image <span className="text-muted-foreground">(Optional)</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          className="inline-flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground transition"
                        >
                          <ImageIcon className="h-4 w-4" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="font-medium">Product Image</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Upload a product photo for easier identification.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>

                <Input
                  type="file"
                  accept="image/*"
                  className="mt-1.5"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null
                    setData("image", file)

                    if (file) {
                      const url = URL.createObjectURL(file)
                      setImagePreview(url)
                      return
                    }

                    setImagePreview(product?.image_path || "")
                  }}
                />

                {imagePreview && (
                  <div className="mt-3">
                    <div className="w-full border rounded-lg overflow-hidden bg-muted">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-72 object-contain"
                      />
                    </div>
                  </div>
                )}

                {(errors.image || clientErrors.image) && (
                  <p className="text-sm text-destructive mt-1.5">{errors.image || clientErrors.image}</p>
                )}
              </div>

              <div>
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={data.description}
                  onChange={(e) => setData("description", e.target.value)}
                  placeholder="Add details..."
                  rows={5}
                  className="mt-1.5 resize-none"
                />
                {(errors.description || clientErrors.description) && (
                  <p className="text-sm text-destructive mt-1.5">{errors.description || clientErrors.description}</p>
                )}
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