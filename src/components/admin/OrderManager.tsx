import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { formatPrice } from '@/hooks/useProducts';

type OrderStatus = 'pending' | 'confirmed' | 'paid' | 'processing' | 'delivered' | 'cancelled';

export const OrderManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: orders, isLoading } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            id,
            product_name,
            product_price,
            quantity,
            size,
            color
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: OrderStatus }) => {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      toast({ title: 'Order status updated' });
    },
    onError: (error: any) => {
      toast({ 
        title: 'Error updating status', 
        description: error.message, 
        variant: 'destructive' 
      });
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Order Management</h2>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={6} className="text-center">Loading...</TableCell></TableRow>
            ) : orders?.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-mono text-xs">{order.id.slice(0, 8)}...</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{order.customer_name}</span>
                    <span className="text-xs text-muted-foreground">{order.customer_phone}</span>
                  </div>
                </TableCell>
                <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                <TableCell>{formatPrice(order.total_amount)}</TableCell>
                <TableCell>
                  <Select 
                    defaultValue={order.status} 
                    onValueChange={(val) => updateStatusMutation.mutate({ orderId: order.id, status: val as OrderStatus })}
                  >
                    <SelectTrigger className={`w-[130px] h-8 ${getStatusColor(order.status)} border-none`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-right">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Order Details #{order.id.slice(0, 8)}</DialogTitle>
                      </DialogHeader>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-sm font-medium text-muted-foreground">Customer Info</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm space-y-1">
                              <p><span className="font-semibold">Name:</span> {order.customer_name}</p>
                              <p><span className="font-semibold">Phone:</span> {order.customer_phone}</p>
                              <p><span className="font-semibold">Address:</span> {order.customer_address}</p>
                              {order.notes && <p><span className="font-semibold">Notes:</span> {order.notes}</p>}
                            </CardContent>
                          </Card>
                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-sm font-medium text-muted-foreground">Payment Info</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm space-y-1">
                              <p><span className="font-semibold">Method:</span> {order.payment_method || 'N/A'}</p>
                              <p><span className="font-semibold">Reference:</span> {order.payment_reference || 'N/A'}</p>
                            </CardContent>
                          </Card>
                        </div>
                        <div className="space-y-4">
                          <h3 className="font-semibold">Items</h3>
                          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                            {order.order_items.map((item: any) => (
                              <div key={item.id} className="flex justify-between items-start border-b pb-2 last:border-0">
                                <div>
                                  <p className="font-medium text-sm">{item.product_name}</p>
                                  <p className="text-xs text-muted-foreground">
                                    Size: {item.size} {item.color && `| Color: ${item.color}`}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm">{item.quantity} x {formatPrice(item.product_price)}</p>
                                  <p className="font-semibold text-sm">{formatPrice(item.quantity * item.product_price)}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="flex justify-between border-t pt-4">
                            <span className="font-bold">Total</span>
                            <span className="font-bold text-lg">{formatPrice(order.total_amount)}</span>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
