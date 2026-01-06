import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Search, ShoppingBag, Tag, History, ExternalLink } from "lucide-react";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command";
import { useFilteredProducts } from "@/hooks/useProducts";
import { formatPrice } from "@/hooks/useProducts";
import { hapticFeedback } from "@/lib/haptics";

export function GlobalSearch() {
    const [open, setOpen] = React.useState(false);
    const navigate = useNavigate();

    // Use a minimal filter to get a list of products for search
    const { data: products } = useFilteredProducts({
        search: '',
        sort: 'newest'
    });

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };

        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    const runCommand = React.useCallback((command: () => void) => {
        setOpen(false);
        command();
        hapticFeedback.light();
    }, []);

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground bg-secondary/50 rounded-full hover:bg-secondary transition-colors border border-border"
            >
                <Search className="w-4 h-4" />
                <span className="hidden md:inline">Search products...</span>
                <kbd className="hidden md:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">
                    <span className="text-xs">⌘</span>K
                </kbd>
            </button>

            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder="Type to search products..." />
                <CommandList className="max-h-[80vh] md:max-h-[500px]">
                    <CommandEmpty>No results found.</CommandEmpty>

                    <CommandGroup heading="Product Categories">
                        <CommandItem onSelect={() => runCommand(() => navigate('/shop/men'))}>
                            <Tag className="mr-2 h-4 w-4" />
                            <span>Men's Collection</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => navigate('/shop/women'))}>
                            <Tag className="mr-2 h-4 w-4" />
                            <span>Women's Collection</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => navigate('/shop/kids'))}>
                            <Tag className="mr-2 h-4 w-4" />
                            <span>Kids' Collection</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => navigate('/shop/cake'))}>
                            <Tag className="mr-2 h-4 w-4" />
                            <span>Cakes & Treats</span>
                        </CommandItem>
                    </CommandGroup>

                    <CommandSeparator />

                    <CommandGroup heading="Featured Products">
                        {products?.slice(0, 5).map((product) => (
                            <CommandItem
                                key={product.id}
                                onSelect={() => runCommand(() => navigate(`/product/${product.id}`))}
                                className="flex items-center justify-between"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded bg-secondary overflow-hidden">
                                        <img src={product.image_url || ''} alt="" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-medium">{product.name}</span>
                                        <span className="text-xs text-muted-foreground">{product.category}</span>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="font-semibold text-accent">{formatPrice(product.price)}</span>
                                    {product.discount && (
                                        <span className="text-[10px] text-red-500 bg-red-100 dark:bg-red-900/30 px-1 rounded">-{product.discount}%</span>
                                    )}
                                </div>
                            </CommandItem>
                        ))}
                    </CommandGroup>

                    <CommandSeparator />

                    <CommandGroup heading="Quick Links">
                        <CommandItem onSelect={() => runCommand(() => navigate('/shop'))}>
                            <ShoppingBag className="mr-2 h-4 w-4" />
                            <span>View All Shop</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => navigate('/orders'))}>
                            <History className="mr-2 h-4 w-4" />
                            <span>My Orders</span>
                        </CommandItem>
                    </CommandGroup>
                </CommandList>
            </CommandDialog>
        </>
    );
}
