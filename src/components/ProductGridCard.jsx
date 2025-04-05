import ProductCard from "./ProductCard"

export default function ProductGridCard({ product }) {
  return (
    <div className="bg-white hover:shadow-md  overflow-hidden transition">
      <ProductCard product={product} />
    </div>
  )
}
