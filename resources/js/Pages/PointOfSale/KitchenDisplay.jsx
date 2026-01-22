import React, { useState } from 'react';
import {
  ChefHat,
  Volume2,
  Bell,
  Utensils,
  Coffee,
  Clock,
  CheckCircle2,
  X,
  Flame,
  Check,
  LogOut,
  ChevronLeft,
  LayoutDashboard
} from 'lucide-react';
import { Card } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { ScrollArea } from "@/Components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/Components/ui/avatar";
import { Separator } from "@/Components/ui/separator";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

const orders = [
  {
    id: "ORD-011",
    table: "O3",
    type: "Dine In",
    time: "10 mins",
    progress: 33,
    statusColor: "bg-orange-500",
    items: [
      { name: "Beer", qty: 1, time: "09:36 PM", server: "Sarah Server", status: "ready" },
      { name: "Caesar Salad", qty: 1, time: "09:36 PM", server: "Sarah Server", status: "preparing" },
      { name: "Garlic Bread", qty: 1, time: "09:36 PM", server: "Sarah Server", status: "preparing" },
      { name: "Fresh Juice", qty: 1, time: "09:36 PM", server: "Sarah Server", status: "served" },
      { name: "Margherita Pizza", qty: 1, time: "09:36 PM", server: "Sarah Server", status: "pending" },
      { name: "Pasta Carbonara", qty: 1, time: "09:36 PM", server: "Sarah Server", status: "pending" },
    ]
  },
  {
    id: "ORD-012",
    table: "V2",
    type: "Dine In",
    time: "9 mins",
    progress: 33,
    statusColor: "bg-orange-500",
    items: [
      { name: "Garlic Bread", qty: 1, time: "09:37 PM", server: "Sarah Server", status: "preparing" },
      { name: "Pepperoni Pizza", qty: 1, time: "09:37 PM", server: "Sarah Server", status: "pending" },
      { name: "Beer", qty: 1, time: "09:37 PM", server: "Sarah Server", status: "ready" },
    ]
  },
  {
    id: "ORD-013",
    table: "1",
    type: "Dine In",
    time: "8 mins",
    progress: 100,
    statusColor: "bg-green-500",
    items: [
      { name: "Beer", qty: 1, time: "09:38 PM", server: "Sarah Server", status: "ready" },
      { name: "Red Wine", qty: 1, time: "09:38 PM", server: "Sarah Server", status: "ready" },
    ]
  }
];

export default function KitchenDisplay() {
  const [activeTab, setActiveTab] = useState('All Orders');

  const getStatusBadge = (status) => {
    switch (status) {
      case 'ready':
        return (
          <div className="flex items-center gap-1.5">
            <Badge className="bg-green-500/10 text-green-500 border-none text-[10px] h-5 hover:bg-green-500/10">ready</Badge>
            <div className="bg-green-500 rounded-full p-0.5"><Check className="w-3 h-3 text-white" /></div>
          </div>
        );
      case 'preparing':
        return (
          <div className="flex items-center gap-1.5">
            <Badge className="bg-blue-500/10 text-blue-400 border-none text-[10px] h-5 hover:bg-blue-500/10">preparing</Badge>
            <div className="border border-slate-600 rounded-full p-0.5"><Check className="w-3 h-3 text-slate-500" /></div>
          </div>
        );
      case 'pending':
        return (
          <div className="flex items-center gap-1">
            <Badge className="bg-orange-500/10 text-orange-400 border-none text-[10px] h-5 hover:bg-orange-500/10">pending</Badge>
            <Button size="icon" variant="ghost" className="h-6 w-6 text-red-500/50 hover:text-red-500 bg-red-500/10"><X className="w-3 h-3" /></Button>
            <Button size="icon" variant="ghost" className="h-6 w-6 text-slate-400 bg-slate-800"><Flame className="w-3 h-3" /></Button>
          </div>
        );
      case 'served':
        return <Badge variant="outline" className="text-[10px] h-5 text-slate-500 border-slate-700">served</Badge>;
      default:
        return null;
    }
  };

  return (
    <AuthenticatedLayout>
      <Head title="Kitchen Display" />

      <div className="flex h-[calc(100vh-100px)] bg-background text-foreground">
        {/* Sidebar */}
        {/* <aside className="w-[240px] border-r border-border flex flex-col p-4 space-y-8 bg-card">
          <div className="flex items-center gap-2 px-2">
            <div className="bg-blue-600 p-1.5 rounded-md shadow-sm">
              <Utensils className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold leading-tight">TanStack POS</h1>
              <p className="text-[10px] text-muted-foreground">Restaurant Management</p>
            </div>
          </div>

          <nav className="flex-1">
            <Button variant="ghost" className="w-full justify-start gap-3 bg-cyan-500/10 text-cyan-500 hover:bg-cyan-500/15 hover:text-cyan-500 border-r-2 border-cyan-500 rounded-none">
              <ChefHat className="w-4 h-4" />
              <span className="text-sm font-medium">Kitchen</span>
            </Button>
          </nav>

          <div className="mt-auto space-y-4">
            <div className="flex items-center gap-3 px-2">
              <Avatar className="h-9 w-9 border border-border">
                <AvatarFallback className="bg-muted text-xs font-bold">C</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-xs font-semibold">Chef Gordon</span>
                <Badge className="text-[9px] h-4 bg-orange-600/20 text-orange-500 hover:bg-orange-600/20 border-none px-1">Kitchen Staff</Badge>
              </div>
              <div className="ml-auto">
                  <ChevronLeft className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>
            <Button variant="outline" className="w-full justify-start gap-3 border-border hover:bg-accent px-2 text-muted-foreground">
              <LogOut className="w-4 h-4" />
              <span className="text-sm">Sign Out</span>
            </Button>
          </div>
        </aside> */}

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-w-0 bg-background">
          {/* Header */}
          <header className="h-16 flex items-center justify-between px-4 border-b border-border">
            <h2 className="text-lg font-bold">Welcome back, Chef!</h2>
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
          <div className="p-4 pb-4 flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="bg-cyan-500/10 p-1.5 rounded-lg">
                  <ChefHat className="w-5 h-5 text-cyan-500" />
                </div>
                <h1 className="text-2xl font-black tracking-tight">Kitchen Display</h1>
              </div>
              <p className="text-xs text-muted-foreground">Manage and track order preparation</p>
            </div>

            <div className="flex items-center gap-3">
              <Button size="icon" variant="secondary" className="bg-green-500/10 text-green-500 hover:bg-green-500/20 h-9 w-9">
                  <Volume2 className="w-4 h-4" />
              </Button>
              
              <div className="flex bg-muted p-1 rounded-lg border border-border">
                  <Button size="sm" className="bg-cyan-500 hover:bg-cyan-600 text-white h-7 px-3 text-[11px] font-bold">All</Button>
                  <Button size="sm" variant="ghost" className="h-7 px-3 text-[11px] font-bold text-muted-foreground gap-1.5"><Utensils className="w-3 h-3"/> Food</Button>
                  <Button size="sm" variant="ghost" className="h-7 px-3 text-[11px] font-bold text-muted-foreground gap-1.5"><Coffee className="w-3 h-3"/> Beverage</Button>
              </div>

              <Button variant="outline" size="sm" className="bg-blue-500/5 border-blue-500/20 text-blue-400 h-9 px-4 text-xs font-bold gap-2">
                  <Bell className="w-4 h-4" />
                  1 active orders
              </Button>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="px-4 flex gap-2 mb-4">
            {[
              { label: 'All Orders', count: 3 },
              { label: 'Pending', count: 0 },
              { label: 'Preparing', count: 1 },
              { label: 'Ready', count: 2 }
            ].map((tab) => (
              <Button
                key={tab.label}
                variant={activeTab === tab.label ? "default" : "secondary"}
                onClick={() => setActiveTab(tab.label)}
                className={`h-9 px-4 text-xs font-bold gap-2 rounded-lg transition-all ${
                  activeTab === tab.label 
                  ? 'bg-cyan-500 text-white hover:bg-cyan-600' 
                  : 'bg-muted text-muted-foreground hover:bg-accent'
                }`}
              >
                {tab.label}
                <Badge className={`h-5 min-w-[20px] px-1 justify-center border-none ${activeTab === tab.label ? 'bg-cyan-400/30 text-white' : 'bg-background/50 text-muted-foreground'}`}>
                  {tab.count}
                </Badge>
              </Button>
            ))}
          </div>

          {/* Orders Grid */}
          <ScrollArea className="flex-1 px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-8">
              {orders.map((order) => (
                <Card key={order.id} className="bg-card border-border shadow-sm flex flex-col overflow-hidden">
                  <div className="p-4 border-b border-border bg-muted/30">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-sm font-black tracking-wide text-foreground">{order.id}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Utensils className="w-3 h-3 text-muted-foreground" />
                          <span className="text-[10px] font-bold text-muted-foreground uppercase">{order.table} • {order.type}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1.5 justify-end text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span className="text-[11px] font-bold">{order.time}</span>
                        </div>
                        <span className="text-[10px] text-muted-foreground mt-0.5 block">{order.progress}% complete</span>
                      </div>
                    </div>
                    <div className="w-full bg-background rounded-full h-1 overflow-hidden">
                      <div className={`${order.statusColor} h-full`} style={{ width: `${order.progress}%` }} />
                    </div>
                  </div>

                  <div className="flex-1 p-0">
                    <div className="divide-y divide-border">
                      {order.items.map((item, idx) => (
                        <div key={idx} className={`p-4 flex items-center justify-between group transition-colors ${item.status === 'served' ? 'opacity-40' : ''}`}>
                          <div className="flex items-start gap-3">
                            <span className="text-[11px] font-black text-foreground mt-0.5">{item.qty}x</span>
                            <div className="space-y-0.5">
                              <p className={`text-xs font-bold ${item.status === 'served' ? 'line-through' : ''}`}>{item.name}</p>
                              <p className="text-[10px] text-muted-foreground">{item.time} • {item.server}</p>
                            </div>
                          </div>
                          {getStatusBadge(item.status)}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 pt-0 mt-auto">
                      <Button className="w-full bg-green-500 hover:bg-green-600 text-white font-bold h-10 rounded-xl shadow-lg shadow-green-900/10 gap-2">
                          <CheckCircle2 className="w-4 h-4" />
                          Mark All Ready
                      </Button>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </main>
      </div>
    </AuthenticatedLayout>
  );
}