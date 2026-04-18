import { BrowserRouter as Router, Navigate, Outlet, Route, Routes } from "react-router-dom";
import { Sidebar } from "./Components/Sidebar/Sidebar";
import { Overview } from "./Components/Overview/Overview";
import { ListProducts } from "./Components/Products";
import { CreateProduct } from "./Components/Products";
import { EditProduct } from "./Components/Products";
import { ListOrders, ShowOrder } from "./Components/Orders";
import { CreateCustomer, EditCustomer, ListCustomers, ShowCustomer } from "./Components/Customers";
import { CreateColor, EditColor, ListColor, ShowColor } from "./Components/Colors";
import { ListUsers } from "./Components/Users";
import {
  CreateStockManagement,
  EditStockManagement,
  ListStockManagement,
  ShowStockManagement,
} from "./Components/StockManagement";
import "./App.css";

function AdminLayout() {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="app-content">
        <Outlet />
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/admin" replace />} />

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Overview />} />

          {/* products */}
          <Route path="products" element={<ListProducts />} />
          <Route path="products/create" element={<CreateProduct />} />
          <Route path="products/edit/:productId" element={<EditProduct />} />

          {/* orders */}
          <Route path="orders" element={<ListOrders />} />
          <Route path="orders/:orderId" element={<ShowOrder />} />

          {/* customers */}
          <Route path="customers" element={<ListCustomers />} />
          <Route path="customers/create" element={<CreateCustomer />} />
          <Route path="customers/edit/:customerId" element={<EditCustomer />} />
          <Route path="customers/show/:customerId" element={<ShowCustomer />} />

          {/* colors */}
          <Route path="colors" element={<ListColor />} />
          <Route path="colors/create" element={<CreateColor />} />
          <Route path="colors/edit/:colorId" element={<EditColor />} />
          <Route path="colors/show/:colorId" element={<ShowColor />} />

          {/* users */}
          <Route path="users" element={<ListUsers />} />

          {/* stock management */}
          <Route path="stock-management" element={<ListStockManagement />} />
          <Route path="stock-management/create" element={<CreateStockManagement />} />
          <Route path="stock-management/edit/:variantId" element={<EditStockManagement />} />
          <Route path="stock-management/show/:variantId" element={<ShowStockManagement />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
