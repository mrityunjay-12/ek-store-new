import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import Breadcrumb from "@/components/Breadcrumb";
import ProductListingLayout from "@/components/productList/ProductListingLayout";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function ProductListingPage() {
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [filters, setFilters] = useState({});
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 50;
  const [sortOption, setSortOption] = useState("Recommended");

  const query = useQuery();
  const { slug, categorySlug, subcategorySlug } = useParams();

  const categoryIdFromUrl = categorySlug
    ? categorySlug.split("_").pop()
    : slug?.split("_").pop() || query.get("categoryId");

  const subcategoryIdFromUrl = subcategorySlug
    ? subcategorySlug.split("_").pop()
    : query.get("subcategory");

  const categoryNameFromSlug = categorySlug
    ? categorySlug.split("_")[0].replace(/-/g, " ")
    : slug?.split("_")[0].replace(/-/g, " ") || "All Products";

  const subcategoryNameFromSlug = subcategorySlug
    ? subcategorySlug.split("_")[0].replace(/-/g, " ")
    : null;

  useEffect(() => {
    setLoading(true);
    fetch("https://estylishkart.el.r.appspot.com/api/products")
      .then((res) => res.json())
      .then((data) => {
        const products = data.data || [];
        setAllProducts(products);

        // ✅ Filter products by category/subcategory
        const categoryFiltered = products.filter((product) => {
          if (
            categoryIdFromUrl &&
            !product.categories?.some((cat) => cat._id === categoryIdFromUrl)
          )
            return false;

          if (
            subcategoryIdFromUrl &&
            !product.sub_categories?.some(
              (sub) => sub._id === subcategoryIdFromUrl
            )
          )
            return false;

          return true;
        });

        setCategoryProducts(categoryFiltered);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Product fetch error:", err);
        setLoading(false);
      });
  }, [categoryIdFromUrl, subcategoryIdFromUrl]);

  useEffect(() => {
    const filtered = categoryProducts.filter((product) => {
      return Object.entries(filters).every(([key, values]) => {
        if (!values || values.length === 0) return true;

        switch (key) {
          case "Color":
          case "Size":
            return product.product_variants?.some((variant) =>
              variant.attributes?.some(
                (attr) =>
                  attr.attribute_name?.toLowerCase() === key.toLowerCase() &&
                  values.includes(attr.attribute_value)
              )
            );
          case "Price":
            return product.product_variants?.some((variant) =>
              values.some((range) => {
                if (range === "Under 500") return variant.price < 500;
                if (range === "500-1000")
                  return variant.price >= 500 && variant.price <= 1000;
                if (range === "1000+") return variant.price > 1000;
                return true;
              })
            );
          default:
            return product.product_variants?.some((variant) =>
              variant.attributes?.some(
                (attr) =>
                  attr.attribute_name?.toLowerCase() === key.toLowerCase() &&
                  values.includes(attr.attribute_value)
              )
            );
        }
      });
    });

    let sorted = [...filtered];
    switch (sortOption) {
      case "Newest":
        sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
      case "PriceHigh":
        sorted.sort(
          (a, b) =>
            (b.product_variants?.[0]?.price ?? 0) -
            (a.product_variants?.[0]?.price ?? 0)
        );
        break;
      case "PriceLow":
        sorted.sort(
          (a, b) =>
            (a.product_variants?.[0]?.price ?? 0) -
            (b.product_variants?.[0]?.price ?? 0)
        );
        break;
      case "Discount":
        sorted.sort((a, b) => {
          const aVar = a.product_variants?.[0];
          const bVar = b.product_variants?.[0];
          const aDisc =
            aVar?.compare_price && aVar?.price
              ? ((aVar.compare_price - aVar.price) / aVar.compare_price) * 100
              : 0;
          const bDisc =
            bVar?.compare_price && bVar?.price
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
  }, [filters, sortOption, categoryProducts]);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const visibleProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  return (
    <>
      <Breadcrumb
        category={categoryNameFromSlug}
        categoryId={categoryIdFromUrl}
        subcategory={subcategoryNameFromSlug}
        subcategoryId={subcategoryIdFromUrl}
      />

      <ProductListingLayout
        filters={filters}
        setFilters={setFilters}
        selectedSub={subcategoryNameFromSlug}
        setSelectedSub={() => {}}
        loading={loading}
        visibleProducts={visibleProducts}
        totalFiltered={filteredProducts.length}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        sortOption={sortOption}
        setSortOption={setSortOption}
        allProducts={filteredProducts}
        categoryProducts={categoryProducts}
      />
    </>
  );
}
