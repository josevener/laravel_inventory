import React, { useState, useEffect } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Head, router } from "@inertiajs/react"
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

const formSchema = z.object({
  supplier_id: z.string().min(1, "Select a supplier"),
  warehouse_id: z.string().min(1, "Select warehouse"),
  vehicle_no: z.string().min(3, "Enter vehicle number"),
  driver_name: z.string().optional(),
  items: z.array(z.object({
    product_id: z.string(),
    quantity: z.coerce.number().min(1, "Qty ≥ 1"),
  })).min(1, "Add at least one item"),
})

export default function InwardCreate({ suppliers, warehouses, nextNumber }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [selectedWarehouse, setSelectedWarehouse] = useState(null)
  const [displayItems, setDisplayItems] = useState([]) // ← FIXED: Moved up!

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      supplier_id: "",
      warehouse_id: "",
      vehicle_no: "",
      driver_name: "",
      items: [],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  })

  useEffect(() => {
    if (searchTerm.length < 2) {
      setSearchResults([])
      return
    }

    const timer = setTimeout(async () => {
      setSearchLoading(true)
      try {
        const res = await axios.get("/products/search", {
          params: { q: searchTerm, warehouse_id: selectedWarehouse }
        })
        setSearchResults(res.data)
      } catch (err) {
        console.error("Search failed:", err)
      } finally {
        setSearchLoading(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [searchTerm, selectedWarehouse])

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
    router.post("/gatepass/inward", {
      ...data,
      nextNumber,
    }, {
      onSuccess: () => {
        form.reset()
        setDisplayItems([])
      }
    })
  }

  return (
    <>
      <Head title="New Inward Gate Pass" />

      <div className="max-w-6xl mx-auto space-y-8 py-8">
        <div className="flex items-center gap-4">
          <Truck className="h-12 w-12 text-primary" />
          <div>
            <h1 className="text-4xl font-bold">Inward Gate Pass</h1>
            <p className="text-2xl text-muted-foreground font-mono">
              No: <span className="text-primary font-bold">{nextNumber}</span>
            </p>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <FormField control={form.control} name="supplier_id" render={({ field }) => (
                <FormItem>
                  <FormLabel>Supplier</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Choose supplier" /></SelectTrigger></FormControl>
                    <SelectContent>
                      {suppliers.map(s => (
                        <SelectItem key={s.id} value={s.id.toString()}>
                          {s.company_name || s.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="warehouse_id" render={({ field }) => (
                <FormItem>
                  <FormLabel>Receiving Warehouse</FormLabel>
                  <Select onValueChange={(v) => { field.onChange(v); setSelectedWarehouse(v) }} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select warehouse" /></SelectTrigger></FormControl>
                    <SelectContent>
                      {warehouses.map(w => (
                        <SelectItem key={w.id} value={w.id.toString()}>
                          {w.name} ({w.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="vehicle_no" render={({ field }) => (
                <FormItem>
                  <FormLabel>Vehicle Number</FormLabel>
                  <FormControl><Input placeholder="MH14 AB 1234" className="uppercase" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="driver_name" render={({ field }) => (
                <FormItem>
                  <FormLabel>Driver Name (Optional)</FormLabel>
                  <FormControl><Input placeholder="Enter driver name" {...field} /></FormControl>
                </FormItem>
              )} />
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" /> Add Products
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by SKU or name..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {searchLoading && (
                  <div className="space-y-2">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                )}

                {searchResults.length > 0 && (
                  <div className="border rounded-lg max-h-64 overflow-y-auto">
                    {searchResults.map(product => (
                      <div
                        key={product.id}
                        onClick={() => addProduct(product)}
                        className="p-4 hover:bg-accent cursor-pointer border-b last:border-b-0 flex justify-between items-center"
                      >
                        <div>
                          <div className="font-medium">{product.sku} - {product.name}</div>
                          <div className="text-sm text-muted-foreground">
                            Stock: {product.current_stock} {product.unit_short}
                            {product.current_stock < product.reorder_level && (
                              <Badge variant="destructive" className="ml-2">Low</Badge>
                            )}
                          </div>
                        </div>
                        <Button size="sm" variant="ghost"><Plus className="h-4 w-4" /></Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

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
                        <TableHead>Product</TableHead>
                        <TableHead>Current Stock</TableHead>
                        <TableHead className="text-center">Qty</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {fields.map((field, index) => {
                        const item = displayItems[index]
                        return (
                          <TableRow key={field.id}>
                            <TableCell className="font-medium">{item?.sku}</TableCell>
                            <TableCell>{item?.name}</TableCell>
                            <TableCell>
                              <Badge variant="secondary">
                                {item?.current_stock || 0} {item?.unit_short}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-center">
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

            <div className="flex justify-end">
              <Button type="submit" size="lg">
                <Save className="mr-2 h-5 w-5" />
                Save Gate Pass & Receive Stock
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  )
}