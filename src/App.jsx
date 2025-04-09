import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import ProductListing from "@/pages/ProductListing";
import ProductDetailPage from "@/pages/ProductDetail";
import { useDispatch } from "react-redux";
import { loadFromCookie } from "./redux/slices/userSlice";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import Signup from "./pages/SignUp";
import Footer from "./components/Footer";
import Wishlist from "@/pages/Wishlist";
import ScrollToTop from "./components/ScrollToTop";
import UserAccount from "./pages/UserAccount";



export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadFromCookie());
  }, [dispatch]);

  return (
    <BrowserRouter>
    <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/profile" element={<UserAccount />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/products" element={<ProductListing />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/products/:productId" element={<ProductDetailPage />} />
        {/*  */}
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
