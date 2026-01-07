import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Pencil, Trash, Image as ImageIcon } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProductCategory, useProducts } from '@/hooks/useProducts';

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  in_stock: boolean;
  featured: boolean;
  image_url: string;
  sizes: string[];
  colors: string[];
}

const initialFormData: ProductFormData = {
  name: '',
  description: '',
  price: 0,
  category: 'men',
  in_stock: true,
  featured: false,
  image_url: '',
  sizes: [],
  colors: [],
};

export const ProductManager = () => {
  const { data: products, isLoading } = useProducts();
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<ProductFormData>(initialFormData);
  const [uploading, setUploading] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('products')
        .getPublicUrl(filePath);

      setFormData({ ...formData, image_url: data.publicUrl });
      toast({ title: 'Image uploaded successfully' });
    } catch (error: any) {
      toast({ 
        title: 'Error uploading image', 
        description: error.message, 
        variant: 'destructive' 
      });
    } finally {
      setUploading(false);
    }
  };

  const mutation = useMutation({
    mutationFn: async (data: ProductFormData) => {
      if (editingId) {
        const { error } = await supabase
          .from('products')
          .update(data)
          .eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('products')
          .insert(data);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setIsOpen(false);
      setEditingId(null);
      setFormData(initialFormData);
      toast({ title: `Product ${editingId ? 'updated' : 'created'} successfully` });
    },
    onError: (error: any) => {
      toast({ 
        title: 'Error', 
        description: error.message, 
        variant: 'destructive' 
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({ title: 'Product deleted' });
    },
  });

  const handleEdit = (product: any) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price,
      category: product.category,
      in_stock: product.in_stock,
      featured: product.featured,
      image_url: product.image_url || '',
      sizes: product.sizes || [],
      colors: product.colors || [],
    });
    setIsOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Products</h2>
        <Dialog open={isOpen} onOpenChange={(open) => {
          setIsOpen(open);
          if (!open) {
            setEditingId(null);
            setFormData(initialFormData);
          }
        }}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" /> Add Product</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? 'Edit Product' : 'Add New Product'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input 
                    value={formData.name} 
                    onChange={(e) => setFormData({...formData, name: e.target.value})} 
                  />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(val) => setFormData({...formData, category: val as ProductCategory})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="men">Men</SelectItem>
                      <SelectItem value="women">Women</SelectItem>
                      <SelectItem value="kids">Kids</SelectItem>
                      <SelectItem value="shoes">Shoes</SelectItem>
                      <SelectItem value="accessories">Accessories</SelectItem>
                      <SelectItem value="cake">Cake</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea 
                  value={formData.description} 
                  onChange={(e) => setFormData({...formData, description: e.target.value})} 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Price (BIF)</Label>
                  <Input 
                    type="number"
                    value={formData.price} 
                    onChange={(e) => setFormData({...formData, price: Number(e.target.value)})} 
                  />
                </div>
                <div className="space-y-2">
                  <Label>Image</Label>
                  <div className="flex gap-2">
                    <Input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageUpload}
                      disabled={uploading} 
                    />
                    {uploading && <span className="text-sm self-center">Uploading...</span>}
                  </div>
                  {formData.image_url && (
                    <img src={formData.image_url} alt="Preview" className="h-20 w-20 object-cover rounded mt-2" />
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Sizes (comma separated)</Label>
                <Input 
                  value={formData.sizes.join(', ')} 
                  onChange={(e) => setFormData({...formData, sizes: e.target.value.split(',').map(s => s.trim()).filter(Boolean)})}
                  placeholder="S, M, L, XL"
                />
              </div>

              <div className="space-y-2">
                <Label>Colors (comma separated)</Label>
                <Input 
                  value={formData.colors.join(', ')} 
                  onChange={(e) => setFormData({...formData, colors: e.target.value.split(',').map(s => s.trim()).filter(Boolean)})}
                  placeholder="red, blue, green"
                />
              </div>

              <div className="flex gap-8 pt-4">
                <div className="flex items-center space-x-2">
                  <Switch 
                    checked={formData.in_stock} 
                    onCheckedChange={(checked) => setFormData({...formData, in_stock: checked})}
                  />
                  <Label>In Stock</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch 
                    checked={formData.featured} 
                    onCheckedChange={(checked) => setFormData({...formData, featured: checked})}
                  />
                  <Label>Featured</Label>
                </div>
              </div>

              <Button 
                onClick={() => mutation.mutate(formData)} 
                className="w-full mt-4" 
                disabled={mutation.isPending || uploading}
              >
                {mutation.isPending ? 'Saving...' : 'Save Product'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Mobile View (Cards) */}
      <div className="md:hidden space-y-4">
        {isLoading ? (
          <div className="text-center py-4">Loading...</div>
        ) : products?.map((product) => (
          <div key={product.id} className="bg-card border rounded-lg overflow-hidden shadow-sm">
            <div className="flex p-4 gap-4">
              <div className="h-20 w-20 flex-shrink-0 bg-muted rounded overflow-hidden">
                {product.image_url ? (
                  <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center">
                    <ImageIcon className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium truncate pr-2">{product.name}</h3>
                  <div className="flex flex-col items-end">
                    <span className="font-bold text-sm">{product.price.toLocaleString()} BIF</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground capitalize mt-1">{product.category}</p>
                
                <div className="flex justify-between items-center mt-3">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${product.in_stock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {product.in_stock ? 'In Stock' : 'Out of Stock'}
                  </span>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={() => handleEdit(product)}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 w-8 p-0 text-destructive hover:text-destructive" onClick={() => {
                      if (confirm('Are you sure you want to delete this product?')) {
                        deleteMutation.mutate(product.id);
                      }
                    }}>
                      <Trash className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop View (Table) */}
      <div className="rounded-md border hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={6} className="text-center">Loading...</TableCell></TableRow>
            ) : products?.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.name} className="h-10 w-10 object-cover rounded" />
                  ) : (
                    <ImageIcon className="h-10 w-10 text-muted-foreground" />
                  )}
                </TableCell>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>{product.price.toLocaleString()} BIF</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${product.in_stock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {product.in_stock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(product)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-destructive" onClick={() => {
                    if (confirm('Are you sure you want to delete this product?')) {
                      deleteMutation.mutate(product.id);
                    }
                  }}>
                    <Trash className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
