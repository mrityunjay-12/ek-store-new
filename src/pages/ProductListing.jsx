import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Breadcrumb from "@/components/Breadcrumb";
import ProductListingLayout from "@/components/productList/ProductListingLayout";
import SortDropdown from "@/components/productList/SortDropdown";
import SubcategorySlider from "@/components/SubcategorySlider";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function ProductListingPage() {
  const [allProducts, setAllProducts] = useState([]);
  const [filters, setFilters] = useState({});
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedSub, setSelectedSub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 30;
  const [sortOption, setSortOption] = useState("Recommended");
  const [categoryName, setCategoryName] = useState(""); 

  const query = useQuery();
  const categoryIdFromUrl = query.get("categoryId"); // ✅ GET CATEGORY ID FROM URL
  // const categoryName = query.get("categoryname")
  const subcategoryFromUrl = query.get("subcategory");

  useEffect(() => {
    if (subcategoryFromUrl) setSelectedSub(subcategoryFromUrl);
  }, [subcategoryFromUrl]);

  useEffect(() => {
    setLoading(true);
    fetch("https://estylishkart.el.r.appspot.com/api/products")
      .then((res) => res.json())
      .then((data) => {
        setAllProducts(data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Product fetch error:", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!categoryIdFromUrl) return;
  
    fetch("https://estylishkart.el.r.appspot.com/api/product-categories")
      .then((res) => res.json())
      .then((data) => {
        const matchedCategory = data.data.find(
          (cat) => cat._id === categoryIdFromUrl
        );
        if (matchedCategory) {
          setCategoryName(matchedCategory.name);
        }
      })
      .catch((err) => {
        console.error("Category fetch error:", err);
      });
  }, [categoryIdFromUrl]);
  
  useEffect(() => {
    const filtered = allProducts.filter((product) => {
      // Filter by Category ID (multiple categories exist in product)
      if (
        categoryIdFromUrl &&
        !product.categories.some((cat) => cat._id === categoryIdFromUrl)
      ) {
        return false;
      }
  
      // Filter by Subcategory name (name, not ID, is used in query)
      if (
        selectedSub &&
        !product.sub_categories.some(
          (sub) => sub.sub_category_name.toLowerCase() === selectedSub.toLowerCase()
        )
      ) {
        return false;
      }
  
      // Dynamic filters like Color, Size, Price
      return Object.entries(filters).every(([key, values]) => {
        if (!values || values.length === 0) return true;
  
        switch (key) {
          case "Color":
          case "Size":
            return product.product_variants.some((variant) =>
              variant.attributes?.some(
                (attr) =>
                  attr.attribute_name.toLowerCase() === key.toLowerCase() &&
                  values.includes(attr.attribute_value)
              )
            );
  
          case "Price":
            return product.product_variants.some((variant) =>
              values.some((range) => {
                if (range === "Under 500") return variant.price < 500;
                if (range === "500-1000") return variant.price >= 500 && variant.price <= 1000;
                if (range === "1000+") return variant.price > 1000;
                return true;
              })
            );
  
          default:
            return product.product_variants.some((variant) =>
              variant.attributes?.some(
                (attr) =>
                  attr.attribute_name.toLowerCase() === key.toLowerCase() &&
                  values.includes(attr.attribute_value)
              )
            );
        }
      });
    });
  
    // Sort logic here (unchanged)
    let sorted = [...filtered];
    switch (sortOption) {
      case "Newest":
        sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
      case "PriceHigh":
        sorted.sort((a, b) => (b.product_variants?.[0]?.price ?? 0) - (a.product_variants?.[0]?.price ?? 0));
        break;
      case "PriceLow":
        sorted.sort((a, b) => (a.product_variants?.[0]?.price ?? 0) - (b.product_variants?.[0]?.price ?? 0));
        break;
      case "Discount":
        sorted.sort((a, b) => {
          const aVar = a.product_variants?.[0];
          const bVar = b.product_variants?.[0];
          const aDisc = aVar?.compare_price && aVar?.price
            ? ((aVar.compare_price - aVar.price) / aVar.compare_price) * 100
            : 0;
          const bDisc = bVar?.compare_price && bVar?.price
            ? ((bVar.compare_price - bVar.price) / bVar.compare_price) * 100
            : 0;
          return bDisc - aDisc;
        });
        break;
      default:
        break;
    }
  
    setFilteredProducts(sorted);
    setCurrentPage(1);
  }, [allProducts, filters, selectedSub, categoryIdFromUrl, sortOption]);
  
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const visibleProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <>
      <Breadcrumb
        category={categoryName || "All Products"}
        subcategory={selectedSub}
      />
  
      {/* 👇 Now SubcategorySlider comes right after breadcrumb */}
      <section className="bg-white py-4 border-b mb-4">
        <SubcategorySlider />
      </section>
  
      <SortDropdown selected={sortOption} onChange={setSortOption} />
  
      <ProductListingLayout
        filters={filters}
        setFilters={setFilters}
        selectedSub={selectedSub}
        setSelectedSub={setSelectedSub}
        loading={loading}
        visibleProducts={visibleProducts}
        totalFiltered={filteredProducts.length}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </>
  );
  
}
