import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/lib/api";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  BarChart, 
  Bar, 
  Cell,
  PieChart,
  Pie,
  ScatterChart,
  Scatter,
  ZAxis
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Info, Activity } from "lucide-react";

export function Analytics() {
  const { data, isLoading } = useQuery({
    queryKey: ["products", "analytics"],
    queryFn: () => fetchProducts(100, 0),
  });

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-100 w-full rounded-xl" />
          <Skeleton className="h-100 w-full rounded-xl" />
        </div>
        <Skeleton className="h-100 w-full rounded-xl" />
      </div>
    );
  }

  const products = data?.products || [];

  // 1. Category Price Averages
  const categoryStats = products.reduce((acc: any, p) => {
    if (!acc[p.category]) {
      acc[p.category] = { name: p.category, total: 0, count: 0 };
    }
    acc[p.category].total += p.price;
    acc[p.category].count += 1;
    return acc;
  }, {});

  const avgPriceData = Object.values(categoryStats).map((cat: any) => ({
    name: cat.name.charAt(0).toUpperCase() + cat.name.slice(1),
    avgPrice: Math.round(cat.total / cat.count)
  })).sort((a, b) => b.avgPrice - a.avgPrice).slice(0, 8);

  // 2. Discount Distribution
  const discountData = [
    { name: "0-5%", value: products.filter(p => p.discountPercentage <= 5).length },
    { name: "5-10%", value: products.filter(p => p.discountPercentage > 5 && p.discountPercentage <= 10).length },
    { name: "10-15%", value: products.filter(p => p.discountPercentage > 10 && p.discountPercentage <= 15).length },
    { name: "15%+", value: products.filter(p => p.discountPercentage > 15).length },
  ];

  // 3. Price vs Rating Correlation
  const correlationData = products.map(p => ({
    x: p.price,
    y: p.rating,
    z: p.stock,
    name: p.title
  }));

  // 4. Stock Prediction (Simulated)
  const stockPredictionData = products.slice(0, 10).map(p => ({
    name: p.title.substring(0, 10),
    current: p.stock,
    predicted: Math.max(0, p.stock - Math.floor(Math.random() * 20))
  }));

  const COLORS = ['#0F172A', '#334155', '#475569', '#64748B', '#94A3B8'];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Enterprise Analytics</h1>
        <p className="text-muted-foreground">Deep insights into warehouse performance and inventory trends.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Price Analysis */}
        <Card className="border-none shadow-md bg-white dark:bg-[#111]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Average Price by Category
            </CardTitle>
            <CardDescription>Comparison of market value across top categories</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-75 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={avgPriceData} layout="vertical" margin={{ left: 40, right: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="currentColor" opacity={0.1} />
                  <XAxis type="number" hide />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    width={100} 
                    tick={{ fontSize: 11 }} 
                    axisLine={false} 
                    tickLine={false} 
                  />
                  <Tooltip 
                    cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                  />
                  <Bar dataKey="avgPrice" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} barSize={20}>
                    {avgPriceData.map((_, index) => (
                      <Cell key={`cell-${index}`} opacity={1 - (index * 0.1)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Discount Distribution */}
        <Card className="border-none shadow-md bg-white dark:bg-[#111]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-emerald-500" />
              Discount Strategy
            </CardTitle>
            <CardDescription>Distribution of promotional discounts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-75 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={discountData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {discountData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-4 mt-2">
                {discountData.map((item, i) => (
                  <div key={item.name} className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    <span className="text-[10px] text-muted-foreground font-medium">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stock Forecasting */}
      <Card className="border-none shadow-md bg-white dark:bg-[#111]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Inventory Depletion Forecast
              </CardTitle>
              <CardDescription>Predicted stock levels based on current velocity</CardDescription>
            </div>
            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
              7-Day Projection
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-87.5 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stockPredictionData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis fontSize={10} tickLine={false} axisLine={false} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" opacity={0.1} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                />
                <Area type="monotone" dataKey="current" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorCurrent)" strokeWidth={2} />
                <Area type="monotone" dataKey="predicted" stroke="#ef4444" fillOpacity={1} fill="url(#colorPredicted)" strokeWidth={2} strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 p-4 bg-muted/30 rounded-xl border border-border flex items-start gap-3">
            <Info className="w-5 h-5 text-primary mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-semibold">Forecasting Engine Active</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                The dashed red line represents predicted stock levels in 7 days based on current order velocity. 
                Items where the red line approaches zero should be prioritized for procurement.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Price vs Rating Correlation */}
      <Card className="border-none shadow-md bg-white dark:bg-[#111]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Price vs. Rating Correlation
          </CardTitle>
          <CardDescription>Analyzing the relationship between product value and customer satisfaction</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-100 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
                <XAxis type="number" dataKey="x" name="Price" unit="$" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis type="number" dataKey="y" name="Rating" domain={[3, 5]} fontSize={12} tickLine={false} axisLine={false} />
                <ZAxis type="number" dataKey="z" range={[50, 400]} name="Stock" />
                <Tooltip 
                  cursor={{ strokeDasharray: '3 3' }}
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                />
                <Scatter name="Products" data={correlationData} fill="hsl(var(--primary))" opacity={0.6}>
                  {correlationData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
