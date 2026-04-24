import { Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { RequireAuth } from "./guards/RequireAuth";
import { RequireAdmin } from "./guards/RequireAdmin";

import { DefaultLayout } from "../layouts/DefaultLayout";
import { Home } from "../pages/Home";
import { ProductDetail } from "../pages/ProductDetail";
import { Login } from "../pages/auth/Login";
import { Register } from "../pages/auth/Register";

import { Cart } from "../pages/customer/Cart";
import { Orders } from "../pages/customer/Orders";
import { OrderDetail } from "../pages/customer/OrderDetail";

import { AdminProducts } from "../pages/admin/AdminProducts";

const NotFound = () => <h2 className="text-2xl font-bold">404 - Not Found</h2>;
const Loading = () => <h2 className="text-2xl font-bold">Loading...</h2>;

const AppRoutes = () => {
  return (
    <BrowserRouter>
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
            </Route>

            <Route element={<RequireAdmin />}>
              <Route path="/admin/products" element={<AdminProducts />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default AppRoutes;