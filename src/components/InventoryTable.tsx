import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  ArrowUpDown,
  Plus,
  Minus,
  CheckSquare,
  X,
  DollarSign,
  Tag
} from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { fetchCategories } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Product } from "@/types/inventory";
import { motion, AnimatePresence } from "motion/react";
import { useInventory } from "./providers/InventoryProvider";

interface InventoryTableProps {
  onViewDetails: (product: Product) => void;
  onEditProduct: (product: Product) => void;
}

export function InventoryTable({ onViewDetails, onEditProduct }: InventoryTableProps) {
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);
  
  const limit = 10;
  const LOW_STOCK_THRESHOLD = 10;

  const { 
    products, 
    total, 
    isLoading, 
    refreshProducts, 
    deleteProduct, 
    updateProduct,
    batchDelete 
  } = useInventory();

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  useEffect(() => {
    refreshProducts(limit, page * limit, search, category);
  }, [page, search, category, refreshProducts]);

  const handleUpdateStock = (product: Product, delta: number) => {
    const nextStock = Math.max(0, product.stock + delta);
    
    if (nextStock < LOW_STOCK_THRESHOLD && product.stock >= LOW_STOCK_THRESHOLD) {
      toast.warning("Critical Low Stock!", {
        description: `${product.title} is below ${LOW_STOCK_THRESHOLD} units.`
      });
    }
    
    updateProduct({ ...product, stock: nextStock });
  };

  const getStockBadge = (stock: number) => {
    if (stock === 0) return <Badge variant="destructive">Out of Stock</Badge>;
    if (stock < LOW_STOCK_THRESHOLD) return <Badge variant="outline" className="text-red-600 border-red-200 bg-red-50 dark:bg-red-900/20">Critical</Badge>;
    if (stock < 20) return <Badge variant="outline" className="text-orange-600 border-orange-200 bg-orange-50 dark:bg-orange-900/20">Low Stock</Badge>;
    return <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50 dark:bg-emerald-900/20">Optimal</Badge>;
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === products.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(products.map(p => p.id));
    }
  };

  const toggleSelect = (id: number) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleBatchAction = (action: string) => {
    if (action === "Deletion") {
      batchDelete(selectedIds);
      setSelectedIds([]);
      return;
    }

    if (action === "Price Update") {
      selectedIds.forEach(id => {
        const product = products.find(p => p.id === id);
        if (product) {
          updateProduct({ ...product, price: Math.round(product.price * 1.1) }); // 10% increase for demo
        }
      });
      toast.success("Batch price update (10% increase) applied");
      setSelectedIds([]);
      return;
    }

    if (action === "Category Change") {
      selectedIds.forEach(id => {
        const product = products.find(p => p.id === id);
        if (product) {
          updateProduct({ ...product, category: "groceries" }); // Move to groceries for demo
        }
      });
      toast.success("Batch category change applied");
      setSelectedIds([]);
      return;
    }

    toast.success(`Batch ${action} initiated`, {
      description: `Processing ${selectedIds.length} items...`
    });
  };

  const confirmDelete = () => {
    if (productToDelete) {
      deleteProduct(productToDelete);
      setProductToDelete(null);
    }
  };

  return (
    <div className="space-y-4 mt-8 relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold">Inventory Management</h2>
          <p className="text-sm text-muted-foreground">Manage stock levels and perform batch operations.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search products..." 
              className="pl-9"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(0);
              }}
            />
          </div>
          <Select value={category} onValueChange={(val) => {
            setCategory(val || "all");
            setPage(0);
          }}>
            <SelectTrigger className="w-full md:w-48">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories?.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Batch Actions Bar */}
      <AnimatePresence>
        {selectedIds.length > 0 && (
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-primary text-primary-foreground px-6 py-3 rounded-full shadow-2xl flex items-center gap-6 border border-primary-foreground/20 backdrop-blur-md"
          >
            <div className="flex items-center gap-2 border-r border-primary-foreground/20 pr-6">
              <CheckSquare className="w-5 h-5" />
              <span className="font-bold">{selectedIds.length} items selected</span>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-primary-foreground hover:bg-white/10"
                onClick={() => handleBatchAction("Price Update")}
              >
                <DollarSign className="w-4 h-4 mr-2" /> Update Price
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-primary-foreground hover:bg-white/10"
                onClick={() => handleBatchAction("Category Change")}
              >
                <Tag className="w-4 h-4 mr-2" /> Change Category
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="hover:bg-red-500/20 text-red-200"
                onClick={() => handleBatchAction("Deletion")}
              >
                <Trash2 className="w-4 h-4 mr-2" /> Delete
              </Button>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-primary-foreground hover:bg-white/10 ml-2"
              onClick={() => setSelectedIds([])}
            >
              <X className="w-4 h-4" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="border rounded-xl bg-white dark:bg-[#111] overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30">
              <TableHead className="w-10">
                <Checkbox 
                  checked={selectedIds.length === products.length && products.length > 0}
                  onCheckedChange={toggleSelectAll}
                />
              </TableHead>
              <TableHead className="w-20">Image</TableHead>
              <TableHead className="min-w-50">
                <div className="flex items-center gap-1 cursor-pointer hover:text-foreground transition-colors">
                  Product Name <ArrowUpDown className="w-3 h-3" />
                </div>
              </TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center">Stock Level</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="w-4 h-4" /></TableCell>
                  <TableCell><Skeleton className="w-10 h-10 rounded" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-24 mx-auto rounded" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-8 ml-auto rounded" /></TableCell>
                </TableRow>
              ))
            ) : products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="h-32 text-center text-muted-foreground">
                  No products found matching your criteria.
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow 
                  key={product.id} 
                  className={cn(
                    "group hover:bg-muted/20 transition-colors",
                    selectedIds.includes(product.id) && "bg-primary/5 dark:bg-primary/10"
                  )}
                >
                  <TableCell>
                    <Checkbox 
                      checked={selectedIds.includes(product.id)}
                      onCheckedChange={() => toggleSelect(product.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <img 
                      src={product.thumbnail} 
                      alt={product.title} 
                      className="w-10 h-10 rounded object-cover border border-border"
                      referrerPolicy="no-referrer"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{product.title}</TableCell>
                  <TableCell className="text-xs font-mono text-muted-foreground">{product.sku}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-normal capitalize">
                      {product.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-semibold">${product.price}</TableCell>
                  <TableCell>{getStockBadge(product.stock)}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-2">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-7 w-7"
                        onClick={() => handleUpdateStock(product, -1)}
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className={cn(
                        "w-8 text-center font-mono font-bold",
                        product.stock < LOW_STOCK_THRESHOLD ? "text-red-600 animate-pulse" : 
                        product.stock < 20 ? "text-orange-600" : "text-foreground"
                      )}>
                        {product.stock}
                      </span>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-7 w-7"
                        onClick={() => handleUpdateStock(product, 1)}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "h-8 w-8")}>
                        <MoreHorizontal className="w-4 h-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem onClick={() => onViewDetails(product)}>
                          <Eye className="w-4 h-4 mr-2" /> View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEditProduct(product)}>
                          <Edit className="w-4 h-4 mr-2" /> Edit Product
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-destructive"
                          onClick={() => setProductToDelete(product.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-2 py-4">
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-medium">{page * limit + 1}</span> to <span className="font-medium">{Math.min((page + 1) * limit, total)}</span> of <span className="font-medium">{total}</span> products
        </p>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0 || isLoading}
          >
            <ChevronLeft className="w-4 h-4 mr-1" /> Previous
          </Button>
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, Math.ceil(total / limit)) }).map((_, i) => (
              <Button
                key={i}
                variant={page === i ? "default" : "ghost"}
                size="sm"
                className="w-8 h-8 p-0"
                onClick={() => setPage(i)}
                disabled={isLoading}
              >
                {i + 1}
              </Button>
            ))}
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setPage(p => p + 1)}
            disabled={(page + 1) * limit >= total || isLoading}
          >
            Next <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!productToDelete} onOpenChange={(open) => !open && setProductToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the product
              from the warehouse inventory database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete Product
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
