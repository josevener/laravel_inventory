import React, { useState, useEffect } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { router } from "@inertiajs/react"
import { Truck, Plus, Trash2, Save, Search, Package } from "lucide-react"
import axios from "axios"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { useSafeRoute } from "@/hooks/useSafeRoute"

const formSchema = z.object({
  project_id: z.string().min(1, "Select a Project"),
  vehicle_no: z.string().min(3, "Enter vehicle number"),
  driver_name: z.string().optional(),
  items: z.array(z.object({
    product_id: z.string(),
    quantity: z.coerce.number().min(1, "Qty ≥ 1"),
  })).min(1, "Add at least one item"),
})

export default function InwardCreate({ projects, nextNumber }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [displayItems, setDisplayItems] = useState([])
  const safeRoute = useSafeRoute()

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      project_id: "",
      vehicle_no: "",
      driver_name: "",
      items: [],
    },
  })

  console.log("projects: ", JSON.stringify(projects, null,2))
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  })

  // Search products (no warehouse filter)
  useEffect(() => {
    if (searchTerm.length < 1) {
      setSearchResults([])
      return
    }

    const timer = setTimeout(async () => {
      setSearchLoading(true)
      try {
        const res = await axios.get(safeRoute("products.search"), {
          params: { q: searchTerm }
        })
        setSearchResults(res.data)
      } 
      catch (err) {
        console.error("Search failed:", err)
      } 
      finally {
        setSearchLoading(false)
      }
    }, 400)

    return () => clearTimeout(timer)
  }, [searchTerm])

  const addProduct = (product) => {
    const exists = fields.some(f => f.product_id === product.id.toString())
    if (exists) {
      alert("Product already added!")
      return
    }

    append({ product_id: product.id.toString(), quantity: 1 })
    setDisplayItems(prev => [...prev, { ...product, tempId: Date.now() }])
    setSearchTerm("")
    setSearchResults([])
  }

  const onSubmit = (data) => {
    router.post(safeRoute("gatepass.inward.store"), {
      ...data,
      nextNumber,
    }, {
      onSuccess: () => {
        form.reset()
        setDisplayItems([])
      },
      preserveScroll: true,
    })
  }

  return (
    <AuthenticatedLayout
      breadCrumbLink={safeRoute("gatepass.inward.index")}
      breadCrumbLinkText="Inward Gate Passes"
      breadCrumbPage="New Inward Gate Pass"
    >
      <div className="w-full mx-auto">
        {/* Header */}
        <div className="flex items-center gap-6">
          <Truck className="h-14 w-14 text-primary" />
          <div>
            <h1 className="text-4xl font-bold">Inward Gate Pass</h1>
            <p className="text-2xl text-muted-foreground font-mono mt-1">
              No: <span className="text-primary font-bold">{nextNumber}</span>
            </p>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

            {/* Project & Vehicle Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                        {projects.map(s => (
                          <SelectItem key={s.id} value={s.id.toString()}>
                            {s.company_name || s.name}
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
                name="vehicle_no"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vehicle Number *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="MH14 AB 1234"
                        className="uppercase font-mono"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="driver_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Driver Name (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter driver name" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {/* Search & Add Products */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" /> Add Products
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by SKU, name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {searchLoading && (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                )}

                {searchResults.length > 0 && (
                  <div className="border rounded-lg max-h-64 overflow-y-auto bg-background">
                    {searchResults.map(product => (
                      <div
                        key={product.id}
                        onClick={() => addProduct(product)}
                        className="p-4 hover:bg-accent cursor-pointer border-b last:border-b-0 flex justify-between items-center transition-colors"
                      >
                        <div>
                          <div className="font-medium">{product.sku} - {product.name}</div>
                          <div className="text-sm text-muted-foreground">
                            Current Stock: {product.current_stock} {product.unit_short}
                            {product.current_stock < product.reorder_level && product.current_stock > 0 && (
                              <Badge variant="destructive" className="ml-2 text-xs">Low Stock</Badge>
                            )}
                            {product.current_stock === 0 && (
                              <Badge variant="secondary" className="ml-2 text-xs">Out of Stock</Badge>
                            )}
                          </div>
                        </div>
                        <Button size="sm" variant="ghost">
                          <Plus className="h-5 w-5" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Items Table */}
            {fields.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Items to Receive ({fields.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>SKU</TableHead>
                        <TableHead>Product Name</TableHead>
                        <TableHead>Current Stock</TableHead>
                        <TableHead className="text-center">Receive Qty</TableHead>
                        <TableHead className="w-10"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {fields.map((field, index) => {
                        const item = displayItems[index]
                        return (
                          <TableRow key={field.id}>
                            <TableCell className="font-mono">{item?.sku}</TableCell>
                            <TableCell>{item?.name}</TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {item?.current_stock || 0} {item?.unit_short}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-center">
                              <Input
                                type="number"
                                min="1"
                                defaultValue={1}
                                className="w-24 mx-auto"
                                {...form.register(`items.${index}.quantity`, { valueAsNumber: true })}
                              />
                            </TableCell>
                            <TableCell>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  remove(index)
                                  setDisplayItems(prev => prev.filter((_, i) => i !== index))
                                }}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}

            {/* Submit */}
            <div className="flex justify-end pt-6">
              <Button type="submit" size="lg" className="min-w-64">
                <Save className="mr-2 h-5 w-5" />
                Save Gate Pass & Receive Stock
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </AuthenticatedLayout>
  )
}