import React, { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Product } from "@/types/inventory";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface EditProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Product) => void;
}

export function EditProductModal({ product, isOpen, onClose, onSave }: EditProductModalProps) {
  const [formData, setFormData] = useState<Partial<Product>>({});

  useEffect(() => {
    if (product) {
      setFormData(product);
    }
  }, [product]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "price" || name === "stock" || name === "discountPercentage" ? Number(value) : value
    }));
  };

  const handleCategoryChange = (value: string | null) => {
    setFormData(prev => ({ ...prev, category: value || "" }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.id) {
      onSave(formData as Product);
      onClose();
    }
  };

  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Product: {product.title}</DialogTitle>
          <DialogDescription>
            Update the product details in the warehouse inventory system.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
              <Label htmlFor="title">Product Title</Label>
              <Input 
                id="title" 
                name="title" 
                value={formData.title || ""} 
                onChange={handleChange} 
                required 
              />
            </div>
            
            <div className="space-y-2 col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                name="description" 
                value={formData.description || ""} 
                onChange={handleChange} 
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category} onValueChange={handleCategoryChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beauty">Beauty</SelectItem>
                  <SelectItem value="fragrances">Fragrances</SelectItem>
                  <SelectItem value="furniture">Furniture</SelectItem>
                  <SelectItem value="groceries">Groceries</SelectItem>
                  <SelectItem value="home-decoration">Home Decoration</SelectItem>
                  <SelectItem value="kitchen-accessories">Kitchen Accessories</SelectItem>
                  <SelectItem value="laptops">Laptops</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="brand">Brand</Label>
              <Input 
                id="brand" 
                name="brand" 
                value={formData.brand || ""} 
                onChange={handleChange} 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price ($)</Label>
              <Input 
                id="price" 
                name="price" 
                type="number" 
                step="0.01"
                value={formData.price || 0} 
                onChange={handleChange} 
                required 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock">Stock Level</Label>
              <Input 
                id="stock" 
                name="stock" 
                type="number" 
                value={formData.stock || 0} 
                onChange={handleChange} 
                required 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sku">SKU</Label>
              <Input 
                id="sku" 
                name="sku" 
                value={formData.sku || ""} 
                onChange={handleChange} 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="discountPercentage">Discount (%)</Label>
              <Input 
                id="discountPercentage" 
                name="discountPercentage" 
                type="number" 
                step="0.01"
                value={formData.discountPercentage || 0} 
                onChange={handleChange} 
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
