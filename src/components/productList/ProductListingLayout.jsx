import { useState } from "react";
import FilterSidebar from "@/components/productList/FilterSidebar";
import ProductGrid from "./ProductGrid";
import PaginationControls from "./PaginationControls";
import NewArrivalsSlider from "../NewArrivalsSlider";
import SortDropdown from "./SortDropdown";
import RecentlyViewed from "../RecentlyViewed";

export default function ProductListingLayout({
  filters,
  setFilters,
  loading,
  visibleProducts,
  currentPage,
  totalPages,
  onPageChange,
  sortOption,
  setSortOption,
  allProducts,
  categoryProducts,
}) {
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  return (
    <div className="mx-auto flex flex-col md:flex-row gap-4 px-2 relative">
      <div className="md:hidden flex justify-end px-2 mb-2">
        <button
          onClick={() => setShowMobileFilter(true)}
          className="bg-[#723248] text-white px-4 py-2 rounded text-sm font-semibold shadow"
        >
          Filter
        </button>
      </div>

      <aside className="hidden md:block w-full md:w-[250px] md:sticky md:top-[80px] h-fit">
        <FilterSidebar
          filters={filters}
          setFilters={setFilters}
          products={categoryProducts}
        />
        <RecentlyViewed />
      </aside>

      {showMobileFilter && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex md:hidden">
          <div className="w-4/5 bg-white p-4 overflow-y-auto max-h-screen">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Filters</h2>
              <button
                onClick={() => setShowMobileFilter(false)}
                className="text-gray-600 text-xl"
              >
                &times;
              </button>
            </div>
            <FilterSidebar
              filters={filters}
              setFilters={setFilters}
              products={allProducts}
              isMobileOpen={true}
              onClose={() => setShowMobileFilter(false)}
            />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col gap-3 md:w-[100px]">
        <div className="bg-white max-w-full overflow-hidden">
          <NewArrivalsSlider />
        </div>

        <div className=" justify-end px-1">
          <SortDropdown selected={sortOption} onChange={setSortOption} />
        </div>

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
              <style>
                {`
                  @keyframes dot-spin {
                    0% { opacity: 1; }
                    100% { opacity: 0.2; }
                  }
                `}
              </style>
            </div>
          </div>
        ) : (
          <>
            <ProductGrid products={visibleProducts} />
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
            />
          </>
        )}
      </div>
    </div>
  );
}
