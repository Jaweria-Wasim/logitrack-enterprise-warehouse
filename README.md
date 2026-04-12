# 📦 LogiTrack - Enterprise Warehouse Management System

LogiTrack is a high-performance, enterprise-grade warehouse inventory management application. Built with React 19 and TypeScript, it provides warehouse managers with real-time control over stock levels, detailed logistics tracking, and advanced batch operations.


## 🚀 Key Features

- **📊 Advanced Analytics Dashboard**: Real-time visualization of inventory health, category distribution, and stock trends.
- **🛠️ Full CRUD Operations**: Seamlessly add, edit, and delete products with instant UI updates.
- **📦 Smart Inventory Table**: 
    - Search and filter by category.
    - Real-time stock adjustment (+/-).
    - **Low Stock Predictor**: Visual alerts for items with critical stock levels (threshold < 10).
- **⚡ Batch Operations**: Perform mass actions like batch deletion, price updates, and category changes on multiple items simultaneously.
- **🔍 Detailed Product Insights**: A large, professional preview modal featuring:
    - **Logistics Tab**: Weight, dimensions, and shipping info.
    - **Reviews Tab**: Customer feedback and performance ratings.
    - **Inventory Metadata**: SKU, Barcode, and timestamps.
- **🌓 Adaptive Theme**: Custom Light and Dark modes optimized for high-glare warehouse environments.
- **🛡️ Enterprise Safety**: Confirmation dialogs for destructive actions (Delete) to prevent data loss.

## 🛠️ Tech Stack

- **Frontend**: [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Shadcn/UI](https://ui.shadcn.com/) (Radix UI based)
- **Data Fetching**: [TanStack Query v5](https://tanstack.com/query/latest)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **API**: [DummyJSON](https://dummyjson.com/) (Enterprise product data)

## ⚙️ Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Jaweria-Wasim/logitrack.git
   cd logitrack
Install dependencies:
code
Bash
npm install
Run the development server:
code
Bash
npm run dev
Build for production:
code
Bash
npm run build
📂 Project Structure
code
Text
src/
├── components/
│   ├── ui/             # Shadcn UI reusable components
│   ├── providers/      # Context providers (Inventory, Query, Theme)
│   ├── Dashboard.tsx   # Analytics and stats overview
│   ├── InventoryTable.tsx # Main management interface
│   ├── ProductModal.tsx   # Detailed product preview
│   └── EditProductModal.tsx # Product editing form
├── lib/
│   ├── api.ts          # API service layer
│   └── utils.ts        # Helper functions
├── types/
│   └── inventory.ts    # TypeScript interfaces
└── App.tsx             # Main application entry
📝 License
This project is licensed under the Apache-2.0 License.
Built with ❤️ for Warehouse Managers.