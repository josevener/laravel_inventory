import React, { useState, useEffect } from "react"
import { useForm, useFieldArray, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Head, router } from "@inertiajs/react"
import { Plus, Trash2, Save, Search, Package, Fence } from "lucide-react"
import axios from "axios"

import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/Components/ui/form"
import { Badge } from "@/Components/ui/badge"
import { Skeleton } from "@/Components/ui/skeleton"
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { useSafeRoute } from "@/hooks/useSafeRoute"
import { toast } from "@/hooks/use-toast"

const formSchema = z.object({
  project_id: z.string().min(1, "Select a Project"),
  authorized_bearer: z.string().min(1, "Enter authorized bearer"),
  items: z.array(z.object({
    product_id: z.string(),
    quantity: z.coerce.number().min(1, "Qty ≥ 1"),
  })).min(1, "Add at least one item"),
})

export default function GatepassCreate({ type, projects, nextNumber }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [allProducts, setAllProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedItems, setSelectedItems] = useState([])

  const safeRoute = useSafeRoute()

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      project_id: "",
      authorized_bearer: "",
      items: [],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  })

  const projectId = useWatch({
    control: form.control,
    name: "project_id",
  })

  useEffect(() => {
    if (type !== "pullout") return
  
    // Clear RHF items array
    form.setValue("items", [])
  
    // Clear UI items
    setSelectedItems([])
  
  }, [projectId])
  
  // Fetch all products
  useEffect(() => {
    if (type !== "dispatch") return

    const fetchProducts = async () => {
      setLoading(true)
      try {
        const res = await axios.get(safeRoute("products.list"))
        setAllProducts(res.data.data)
        setFilteredProducts(res.data.data)
      } 
      catch (err) {
        console.error("Failed to load products:", err)
      } 
      finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [type])

  
  useEffect(() => {
    if (type !== "pullout") return
    if (!form.watch("project_id")) return
  
    const projectId = form.watch("project_id")
    
    const loadProjectStock = async () => {
      setLoading(true)
      try {
        const res = await axios.get(
          safeRoute("gatepass.project.dispatched_items", { project: projectId })
        )
        setAllProducts(res.data)
        setFilteredProducts(res.data)
      } 
      catch (e) {
        console.error(e)
      } 
      finally {
        setLoading(false)
      }
    }
  
    loadProjectStock()
  }, [form.watch("project_id"), type])

  // Filter products based on search
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredProducts(allProducts)
    } 
    else {
      const lower = searchTerm.toLowerCase()
      const filtered = allProducts.filter(
        (p) =>
          p.sku.toLowerCase().includes(lower) ||
          p.name.toLowerCase().includes(lower)
      )
      setFilteredProducts(filtered)
    }
  }, [searchTerm, allProducts])

  const addProduct = (product) => {
    const alreadyAdded = fields.some((f) => f.product_id === product.id.toString())
    if (alreadyAdded) {
      toast.info(
        <div>
          <strong>{product.sku} - {product.name}</strong> is already added
        </div>,
        {
          duration: 3000,
        }
      )
      return
    }

    append({ product_id: product.id.toString(), quantity: 1 })
    setSelectedItems((prev) => [...prev, { ...product, quantity: 1 }])
  }

  const removeItem = (index) => {
    remove(index)
    setSelectedItems((prev) => prev.filter((_, i) => i !== index))
  }

  const onSubmit = (data) => {
    router.post(safeRoute(`gatepass.${type}.store`), {
      ...data,
      nextNumber,
    }, {
      onSuccess: () => {
        // Only reset if backend did NOT send an error
        if (!page.props.flash?.error) {
          form.reset()
          setSelectedItems([])
        }
      },
      preserveScroll: true,
    })
  }

  return (
    <AuthenticatedLayout
      breadCrumbLink={safeRoute(`gatepass.${type}.index`)}
      breadCrumbLinkText={`${type === 'dispatch' ? 'Dispatch Gate Passes' : 'Pull Out'}`}
      breadCrumbPage={`New ${type === 'dispatch' ? 'Dispatch Gate Pass' : 'Pull Out'}`}
    >
      <Head title={`${type === 'dispatch' ? 'Dispatch' : 'Pull Out'} Gate Passes`} />

      {/* Full viewport height, flex column layout */}
      <div className="flex flex-col overflow-hidden">
        {/* TOP HEADER - Always visible */}
        <div className="flex items-center gap-4 border-b bg-background">
          <Fence className="h-12 w-12 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">
              {type === 'dispatch' ? 'Dispatch Gate Pass' : 'Pull Out'}
            </h1>
            {type === 'dispatch' && (
              <p className="text-xl text-muted-foreground font-mono mt-1">
                No: <span className="text-primary font-bold">{nextNumber}</span>
              </p>
            )}
          </div>
        </div>

        {/* MAIN CONTENT - Takes remaining space */}
        <div className="flex-1 flex flex-col">

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col">

              {/* Project & Bearer - Fixed at top */}
              <div className="py-4 px-2 bg-background">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-w-7xl mx-auto">
                  <FormField
                    control={form.control}
                    name="project_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Choose Project" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {projects.map((p) => (
                              <SelectItem key={p.id} value={p.id.toString()}>
                                {p.company_name || p.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="authorized_bearer"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Authorized Bearer *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter name of authorized person" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* SCROLLABLE TWO COLUMNS - This is the magic part */}
              <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-2">
                {/* LEFT: Available Products - Independent scroll */}
                <Card className="flex flex-col max-h-[calc(100vh-320px)] overflow-auto">
                  <CardHeader className="flex-shrink-0">
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Package className="h-5 w-5" />
                        Available Products ({filteredProducts.length})
                      </span>
                      <div className="relative w-64">
                        <Search className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search SKU or name..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 overflow-y-auto">
                    {loading ? (
                      <div className="space-y-3">
                        {[...Array(8)].map((_, i) => (
                          <Skeleton key={i} className="h-20 w-full" />
                        ))}
                      </div>
                    ) : filteredProducts.length === 0 ? (
                      <p className="text-center text-muted-foreground py-10">
                        {searchTerm ? "No products match your search." : "No products available."}
                      </p>
                    ) : (
                      <div className="space-y-0 divide-y border rounded-lg">
                        {filteredProducts.map((product) => {
                          const isAdded = selectedItems.some((item) => item.id === product.id)

                          return (
                            <div
                              key={product.id}
                              className={`p-4 flex justify-between items-center transition-colors ${
                                isAdded
                                  ? "bg-muted/50 opacity-70 cursor-not-allowed"
                                  : "hover:bg-accent cursor-pointer"
                              }`}
                              onClick={() => !isAdded && addProduct(product)}
                            >
                              <div>
                                <div className="font-medium">{product.sku} {product.category?.name ?? null} - {product.name}</div>
                                <div className="text-sm text-muted-foreground mt-1">
                                  Stock: {product.current_stock} {product.unit_short}
                                  {product.current_stock < product.reorder_level && product.current_stock > 0 && (
                                    <Badge variant="destructive" className="ml-2 text-xs">Low Stock</Badge>
                                  )}
                                  {product.current_stock === 0 && (
                                    <Badge variant="secondary" className="ml-2 text-xs">Out of Stock</Badge>
                                  )}
                                </div>
                              </div>

                              <Button
                                size="sm"
                                variant={isAdded ? "secondary" : "default"}
                                disabled={isAdded}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  !isAdded && addProduct(product)
                                }}
                              >
                                {isAdded ? "Added" : <Plus className="h-4 w-4" />}
                              </Button>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* RIGHT: Selected Items - Independent scroll */}
                <Card className="flex flex-col max-h-[calc(100vh-320px)] overflow-auto">
                  <CardHeader className="flex-shrink-0">
                    <CardTitle>Items to {type === 'dispatch' ? 'Dispatch' : 'Receive'} ({fields.length})</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 overflow-y-auto">
                    {fields.length === 0 ? (
                      <div className="text-center text-muted-foreground py-16 h-full flex flex-col justify-center">
                        <Package className="h-16 w-16 mx-auto mb-4 opacity-30" />
                        <p className="text-lg">No items selected yet.</p>
                        <p className="text-sm mt-2">Click products on the left to add them</p>
                      </div>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>SKU</TableHead>
                            <TableHead>Product</TableHead>
                            {type === 'dispatch' && (
                              <TableHead>Current Stock</TableHead>
                            )}
                            {type === 'pullout' && (
                              <TableHead className="text-center">Dispatched Qty</TableHead>
                            )}
                            <TableHead className="text-center">
                              {type === 'dispatch' ? 'Dispatch Qty' : 'Receive Qty'}
                            </TableHead>
                            <TableHead className="w-12"></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {fields.map((field, index) => {
                            const item = selectedItems[index]
                            if (!item) return null

                            return (
                              <TableRow key={field.id} className="text-center">
                                <TableCell className="font-mono text-sm">{item.sku}</TableCell>
                                <TableCell className="font-medium">{item.name}</TableCell>
                                {type === 'dispatch' && (
                                  <TableCell>
                                    <Badge variant="outline">
                                      {item.current_stock} {item.unit_short}
                                    </Badge>
                                  </TableCell>
                                )}
                                {type === 'pullout' && (
                                  <TableCell>
                                    <Badge variant="outline">
                                      {item.current_stock} {item.unit_short}
                                    </Badge>
                                  </TableCell>
                                )}
                                <TableCell>
                                  <Input
                                    type="number"
                                    min="1"
                                    className="w-24 mx-auto"
                                    {...form.register(`items.${index}.quantity`, { valueAsNumber: true })}
                                  />
                                </TableCell>
                                <TableCell>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeItem(index)}
                                  >
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            )
                          })}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                </Card>

                {/* BOTTOM SUBMIT - Always visible at bottom */}
                <div className="bg-background flex justify-end col-span-full">
                  <div className="w-full max-w-7xl mx-auto flex justify-end">
                    <Button type="submit" size="lg" className="min-w-72">
                      <Save className="mr-2 h-5 w-5" />
                      Save Gate Pass
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}