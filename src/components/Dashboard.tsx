import { useQuery } from "@tanstack/react-query";
import { 
  Package, 
  AlertTriangle, 
  TrendingUp, 
  DollarSign,
  ArrowUpRight,
  Activity,
  Layers
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { fetchProducts } from "@/lib/api";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function Dashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ["products", "dashboard"],
    queryFn: () => fetchProducts(100, 0),
  });

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 w-full rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
          <Skeleton className="lg:col-span-4 h-100 w-full rounded-xl" />
          <Skeleton className="lg:col-span-3 h-100 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  const products = data?.products || [];
  const LOW_STOCK_THRESHOLD = 10;

  const stats = {
    totalProducts: products.length,
    totalStock: products.reduce((acc, p) => acc + p.stock, 0),
    lowStock: products.filter(p => p.stock < LOW_STOCK_THRESHOLD).length,
    totalValue: products.reduce((acc, p) => acc + (p.price * p.stock), 0),
    categories: new Set(products.map(p => p.category)).size,
  };

  const categoryData = products.reduce((acc: any[], p) => {
    const existing = acc.find(item => item.name === p.category);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: p.category, value: 1 });
    }
    return acc;
  }, []).sort((a, b) => b.value - a.value).slice(0, 5);

  const COLORS = ['#0F172A', '#334155', '#475569', '#64748B', '#94A3B8'];

  const lowStockItems = products
    .filter(p => p.stock < LOW_STOCK_THRESHOLD)
    .sort((a, b) => a.stock - b.stock)
    .slice(0, 5);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">LogiTrack Pro Dashboard</h1>
        <p className="text-muted-foreground">Enterprise Warehouse Intelligence & Inventory Forecasting.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-none shadow-md bg-white dark:bg-[#111]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Inventory</CardTitle>
            <div className="w-8 h-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
              <Package className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStock.toLocaleString()}</div>
            <p className="text-xs text-emerald-600 flex items-center gap-1 mt-1">
              <ArrowUpRight className="w-3 h-3" /> +12.5% vs last month
            </p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md bg-white dark:bg-[#111]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Critical Stock</CardTitle>
            <div className="w-8 h-8 bg-red-50 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.lowStock}</div>
            <p className="text-xs text-muted-foreground mt-1 font-medium">
              Threshold: &lt;{LOW_STOCK_THRESHOLD} units
            </p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md bg-white dark:bg-[#111]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Asset Value</CardTitle>
            <div className="w-8 h-8 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalValue.toLocaleString()}</div>
            <p className="text-xs text-emerald-600 flex items-center gap-1 mt-1">
              <ArrowUpRight className="w-3 h-3" /> +5.4% asset growth
            </p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md bg-white dark:bg-[#111]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Zones</CardTitle>
            <div className="w-8 h-8 bg-purple-50 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
              <Layers className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.categories}</div>
            <p className="text-xs text-muted-foreground mt-1">Across all warehouse zones</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4 border-none shadow-md bg-white dark:bg-[#111]">
          <CardHeader>
            <CardTitle>Category Distribution</CardTitle>
            <CardDescription>Top 5 categories by product count</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-87.5">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" opacity={0.1} />
                  <XAxis 
                    dataKey="name" 
                    stroke="#888888" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false}
                    tickFormatter={(val) => val.charAt(0).toUpperCase() + val.slice(1)}
                  />
                  <YAxis 
                    stroke="#888888" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false}
                    tickFormatter={(value) => `${value}`}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {categoryData?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 border-none shadow-md bg-white dark:bg-[#111]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Low Stock Predictor</CardTitle>
                <CardDescription>Items requiring immediate reorder</CardDescription>
              </div>
              <Activity className="w-5 h-5 text-red-600 animate-pulse" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lowStockItems.length === 0 ? (
                <div className="h-50 flex items-center justify-center text-muted-foreground italic">
                  All stock levels are optimal.
                </div>
              ) : (
                lowStockItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                    <img 
                      src={item.thumbnail} 
                      alt={item.title} 
                      className="w-10 h-10 rounded object-cover border border-border"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.title}</p>
                      <p className="text-xs text-muted-foreground capitalize">{item.category}</p>
                    </div>
                    <div className="text-right">
                      <p className={cn(
                        "text-sm font-bold",
                        item.stock === 0 ? "text-red-600" : "text-orange-600"
                      )}>
                        {item.stock} units
                      </p>
                      <Badge variant={item.stock === 0 ? "destructive" : "outline"} className="text-[10px] h-4 px-1">
                        {item.stock === 0 ? "Out" : "Critical"}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
              {lowStockItems.length > 0 && (
                <div className="pt-4 border-t border-border mt-4">
                  <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-100 dark:border-red-900/30">
                    <p className="text-xs font-semibold text-red-700 dark:text-red-400 flex items-center gap-2">
                      <AlertTriangle className="w-3 h-3" /> Action Required
                    </p>
                    <p className="text-[11px] text-red-600/80 dark:text-red-400/80 mt-1">
                      {stats.lowStock} items are currently below the safety threshold. Supply chain delays may impact fulfillment.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
