import { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // if you're using routing

export default function RecentlyViewed() {
  const [recentProducts, setRecentProducts] = useState([]);

  useEffect(() => {
    const recent = JSON.parse(localStorage.getItem("recentlyViewed")) || [];
    setRecentProducts(recent);
  }, []);

  if (recentProducts.length === 0) return null;

  return (
    <div className="mt-8 border-t pt-4">
      <h3 className="text-base font-semibold mb-3">Recently Viewed</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {recentProducts.map((product) => (
          <div key={product._id} className="bg-white">
            <Link to={`/product/${product._id}`}>
              <img
                src={product?.main_image || "/placeholder.jpg"}
                alt={product?.name}
                className="w-full rounded object-cover aspect-[3/4]"
              />
            </Link>

            <div className="mt-2">
              <p className="text-xs text-gray-500">{product?.category_name}</p>

              <p className="text-sm font-medium truncate">{product?.name}</p>

              {/* Optional: Pricing */}
              <div className="text-sm font-semibold text-gray-800 mt-1">
                ₹{product?.price}
              </div>

              {/* Optional: Tags */}
              {product?.tag && (
                <p className="text-xs text-red-600 font-semibold mt-1">
                  {product.tag}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
