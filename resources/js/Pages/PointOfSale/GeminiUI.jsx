import React, { useState } from 'react';
import { 
  Search, 
  Trash2, 
  Plus, 
  Minus, 
  X, 
  UtensilsCrossed, 
  ClipboardList, 
  Send, 
  Wallet 
} from 'lucide-react';
import { Card } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Badge } from "@/Components/ui/badge";
import { Separator } from "@/Components/ui/separator";
import { ScrollArea } from "@/Components/ui/scroll-area";

const menuItems = [
  { id: 1, name: 'Caesar Salad', price: 9.99, icon: '🥗', category: 'Appetizers' },
  { id: 2, name: 'Chicken Wings', price: 11.99, icon: '🍗', category: 'Appetizers' },
  { id: 3, name: 'French Fries', price: 5.99, icon: '🍟', category: 'Appetizers' },
  { id: 4, name: 'Garlic Bread', price: 4.99, icon: '🥖', category: 'Appetizers' },
  { id: 5, name: 'Classic Burger', price: 12.99, icon: '🍔', category: 'Main Course' },
  { id: 6, name: 'Grilled Salmon', price: 22.99, icon: '🐟', category: 'Main Course' },
  { id: 7, name: 'Pasta Carbonara', price: 15.99, icon: '🍝', category: 'Main Course' },
  { id: 8, name: 'Steak', price: 28.99, icon: '🥩', category: 'Main Course' },
  { id: 9, name: 'Margherita Pizza', price: 14.99, icon: '🍕', category: 'Pizza' },
  { id: 10, name: 'Pepperoni Pizza', price: 16.99, icon: '🍕', category: 'Pizza' },
  { id: 11, name: 'Cappuccino', price: 4.99, icon: '☕', category: 'Beverages' },
  { id: 12, name: 'Fresh Juice', price: 5.99, icon: '🧃', category: 'Beverages' },
  { id: 13, name: 'Chocolate Cake', price: 7.99, icon: '🍰', category: 'Desserts' },
  { id: 14, name: 'Ice Cream', price: 6.99, icon: '🍨', category: 'Desserts' },
  { id: 15, name: 'Beer', price: 6.99, icon: '🍺', category: 'Drinks' },
  { id: 16, name: 'Red Wine', price: 12.99, icon: '🍷', category: 'Drinks' },
];

const tables = [
  { id: '1', status: 'active', color: 'bg-orange-500/20 text-orange-500 border-orange-500/50' },
  { id: '2', status: 'empty', color: 'bg-[#1e293b] text-slate-400 border-slate-700' },
  { id: '3', status: 'empty', color: 'bg-[#1e293b] text-slate-400 border-slate-700' },
  { id: '4', status: 'empty', color: 'bg-[#1e293b] text-slate-400 border-slate-700' },
  { id: '5', status: 'selected', color: 'bg-cyan-500 text-white border-cyan-500' },
  { id: '6', status: 'empty', color: 'bg-[#1e293b] text-slate-400 border-slate-700' },
  { id: '7', status: 'empty', color: 'bg-[#1e293b] text-slate-400 border-slate-700' },
  { id: '8', status: 'empty', color: 'bg-[#1e293b] text-slate-400 border-slate-700' },
  { id: 'B1', status: 'empty', color: 'bg-[#1e293b] text-slate-400 border-slate-700' },
  { id: 'B2', status: 'empty', color: 'bg-[#1e293b] text-slate-400 border-slate-700' },
  { id: 'O1', status: 'empty', color: 'bg-[#1e293b] text-slate-400 border-slate-700' },
  { id: 'O2', status: 'empty', color: 'bg-[#1e293b] text-slate-400 border-slate-700' },
  { id: 'O3', status: 'active', color: 'bg-orange-500/20 text-orange-500 border-orange-500/50' },
  { id: 'O4', status: 'empty', color: 'bg-[#1e293b] text-slate-400 border-slate-700' },
  { id: 'V1', status: 'empty', color: 'bg-[#1e293b] text-slate-400 border-slate-700' },
  { id: 'V2', status: 'active', color: 'bg-orange-500/20 text-orange-500 border-orange-500/50' },
];

const categories = ['All', 'Appetizers', 'Main Course', 'Pizza', 'Beverages', 'Desserts', 'Drinks'];

export default function GeminiUI() {
  const [activeCategory, setActiveCategory] = useState('All');

  return (
    <div className="flex h-[calc(100vh-100px)] text-slate-200">
      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
          <h2 className="text-lg font-semibold">Welcome back, Sarah!</h2>
          <span className="text-xs text-slate-500">Wednesday, January 7, 2026</span>
        </header>

        {/* Action Bar */}
        <div className="p-4 space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <Input 
                className="bg-[#1e293b] border-slate-700 pl-10 h-10 text-sm focus-visible:ring-cyan-500/50" 
                placeholder="Search products..." 
              />
            </div>
            <div className="flex bg-[#1e293b] p-1 rounded-lg">
              <Button size="sm" className="bg-cyan-500 hover:bg-cyan-600 text-white rounded-md px-4">Dine In</Button>
              <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white rounded-md px-4">Takeaway</Button>
              <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white rounded-md px-4">Delivery</Button>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Select Table</span>
              <span className="text-[10px] text-cyan-400 font-medium">(Table 5 has active order)</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {tables.map((table) => (
                <div 
                  key={table.id}
                  className={`w-10 h-8 rounded flex items-center justify-center text-[11px] font-bold border cursor-pointer transition-colors ${table.color}`}
                >
                  <UtensilsCrossed className="w-3 h-3 mr-0.5 opacity-70" />
                  {table.id}
                  {table.status === 'active' && <div className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full border border-[#0f172a]" />}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {categories.map((cat) => (
              <Button
                key={cat}
                variant="ghost"
                size="sm"
                onClick={() => setActiveCategory(cat)}
                className={`text-xs px-4 h-8 rounded-lg whitespace-nowrap transition-all ${
                  activeCategory === cat 
                  ? 'bg-cyan-500 text-white hover:bg-cyan-600' 
                  : 'bg-[#1e293b] text-slate-400 hover:bg-slate-700 hover:text-white'
                }`}
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>

        {/* Grid Area */}
        <ScrollArea className="flex-1 px-4">
          <div className="grid grid-cols-4 gap-4 pb-4">
            {menuItems.map((item) => (
              <Card key={item.id} className="bg-[#1e293b] border-slate-700 p-4 hover:border-cyan-500/50 cursor-pointer group transition-all">
                <div className="text-3xl mb-3">{item.icon}</div>
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold text-slate-200 group-hover:text-white">{item.name}</h3>
                  <p className="text-sm font-bold text-cyan-400">${item.price.toFixed(2)}</p>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </main>

      {/* Right Sidebar - Order Summary */}
      <aside className="w-[380px] border-l border-slate-800 flex flex-col">
        <div className="p-4 border-b border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-cyan-500/10 rounded">
                <UtensilsCrossed className="w-5 h-5 text-cyan-500" />
              </div>
              <div>
                <h2 className="text-sm font-bold">Add to Order</h2>
                <p className="text-[10px] text-slate-500">Table 5 - <span className="text-orange-500 font-bold">Active Order #ORD-010</span></p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-red-400">
                <Trash2 className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-white">
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-6">
            <section>
              <h3 className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-3">ALREADY ORDERED</h3>
              <div className="space-y-4">
                {[
                  { name: 'Caesar Salad', price: 9.99, qty: 1, mod: 'CUT', icon: '🥗' },
                  { name: 'Garlic Bread', price: 14.97, qty: 3, icon: '🥖' },
                  { name: 'Grilled Salmon', price: 22.99, qty: 1, icon: '🐟' },
                  { name: 'Steak', price: 28.99, qty: 1, icon: '🥩' },
                  { name: 'Fresh Juice', price: 5.99, qty: 1, icon: '🧃' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start justify-between group">
                    <div className="flex gap-3">
                      <span className="text-lg">{item.icon}</span>
                      <div className="space-y-0.5">
                        <p className="text-xs font-medium text-slate-300">{item.name}</p>
                        {item.mod && <p className="text-[10px] text-slate-500 flex items-center gap-1"><UtensilsCrossed className="w-2.5 h-2.5" /> {item.mod}</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] text-slate-500">×{item.qty}</span>
                      <span className="text-xs font-semibold text-cyan-400">${item.price.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <Separator className="bg-slate-800" />

            <section>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">NEW ITEMS</h3>
                <Badge variant="outline" className="text-[10px] border-cyan-500/30 text-cyan-400 bg-cyan-500/5 px-1.5 py-0">Pending</Badge>
              </div>
              
              <div className="bg-[#1e293b]/50 border border-cyan-500/20 rounded-xl p-3">
                <div className="flex items-center justify-between">
                  <div className="flex gap-3">
                    <span className="text-xl">🍺</span>
                    <div className="space-y-0.5">
                      <p className="text-xs font-bold text-slate-200">Beer</p>
                      <p className="text-[11px] font-semibold text-cyan-400">$6.99</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-[#0f172a] rounded-lg p-1">
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-500 hover:text-white">
                      <Minus className="w-3 h-3" />
                    </Button>
                    <span className="text-xs font-bold w-4 text-center">1</span>
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-500 hover:text-white">
                      <Plus className="w-3 h-3" />
                    </Button>
                    <Separator orientation="vertical" className="h-4 bg-slate-700 mx-1" />
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-500 hover:text-red-400">
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2 bg-[#0f172a] rounded px-2 py-1.5 border border-slate-700/50">
                  <ClipboardList className="w-3 h-3 text-slate-500" />
                  <input className="bg-transparent border-none text-[10px] text-slate-400 focus:outline-none w-full" placeholder="Add note for kitchen..." />
                </div>
              </div>
            </section>
          </div>
        </ScrollArea>

        {/* Footer Billing */}
        <div className="p-4 bg-[#1e293b]/30 border-t border-slate-800 space-y-3">
          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>New Items</span>
              <span className="text-slate-300">$6.99</span>
            </div>
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>Tax (10%)</span>
              <span className="text-slate-300">$0.70</span>
            </div>
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>Previous Order</span>
              <span className="text-slate-300">$91.22</span>
            </div>
          </div>
          
          <div className="flex justify-between items-end pt-2">
            <span className="text-sm font-bold text-slate-200 uppercase tracking-tight">Total</span>
            <span className="text-xl font-black text-white">$98.91</span>
          </div>

          <div className="grid gap-2 pt-2">
            <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold h-11 rounded-xl shadow-lg shadow-orange-950/20 gap-2">
              <Send className="w-4 h-4" />
              Send to Kitchen
            </Button>
            <Button className="w-full bg-white hover:bg-slate-100 text-slate-900 font-bold h-11 rounded-xl shadow-lg gap-2">
              <Wallet className="w-4 h-4" />
              Pay Now $98.91
            </Button>
          </div>
        </div>
      </aside>
    </div>
  );
}