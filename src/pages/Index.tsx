import { Layout } from '@/components/layout/Layout';
import { Hero } from '@/components/home/Hero';
import { Categories } from '@/components/home/Categories';
import { QuickLinks } from '@/components/home/QuickLinks';
import { SEO } from '@/components/layout/SEO';
import { ProductGrid } from '@/components/products/ProductGrid';
import { DeliveryInfo } from '@/components/home/DeliveryInfo';
import { useFeaturedProducts } from '@/hooks/useProducts';
import { Skeleton } from '@/components/ui/skeleton';

const FeaturedSkeleton = () => (
  <section className="py-12 md:py-16">
    <div className="container mx-auto px-4">
      <div className="text-center mb-10 md:mb-12">
        <Skeleton className="h-4 w-32 mx-auto mb-2" />
        <Skeleton className="h-10 w-64 mx-auto" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="aspect-[3/4] rounded-lg" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-6 w-24" />
          </div>
        ))}
      </div>
    </div>
  </section>
);

const Index = () => {
  const { data: featuredProducts, isLoading } = useFeaturedProducts();

  return (
    <Layout>
      <SEO
        title="Mumu Style Shop | Premium Lifestyle Fashion"
        description="Discover the latest in premium fashion at Mumu Style Shop. From tailored shirts to designer footwear, redefine your elegance with us."
      />
      <Hero />
      <Categories />
      <QuickLinks />
      {isLoading ? (
        <FeaturedSkeleton />
      ) : (
        <ProductGrid
          products={featuredProducts || []}
          title="Featured Products"
          subtitle="Curated Selection"
        />
      )}
      <DeliveryInfo />
    </Layout>
  );
};

export default Index;
