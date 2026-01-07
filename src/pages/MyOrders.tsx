import { Layout } from "@/components/layout/Layout";
import { useAuth } from "@/hooks/useAuth";
import { useUserOrders } from "@/hooks/useOrders";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/hooks/useProducts";
import { Navigate, Link } from "react-router-dom";
import { Loader2, Package, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

const MyOrders = () => {
  const { session, isLoading: authLoading } = useAuth();
  const { data: orders, isLoading: ordersLoading } = useUserOrders();

  if (authLoading) return null;
  if (!session) return <Navigate to="/auth" />;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 md:py-12">
        <h1 className="text-3xl font-serif font-bold mb-8">My Orders</h1>

        {ordersLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : orders && orders.length > 0 ? (
          <div className="space-y-4 max-w-3xl">
            {orders.map((order) => (
              <Card key={order.id} className="overflow-hidden">
                <CardHeader className="bg-secondary/20 py-4 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-medium">Order #{order.id.slice(0, 8)}</CardTitle>
                    <p className="text-xs text-muted-foreground">
                      Placed on {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant={order.status === 'delivered' ? 'default' : order.status === 'cancelled' ? 'destructive' : 'secondary'} className="capitalize">
                    {order.status}
                  </Badge>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    {/* Order Timeline */}
                    <div className="relative pt-2 pb-8">
                      <div className="absolute top-5 left-0 right-0 h-0.5 bg-muted" />
                      <div
                        className="absolute top-5 left-0 h-0.5 bg-accent transition-all duration-500"
                        style={{
                          width: order.status === 'pending' ? '0%' :
                            order.status === 'confirmed' ? '33%' :
                              order.status === 'processing' ? '66%' :
                                order.status === 'delivered' ? '100%' : '0%'
                        }}
                      />
                      <div className="relative flex justify-between">
                        {[
                          { key: 'pending', label: 'Ordered' },
                          { key: 'confirmed', label: 'Confirmed' },
                          { key: 'processing', label: 'Shipping' },
                          { key: 'delivered', label: 'Delivered' }
                        ].map((step, idx) => {
                          const isCompleted = ['pending', 'confirmed', 'processing', 'delivered'].indexOf(order.status) >= idx;
                          const isActive = order.status === step.key;

                          return (
                            <div key={step.key} className="flex flex-col items-center gap-2">
                              <div className={`w-3 h-3 rounded-full relative z-10 ${isCompleted ? 'bg-accent' : 'bg-muted'}`}>
                                {isActive && <div className="absolute inset-0 rounded-full bg-accent animate-ping" />}
                              </div>
                              <span className={`text-[10px] font-medium ${isCompleted ? 'text-accent' : 'text-muted-foreground'}`}>
                                {step.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="space-y-4">
                      {order.order_items.map((item: any) => (
                        <div key={item.id} className="flex justify-between items-center text-sm">
                          <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded overflow-hidden border bg-muted flex-shrink-0">
                                {item.products?.image_url ? (
                                    <img 
                                        src={item.products.image_url} 
                                        alt={item.product_name} 
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center text-xs text-muted-foreground">
                                        No Img
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-col">
                                <div className="flex items-center gap-2">
                                    <span className="font-medium">{item.product_name}</span>
                                    <span className="text-xs bg-secondary px-1.5 py-0.5 rounded text-muted-foreground">
                                        x{item.quantity}
                                    </span>
                                </div>
                                <span className="text-muted-foreground text-xs">
                                    Size: {item.size} {item.color && `• Color: ${item.color}`}
                                </span>
                            </div>
                          </div>
                          <span className="font-medium">{formatPrice(item.product_price * item.quantity)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t pt-4 flex justify-between items-center font-medium">
                      <span>Total Amount</span>
                      <span className="text-lg">{formatPrice(order.total_amount)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-secondary/10 rounded-lg">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
            <p className="text-muted-foreground mb-6">You haven't placed any orders yet.</p>
            <Button asChild>
              <Link to="/shop">Start Shopping</Link>
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MyOrders;
