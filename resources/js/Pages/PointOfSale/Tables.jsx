import React, { useState } from 'react';
import { 
  UtensilsCrossed, 
  Users, 
  Clock, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical,
  LayoutDashboard,
  ClipboardList,
  ChefHat,
  LogOut,
  Map as MapIcon,
  MousePointer2
} from 'lucide-react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

const sections = ["Main Hall", "Bar Area", "Outdoor", "VIP Room"];

const tablesData = [
  { id: "1", seats: 4, status: "occupied", orderId: "ORD-011", time: "45m", section: "Main Hall" },
  { id: "2", seats: 2, status: "available", section: "Main Hall" },
  { id: "3", seats: 2, status: "available", section: "Main Hall" },
  { id: "4", seats: 4, status: "available", section: "Main Hall" },
  { id: "5", seats: 6, status: "selected", section: "Main Hall" },
  { id: "B1", seats: 1, status: "occupied", orderId: "ORD-015", time: "12m", section: "Bar Area" },
  { id: "B2", seats: 1, status: "available", section: "Bar Area" },
  { id: "O1", seats: 4, status: "dirty", section: "Outdoor" },
  { id: "V1", seats: 8, status: "reserved", time: "19:30", section: "VIP Room" },
];

export default function TablesManagement() {
  const [activeSection, setActiveSection] = useState("Main Hall");

  const getStatusStyles = (status) => {
    switch (status) {
      case 'occupied': return 'border-orange-500/50 bg-orange-500/10 text-orange-500';
      case 'selected': return 'border-cyan-500 bg-cyan-500 text-white';
      case 'dirty': return 'border-yellow-500/50 bg-yellow-500/10 text-yellow-500';
      case 'reserved': return 'border-purple-500/50 bg-purple-500/10 text-purple-500';
      default: return 'border-border bg-card text-muted-foreground hover:border-muted-foreground/50';
    }
  };

  return (
    <AuthenticatedLayout>
      <Head title='Tables' />

      <div className="flex h-[calc(100vh-100px)] bg-background text-foreground">
        {/* Main Content */}
        <main className="flex-1 flex flex-col bg-background overflow-hidden">
          <header className="h-16 flex items-center justify-between px-2 border-b border-border">
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-bold">Floor Plan</h2>
              <div className="flex bg-muted p-1 rounded-lg border border-border">
                {sections.map(section => (
                  <Button 
                    key={section}
                    size="sm" 
                    variant={activeSection === section ? "default" : "ghost"}
                    onClick={() => setActiveSection(section)}
                    className={`h-7 px-3 text-[11px] font-bold ${activeSection === section ? 'bg-cyan-500 text-white' : 'text-muted-foreground'}`}
                  >
                    {section}
                  </Button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="h-9 gap-2 border-border text-xs font-bold">
                <MousePointer2 className="w-4 h-4" /> Edit Layout
              </Button>
              <Button className="h-9 bg-cyan-500 hover:bg-cyan-600 text-xs font-bold gap-2">
                <Plus className="w-4 h-4" /> Add Table
              </Button>
            </div>
          </header>

          <div className="p-2 flex-1 flex flex-col gap-4 overflow-hidden">
            {/* Stats Bar */}
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: "Total Tables", value: "24", color: "text-foreground" },
                { label: "Occupied", value: "12", color: "text-orange-500" },
                { label: "Available", value: "10", color: "text-green-500" },
                { label: "Reserved", value: "2", color: "text-purple-500" },
              ].map((stat, i) => (
                <Card key={i} className="p-4 bg-card border-border flex flex-col gap-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{stat.label}</span>
                  <span className={`text-2xl font-black ${stat.color}`}>{stat.value}</span>
                </Card>
              ))}
            </div>

            {/* Table Grid Area */}
            <div className="flex-1 bg-muted/30 rounded-2xl border border-dashed border-border p-2 relative overflow-auto">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
                {tablesData.filter(t => t.section === activeSection || activeSection === "Main Hall").map((table) => (
                  <div key={table.id} className="relative group">
                    <Card className={`aspect-square w-32 flex flex-col items-center justify-center border-2 transition-all cursor-pointer shadow-sm relative ${getStatusStyles(table.status)}`}>
                      <span className="text-2xl font-black">{table.id}</span>
                      <div className="flex items-center gap-1 mt-1 opacity-70">
                        <Users className="w-3 h-3" />
                        <span className="text-[10px] font-bold">{table.seats} Seats</span>
                      </div>
                      
                      {table.time && (
                        <div className="absolute -bottom-2 bg-background border border-border px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                          <Clock className="w-2.5 h-2.5 text-muted-foreground" />
                          <span className="text-[9px] font-bold text-foreground">{table.time}</span>
                        </div>
                      )}

                      <div className="absolute top-2 right-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity">
                              <MoreVertical className="w-3 h-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem className="text-xs font-bold">Quick Order</DropdownMenuItem>
                            <DropdownMenuItem className="text-xs font-bold">Reserve Table</DropdownMenuItem>
                            <DropdownMenuItem className="text-xs font-bold">Transfer Table</DropdownMenuItem>
                            <Separator className="my-1" />
                            <DropdownMenuItem className="text-xs font-bold text-red-500">Mark as Dirty</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </Card>
                    
                    {/* Status Indicator Dot */}
                    <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-background ${
                      table.status === 'occupied' ? 'bg-orange-500' : 
                      table.status === 'available' ? 'bg-green-500' : 
                      table.status === 'dirty' ? 'bg-yellow-500' : 'bg-transparent'
                    }`} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>

        {/* Right Sidebar - Table Details / Quick View */}
        <aside className="w-[320px] border-l border-border bg-card flex flex-col">
          <div className="p-6 border-b border-border">
            <h3 className="text-sm font-black uppercase tracking-widest mb-4">Table Details</h3>
            <div className="bg-muted/50 rounded-xl p-4 border border-border">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-4xl font-black text-cyan-500">T5</span>
                  <p className="text-xs font-bold text-muted-foreground">Main Hall Section</p>
                </div>
                <Badge className="bg-orange-500/10 text-orange-500 border-none">In Use</Badge>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground font-medium">Current Order</span>
                  <span className="font-bold text-cyan-500">#ORD-010</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground font-medium">Seated at</span>
                  <span className="font-bold">08:45 PM</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground font-medium">Guests</span>
                  <span className="font-bold">4 People</span>
                </div>
              </div>
            </div>
          </div>

          <ScrollArea className="flex-1 p-6">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">Live Order Preview</h4>
            <div className="space-y-4">
                {[
                  { name: "Margherita Pizza", qty: 1, price: 14.99 },
                  { name: "Coke Zero", qty: 2, price: 5.00 },
                  { name: "Garlic Bread", qty: 1, price: 4.99 },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold">{item.name}</span>
                      <span className="text-[10px] text-muted-foreground">Qty: {item.qty}</span>
                    </div>
                    <span className="text-xs font-black">${item.price.toFixed(2)}</span>
                  </div>
                ))}
            </div>
          </ScrollArea>

          <div className="p-6 border-t border-border bg-muted/10 space-y-3">
            <div className="flex justify-between items-end mb-2">
              <span className="text-xs font-bold text-muted-foreground uppercase">Current Total</span>
              <span className="text-xl font-black">$24.98</span>
            </div>
            <Button className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold h-11 rounded-xl gap-2">
              Go to POS Order
            </Button>
            <Button variant="outline" className="w-full h-11 border-border font-bold">
              Print Bill Preview
            </Button>
          </div>
        </aside>
      </div>
    </AuthenticatedLayout>
  );
}