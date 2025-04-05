import { useEffect, useState } from "react";
import FilterSidebar from "@/components/FilterSidebar";
import ProductCard from "@/components/ProductCard";
import Loader from "@/components/Loader";
import Breadcrumb from "@/components/Breadcrumb";
import SubCategoryPills from "@/components/SubCategoryPills";
import { useLocation } from "react-router-dom";
import RecentlyViewed from "@/components/RecentlyViewed";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function ProductListingPage() {
  const [allProducts, setAllProducts] = useState([]);
  const [filters, setFilters] = useState({});
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [visibleCount, setVisibleCount] = useState(18);
  const [selectedSub, setSelectedSub] = useState(null);
  const [loading, setLoading] = useState(true); // <-- loader state

  const query = useQuery();
  const categoryFromUrl = query.get("category");
  const subcategoryFromUrl = query.get("subcategory");

  useEffect(() => {
    if (subcategoryFromUrl) {
      setSelectedSub(subcategoryFromUrl);
    }
  }, [subcategoryFromUrl]);

  useEffect(() => {
    setLoading(true);
    fetch("https://estylishkart.el.r.appspot.com/api/products")
      .then((res) => res.json())
      .then((data) => {
        setAllProducts(data.data);
        setLoading(false); // <-- stop loading after data fetch
      })
      .catch((err) => {
        console.error("Product fetch error:", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const filtered = allProducts.filter((product) => {
      if (
        categoryFromUrl &&
        !product.categories.some((cat) =>
          cat.category_name
            .toLowerCase()
            .includes(categoryFromUrl.toLowerCase())
        )
      )
        return false;

      if (
        selectedSub &&
        !product.sub_categories.some(
          (sub) => sub.sub_category_name === selectedSub
        )
      )
        return false;

      return Object.entries(filters).every(([key, values]) => {
        if (!values || values.length === 0) return true;

        switch (key) {
          case "Color":
          case "Size":
            return product.product_variants.some((variant) =>
              variant.attributes?.some(
                (attr) =>
                  attr.attribute_name === key &&
                  values.includes(attr.attribute_value)
              )
            );
          case "Price":
            return product.product_variants.some((variant) => {
              return values.some((range) => {
                if (range === "Under 500") return variant.price < 500;
                if (range === "500-1000")
                  return variant.price >= 500 && variant.price <= 1000;
                if (range === "1000+") return variant.price > 1000;
                return true;
              });
            });
          default:
            return product.product_variants.some((variant) =>
              variant.attributes?.some(
                (attr) =>
                  attr.attribute_name === key &&
                  values.includes(attr.attribute_value)
              )
            );
        }
      });
    });

    setFilteredProducts(filtered);
    setVisibleCount(21);
  }, [allProducts, filters, selectedSub, categoryFromUrl]);

  const visibleProducts = filteredProducts.slice(0, visibleCount);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 21);
  };

  return (
    <>
      {/* <Navbar /> */}

      <div className="bg-[#723248] text-white text-sm text-center py-2 px-4 font-semibold">
        Sub Categories
      </div>

      <Breadcrumb
        category={categoryFromUrl || "All"}
        subcategory={selectedSub}
      />

      <div className="flex flex-col md:flex-row max-w-[1440px] mx-auto">
        <aside className="w-full md:w-80 p-4 border-r max-h-screen md:flex-none">
          <FilterSidebar filters={filters} setFilters={setFilters} />
          <RecentlyViewed />
        </aside>

        <main className="flex-1 p-4">
          <SubCategoryPills selected={selectedSub} onSelect={setSelectedSub} />

          {/* Loader */}
          {loading ? (
          <div className="flex justify-center items-center min-h-[300px]">
            <div className="relative w-12 h-12">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 rounded-full"
                  style={{
                    backgroundColor: "#723248",
                    top: "50%",
                    left: "50%",
                    transform: `rotate(${i * 45}deg) translate(20px)`,
                    animation: "dot-spin 1s linear infinite",
                    animationDelay: `${i * 0.1}s`,
                  }}
                />
              ))}
            </div>
            <style>
              {`
                @keyframes dot-spin {
                  0% { opacity: 1; }
                  100% { opacity: 0.2; }
                }
              `}
            </style>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4 mt-4">
              {visibleProducts.length > 0 ? (
                visibleProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))
              ) : (
                <p className="col-span-full text-center text-gray-500">
                  No products match the filters.
                </p>
              )}
            </div>

            {visibleCount < filteredProducts.length && (
              <div className="text-center mt-6">
                <button
                  onClick={handleLoadMore}
                  className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800 transition"
                >
                  More
                </button>
              </div>
            )}
          </>
        )}

        </main>
      </div>

      {/* <Footer /> */}
    </>
  );
}
