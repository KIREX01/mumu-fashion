import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ProductCategory } from "@/hooks/useProducts";
import { useState, useEffect } from "react";

interface FilterSidebarProps {
  onFilterChange: (filters: any) => void;
  initialFilters?: any;
}

export const FilterSidebar = ({ onFilterChange, initialFilters }: FilterSidebarProps) => {
  const [categories, setCategories] = useState<ProductCategory[]>(initialFilters?.category || []);
  const [priceRange, setPriceRange] = useState<[number, number]>(initialFilters?.priceRange || [0, 500000]);
  const [colors, setColors] = useState<string[]>(initialFilters?.colors || []);

  // Debounce filter updates to avoid too many re-renders/fetches
  useEffect(() => {
    const timer = setTimeout(() => {
      onFilterChange({
        category: categories,
        minPrice: priceRange[0],
        maxPrice: priceRange[1],
        colors: colors
      });
    }, 500);
    return () => clearTimeout(timer);
  }, [categories, priceRange, colors]); // Removed onFilterChange from deps to avoid loop if not memoized

  const toggleCategory = (cat: ProductCategory) => {
    setCategories(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const toggleColor = (color: string) => {
    setColors(prev => 
      prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
    );
  };

  const availableCategories: { label: string; value: ProductCategory }[] = [
    { label: "Men", value: "men" },
    { label: "Women", value: "women" },
    { label: "Kids", value: "kids" },
    { label: "Shoes", value: "shoes" },
    { label: "Accessories", value: "accessories" },
    { label: "Cakes", value: "cake" },
  ];

  const availableColors = ["black", "white", "red", "blue", "green", "yellow", "pink"];

  return (
    <div className="space-y-8 p-4 border rounded-lg bg-card text-card-foreground">
      <div>
        <h3 className="font-semibold mb-4">Categories</h3>
        <div className="space-y-2">
          {availableCategories.map((cat) => (
            <div key={cat.value} className="flex items-center space-x-2">
              <Checkbox 
                id={`cat-${cat.value}`} 
                checked={categories.includes(cat.value)}
                onCheckedChange={() => toggleCategory(cat.value)}
              />
              <Label htmlFor={`cat-${cat.value}`}>{cat.label}</Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-4">Price Range (BIF)</h3>
        <Slider
          defaultValue={[0, 500000]}
          max={1000000}
          step={1000}
          value={priceRange}
          onValueChange={(val) => setPriceRange(val as [number, number])}
          className="mb-2"
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{priceRange[0]}</span>
          <span>{priceRange[1]}</span>
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-4">Colors</h3>
        <div className="flex flex-wrap gap-2">
          {availableColors.map((color) => (
            <button
              key={color}
              onClick={() => toggleColor(color)}
              className={`w-6 h-6 rounded-full border-2 ${
                colors.includes(color) ? 'border-primary ring-2 ring-offset-1' : 'border-transparent'
              }`}
              style={{ backgroundColor: color }}
              aria-label={`Select ${color}`}
            />
          ))}
        </div>
      </div>
      
      <Button 
        variant="outline" 
        className="w-full"
        onClick={() => {
          setCategories([]);
          setPriceRange([0, 500000]);
          setColors([]);
        }}
      >
        Reset Filters
      </Button>
    </div>
  );
};
