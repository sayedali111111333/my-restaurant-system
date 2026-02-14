import { BrowserRouter, Routes, Route } from "react-router-dom";
import { StoreProvider } from "./store";

// Layouts
import CustomerLayout from "./pages/CustomerLayout";
import AdminLayout from "./pages/AdminLayout";

// Customer Pages
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";

// Admin Pages
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import AdminMenu from "./pages/AdminMenu";
import AdminOrders from "./pages/AdminOrders";
import AdminCustomers from "./pages/AdminCustomers";
import AdminPOS from "./pages/AdminPOS";
import AdminSettings from "./pages/AdminSettings";

export function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Customer Routes */}
          <Route path="/" element={<CustomerLayout />}>
            <Route index element={<Home />} />
            <Route path="cart" element={<Cart />} />
            <Route path="checkout" element={<Checkout />} />
          </Route>

          {/* Login Route */}
          <Route path="/login" element={<Login />} />

          {/* Protected Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="menu" element={<AdminMenu />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="customers" element={<AdminCustomers />} />
            <Route path="pos" element={<AdminPOS />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </StoreProvider>
  );
}