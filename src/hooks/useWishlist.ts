import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import { useToast } from '@/components/ui/use-toast';

export const useWishlist = () => {
  const { session } = useAuth();
  
  return useQuery({
    queryKey: ['wishlist', session?.user.id],
    queryFn: async () => {
      if (!session?.user.id) return [];
      
      const { data, error } = await supabase
        .from('wishlist')
        .select('*, products(*)')
        .eq('user_id', session.user.id);
        
      if (error) throw error;
      return data;
    },
    enabled: !!session?.user.id,
  });
};

export const useWishlistOperations = () => {
  const queryClient = useQueryClient();
  const { session } = useAuth();
  const { toast } = useToast();

  const addToWishlist = useMutation({
    mutationFn: async (productId: string) => {
      if (!session?.user.id) throw new Error('Must be logged in');
      
      const { error } = await supabase
        .from('wishlist')
        .insert({ user_id: session.user.id, product_id: productId });
        
      if (error) {
        // Ignore duplicate key error (already in wishlist)
        if (error.code === '23505') return;
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      toast({ title: 'Added to wishlist' });
    },
    onError: (error) => {
      toast({ 
        title: 'Error', 
        description: error.message, 
        variant: 'destructive' 
      });
    },
  });

  const removeFromWishlist = useMutation({
    mutationFn: async (productId: string) => {
      if (!session?.user.id) throw new Error('Must be logged in');
      
      const { error } = await supabase
        .from('wishlist')
        .delete()
        .eq('user_id', session.user.id)
        .eq('product_id', productId);
        
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      toast({ title: 'Removed from wishlist' });
    },
    onError: (error) => {
      toast({ 
        title: 'Error', 
        description: error.message, 
        variant: 'destructive' 
      });
    },
  });

  return { addToWishlist, removeFromWishlist };
};
