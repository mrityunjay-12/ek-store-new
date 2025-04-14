import FilterSidebar from "@/components/FilterSidebar";
// import RecentlyViewed from "@/components/RecentlyViewed";
import ProductGrid from "@/components/productList/ProductGrid";
import PaginationControls from "@/components/productList/PaginationControls";
import SubCategoryPills from "@/components/SubCategoryPills";

export default function ProductListingLayout({
  filters,
  setFilters,
  selectedSub,
  setSelectedSub,
  loading,
  visibleProducts,
  currentPage,
  totalPages,
  onPageChange,
}) {
  return (
    <div className="flex flex-col md:flex-row max-w-[1440px] mx-auto">
      {/* Left Sidebar */}
      <aside className="w-full md:w-80 pr-4 border-r max-h-screen md:flex-none">
        <FilterSidebar filters={filters} setFilters={setFilters} />
        {/* <RecentlyViewed /> */}
      </aside>

      {/* Main Product Grid */}
      <main className="flex-1 p-4">
        <SubCategoryPills selected={selectedSub} onSelect={setSelectedSub} />

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
      </main>
    </div>
  );
}
