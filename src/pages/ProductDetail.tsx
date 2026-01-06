import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useProduct, formatPrice } from '@/hooks/useProducts';
import { useCart } from '@/contexts/CartContext';
import { useWishlistOperations } from '@/hooks/useWishlist';
import { useReviews, useAddReview } from '@/hooks/useReviews';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { useState } from 'react';
import { Heart, Star, ShoppingBag } from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { SEO } from '@/components/layout/SEO';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading } = useProduct(id || '');
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlistOperations();
  const { toast } = useToast();

  const { data: reviews, isLoading: reviewsLoading } = useReviews(id || '');
  const addReview = useAddReview();

  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewImages, setReviewImages] = useState<File[]>([]);

  const handleAddToCart = () => {
    if (!product) return;
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      toast({
        title: "Please select a size",
        variant: "destructive",
      });
      return;
    }

    addToCart(product, selectedSize || 'One Size', 1);

    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const stockQuantity = (product as any)?.stock_quantity ?? 10;
  const isLowStock = stockQuantity > 0 && stockQuantity <= 5;

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    try {
      const uploadedImageUrls: string[] = [];

      if (reviewImages.length > 0) {
        for (const file of reviewImages) {
          const fileExt = file.name.split('.').pop();
          const fileName = `${Math.random()}.${fileExt}`;
          const filePath = `${id}/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from('product-reviews')
            .upload(filePath, file);

          if (uploadError) throw uploadError;

          const { data: { publicUrl } } = supabase.storage
            .from('product-reviews')
            .getPublicUrl(filePath);

          uploadedImageUrls.push(publicUrl);
        }
      }

      await addReview.mutateAsync({
        productId: id,
        rating: reviewRating,
        comment: reviewComment,
        images: uploadedImageUrls,
      });
      setReviewComment('');
      setReviewRating(5);
      setReviewImages([]);
    } catch (error) {
      // Error handled in hook
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-2 gap-8">
            <Skeleton className="aspect-square rounded-lg" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-24 w-full" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!product) return <div>Product not found</div>;

  return (
    <Layout>
      <SEO
        title={`${product.name} | Mumu Style Shop`}
        description={product.description || undefined}
        image={product.image_url || undefined}
      />
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Image */}
          <div className="relative group overflow-hidden rounded-lg bg-secondary/20">
            <img
              src={product.image_url || '/placeholder.svg'}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {product.discount && (
              <Badge className="absolute top-4 left-4 bg-red-500 hover:bg-red-600">
                -{product.discount}%
              </Badge>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-start">
                <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground">
                  {product.name}
                </h1>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => addToWishlist.mutate(product.id)}
                  className="text-muted-foreground hover:text-red-500"
                >
                  <Heart className="h-6 w-6" />
                </Button>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center text-yellow-400">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="ml-1 text-foreground font-medium">{product.rating || 0}</span>
                </div>
                <span className="text-muted-foreground">({product.reviews_count || 0} reviews)</span>
              </div>
              <div className="flex items-center gap-4 mt-4">
                <p className="text-2xl font-medium text-primary">
                  {formatPrice(product.price)}
                </p>
                {isLowStock ? (
                  <Badge variant="outline" className="text-orange-500 border-orange-500 animate-pulse">
                    Only {stockQuantity} left!
                  </Badge>
                ) : stockQuantity > 0 ? (
                  <Badge variant="outline" className="text-green-500 border-green-500">
                    In Stock
                  </Badge>
                ) : (
                  <Badge variant="destructive">Out of Stock</Badge>
                )}
              </div>
            </div>

            <p className="text-muted-foreground leading-relaxed">
              {product.description}
            </p>

            {/* Colors */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-3">
                <Label>Color</Label>
                <div className="flex gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-8 h-8 rounded-full border-2 ${selectedColor === color ? 'border-primary ring-2 ring-offset-2' : 'border-transparent'
                        }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-3">
                <Label>Size</Label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <Toggle
                      key={size}
                      pressed={selectedSize === size}
                      onPressedChange={() => setSelectedSize(size)}
                      variant="outline"
                      className="min-w-[3rem]"
                    >
                      {size}
                    </Toggle>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-6 flex gap-4">
              <Button onClick={handleAddToCart} size="lg" className="flex-1">
                <ShoppingBag className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16 md:mt-24">
          <h2 className="text-2xl font-serif font-bold mb-8">Customer Reviews</h2>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Review List */}
            <div className="space-y-6">
              {reviewsLoading ? (
                <p>Loading reviews...</p>
              ) : reviews && reviews.length > 0 ? (
                reviews.map((review) => (
                  <Card key={review.id} className="bg-card/50">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3 mb-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{review.profiles?.full_name?.[0] || 'U'}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{review.profiles?.full_name || 'Anonymous'}</p>
                          <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`h-3 w-3 ${i < review.rating ? 'fill-current' : 'text-gray-300'}`} />
                            ))}
                          </div>
                        </div>
                        <span className="ml-auto text-xs text-muted-foreground">
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{review.comment}</p>
                      {review.images && (review.images as string[]).length > 0 && (
                        <div className="flex gap-2 flex-wrap">
                          {(review.images as string[]).map((img: string, i: number) => (
                            <div key={i} className="relative aspect-square w-16 overflow-hidden rounded-md border border-border group/img">
                              <img
                                src={img}
                                alt="Review"
                                className="h-full w-full object-cover transition-transform group-hover/img:scale-110 cursor-zoom-in"
                                onClick={() => window.open(img, '_blank')}
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="text-muted-foreground italic text-center py-8">No reviews yet. Be the first to review!</p>
              )}
            </div>

            {/* Write Review Form */}
            <div className="glass-card p-6 rounded-2xl h-fit">
              <h3 className="font-serif text-xl font-semibold mb-4">Write a Review</h3>
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Rating</Label>
                  <div className="flex gap-1 mt-1.5 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        className={`transition-all hover:scale-110 ${star <= reviewRating ? 'text-yellow-400' : 'text-gray-300'}`}
                      >
                        <Star className={`h-6 w-6 ${star <= reviewRating ? 'fill-current' : ''}`} />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="review" className="text-sm font-medium">Your Experience</Label>
                  <Textarea
                    id="review"
                    placeholder="What did you like about this product?"
                    className="min-h-[100px] resize-none"
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="images" className="text-sm font-medium">Add Photos</Label>
                  <div className="flex flex-col gap-3">
                    <input
                      id="images"
                      type="file"
                      multiple
                      accept="image/*"
                      className="text-xs file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-primary-foreground hover:file:opacity-90 cursor-pointer"
                      onChange={(e) => {
                        if (e.target.files) {
                          setReviewImages(Array.from(e.target.files));
                        }
                      }}
                    />
                    {reviewImages.length > 0 && (
                      <div className="flex gap-2 flex-wrap">
                        {reviewImages.map((file, i) => (
                          <div key={i} className="text-[10px] bg-secondary px-2 py-1 rounded-md text-muted-foreground">
                            {file.name.slice(0, 15)}...
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <Button type="submit" disabled={addReview.isPending} className="w-full h-12 rounded-xl">
                  {addReview.isPending ? 'Publishing...' : 'Submit Review'}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetail;