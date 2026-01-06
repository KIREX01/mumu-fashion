import { Layout } from "@/components/layout/Layout";
import { useWishlist } from "@/hooks/useWishlist";
import { ProductGrid } from "@/components/products/ProductGrid";
import { Skeleton } from "@/components/ui/skeleton";

const Wishlist = () => {
  const { data: wishlistItems, isLoading } = useWishlist();

  // Extract products from wishlist items
  const products = wishlistItems?.map(item => item.products).filter(p => !!p) || [];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-serif font-bold mb-8">My Wishlist</h1>
        
        {isLoading ? (
           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
             {[...Array(4)].map((_, i) => (
               <Skeleton key={i} className="aspect-[3/4] rounded-lg" />
             ))}
           </div>
        ) : products.length > 0 ? (
          <ProductGrid products={products} />
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Your wishlist is empty.</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Wishlist;
