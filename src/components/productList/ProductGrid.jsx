import ProductCard from "@/components/ProductCard";

export default function ProductGrid({ products }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {products.length > 0 ? (
        products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))
      ) : (
        <p className="col-span-full text-center text-gray-500">
          No products match the filters.
        </p>
      )}
    </div>
  );
}
