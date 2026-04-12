import { ReactNode, useState, useEffect } from "react";
import { 
  LayoutDashboard, 
  Package, 
  BarChart3, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Bell,
  Search,
  User,
  Sun,
  Moon,
  Monitor
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface LayoutProps {
  children: ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Layout({ children, activeTab, onTabChange }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems = [
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { id: "inventory", icon: Package, label: "Inventory" },
    { id: "analytics", icon: BarChart3, label: "Analytics" },
    { id: "settings", icon: Settings, label: "Settings" },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#0A0A0A] flex text-foreground transition-colors duration-300">
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-[#111] border-r border-border transition-all duration-300 ease-in-out lg:relative lg:translate-x-0",
          !isSidebarOpen && "-translate-x-full lg:w-20"
        )}
      >
        <div className="h-full flex flex-col">
          <div className="p-6 flex items-center justify-between">
            <div className={cn("flex items-center gap-3", !isSidebarOpen && "lg:hidden")}>
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
                <Package className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl tracking-tight">LogiTrack</span>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          <nav className="flex-1 px-4 space-y-2 mt-4">
            {navItems.map((item) => (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "secondary" : "ghost"}
                onClick={() => onTabChange(item.id)}
                className={cn(
                  "w-full justify-start gap-3 h-11 px-3 transition-all",
                  activeTab === item.id && "shadow-sm",
                  !isSidebarOpen && "lg:justify-center lg:px-0"
                )}
              >
                <item.icon className={cn("w-5 h-5", activeTab === item.id ? "text-primary" : "text-muted-foreground")} />
                <span className={cn(activeTab === item.id ? "font-semibold" : "font-medium", !isSidebarOpen && "lg:hidden")}>
                  {item.label}
                </span>
              </Button>
            ))}
          </nav>

          <div className="p-4 border-t border-border">
            <Button 
              variant="ghost" 
              className={cn("w-full justify-start gap-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10", !isSidebarOpen && "lg:justify-center lg:px-0")}
            >
              <LogOut className="w-5 h-5" />
              <span className={cn(!isSidebarOpen && "lg:hidden")}>Logout</span>
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white/80 dark:bg-[#111]/80 border-b border-border flex items-center justify-between px-4 lg:px-8 sticky top-0 z-40 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="hover:bg-muted"
            >
              <Menu className="w-5 h-5" />
            </Button>
            <div className="hidden md:flex items-center relative w-96">
              {/* <Search className="absolute left-3 w-4 h-4 text-muted-foreground" /> */}
              {/* <Input 
                placeholder="Search warehouse assets..." 
                className="pl-10 bg-muted/50 border-none focus-visible:ring-1 h-9"
              /> */}
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            {mounted && (
              <DropdownMenu>
                <DropdownMenuTrigger className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "h-9 w-9")}>
                  <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Toggle theme</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setTheme("light")}>
                    <Sun className="mr-2 h-4 w-4" /> Light
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("dark")}>
                    <Moon className="mr-2 h-4 w-4" /> Dark
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("system")}>
                    <Monitor className="mr-2 h-4 w-4" /> System
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* <Button variant="ghost" size="icon" className="relative h-9 w-9">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full border-2 border-white dark:border-[#111]" />
            </Button> */}
            <div className="h-8 w-px bg-border mx-2 hidden sm:block" />
            <div className="flex items-center gap-3 pl-2">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold">User Name</p>
                <p className="text-xs text-muted-foreground">Warehouse Admin</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 shadow-inner">
                <User className="w-5 h-5 text-primary" />
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
