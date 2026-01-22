import React, { useMemo, useState } from "react"
import {
  Search,
  Trash2,
  Plus,
  Minus,
  X,
  UtensilsCrossed,
  ClipboardList,
  Send,
  Wallet,
} from "lucide-react"
import { Card } from "@/Components/ui/card"
import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import { Badge } from "@/Components/ui/badge"
import { Separator } from "@/Components/ui/separator"
import { ScrollArea } from "@/Components/ui/scroll-area"
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { Head, usePage } from "@inertiajs/react"

/* ===========================
  MOCK DATA (FALLBACK)
=========================== */
const mockMenuItems = [
  { id: 1, name: "Caesar Salad", price: 9.99, icon: "🥗", category: "Appetizers" },
  { id: 2, name: "Chicken Wings", price: 11.99, icon: "🍗", category: "Appetizers" },
  { id: 3, name: "French Fries", price: 5.99, icon: "🍟", category: "Appetizers" },
  { id: 4, name: "Garlic Bread", price: 4.99, icon: "🥖", category: "Appetizers" },
  { id: 5, name: "Classic Burger", price: 12.99, icon: "🍔", category: "Main Course" },
  { id: 6, name: "Grilled Salmon", price: 22.99, icon: "🐟", category: "Main Course" },
  { id: 7, name: "Pasta Carbonara", price: 15.99, icon: "🍝", category: "Main Course" },
  { id: 8, name: "Steak", price: 28.99, icon: "🥩", category: "Main Course" },
  { id: 9, name: "Margherita Pizza", price: 14.99, icon: "🍕", category: "Pizza" },
  { id: 10, name: "Pepperoni Pizza", price: 16.99, icon: "🍕", category: "Pizza" },
  { id: 11, name: "Cappuccino", price: 4.99, icon: "☕", category: "Beverages" },
  { id: 12, name: "Fresh Juice", price: 5.99, icon: "🧃", category: "Beverages" },
  { id: 13, name: "Chocolate Cake", price: 7.99, icon: "🍰", category: "Desserts" },
  { id: 14, name: "Ice Cream", price: 6.99, icon: "🍨", category: "Desserts" },
  { id: 15, name: "Beer", price: 6.99, icon: "🍺", category: "Drinks" },
  { id: 16, name: "Red Wine", price: 12.99, icon: "🍷", category: "Drinks" },
]

const tables = [
  { id: "1", status: "active", color: "bg-orange-500/20 text-orange-500 border-orange-500/50" },
  { id: "2", status: "empty", color: "bg-[#1e293b] text-slate-400 border-slate-700" },
  { id: "3", status: "empty", color: "bg-[#1e293b] text-slate-400 border-slate-700" },
  { id: "4", status: "empty", color: "bg-[#1e293b] text-slate-400 border-slate-700" },
  { id: "5", status: "selected", color: "bg-cyan-500 text-white border-cyan-500" },
  { id: "6", status: "empty", color: "bg-[#1e293b] text-slate-400 border-slate-700" },
  { id: "7", status: "empty", color: "bg-[#1e293b] text-slate-400 border-slate-700" },
  { id: "8", status: "empty", color: "bg-[#1e293b] text-slate-400 border-slate-700" },
  { id: "B1", status: "empty", color: "bg-[#1e293b] text-slate-400 border-slate-700" },
  { id: "B2", status: "empty", color: "bg-[#1e293b] text-slate-400 border-slate-700" },
  { id: "O1", status: "empty", color: "bg-[#1e293b] text-slate-400 border-slate-700" },
  { id: "O2", status: "empty", color: "bg-[#1e293b] text-slate-400 border-slate-700" },
  { id: "O3", status: "active", color: "bg-orange-500/20 text-orange-500 border-orange-500/50" },
  { id: "O4", status: "empty", color: "bg-[#1e293b] text-slate-400 border-slate-700" },
  { id: "V1", status: "empty", color: "bg-[#1e293b] text-slate-400 border-slate-700" },
  { id: "V2", status: "active", color: "bg-orange-500/20 text-orange-500 border-orange-500/50" },
]

const categories = ["All", "Appetizers", "Main Course", "Pizza", "Beverages", "Desserts", "Drinks"]

/* ===========================
  HELPERS
=========================== */
const peso = (n) => `₱${Number(n || 0).toFixed(2)}`

/**
 * Map backend products to menu item format
 * (so your UI only uses 1 structure)
 */
const mapProductsToMenu = (products) => {
  if (!Array.isArray(products) || products.length === 0) return []

  return products.map((p) => ({
    id: p.id,
    sku: p.sku ?? "",
    name: p.name ?? "Unnamed",
    price: Number(p.selling_price ?? 0),
    selling_price: Number(p.selling_price ?? 0), // keep compatibility
    current_stock: Number(p.current_stock ?? 0),
    category: p.category?.name ?? "Others",
    icon: "🛒",
  }))
}

export default function POS({ products = [] }) {
  const { auth } = usePage().props
  const [activeCategory, setActiveCategory] = useState("All")
  const [search, setSearch] = useState("")
  const [cart, setCart] = useState([])
  
  /* ===========================
    DATA SOURCE
  =========================== */
  const dynamicMenu = useMemo(() => mapProductsToMenu(products), [products])

  const menuItems = useMemo(() => {
    // if backend has products use it, else use mock
    return dynamicMenu.length > 0 ? dynamicMenu : mockMenuItems
  }, [dynamicMenu])

  const computedCategories = useMemo(() => {
    if (dynamicMenu.length === 0) return categories

    const unique = Array.from(new Set(menuItems.map((i) => i.category || "Others")))
    return ["All", ...unique]
  }, [dynamicMenu.length, menuItems])

  /* ===========================
    CART LOGIC
  =========================== */
  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id)
      if (existing) {
        return prev.map((i) => (i.id === item.id ? { ...i, qty: i.qty + 1 } : i))
      }
      return [...prev, { ...item, qty: 1, note: "" }]
    })
  }

  const updateQty = (id, qty) => {
    if (qty <= 0) {
      setCart((prev) => prev.filter((i) => i.id !== id))
      return
    }
    setCart((prev) => prev.map((i) => (i.id === id ? { ...i, qty } : i)))
  }

  const removeItem = (id) => {
    setCart((prev) => prev.filter((i) => i.id !== id))
  }

  const clearCart = () => setCart([])

  const updateNote = (id, note) => {
    setCart((prev) => prev.map((i) => (i.id === id ? { ...i, note } : i)))
  }

  /* ===========================
    FILTER
  =========================== */
  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesCategory =
        activeCategory === "All" || (item.category || "Others") === activeCategory

      const keyword = search.trim().toLowerCase()
      const matchesSearch =
        keyword.length === 0 ||
        item.name.toLowerCase().includes(keyword) ||
        (item.sku || "").toLowerCase().includes(keyword)

      return matchesCategory && matchesSearch
    })
  }, [menuItems, activeCategory, search])

  /* ===========================
    TOTALS
  =========================== */
  const newItemsSubtotal = useMemo(() => {
    return cart.reduce((sum, i) => sum + Number(i.price || i.selling_price || 0) * i.qty, 0)
  }, [cart])

  const taxRate = 0.1
  const tax = newItemsSubtotal * taxRate

  // You can replace this later with actual previous order total per table
  const previousOrderTotal = 0

  const grandTotal = newItemsSubtotal + tax + previousOrderTotal

  return (
    <AuthenticatedLayout>
      <Head title="Point of Sale" />
  
      <div className="flex h-[calc(100vh-100px)] bg-background text-foreground">
        {/* Main Content */}
        <main className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <header className="h-16 px-2 flex items-center justify-between border-b bg-background">
            <span className="flex flex-row gap-2 items-center">
              <h2 className="text-lg font-semibold">Welcome back,</h2>
              <p className="font-semibold">{auth?.user?.first_name} {auth?.user?.last_name}!</p>
            </span>
            <span className="text-xs text-muted-foreground">
              {new Date().toLocaleDateString(undefined, {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </header>
  
          {/* Action Bar */}
          <div className="py-4 px-2 space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 h-10 text-sm"
                  placeholder="Search products / Scan barcode..."
                  autoFocus
                />
              </div>
  
              <div className="flex bg-muted p-1 rounded-lg">
                <Button size="sm" className="rounded-md px-4">
                  Dine In
                </Button>
                <Button size="sm" variant="ghost" className="rounded-md px-4 text-muted-foreground">
                  Takeaway
                </Button>
                <Button size="sm" variant="ghost" className="rounded-md px-4 text-muted-foreground">
                  Delivery
                </Button>
              </div>
            </div>
  
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground font-medium">Select Table</span>
                <span className="text-[10px] text-primary font-medium">(Mock tables for now)</span>
              </div>
  
              <div className="flex flex-wrap gap-2">
                {tables.map((table) => (
                  <div
                    key={table.id}
                    className="relative w-10 h-8 rounded-md flex items-center justify-center text-[11px] font-bold border bg-muted text-muted-foreground cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    <UtensilsCrossed className="w-3 h-3 mr-0.5 opacity-70" />
                    {table.id}
  
                    {table.status === "active" && (
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full border border-background" />
                    )}
                  </div>
                ))}
              </div>
            </div>
  
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
              {computedCategories.map((cat) => (
                <Button
                  key={cat}
                  variant={activeCategory === cat ? "default" : "secondary"}
                  size="sm"
                  onClick={() => setActiveCategory(cat)}
                  className="text-xs px-4 h-8 rounded-lg whitespace-nowrap"
                >
                  {cat}
                </Button>
              ))}
            </div>
          </div>
  
          {/* Grid Area */}
          <ScrollArea className="flex-1 px-2">
            <div className="grid grid-cols-4 gap-4 pb-4">
              {filteredItems.map((item) => (
                <Card
                  key={item.id}
                  onClick={() => addToCart(item)}
                  className="p-4 cursor-pointer hover:border-primary/50 transition-all"
                >
                  <div className="text-3xl mb-3">{item.icon || "🛒"}</div>
  
                  <div className="space-y-1">
                    <h3 className="text-sm font-semibold">{item.name}</h3>
  
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold text-primary">
                        {peso(item.price ?? item.selling_price)}
                      </p>
  
                      {typeof item.current_stock === "number" && (
                        <Badge variant="outline" className="text-[10px]">
                          {item.current_stock}
                        </Badge>
                      )}
                    </div>
  
                    {item.sku && (
                      <p className="text-[10px] text-muted-foreground">SKU: {item.sku}</p>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </main>
  
        {/* Right Sidebar - Order Summary */}
        <aside className="w-[380px] border-l bg-background flex flex-col">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-primary/10 rounded">
                  <UtensilsCrossed className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-sm font-bold">Add to Order</h2>
                  <p className="text-[10px] text-muted-foreground">
                    New Items:{" "}
                    <span className="text-primary font-bold">{cart.length}</span>
                  </p>
                </div>
              </div>
  
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={clearCart}
                  disabled={cart.length === 0}
                  title="Clear cart"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
  
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground"
                  onClick={() => clearCart()}
                  title="Close (mock)"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
  
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-6">
              <section>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
                    NEW ITEMS
                  </h3>
  
                  <Badge variant="outline" className="text-[10px]">
                    Pending
                  </Badge>
                </div>
  
                {cart.length === 0 ? (
                  <div className="text-xs text-muted-foreground text-center py-8">
                    No items yet. Click a product to add.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {cart.map((item) => (
                      <div key={item.id} className="border rounded-xl p-3 bg-muted/40">
                        <div className="flex items-center justify-between">
                          <div className="flex gap-3">
                            <span className="text-xl">{item.icon || "🛒"}</span>
                            <div className="space-y-0.5">
                              <p className="text-xs font-bold">{item.name}</p>
                              <p className="text-[11px] font-semibold text-primary">
                                {peso(item.price ?? item.selling_price)}
                              </p>
                            </div>
                          </div>
  
                          <div className="flex items-center gap-2 bg-background rounded-lg p-1 border">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-muted-foreground"
                              onClick={() => updateQty(item.id, item.qty - 1)}
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
  
                            <span className="text-xs font-bold w-4 text-center">{item.qty}</span>
  
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-muted-foreground"
                              onClick={() => updateQty(item.id, item.qty + 1)}
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
  
                            <Separator orientation="vertical" className="h-4 mx-1" />
  
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-muted-foreground hover:text-destructive"
                              onClick={() => removeItem(item.id)}
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
  
                        <div className="mt-3 flex items-center gap-2 bg-background rounded px-2 py-1.5 border">
                          <ClipboardList className="w-3 h-3 text-muted-foreground" />
                          <input
                            value={item.note || ""}
                            onChange={(e) => updateNote(item.id, e.target.value)}
                            className="bg-transparent border-none text-[10px] text-muted-foreground focus:outline-none w-full"
                            placeholder="Add note for kitchen..."
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>
          </ScrollArea>
  
          {/* Footer Billing */}
          <div className="p-4 bg-muted/30 border-t space-y-3">
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] text-muted-foreground">
                <span>New Items</span>
                <span className="text-foreground">{peso(newItemsSubtotal)}</span>
              </div>
              <div className="flex justify-between text-[11px] text-muted-foreground">
                <span>Tax (10%)</span>
                <span className="text-foreground">{peso(tax)}</span>
              </div>
              <div className="flex justify-between text-[11px] text-muted-foreground">
                <span>Previous Order</span>
                <span className="text-foreground">{peso(previousOrderTotal)}</span>
              </div>
            </div>
  
            <div className="flex justify-between items-end pt-2">
              <span className="text-sm font-bold uppercase tracking-tight">Total</span>
              <span className="text-xl font-black">{peso(grandTotal)}</span>
            </div>
  
            <div className="grid gap-2 pt-2">
              <Button
                disabled={cart.length === 0}
                className="w-full h-11 rounded-xl gap-2"
                onClick={() => alert("Send to Kitchen (mock). Replace with API call.")}
              >
                <Send className="w-4 h-4" />
                Send to Kitchen
              </Button>
  
              <Button
                disabled={cart.length === 0}
                variant="secondary"
                className="w-full h-11 rounded-xl gap-2"
                onClick={() => alert("Pay Now (mock). Replace with CheckoutModal or API.")}
              >
                <Wallet className="w-4 h-4" />
                Pay Now {peso(grandTotal)}
              </Button>
            </div>
          </div>
        </aside>
      </div>
    </AuthenticatedLayout>
  )
}