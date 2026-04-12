/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { QueryProvider } from "./components/providers/QueryProvider";
import { Layout } from "./components/Layout";
import { Dashboard } from "./components/Dashboard";
import { InventoryTable } from "./components/InventoryTable";
import { Analytics } from "./components/Analytics";
import { ProductModal } from "./components/ProductModal";
import { EditProductModal } from "./components/EditProductModal";
import { Product } from "./types/inventory";
import { Toaster } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { ThemeProvider } from "next-themes";
import { InventoryProvider, useInventory } from "./components/providers/InventoryProvider";

function AppContent() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { updateProduct } = useInventory();

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "inventory":
        return <InventoryTable onViewDetails={handleViewDetails} onEditProduct={handleEditProduct} />;
      case "analytics":
        return <Analytics />;
      case "settings":
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground">Manage your warehouse configuration and user preferences.</p>
            <div className="max-w-2xl bg-white dark:bg-[#111] rounded-xl border border-border p-6 space-y-4">
              <div className="flex items-center justify-between py-2 border-b">
                <div className="space-y-0.5">
                  <div className="font-medium">Warehouse Notifications</div>
                  <div className="text-xs text-muted-foreground">Receive alerts for critical stock levels.</div>
                </div>
                <Button variant="outline" size="sm">Configure</Button>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <div className="space-y-0.5">
                  <div className="font-medium">Data Export</div>
                  <div className="text-xs text-muted-foreground">Export inventory logs to CSV or PDF.</div>
                </div>
                <Button variant="outline" size="sm">Export</Button>
              </div>
              <div className="flex items-center justify-between py-2">
                <div className="space-y-0.5">
                  <div className="font-medium">API Access</div>
                  <div className="text-xs text-muted-foreground">Manage enterprise integration keys.</div>
                </div>
                <Button variant="outline" size="sm">Manage</Button>
              </div>
            </div>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      <div className="max-w-7xl mx-auto">
        {renderContent()}
      </div>

      <ProductModal 
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onEdit={handleEditProduct}
      />

      <EditProductModal 
        product={selectedProduct}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={updateProduct}
      />
      <Toaster position="top-right" richColors />
    </Layout>
  );
}

export default function App() {
  return (
    // @ts-ignore - ThemeProvider types mismatch with React 19
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryProvider>
        <InventoryProvider>
          <AppContent />
        </InventoryProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}

