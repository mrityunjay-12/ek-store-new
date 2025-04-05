import { Heart } from "lucide-react";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import toast, { Toaster } from "react-hot-toast";

export default function ProductCard({ product, minimal = false }) {
  const { user } = useSelector((state) => state.user);
  const [wishlisted, setWishlisted] = useState(false);
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();

  if (!product) {
    return (
      <div className="h-full w-full p-4 flex flex-col justify-between space-y-3 border rounded-md">
        <Skeleton className="h-64 w-full rounded-md" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <div className="flex gap-2 mt-auto">
          <Skeleton className="w-4 h-4 rounded-full" />
          <Skeleton className="w-4 h-4 rounded-full" />
          <Skeleton className="w-4 h-4 rounded-full" />
        </div>
      </div>
    );
  }

  const name = product.product_name;
  const variant = product.product_variants?.[0];
  const price = variant?.price;
  const compare_price = variant?.compare_price;

  const images = variant?.gallery_image?.length
    ? [variant.image, variant.gallery_image[0]]
    : [variant?.image || "/placeholder.jpg"];

  const discount =
    compare_price && price
      ? Math.round(((compare_price - price) / compare_price) * 100)
      : null;

  const colors =
    variant?.attributes
      ?.filter((attr) => attr.attribute_name === "Color")
      .map((attr) => attr.attribute_value) || [];

  const handleCardClick = () => {
    if (!product) return;
    navigate(`/products/${product._id}`);
  };

  const handleWishlistClick = async (e) => {
    e.stopPropagation();

    if (!user || !user._id || !product?._id || !variant?._id) {
      toast.error("User ID, Product ID, and Variant ID are required");
      return;
    }

    try {
      const res = await fetch(
        "https://estylishkart.el.r.appspot.com/api/wishlist",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: user._id,
            product_id: product._id,
            variant_id: variant._id,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Wishlist failed");

      setWishlisted(true);
      toast.success("Added to Wishlist 💖");
    } catch (err) {
      toast.error(`Wishlist failed: ${err.message}`);
      console.error("❌ Wishlist failed:", err);
    }
  };

  return (
    <>
      <div
        onClick={handleCardClick}
        className="group relative shadow-sm overflow-hidden hover:shadow-md transition cursor-pointer h-full flex flex-col"
      >
        <Toaster position="top-center" reverseOrder={false} />

        {/* Wishlist Icon */}
        {!minimal && (
          <button
            onClick={handleWishlistClick}
            className="absolute top-2 right-2 z-10 bg-white p-1 rounded-full shadow hover:bg-gray-100"
          >
            <Heart
              className={`w-4 h-4 ${
                wishlisted
                  ? "text-red-500"
                  : "text-gray-600 group-hover:text-red-500"
              }`}
              fill={wishlisted ? "currentColor" : "none"}
            />
          </button>
        )}

        {/* Product Image */}
        <img
          src={hovered ? images[1] : images[0]}
          alt={name}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className="w-full h-64 object-contain transition-all duration-300 ease-in-out"
        />

        {/* Info */}
        <div className="p-4 space-y-2 mt-auto border-t-2 border-gray-200">
          <h3 className="text-base font-semibold text-gray-800 line-clamp-1">
            {name}
          </h3>

          {!minimal && (
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-black">₹{price}</p>
              {compare_price && (
                <>
                  <p className="text-xs text-gray-600 line-through">
                    ₹{compare_price}
                  </p>
                  <span className="text-xs text-green-600 font-semibold">
                    ({discount}% OFF)
                  </span>
                </>
              )}
            </div>
          )}

          {!minimal && colors.length > 0 && (
            <div className="flex gap-2 mt-1">
              {colors.map((color, index) => (
                <span
                  key={index}
                  className="w-4 h-4 rounded-full border"
                  style={{ backgroundColor: color.toLowerCase() }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
