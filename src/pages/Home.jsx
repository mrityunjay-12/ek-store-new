import TopBar from "@/components/TopBar";
import Navbar from "@/components/Navbar";
import HeroBanner from "@/components/HeroBanner";
import CollectionHub from "@/components/CollectionHub";
import ProductCarousel from "@/components/ProductCarousel";
import MidBanner from "@/components/MidBanner";
import LoyaltyTab from "@/components/LoyaltyTab";
import Footer from "@/components/Footer";
import CategorySlider from "@/components/CategorySlider";
import HelpBanner from "@/components/HelpBanner";

import { useEffect, useState } from "react";
import axios from "axios";
import SubcategorySlider from "@/components/SubcategorySlider";

// Sample products (replace with real API later)
// const baseProducts = [
//     {
//       name: "Regular Slim Fit Khaki Trousers",
//       price: 1299,
//       act_price: 1300,
//       image: "/product1.png",

//     },
//     {
//       name: "Casual Denim Jacket",
//       price: 1999,
//       act_price: 2500,
//       image: "/product2.png",

//     },
//   ]

//   const sampleProducts = new Array(10).fill(0).map((_, i) => ({
//     id: i + 1,
//     ...baseProducts[i % 2],
//   }))

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          "https://estylishkart.el.r.appspot.com/api/products"
        );
        const allProducts = res.data.data || [];
        setProducts(allProducts);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };

    fetchProducts();
  }, []);

  const kidsProducts = products.filter((p) =>
    p.categories?.some((c) => c.category_name === "Kids-Girls")
  );
  const womenProducts = products.filter((p) =>
    p.categories?.some((c) => c.category_name === "Women")
  );
  const saleProducts = products.filter((p) =>
    p.categories?.some((c) => c.category_name === "Sale")
  );

  return (
    <div className="bg-white min-h-screen overflow-x-hidden">
      {/* <Navbar /> */}
      <TopBar />
      <CategorySlider />
      <HeroBanner />
      <LoyaltyTab />

      {/* for coupon */}
      {/* Coupon Banners */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full px-1 mb-8 mt-4">
        <img
          src="/offer.png"
          alt="Offer Coupon"
          className="w-full  object-contain rounded-lg"
        />
        <img
          src="/offer.png"
          alt="Offer Coupon"
          className="w-full  object-contain rounded-lg"
        />
        <img
          src="/offer.png"
          alt="Offer Coupon"
          className="w-full  object-contain rounded-lg"
        />
      </div>

      <CollectionHub />

      <div className="">
        <img
          src="/offer.png"
          alt="Offer Coupon"
          className="w-full h-auto sm:h-56 object-fill rounded-lg"
        />
      </div>
      <SubcategorySlider />
      <ProductCarousel
        title="Kids"
        category="Kids-Girls"
        products={kidsProducts}
      />
      <ProductCarousel
        title="Dreamy Women"
        category="Women"
        products={womenProducts}
      />
      <MidBanner />
      <ProductCarousel title="Sale" category="Sale" products={saleProducts} />
      <HelpBanner />
    </div>
  );
}
