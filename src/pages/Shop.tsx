import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { ProductGrid } from '@/components/products/ProductGrid';
import { useFilteredProducts, type ProductCategory, type ProductFilters, type ProductSortOption } from '@/hooks/useProducts';
import { Skeleton } from '@/components/ui/skeleton';
import { FilterSidebar } from '@/components/shop/FilterSidebar';
import { SortDropdown } from '@/components/shop/SortDropdown';
import { SearchBar } from '@/components/shop/SearchBar';
import { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from '@/components/ui/button';
import { SlidersHorizontal } from 'lucide-react';

const categoryTitles: Record<string, { title: string; subtitle: string }> = {
  men: { title: 'Men\'s Collection', subtitle: 'Sophisticated Style' },
  women: { title: 'Women\'s Collection', subtitle: 'Elegant & Chic' },
  kids: { title: 'Kids\' Collection', subtitle: 'Playful & Comfortable' },
  shoes: { title: 'Shoes Collection', subtitle: 'Premium Footwear' },
  accessories: { title: 'Accessories', subtitle: 'Finishing Touches' },
  cake: { title: 'Cakes', subtitle: 'Delicious Treats' },
};

const ProductGridSkeleton = () => (
  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
    {[...Array(6)].map((_, i) => (
      <div key={i} className="space-y-4">
        <Skeleton className="aspect-[3/4] rounded-lg" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-6 w-24" />
      </div>
    ))}
  </div>
);

const Shop = () => {
  const { category: routeCategory } = useParams<{ category?: string }>();
  
  // Initialize filters
  const [filters, setFilters] = useState<ProductFilters>({
    category: routeCategory && categoryTitles[routeCategory] ? [routeCategory as ProductCategory] : [],
    minPrice: 0,
    maxPrice: 500000,
    colors: [],
    search: '',
    sort: 'newest' as ProductSortOption
  });

  // Update filters if route changes
  useEffect(() => {
    if (routeCategory && categoryTitles[routeCategory]) {
      setFilters(prev => ({ ...prev, category: [routeCategory as ProductCategory] }));
    }
  }, [routeCategory]);

  const { data: products, isLoading } = useFilteredProducts(filters);

  const handleFilterChange = (newFilters: Partial<ProductFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const activeCategory = filters.category?.[0];
  const title = activeCategory && categoryTitles[activeCategory] 
    ? categoryTitles[activeCategory].title 
    : 'All Products';
  const subtitle = activeCategory && categoryTitles[activeCategory] 
    ? categoryTitles[activeCategory].subtitle 
    : 'Complete Collection';

  return (
    <Layout>
      {/* Page Header */}
      <section className="py-12 md:py-20 bg-secondary">
        <div className="container mx-auto px-4 text-center">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-accent uppercase tracking-widest"
          >
            {subtitle}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-serif text-4xl md:text-5xl font-semibold text-foreground mt-2"
          >
            {title}
          </motion.h1>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <SearchBar 
            value={filters.search || ''} 
            onChange={(val) => handleFilterChange({ search: val })} 
          />
          <div className="flex items-center gap-2">
             {/* Mobile Filter Sheet */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="lg:hidden">
                  <SlidersHorizontal className="mr-2 h-4 w-4" /> Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <FilterSidebar 
                  onFilterChange={handleFilterChange} 
                  initialFilters={filters}
                />
              </SheetContent>
            </Sheet>

            <SortDropdown 
              value={filters.sort || 'newest'} 
              onChange={(val) => handleFilterChange({ sort: val })} 
            />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <FilterSidebar 
              onFilterChange={handleFilterChange} 
              initialFilters={filters}
            />
          </aside>

          {/* Product Grid */}
          <main className="flex-1">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-muted-foreground mb-4"
            >
              {isLoading ? 'Loading...' : `${products?.length || 0} products found`}
            </motion.p>

            {isLoading ? (
              <ProductGridSkeleton />
            ) : (
              <ProductGrid products={products || []} />
            )}
          </main>
        </div>
      </div>
    </Layout>
  );
};

export default Shop;