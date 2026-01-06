import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Analytics } from '@/components/admin/Analytics';
import { Layout } from '@/components/layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProductManager } from '@/components/admin/ProductManager';
import { UserManager } from '@/components/admin/UserManager';
import { OrderManager } from '@/components/admin/OrderManager';
import { Loader2, Package, ShoppingBag, Users, LayoutDashboard } from 'lucide-react';

const AdminDashboard = () => {
  const { user, isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <Layout>
      <div className="bg-secondary/30 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8 md:flex md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-serif font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-muted-foreground mt-1">Manage your store products, orders, and users.</p>
            </div>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <div className="overflow-x-auto pb-2">
              <TabsList className="inline-flex h-auto p-1 bg-background border rounded-lg min-w-full sm:min-w-0">
                <TabsTrigger value="overview" className="py-2 px-4 gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Overview</span>
                </TabsTrigger>
                <TabsTrigger value="orders" className="py-2 px-4 gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <ShoppingBag className="w-4 h-4" />
                  <span>Orders</span>
                </TabsTrigger>
                <TabsTrigger value="products" className="py-2 px-4 gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Package className="w-4 h-4" />
                  <span>Products</span>
                </TabsTrigger>
                <TabsTrigger value="users" className="py-2 px-4 gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Users className="w-4 h-4" />
                  <span>Users</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="overview" className="mt-0 space-y-4">
              <Analytics />
            </TabsContent>

            <TabsContent value="orders" className="mt-0 space-y-4">
              <OrderManager />
            </TabsContent>

            <TabsContent value="products" className="mt-0 space-y-4">
              <ProductManager />
            </TabsContent>

            <TabsContent value="users" className="mt-0 space-y-4">
              <UserManager />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;