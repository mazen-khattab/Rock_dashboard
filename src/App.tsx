import { BrowserRouter as Router, Navigate, Outlet, Route, Routes } from "react-router-dom";
import { Sidebar } from "./Components/Sidebar/Sidebar";
import { Overview } from "./Components/Overview/Overview";
import { ListProducts } from "./Components/Products";
import { CreateProduct } from "./Components/Products";
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
        </Route>
        
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
