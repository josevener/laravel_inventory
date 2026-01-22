import React, { useState } from 'react';
import {
  Search,
  Filter,
  MoreVertical,
  Eye,
  Download,
  Trash2,
  ChevronLeft,
  Calendar,
  Clock,
  User,
  Utensils,
  CreditCard,
  Printer,
} from 'lucide-react';
import { Card } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Badge } from "@/Components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table";
import { ScrollArea } from "@/Components/ui/scroll-area";
import { Separator } from "@/Components/ui/separator";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

const ordersData = [
  { id: "#ORD-011", date: "Jan 7, 2026", time: "09:36 PM", table: "O3", customer: "Walk-in Customer", total: 124.50, status: "Completed", payment: "Credit Card" },
  { id: "#ORD-010", date: "Jan 7, 2026", time: "09:12 PM", table: "T5", customer: "John Doe", total: 98.91, status: "Pending", payment: "Unpaid" },
  { id: "#ORD-009", date: "Jan 7, 2026", time: "08:45 PM", table: "V2", customer: "Sarah Smith", total: 45.20, status: "Preparing", payment: "Cash" },
  { id: "#ORD-008", date: "Jan 7, 2026", time: "08:20 PM", table: "B1", customer: "Walk-in Customer", total: 67.00, status: "Completed", payment: "Debit Card" },
  { id: "#ORD-007", date: "Jan 6, 2026", time: "10:15 PM", table: "O1", customer: "Mike Ross", total: 156.45, status: "Cancelled", payment: "Refunded" },
];

export default function OrdersManagement() {
  const [view, setView] = useState('list'); // 'list' or 'details'
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setView('details');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'Pending': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'Preparing': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'Cancelled': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
    }
  };

  return (
    <AuthenticatedLayout>
      <Head title="Order Management" />

      <div className="flex h-[calc(100vh-100px)] bg-background text-foreground">
        {/* Main Content */}
        <main className="flex-1 flex flex-col bg-background overflow-hidden">
          {view === 'list' ? (
            <>
              <header className="h-16 flex items-center justify-between border-b border-border">
                <div className="flex items-center gap-4">
                  <h2 className="text-lg font-bold">Order History</h2>
                  <span className="text-xs text-muted-foreground">
                    {new Date().toLocaleDateString(undefined, {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <Button variant="outline" size="sm" className="h-9 gap-2 border-border">
                  <Download className="w-4 h-4" /> Export
                </Button>
              </header>

              <div className="py-2 space-y-4 flex-1 flex flex-col overflow-hidden">
                <div className="flex items-center justify-between gap-4">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input className="bg-muted/50 border-border pl-10 h-10" placeholder="Search by order ID, customer..." />
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" className="gap-2 h-10 border-border">
                      <Filter className="w-4 h-4" /> Filter
                    </Button>
                    <Button className="bg-cyan-500 hover:bg-cyan-600 h-10">New Order</Button>
                  </div>
                </div>

                <Card className="border-border bg-card flex-1 overflow-hidden flex flex-col">
                  <ScrollArea className="flex-1">
                    <Table>
                      <TableHeader className="bg-muted/50 sticky top-0 z-10">
                        <TableRow className="border-border hover:bg-transparent">
                          <TableHead className="text-[11px] font-bold uppercase tracking-wider">Order ID</TableHead>
                          <TableHead className="text-[11px] font-bold uppercase tracking-wider">Date & Time</TableHead>
                          <TableHead className="text-[11px] font-bold uppercase tracking-wider">Table</TableHead>
                          <TableHead className="text-[11px] font-bold uppercase tracking-wider">Customer</TableHead>
                          <TableHead className="text-[11px] font-bold uppercase tracking-wider">Total Amount</TableHead>
                          <TableHead className="text-[11px] font-bold uppercase tracking-wider">Status</TableHead>
                          <TableHead className="text-[11px] font-bold uppercase tracking-wider text-right">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {ordersData.map((order) => (
                          <TableRow key={order.id} className="border-border hover:bg-muted/30 transition-colors">
                            <TableCell className="text-sm font-bold text-cyan-500">{order.id}</TableCell>
                            <TableCell>
                              <div className="flex flex-col">
                                <span className="text-xs font-medium">{order.date}</span>
                                <span className="text-[10px] text-muted-foreground">{order.time}</span>
                              </div>
                            </TableCell>
                            <TableCell><Badge variant="outline" className="bg-muted/50 border-border">{order.table}</Badge></TableCell>
                            <TableCell className="text-xs font-medium">{order.customer}</TableCell>
                            <TableCell className="text-sm font-bold">${order.total.toFixed(2)}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className={`${getStatusColor(order.status)} border px-2 py-0 h-6 text-[10px] font-bold uppercase`}>
                                {order.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={() => handleViewOrder(order)}>
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                  <div className="p-4 border-t border-border flex items-center justify-between bg-muted/20">
                    <p className="text-xs text-muted-foreground">Showing 5 of 124 orders</p>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" disabled className="h-8 border-border">Previous</Button>
                      <Button variant="outline" size="sm" className="h-8 border-border bg-cyan-500 text-white hover:bg-cyan-600">1</Button>
                      <Button variant="outline" size="sm" className="h-8 border-border">2</Button>
                      <Button variant="outline" size="sm" className="h-8 border-border">Next</Button>
                    </div>
                  </div>
                </Card>
              </div>
            </>
          ) : (
            /* Order Details View */
            <>
              <header className="h-16 flex items-center justify-between border-b border-border">
                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="icon" className="h-9 w-9 border border-border" onClick={() => setView('list')}>
                    <ChevronLeft className="w-5 h-5" />
                  </Button>
                  <div>
                    <h2 className="text-lg font-bold flex items-center gap-2">
                      Order Details <span className="text-cyan-500">{selectedOrder.id}</span>
                    </h2>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Button variant="outline" className="h-9 gap-2 border-border text-xs font-bold">
                    <Printer className="w-4 h-4" /> Print Receipt
                  </Button>
                  <Button className="h-9 bg-cyan-500 hover:bg-cyan-600 text-xs font-bold">
                    Edit Order
                  </Button>
                </div>
              </header>

              <div className="py-2 flex gap-2 h-full overflow-hidden bg-muted/20">
                {/* Left Column - Info Cards */}
                <div className="w-[350px] space-y-4 overflow-y-auto pb-2">
                  <Card className="border-border bg-card p-4 space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Summary</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-muted rounded-lg"><Calendar className="w-4 h-4 text-cyan-500" /></div>
                        <div>
                          <p className="text-[10px] text-muted-foreground font-bold uppercase">Date</p>
                          <p className="text-xs font-bold">{selectedOrder.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-muted rounded-lg"><Clock className="w-4 h-4 text-cyan-500" /></div>
                        <div>
                          <p className="text-[10px] text-muted-foreground font-bold uppercase">Time</p>
                          <p className="text-xs font-bold">{selectedOrder.time}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-muted rounded-lg"><User className="w-4 h-4 text-cyan-500" /></div>
                        <div>
                          <p className="text-[10px] text-muted-foreground font-bold uppercase">Customer</p>
                          <p className="text-xs font-bold">{selectedOrder.customer}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-muted rounded-lg"><Utensils className="w-4 h-4 text-cyan-500" /></div>
                        <div>
                          <p className="text-[10px] text-muted-foreground font-bold uppercase">Table</p>
                          <p className="text-xs font-bold">Table {selectedOrder.table}</p>
                        </div>
                      </div>
                    </div>
                  </Card>

                  <Card className="border-border bg-card p-4 space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Payment Details</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Payment Method</span>
                        <div className="flex items-center gap-1.5 font-bold text-xs">
                          <CreditCard className="w-3.5 h-3.5 text-muted-foreground" />
                          {selectedOrder.payment}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Status</span>
                        <Badge className={getStatusColor(selectedOrder.status)}>{selectedOrder.status}</Badge>
                      </div>
                    </div>
                    <Separator className="bg-border" />
                    <div className="space-y-2 text-sm font-bold">
                      <div className="flex justify-between text-muted-foreground">
                        <span>Subtotal</span>
                        <span>$89.92</span>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>Service Tax (10%)</span>
                        <span>$8.99</span>
                      </div>
                      <div className="flex justify-between text-lg pt-2 text-foreground">
                        <span>Total</span>
                        <span className="text-cyan-500 font-black">${selectedOrder.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </Card>

                  <Button variant="ghost" className="w-full text-red-500 hover:text-red-600 hover:bg-red-500/10 gap-2 border border-red-500/20">
                    <Trash2 className="w-4 h-4" /> Cancel Order
                  </Button>
                </div>

                {/* Right Column - Order Items */}
                <div className="flex-1 flex flex-col h-full">
                  <Card className="border-border bg-card flex-1 flex flex-col overflow-hidden">
                    <div className="p-5 border-b border-border flex justify-between items-center">
                      <h3 className="text-sm font-black uppercase tracking-widest">Order Items</h3>
                      <Badge variant="outline" className="border-cyan-500/30 text-cyan-500 bg-cyan-500/5">5 Items</Badge>
                    </div>
                    <ScrollArea className="flex-1">
                      <div className="p-0">
                        <Table>
                          <TableHeader className="bg-muted/30">
                            <TableRow className="border-border hover:bg-transparent">
                              <TableHead className="w-[400px] text-[10px] font-black uppercase tracking-widest">Item</TableHead>
                              <TableHead className="text-[10px] font-black uppercase tracking-widest text-center">Qty</TableHead>
                              <TableHead className="text-[10px] font-black uppercase tracking-widest text-right">Price</TableHead>
                              <TableHead className="text-[10px] font-black uppercase tracking-widest text-right">Total</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {[
                              { name: 'Grilled Salmon', icon: '🐟', price: 22.99, qty: 1, note: 'Well done, lemon on side' },
                              { name: 'Caesar Salad', icon: '🥗', price: 9.99, qty: 1, note: 'No croutons' },
                              { name: 'Garlic Bread', icon: '🥖', price: 4.99, qty: 3, note: null },
                              { name: 'Beer', icon: '🍺', price: 6.99, qty: 2, note: null },
                              { name: 'Chocolate Cake', icon: '🍰', price: 7.99, qty: 1, note: null },
                            ].map((item, i) => (
                              <TableRow key={i} className="border-border">
                                <TableCell>
                                  <div className="flex gap-3">
                                    <span className="text-xl">{item.icon}</span>
                                    <div>
                                      <p className="text-sm font-bold text-foreground">{item.name}</p>
                                      {item.note && (
                                        <p className="text-[10px] text-orange-500 italic mt-0.5">Note: {item.note}</p>
                                      )}
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell className="text-center font-bold text-xs">x{item.qty}</TableCell>
                                <TableCell className="text-right text-xs text-muted-foreground">${item.price.toFixed(2)}</TableCell>
                                <TableCell className="text-right font-bold text-sm text-cyan-500">${(item.price * item.qty).toFixed(2)}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </ScrollArea>
                    <div className="p-6 border-t border-border bg-muted/10 flex justify-between items-center">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="h-8 text-[10px] font-black uppercase tracking-tighter border-border">Refund Items</Button>
                        <Button size="sm" variant="outline" className="h-8 text-[10px] font-black uppercase tracking-tighter border-border">Split Bill</Button>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Order Total</p>
                        <p className="text-2xl font-black text-foreground">${selectedOrder.total.toFixed(2)}</p>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </AuthenticatedLayout>
  );
}