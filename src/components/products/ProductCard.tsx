import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Eye, Zap } from 'lucide-react';
import type { Product } from '@/hooks/useProducts';
import { formatPrice } from '@/hooks/useProducts';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { hapticFeedback } from '@/lib/haptics';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export const ProductCard = ({ product, index = 0 }: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    hapticFeedback.medium();
    const defaultSize = product.sizes?.[0] || 'One Size';
    addToCart(product, defaultSize);
    toast({
      title: 'Added to Cart',
      description: `${product.name} has been added to your cart.`,
    });
  };

  const isNew = new Date(product.created_at).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group"
    >
      <Link to={`/product/${product.id}`} className="block" onClick={() => hapticFeedback.light()}>
        <div className="relative aspect-[3/4] bg-secondary rounded-lg overflow-hidden mb-4">
          <motion.img
            src={product.image_url || ''}
            alt={product.name}
            className="w-full h-full object-cover object-center"
            animate={{ scale: isHovered ? 1.05 : 1 }}
            transition={{ duration: 0.4 }}
          />

          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.discount && product.discount > 0 && (
              <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
                -{product.discount}% OFF
              </span>
            )}
            {isNew && (
              <span className="bg-accent text-accent-foreground text-[10px] font-bold px-2 py-1 rounded-full shadow-sm flex items-center gap-1">
                <Zap className="w-2 h-2 fill-current" /> NEW
              </span>
            )}
            {(product as any).stock_quantity <= 5 && (product as any).stock_quantity > 0 && (
              <span className="bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
                ONLY {(product as any).stock_quantity} LEFT
              </span>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            className="absolute inset-0 bg-foreground/20 flex items-center justify-center gap-2"
          >
            <Button
              size="icon"
              variant="secondary"
              onClick={handleQuickAdd}
              className="shadow-elegant rounded-full"
            >
              <ShoppingBag className="w-4 h-4" />
            </Button>
            <Button size="icon" variant="secondary" className="shadow-elegant rounded-full">
              <Eye className="w-4 h-4" />
            </Button>
          </motion.div>
        </div>

        <div className="space-y-1">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">
            {product.category}
          </p>
          <h3 className="font-medium text-foreground group-hover:text-accent transition-colors line-clamp-2">
            {product.name}
          </h3>
          <div className="flex items-center gap-2">
            <p className="font-serif text-lg font-semibold text-foreground">
              {formatPrice(product.price)}
            </p>
            {product.discount && product.discount > 0 && (
              <p className="text-sm text-muted-foreground line-through">
                {formatPrice(product.price / (1 - product.discount / 100))}
              </p>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
