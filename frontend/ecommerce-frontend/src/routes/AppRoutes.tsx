import { Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { useAutoLogout } from "../hooks/auth/useAutoLogout";
import { RequireAuth } from "./guards/RequireAuth";
import { RequireAdmin } from "./guards/RequireAdmin";

import { DefaultLayout } from "../layouts/DefaultLayout";
import { AdminLayout } from "../layouts/AdminLayout";

import { Home } from "../pages/Home";
import { ProductDetail } from "../pages/ProductDetail";
import { Login } from "../pages/auth/Login";
import { Register } from "../pages/auth/Register";

import { Cart } from "../pages/customer/Cart";
import { Orders } from "../pages/customer/Order/Orders";
import { OrderDetail } from "../pages/customer/Order/OrderDetail";
import { Account } from "../pages/customer/Account/Account";
import { AccountEdit } from "../pages/customer/Account/AccountEdit";

import { AdminProducts } from "../pages/admin/AdminProducts";
import { AdminEditProduct } from "../pages/admin/AdminEditProduct";
import { AdminCreateProduct } from "../pages/admin/AdminCreateProduct";

const NotFound = () => <h2 className="text-2xl font-bold">404 - Not Found</h2>;
const Loading = () => <h2 className="text-2xl font-bold">Loading...</h2>;

function AppRoutesContent() {
  useAutoLogout();
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route element={<DefaultLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<RequireAuth />}>
            <Route path="/cart" element={<Cart />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/orders/:id" element={<OrderDetail />} />
            <Route path="/account" element={<Account />} />
            <Route path="/account/edit" element={<AccountEdit />} />
          </Route>
        </Route>
        <Route element={<RequireAdmin />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/admin/products/create" element={<AdminCreateProduct />} />
            <Route path="/admin/products/:id" element={<AdminEditProduct />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <AppRoutesContent />
    </BrowserRouter>
  );
};

export default AppRoutes;