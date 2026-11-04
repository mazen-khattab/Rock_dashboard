import { BrowserRouter as Router, Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import { Sidebar } from "./Components/Sidebar/Sidebar";
import { Overview } from "./Components/Overview/Overview";
import {
  CreateProduct,
  EditProduct,
  ListProducts,
  ShowProduct,
} from "./Components/Products";
import { ListOrders, ShowOrder } from "./Components/Orders";
import { CreateCustomer, EditCustomer, ListCustomers, ShowCustomer } from "./Components/Customers";
import { CreateCategory, EditCategory, ListCategories, ShowCategory } from "./Components/Categories";
import { CreateColor, EditColor, ListColors, ShowColor } from "./Components/Colors";
import { CreateSize, EditSize, ListSizes, ShowSize } from "./Components/Sizes";
import { ListUsers } from "./Components/Users";
import { Login } from "./Components/Auth";
import {
  CreateStockManagement,
  EditStockManagement,
  ListStockManagement,
  ShowStockManagement,
} from "./Components/StockManagement";
import "./App.css";
import { ToastContainer } from "react-toastify";
import { useAuth } from "./Context/useAuth";
import { ProductProvider } from "./Context/ProductContext";
import { CategoryProvider } from "./Context/CategoryContext";
import { SizeProvider } from "./Context/SizeContext";
import { ColorProvider } from "./Context/ColorContext";
import { OrderProvider } from "./Context/OrderContext";
import { RequireAuth } from "./Components/Auth/RequireAuth";
import { SessionBoundary } from "./Components/Auth/SessionBoundary";
import { getAuthRedirect } from "./Helper/AuthRedirect";

function HomeRedirect() {
  const { isAuthenticated } = useAuth();
  return <Navigate to={isAuthenticated ? "/admin" : "/login"} replace />;
}

function AuthLayout() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  if (isAuthenticated) return <Navigate to={getAuthRedirect(location.state)} replace />;
  return <Outlet />;
}

function AdminLayout() {
  const { user } = useAuth();
  return (
    <OrderProvider key={user?.userId}>
      <CategoryProvider>
        <ProductProvider>
          <SizeProvider>
            <ColorProvider>
              <div className="app-shell">
                <Sidebar />
                <div className="app-content">
                  <Outlet />
                </div>
              </div>
            </ColorProvider>
          </SizeProvider>
        </ProductProvider>
      </CategoryProvider>
    </OrderProvider>
  );
}

function App() {
  return (
    <Router>
      <SessionBoundary>
        <Routes>
          <Route path="/" element={<HomeRedirect />} />

          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
          </Route>

          <Route element={<RequireAuth />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Overview />} />

              {/* products */}
              <Route path="products" element={<ListProducts />} />
              <Route path="products/create" element={<CreateProduct />} />
              <Route path="products/edit/:productId" element={<EditProduct />} />
              <Route path="products/show/:productId" element={<ShowProduct />} />

              {/* categories */}
              <Route path="categories" element={<ListCategories />} />
              <Route path="categories/create" element={<CreateCategory />} />
              <Route path="categories/edit/:categoryId" element={<EditCategory />} />
              <Route path="categories/show/:categoryId" element={<ShowCategory />} />

              {/* orders */}
              <Route path="orders" element={<ListOrders />} />
              <Route path="orders/:orderId" element={<ShowOrder />} />

              {/* customers */}
              <Route path="customers" element={<ListCustomers />} />
              <Route path="customers/create" element={<CreateCustomer />} />
              <Route path="customers/edit/:customerId" element={<EditCustomer />} />
              <Route path="customers/show/:customerId" element={<ShowCustomer />} />

              {/* colors */}
              <Route path="colors" element={<ListColors />} />
              <Route path="colors/create" element={<CreateColor />} />
              <Route path="colors/create/:colorId" element={<CreateColor />} />
              <Route path="colors/edit/:colorId" element={<EditColor />} />
              <Route path="colors/show/:colorId" element={<ShowColor />} />

              {/* sizes */}
              <Route path="sizes" element={<ListSizes />} />
              <Route path="sizes/create" element={<CreateSize />} />
              <Route path="sizes/edit/:sizeId" element={<EditSize />} />
              <Route path="sizes/show/:sizeId" element={<ShowSize />} />

              {/* users */}
              <Route path="users" element={<ListUsers />} />

              {/* stock management */}
              <Route path="stock-management" element={<ListStockManagement />} />
              <Route path="stock-management/create" element={<CreateStockManagement />} />
              <Route path="stock-management/edit/:variantId" element={<EditStockManagement />} />
              <Route path="stock-management/show/:variantId" element={<ShowStockManagement />} />
            </Route>
          </Route>

          <Route path="*" element={<HomeRedirect />} />
        </Routes>
      </SessionBoundary>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="colored"
        draggable
      />
    </Router>
  );
}

export default App;
