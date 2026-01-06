import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, MessageCircle } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { formatPrice } from '@/hooks/useProducts';
import { hapticFeedback } from '@/lib/haptics';

const Cart = () => {
  const { items, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();

  const handleUpdateQuantity = (id: string, size: string, quantity: number) => {
    hapticFeedback.light();
    updateQuantity(id, size, quantity);
  };

  const handleRemove = (id: string, size: string) => {
    hapticFeedback.medium();
    removeFromCart(id, size);
  };

  const handleWhatsAppCheckout = () => {
    if (items.length === 0) return;
    hapticFeedback.success();

    const itemsList = items
      .map(
        item =>
          `- ${item.product.name} (Size: ${item.size}, Qty: ${item.quantity}) - ${formatPrice(item.product.price * item.quantity)}`
      )
      .join('\n');

    const message = encodeURIComponent(
      `Hello! I would like to place an order:\n\n${itemsList}\n\nTotal: ${formatPrice(totalPrice)}\n\nPlease confirm availability and delivery details.`
    );
    window.open(`https://wa.me/25769966695?text=${message}`, '_blank');
  };

  if (items.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-md mx-auto"
          >
            <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-10 h-10 text-muted-foreground" />
            </div>
            <h1 className="font-serif text-3xl font-semibold text-foreground mb-4">
              Your Cart is Empty
            </h1>
            <p className="text-muted-foreground mb-8">
              Looks like you haven't added any items yet. Explore our collection
              and find something you'll love.
            </p>
            <Button asChild size="lg">
              <Link to="/shop">
                Start Shopping
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 md:py-12">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-serif text-3xl md:text-4xl font-semibold text-foreground mb-8"
        >
          Shopping Cart
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, index) => (
              <motion.div
                key={`${item.product.id}-${item.size}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex gap-4 bg-card rounded-xl p-4 shadow-card"
              >
                <Link
                  to={`/product/${item.product.id}`}
                  className="w-24 h-24 md:w-32 md:h-32 bg-secondary rounded-lg overflow-hidden shrink-0"
                >
                  <img
                    src={item.product.image_url || ''}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </Link>

                <div className="flex-1 flex flex-col">
                  <div className="flex justify-between items-start">
                    <div>
                      <Link
                        to={`/product/${item.product.id}`}
                        className="font-medium text-foreground hover:text-accent transition-colors"
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-sm text-muted-foreground">
                        Size: {item.size}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemove(item.product.id, item.size)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="mt-auto flex justify-between items-center">
                    <div className="flex items-center border border-border rounded-md">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() =>
                          handleUpdateQuantity(item.product.id, item.size, item.quantity - 1)
                        }
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="w-8 text-center text-sm">{item.quantity}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() =>
                          handleUpdateQuantity(item.product.id, item.size, item.quantity + 1)
                        }
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                    <p className="font-serif font-semibold text-foreground">
                      {formatPrice(item.product.price * item.quantity)}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:sticky lg:top-24 h-fit"
          >
            <div className="bg-card rounded-xl p-6 shadow-card">
              <h2 className="font-serif text-xl font-semibold text-foreground mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Delivery</span>
                  <span className="text-accent font-medium">Free</span>
                </div>
                <div className="border-t border-border pt-4 flex justify-between">
                  <span className="font-medium text-foreground">Total</span>
                  <span className="font-serif text-xl font-bold text-foreground">
                    {formatPrice(totalPrice)}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  size="lg"
                  className="w-full bg-accent hover:bg-gold-light text-accent-foreground"
                  onClick={handleWhatsAppCheckout}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Order via WhatsApp
                </Button>

                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="w-full"
                >
                  <Link to="/checkout">
                    Checkout with Account
                  </Link>
                </Button>

                <div className="bg-secondary rounded-lg p-4 text-center">
                  <p className="text-sm text-muted-foreground mb-2">
                    Payment via Lumicash
                  </p>
                  <p className="font-medium text-foreground">Muganga Patience</p>
                  <p className="text-accent font-bold">69966695</p>
                </div>
              </div>

              <button
                onClick={clearCart}
                className="w-full mt-4 text-sm text-muted-foreground hover:text-destructive transition-colors"
              >
                Clear Cart
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default Cart;
