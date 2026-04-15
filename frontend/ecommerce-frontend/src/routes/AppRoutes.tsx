import { Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { RequireAuth } from "./guards/RequireAuth";

import { DefaultLayout } from "../layouts/DefaultLayout";
import { Home } from "../pages/Home";
import { ProductDetail } from "../pages/ProductDetail";
import { Login } from "../pages/Login";
import { Register } from "../pages/Register";

// Private routes
import { Cart } from "../pages/Cart";
import { Orders } from "../pages/Orders";
import { OrderDetail } from "../pages/OrderDetail";

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
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default AppRoutes;