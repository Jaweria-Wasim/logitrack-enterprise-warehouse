import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { Product } from "@/types/inventory";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Package, Tag, Building2, Info } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (product: Product) => void;
}

export function ProductModal({ product, isOpen, onClose, onEdit }: ProductModalProps) {
  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto p-0 gap-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 h-full">
          {/* Left Column: Images */}
          <div className="lg:col-span-5 bg-muted/20 p-6 border-r border-border">
            <div className="sticky top-0 space-y-6">
              <div className="aspect-square rounded-2xl overflow-hidden border border-border bg-white dark:bg-[#111] shadow-sm">
                <img 
                  src={product.thumbnail} 
                  alt={product.title} 
                  className="w-full h-full object-contain p-8"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="grid grid-cols-4 gap-3">
                {product.images.slice(0, 4).map((img, i) => (
                  <div key={i} className="aspect-square rounded-xl overflow-hidden border border-border bg-white dark:bg-[#111] hover:border-primary transition-colors cursor-pointer">
                    <img 
                      src={img} 
                      alt={`${product.title} ${i}`} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Availability Status</span>
                  <Badge variant={product.stock > 0 ? "default" : "destructive"}>
                    {product.availabilityStatus || (product.stock > 0 ? "In Stock" : "Out of Stock")}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">SKU</span>
                  <span className="font-mono font-medium">{product.sku}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Min. Order Qty</span>
                  <span className="font-medium">{product.minimumOrderQuantity || 1} units</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Details */}
          <div className="lg:col-span-7 p-8 space-y-8">
            <DialogHeader>
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="outline" className="px-3 py-1 text-xs uppercase tracking-wider font-semibold">{product.category}</Badge>
                <Badge variant="secondary" className="px-3 py-1 text-xs font-medium">{product.brand || "Generic"}</Badge>
              </div>
              <DialogTitle className="text-3xl font-bold tracking-tight">{product.title}</DialogTitle>
              <DialogDescription className="text-lg mt-2">
                Professional grade {product.category.toLowerCase()} for enterprise warehouse management.
              </DialogDescription>
            </DialogHeader>

            <div className="flex items-center justify-between p-6 rounded-2xl bg-muted/30 border border-border">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Unit Price</p>
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-black">${product.price}</span>
                  {product.discountPercentage > 0 && (
                    <span className="text-sm text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-950/30 px-2.5 py-1 rounded-full border border-emerald-100 dark:border-emerald-900/50">
                      {product.discountPercentage}% OFF
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Performance</p>
                <div className="flex items-center gap-1.5 font-black text-2xl text-yellow-500">
                  <Star className="w-6 h-6 fill-current" />
                  {product.rating}
                </div>
              </div>
            </div>

            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="w-full justify-start h-12 bg-transparent border-b border-border rounded-none p-0 gap-8">
                <TabsTrigger value="overview" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-full px-0 text-base">Overview</TabsTrigger>
                <TabsTrigger value="logistics" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-full px-0 text-base">Logistics</TabsTrigger>
                <TabsTrigger value="reviews" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-full px-0 text-base">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="pt-6 space-y-6">
                <div className="space-y-4">
                  <h4 className="font-bold text-lg flex items-center gap-2">
                    <Info className="w-5 h-5 text-primary" />
                    Product Description
                  </h4>
                  <p className="text-muted-foreground leading-relaxed">
                    {product.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border border-border bg-white dark:bg-[#111] shadow-sm">
                    <p className="text-xs text-muted-foreground font-bold uppercase mb-2">Warranty</p>
                    <p className="font-semibold">{product.warrantyInformation || "Standard 1 Year"}</p>
                  </div>
                  <div className="p-4 rounded-xl border border-border bg-white dark:bg-[#111] shadow-sm">
                    <p className="text-xs text-muted-foreground font-bold uppercase mb-2">Return Policy</p>
                    <p className="font-semibold">{product.returnPolicy || "30 Days Return"}</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="logistics" className="pt-6 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-bold text-sm uppercase tracking-widest text-muted-foreground">Physical Specs</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Weight</span>
                        <span className="font-bold">{product.weight || "0.5"} kg</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Dimensions</span>
                        <span className="font-bold">
                          {product.dimensions ? 
                            `${product.dimensions.width} x ${product.dimensions.height} x ${product.dimensions.depth} cm` : 
                            "10 x 5 x 2 cm"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-bold text-sm uppercase tracking-widest text-muted-foreground">Shipping</h4>
                    <p className="text-sm font-bold">{product.shippingInformation || "Ships in 1-2 business days"}</p>
                  </div>
                </div>
                
                <div className="p-4 rounded-xl bg-muted/50 border border-border">
                  <h4 className="font-bold text-sm mb-3">Inventory Metadata</h4>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <p className="text-muted-foreground mb-1">Created At</p>
                      <p className="font-mono">{product.meta?.createdAt ? new Date(product.meta.createdAt).toLocaleDateString() : "2024-01-15"}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">Barcode</p>
                      <p className="font-mono">{product.meta?.barcode || "1234567890123"}</p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="pt-6 space-y-4">
                {product.reviews && product.reviews.length > 0 ? (
                  product.reviews.map((review, i) => (
                    <div key={i} className="p-4 rounded-xl border border-border space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-sm">{review.reviewerName}</span>
                        <div className="flex items-center gap-1 text-yellow-500">
                          <Star className="w-3 h-3 fill-current" />
                          <span className="text-xs font-bold">{review.rating}</span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground italic">"{review.comment}"</p>
                      <p className="text-[10px] text-muted-foreground">{new Date(review.date).toLocaleDateString()}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No reviews available for this product.
                  </div>
                )}
              </TabsContent>
            </Tabs>

            <div className="pt-8 border-t border-border flex gap-4">
              <Button 
                className="flex-1 h-12 text-base font-bold shadow-lg shadow-primary/20"
                onClick={() => {
                  if (product) {
                    onEdit?.(product);
                    onClose();
                  }
                }}
              >
                Edit Inventory Details
              </Button>
              {/* <Button variant="outline" className="flex-1 h-12 text-base font-bold">
                Generate Full Report
              </Button> */}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
