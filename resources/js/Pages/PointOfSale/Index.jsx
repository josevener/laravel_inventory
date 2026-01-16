import React, { useState } from "react"
import { Head } from "@inertiajs/react"
import { Plus, Minus, Trash2, ShoppingCart } from "lucide-react"
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card"
import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import { Badge } from "@/Components/ui/badge"
import CheckoutModal from "./Modals/CheckoutModal"

export default function POS({ products }) {
  const [cart, setCart] = useState([])
  const [search, setSearch] = useState("")
  const [checkoutOpen, setCheckoutOpen] = useState(false)

  /* ---------------- CART LOGIC ---------------- */

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id)
      if (existing) {
        return prev.map((i) =>
          i.id === product.id
            ? { ...i, qty: i.qty + 1 }
            : i
        )
      }
      return [...prev, { ...product, qty: 1 }]
    })
  }

  const updateQty = (id, qty) => {
    if (qty <= 0) return removeItem(id)
    setCart((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, qty } : i
      )
    )
  }

  const removeItem = (id) => {
    setCart((prev) => prev.filter((i) => i.id !== id))
  }

  const subtotal = cart.reduce(
    (sum, i) => sum + i.price * i.qty,
    0
  )

  /* ---------------- FILTER ---------------- */

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.sku.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <AuthenticatedLayout>
      <Head title="Point of Sale" />

      <div className="h-[calc(100vh-4rem)] grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* ================= PRODUCTS ================= */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <Card>
            <CardContent className="p-4">
              <Input
                placeholder="Search product / Scan barcode..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
              />
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 p-4 gap-4 overflow-auto">
            {filteredProducts.map((product) => (
              <Card
                key={product.id}
                className="cursor-pointer hover:ring-2 hover:ring-primary"
                onClick={() => addToCart(product)}
              >
                <CardContent className="p-4 space-y-2">
                  <div className="font-semibold truncate">
                    {product.name}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold">
                      ₱{product.selling_price}
                    </span>
                    <Badge variant="secondary">
                      {product.current_stock}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* ================= CART ================= */}
        <div className="flex flex-col h-full">
          <Card className="flex-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Cart
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4 overflow-auto">
              {cart.length === 0 && (
                <p className="text-muted-foreground text-sm text-center">
                  Cart is empty
                </p>
              )}

              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-2"
                >
                  <div className="flex-1">
                    <p className="font-medium truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ₱{item.selling_price}
                    </p>
                  </div>

                  <div className="flex items-center gap-1">
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() =>
                        updateQty(item.id, item.qty - 1)
                      }
                    >
                      <Minus className="h-4 w-4" />
                    </Button>

                    <span className="w-6 text-center">
                      {item.qty}
                    </span>

                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() =>
                        updateQty(item.id, item.qty + 1)
                      }
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  <Button
                    size="icon"
                    variant="destructive"
                    onClick={() => removeItem(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* ================= TOTAL ================= */}
          <Card className="mt-4">
            <CardContent className="p-4 space-y-3">
              <div className="flex justify-between font-semibold">
                <span>Subtotal</span>
                {/* <span>₱{selling_subtotal}</span> */}
              </div>

              <Button
                size="lg"
                className="w-full"
                disabled={cart.length === 0}
                onClick={() => setCheckoutOpen(true)}
              >
                Checkout
              </Button>
            </CardContent>
          </Card>
        </div>

        <CheckoutModal
          open={checkoutOpen}
          onClose={() => setCheckoutOpen(false)}
          total={subtotal}
          onConfirm={() => {
            setCheckoutOpen(false)
            // next steps will handle save
          }}
        />
      </div>
    </AuthenticatedLayout>
  )
}
