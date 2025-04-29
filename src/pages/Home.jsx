import TopBar from "@/components/TopBar";
import HeroBanner from "@/components/HeroBanner";
import CollectionHub from "@/components/CollectionHub";
import ProductCarousel from "@/components/ProductCarousel";
import MidBanner from "@/components/MidBanner";
import LoyaltyTab from "@/components/LoyaltyTab";
import CategorySlider from "@/components/CategorySlider";
import HelpBanner from "@/components/HelpBanner";

import { useEffect, useState } from "react";
import axios from "axios";
import SubcategorySlider from "@/components/SubcategorySlider";



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
      <TopBar   />
      <CategorySlider />
      <HeroBanner />
      <LoyaltyTab />

      {/* for coupon */}
      {/* Coupon Banners */}
      <div className="flex sm:grid sm:grid-cols-3 gap-4 w-full px-1 mb-8 mt-4 overflow-x-auto scrollbar-hide">
        {[...Array(3)].map((_, i) => (
          <img
            key={i}
            src="/offer.png"
            alt="Offer Coupon"
            className="min-w-[250px] sm:min-w-0 w-full object-contain rounded-lg"
          />
        ))}
      </div>

      <CollectionHub />
      {/* change1 */}
      <div>
        <img
          src="/offer.png"
          alt="Offer Coupon"
          className=" object-fill h-[150px] w-full"
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
