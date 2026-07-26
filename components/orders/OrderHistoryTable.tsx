"use client";

import { useState } from "react";
import { Clock, CheckCircle2, ChevronRight, Search, Receipt } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle,
  SheetDescription 
} from "@/components/ui/sheet";

type OrderItem = {
  id: string;
  quantity: number;
  item_price_cents: number;
  menu_items: { name: string } | null;
};

type Order = {
  id: string;
  status: string;
  created_at: string;
  total_cents: number;
  tables: { table_number: number } | null;
  order_items: OrderItem[];
};

interface OrderHistoryTableProps {
  orders: Order[];
}

export function OrderHistoryTable({ orders }: OrderHistoryTableProps) {
  const [filter, setFilter] = useState<"ALL" | "ACTIVE" | "COMPLETED">("ALL");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(cents / 100);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Badge variant="secondary">Pending</Badge>;
      case "PREPARING":
        return <Badge className="bg-amber-500 hover:bg-amber-600 text-white border-transparent">Preparing</Badge>;
      case "READY":
        return <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white border-transparent">Ready</Badge>;
      case "SERVED":
        return <Badge className="bg-blue-500 hover:bg-blue-600 text-white border-transparent">Served</Badge>;
      case "PAID":
        return <Badge className="bg-brand hover:bg-brand/90 text-white border-transparent">Paid</Badge>;
      case "CANCELLED":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).format(new Date(dateString));
  };

  const formatTime = (dateString: string) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).format(new Date(dateString));
  };

  const filteredOrders = orders.filter((order) => {
    if (filter === "ALL") return true;
    const isActive = ["PENDING", "PREPARING", "READY", "SERVED"].includes(order.status);
    if (filter === "ACTIVE") return isActive;
    if (filter === "COMPLETED") return !isActive; // PAID, CANCELLED
    return true;
  });

  return (
    <div className="flex flex-col space-y-6 h-full">
      {/* Filters */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => setFilter("ALL")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            filter === "ALL" 
              ? "bg-zinc-800 text-white" 
              : "bg-transparent text-muted-foreground hover:bg-zinc-800/50 hover:text-foreground"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter("ACTIVE")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            filter === "ACTIVE" 
              ? "bg-zinc-800 text-white" 
              : "bg-transparent text-muted-foreground hover:bg-zinc-800/50 hover:text-foreground"
          }`}
        >
          Active
        </button>
        <button
          onClick={() => setFilter("COMPLETED")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            filter === "COMPLETED" 
              ? "bg-zinc-800 text-white" 
              : "bg-transparent text-muted-foreground hover:bg-zinc-800/50 hover:text-foreground"
          }`}
        >
          Completed
        </button>
      </div>

      {/* Table Area */}
      <div className="flex-1 bg-zinc-900/50 border rounded-xl overflow-hidden flex flex-col">
        {filteredOrders.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <Receipt className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-xl font-semibold mb-2">No orders found</h3>
            <p className="text-muted-foreground max-w-sm">
              {filter === "ALL" 
                ? "This restaurant doesn't have any orders yet." 
                : `There are no ${filter.toLowerCase()} orders.`}
            </p>
          </div>
        ) : (
          <div className="overflow-auto flex-1">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-zinc-900/80 text-muted-foreground sticky top-0 z-10 border-b">
                <tr>
                  <th className="px-6 py-4 font-medium">Order ID</th>
                  <th className="px-6 py-4 font-medium">Table</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Items</th>
                  <th className="px-6 py-4 font-medium">Total</th>
                  <th className="px-6 py-4 font-medium">Time</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredOrders.map((order) => {
                  const itemCount = order.order_items.reduce((sum, item) => sum + item.quantity, 0);
                  return (
                    <tr 
                      key={order.id} 
                      onClick={() => setSelectedOrder(order)}
                      className="hover:bg-white/5 cursor-pointer transition-colors group"
                    >
                      <td className="px-6 py-4 font-mono text-muted-foreground">
                        {order.id.slice(0, 8)}
                      </td>
                      <td className="px-6 py-4 font-medium">
                        {order.tables?.table_number ? `Table ${order.tables.table_number}` : 'Unknown Table'}
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(order.status)}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {itemCount} item{itemCount !== 1 && 's'}
                      </td>
                      <td className="px-6 py-4 font-medium">
                        {formatPrice(order.total_cents)}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">
                        {formatTime(order.created_at)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors ml-auto" />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Details Sheet */}
      <Sheet open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
        <SheetContent className="bg-zinc-950 border-l-zinc-800 flex flex-col w-full sm:max-w-md p-0">
          {selectedOrder && (
            <>
              <div className="p-6 border-b border-white/5 bg-zinc-900/30">
                <SheetHeader>
                  <div className="flex items-center justify-between mb-2">
                    <SheetTitle className="text-xl">
                      {selectedOrder.tables?.table_number ? `Table ${selectedOrder.tables.table_number}` : 'Unknown Table'}
                    </SheetTitle>
                    {getStatusBadge(selectedOrder.status)}
                  </div>
                  <SheetDescription className="flex items-center space-x-2 text-sm text-muted-foreground font-mono">
                    <Clock className="w-4 h-4" />
                    <span>{formatDate(selectedOrder.created_at)}</span>
                  </SheetDescription>
                  <div className="text-xs text-muted-foreground font-mono mt-1">
                    ID: {selectedOrder.id}
                  </div>
                </SheetHeader>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6">
                <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
                  Order Items
                </h4>
                <div className="space-y-4">
                  {selectedOrder.order_items.map((item) => (
                    <div key={item.id} className="flex justify-between items-start">
                      <div className="flex space-x-3">
                        <span className="text-muted-foreground w-6 font-mono text-sm">
                          {item.quantity}x
                        </span>
                        <span className="font-medium text-foreground">
                          {item.menu_items?.name || 'Unknown Item'}
                        </span>
                      </div>
                      <span className="text-muted-foreground font-medium">
                        {formatPrice(item.item_price_cents * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="p-6 border-t border-white/5 bg-zinc-900/50">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-muted-foreground">Total</span>
                  <span className="text-2xl font-bold text-foreground">
                    {formatPrice(selectedOrder.total_cents)}
                  </span>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
