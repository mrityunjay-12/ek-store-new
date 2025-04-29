import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from "@/pages/Home";
import ProductListing from "@/pages/ProductListing";
import ProductDetailPage from "@/pages/ProductDetail";
import { useDispatch } from "react-redux";
import { loadFromCookie } from "./redux/slices/userSlice";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import Login from "./pages/Login";
import Navbar from "./components/Navbar/Navbar";
import Signup from "./pages/SignUp";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import UserAccount from "./pages/UserAccount";
import Faq from "./pages/faq";
import OrderConfirmation from "./pages/OrderConfirmation";
import { Toaster } from "react-hot-toast";
import WishList from "./pages/WishList";
import Blog from "./pages/BlogHomePage";
import Sitemap from "./pages/Sitemap";

function AppWrapper() {
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    dispatch(loadFromCookie());
  }, [dispatch]);

  const hideFooter =
    location.pathname === "/login" || location.pathname === "/signup";

  return (
    <>
      <ScrollToTop />
      <Navbar />
      <Toaster position="center" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/wishlist" element={<WishList />} />
        <Route path="/profile" element={<UserAccount />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/order-confirmation" element={<OrderConfirmation />} />

        {/* Products Router */}
        <Route path="/product/all" element={<ProductListing />} />
        <Route path="/product/:slug" element={<ProductDetailPage />} />
        <Route path="/product/category/:slug" element={<ProductListing />} />
        <Route
          path="/product/category/:categorySlug/:subcategorySlug"
          element={<ProductListing />}
        />

        <Route path="/blog" element={<Blog />} />
        <Route path="/sitemap" element={<Sitemap />} />
      </Routes>
      {!hideFooter && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppWrapper />
    </BrowserRouter>
  );
}
