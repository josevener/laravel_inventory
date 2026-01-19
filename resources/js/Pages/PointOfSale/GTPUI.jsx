import React from "react"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  ShoppingCart,
  Search,
  Utensils,
  Package,
  Bike,
  Beer,
  Coffee,
  Pizza,
  Cake,
  IceCream,
  Fish,
  Drumstick,
  Salad,
  Sandwich,
  Wine,
  Trash2,
  Minus,
  Plus,
} from "lucide-react"

export default function GPTUI() {
  const categories = [
    "All",
    "Appetizers",
    "Main Course",
    "Pizza",
    "Beverages",
    "Desserts",
    "Drinks",
  ]

  const products = [
    { name: "Caesar Salad", price: 9.99, icon: Salad },
    { name: "Chicken Wings", price: 11.99, icon: Drumstick },
    { name: "French Fries", price: 5.99, icon: Package },
    { name: "Garlic Bread", price: 4.99, icon: Sandwich },
    { name: "Classic Burger", price: 12.99, icon: Sandwich },
    { name: "Grilled Salmon", price: 22.99, icon: Fish },
    { name: "Pasta Carbonara", price: 15.99, icon: Package },
    { name: "Steak", price: 28.99, icon: Package },
    { name: "Margherita Pizza", price: 14.99, icon: Pizza },
    { name: "Pepperoni Pizza", price: 16.99, icon: Pizza },
    { name: "Cappuccino", price: 4.99, icon: Coffee },
    { name: "Fresh Juice", price: 5.99, icon: Package },
    { name: "Chocolate Cake", price: 7.99, icon: Cake },
    { name: "Ice Cream", price: 6.99, icon: IceCream },
    { name: "Beer", price: 6.99, icon: Beer },
    { name: "Red Wine", price: 12.99, icon: Wine },
  ]

  return (
    <div className="flex h-[calc(100vh-100px)] bg-[#0B1220] text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0E1628] flex flex-col p-4 gap-4">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <Utensils className="h-6 w-6 text-cyan-400" />
          TanStack POS
        </div>

        <nav className="flex flex-col gap-2">
          <Button variant="secondary" className="justify-start bg-[#14203A]">
            POS
          </Button>
          <Button variant="ghost" className="justify-start">
            Orders
          </Button>
          <Button variant="ghost" className="justify-start">
            Tables
          </Button>
        </nav>

        <div className="mt-auto text-sm opacity-70">
          <Separator className="my-3" />
          Sarah Server
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6 flex gap-6 overflow-hidden">
        {/* Center */}
        <div className="flex-1 flex flex-col gap-4 overflow-hidden">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold">Welcome back, Sarah!</h1>
            <span className="text-sm opacity-60">
              Wednesday, January 7, 2026
            </span>
          </div>

          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50" />
              <Input
                className="pl-9 bg-[#0E1628] border-[#1E2A4A]"
                placeholder="Search products..."
              />
            </div>

            <Button className="bg-cyan-500 hover:bg-cyan-600">Dine In</Button>
            <Button variant="secondary">Takeaway</Button>
            <Button variant="secondary">Delivery</Button>
          </div>

          <div className="flex gap-2">
            {categories.map((cat, i) => (
              <Button
                key={cat}
                variant={i === 0 ? "default" : "secondary"}
                className={i === 0 ? "bg-cyan-500" : ""}
              >
                {cat}
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-4 gap-4 overflow-y-auto pr-2">
            {products.map((p) => (
              <Card
                key={p.name}
                className="bg-[#0E1628] border-[#1E2A4A] hover:border-cyan-400 transition"
              >
                <CardContent className="p-4 flex flex-col gap-3">
                  <p.icon className="h-6 w-6 text-cyan-400" />
                  <div>
                    <div className="font-medium">{p.name}</div>
                    <div className="text-cyan-400 text-sm">
                      ${p.price.toFixed(2)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Order Panel */}
        <aside className="w-96 bg-[#0E1628] rounded-xl border border-[#1E2A4A] flex flex-col">
          <div className="p-4 flex items-center gap-2 font-semibold">
            <ShoppingCart className="h-5 w-5 text-cyan-400" />
            Add to Order
          </div>

          <Separator />

          <div className="p-4 flex flex-col gap-3 flex-1 overflow-y-auto">
            <div className="text-sm opacity-70">Already Ordered</div>

            {["Caesar Salad", "Garlic Bread", "Grilled Salmon"].map((item) => (
              <div
                key={item}
                className="flex items-center justify-between text-sm"
              >
                <span>{item}</span>
                <span className="opacity-60">$9.99</span>
              </div>
            ))}

            <Separator />

            <div className="text-sm opacity-70">New Items</div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Beer className="h-5 w-5 text-cyan-400" />
                Beer
              </div>
              <div className="flex items-center gap-2">
                <Button size="icon" variant="secondary">
                  <Minus className="h-4 w-4" />
                </Button>
                <span>1</span>
                <Button size="icon" variant="secondary">
                  <Plus className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <Separator />

          <div className="p-4 flex flex-col gap-3 text-sm">
            <div className="flex justify-between">
              <span>New Items</span>
              <span>$6.99</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (10%)</span>
              <span>$0.70</span>
            </div>
            <div className="flex justify-between font-semibold text-base">
              <span>Total</span>
              <span>$98.91</span>
            </div>

            <Button className="bg-orange-500 hover:bg-orange-600">
              Send to Kitchen
            </Button>
            <Button className="bg-green-500 hover:bg-green-600">
              Pay Now $98.91
            </Button>
          </div>
        </aside>
      </main>
    </div>
  )
}