import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { CheckCircle, XCircle, Eye, Image, Clock, Truck, Ban } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type OrderStatus = Database["public"]["Enums"]["order_status"];

interface Order {
  id: string;
  order_number: string;
  status: OrderStatus;
  total: number;
  customer_name: string;
  customer_phone: string;
  shipping_address: string;
  payment_slip_url: string | null;
  payment_method: string | null;
  created_at: string;
  paid_at: string | null;
}

const statusConfig: Record<OrderStatus, { label: string; color: string; icon: React.ReactNode }> = {
  pending: { label: "Pending", color: "bg-yellow-500", icon: <Clock className="h-4 w-4" /> },
  paid: { label: "Paid", color: "bg-green-500", icon: <CheckCircle className="h-4 w-4" /> },
  shipped: { label: "Shipped", color: "bg-purple-500", icon: <Truck className="h-4 w-4" /> },
  delivered: { label: "Delivered", color: "bg-green-600", icon: <CheckCircle className="h-4 w-4" /> },
  cancelled: { label: "Cancelled", color: "bg-red-500", icon: <Ban className="h-4 w-4" /> },
};

const Orders = () => {
  const queryClient = useQueryClient();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [slipDialogOpen, setSlipDialogOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const { data: orders, isLoading } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Order[];
    },
  });

  const updateOrderMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: OrderStatus }) => {
      const updateData: { status: OrderStatus; paid_at?: string } = { status };
      
      // Set paid_at when approving
      if (status === "paid") {
        updateData.paid_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from("orders")
        .update(updateData)
        .eq("id", orderId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      toast({
        title: "Order updated",
        description: "Order status has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update order status.",
        variant: "destructive",
      });
    },
  });

  const handleApprove = (order: Order) => {
    updateOrderMutation.mutate({ orderId: order.id, status: "paid" });
  };

  const handleReject = (order: Order) => {
    updateOrderMutation.mutate({ orderId: order.id, status: "cancelled" });
  };

  const handleStatusChange = (orderId: string, status: OrderStatus) => {
    updateOrderMutation.mutate({ orderId, status });
  };

  const filteredOrders = orders?.filter((order) =>
    filterStatus === "all" ? true : order.status === filterStatus
  );

  const pendingCount = orders?.filter((o) => o.status === "pending").length || 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Orders</h1>
          <p className="text-muted-foreground">Manage and verify customer orders</p>
        </div>
        {pendingCount > 0 && (
          <Badge variant="destructive" className="text-lg px-4 py-2">
            {pendingCount} Pending Verification
          </Badge>
        )}
      </div>

      {/* Filter */}
      <Card>
        <CardContent className="py-4">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">Filter by status:</span>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Orders ({filteredOrders?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order #</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment Slip</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders?.map((order) => (
                <TableRow key={order.id} className={order.status === "pending" ? "bg-yellow-50 dark:bg-yellow-950/20" : ""}>
                  <TableCell className="font-mono text-sm">{order.order_number}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{order.customer_name}</p>
                      <p className="text-sm text-muted-foreground">{order.customer_phone}</p>
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold">฿{order.total.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge className={`${statusConfig[order.status].color} text-white`}>
                      <span className="flex items-center gap-1">
                        {statusConfig[order.status].icon}
                        {statusConfig[order.status].label}
                      </span>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {order.payment_slip_url ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedOrder(order);
                          setSlipDialogOpen(true);
                        }}
                      >
                        <Image className="h-4 w-4 mr-1" />
                        View Slip
                      </Button>
                    ) : (
                      <span className="text-muted-foreground text-sm">No slip</span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(order.created_at).toLocaleDateString("th-TH", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </TableCell>
                  <TableCell>
                    {order.status === "pending" ? (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleApprove(order)}
                          disabled={updateOrderMutation.isPending}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleReject(order)}
                          disabled={updateOrderMutation.isPending}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    ) : (
                      <Select
                        value={order.status}
                        onValueChange={(value) => handleStatusChange(order.id, value as OrderStatus)}
                        disabled={updateOrderMutation.isPending}
                      >
                        <SelectTrigger className="w-36">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="paid">Paid</SelectItem>
                          <SelectItem value="shipped">Shipped</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {filteredOrders?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No orders found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Payment Slip Dialog */}
      <Dialog open={slipDialogOpen} onOpenChange={setSlipDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Payment Slip - {selectedOrder?.order_number}</DialogTitle>
            <DialogDescription>
              Customer: {selectedOrder?.customer_name} | Total: ฿{selectedOrder?.total.toLocaleString()}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center py-4">
            {selectedOrder?.payment_slip_url && (
              <img
                src={selectedOrder.payment_slip_url}
                alt="Payment slip"
                className="max-h-[60vh] rounded-lg border shadow-sm"
              />
            )}
          </div>
          {selectedOrder?.status === "pending" && (
            <DialogFooter>
              <Button
                variant="destructive"
                onClick={() => {
                  handleReject(selectedOrder);
                  setSlipDialogOpen(false);
                }}
                disabled={updateOrderMutation.isPending}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Reject Order
              </Button>
              <Button
                className="bg-green-600 hover:bg-green-700"
                onClick={() => {
                  handleApprove(selectedOrder);
                  setSlipDialogOpen(false);
                }}
                disabled={updateOrderMutation.isPending}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve Order
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Orders;
