import type { Product } from '@/hooks/useProducts';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  title?: string;
  subtitle?: string;
}

export const ProductGrid = ({ products, title, subtitle }: ProductGridProps) => {
  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        {(title || subtitle) && (
          <div className="text-center mb-10 md:mb-12">
            {subtitle && (
              <p className="text-sm text-accent uppercase tracking-widest mb-2">
                {subtitle}
              </p>
            )}
            {title && (
              <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground">
                {title}
              </h2>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};
