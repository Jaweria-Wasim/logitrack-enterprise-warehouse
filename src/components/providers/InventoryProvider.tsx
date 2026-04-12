import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from "react";
import { Product, ProductResponse } from "@/types/inventory";
import { fetchProducts as apiFetchProducts } from "@/lib/api";
import { toast } from "sonner";

interface InventoryContextType {
  products: Product[];
  total: number;
  isLoading: boolean;
  deleteProduct: (id: number) => void;
  updateProduct: (product: Product) => void;
  batchDelete: (ids: number[]) => void;
  refreshProducts: (limit: number, skip: number, search: string, category: string) => Promise<void>;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export function InventoryProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [localUpdates, setLocalUpdates] = useState<Record<number, Product>>({});
  const [deletedIds, setDeletedIds] = useState<Set<number>>(new Set());

  const refreshProducts = useCallback(async (limit: number, skip: number, search: string, category: string) => {
    setIsLoading(true);
    try {
      const data = await apiFetchProducts(limit, skip, search, category);
      
      // Merge with local updates and filter out deleted ones
      const mergedProducts = data.products
        .filter(p => !deletedIds.has(p.id))
        .map(p => localUpdates[p.id] || p);
      
      setProducts(mergedProducts);
      setTotal(data.total - deletedIds.size);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      toast.error("Failed to load inventory data");
    } finally {
      setIsLoading(false);
    }
  }, [localUpdates, deletedIds]);

  const deleteProduct = useCallback((id: number) => {
    setDeletedIds(prev => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
    setProducts(prev => prev.filter(p => p.id !== id));
    setTotal(prev => prev - 1);
    toast.success("Product deleted successfully");
  }, []);

  const updateProduct = useCallback((updatedProduct: Product) => {
    setLocalUpdates(prev => ({
      ...prev,
      [updatedProduct.id]: updatedProduct
    }));
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    toast.success("Product updated successfully");
  }, []);

  const batchDelete = useCallback((ids: number[]) => {
    setDeletedIds(prev => {
      const next = new Set(prev);
      ids.forEach(id => next.add(id));
      return next;
    });
    setProducts(prev => prev.filter(p => !ids.includes(p.id)));
    setTotal(prev => prev - ids.length);
    toast.success(`${ids.length} products deleted successfully`);
  }, []);

  return (
    <InventoryContext.Provider value={{ 
      products, 
      total, 
      isLoading, 
      deleteProduct, 
      updateProduct, 
      batchDelete,
      refreshProducts 
    }}>
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const context = useContext(InventoryContext);
  if (context === undefined) {
    throw new Error("useInventory must be used within an InventoryProvider");
  }
  return context;
}
