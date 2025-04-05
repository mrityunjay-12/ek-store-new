import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";

export default function Wishlist() {
  const { user } = useSelector((state) => state.user);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    try {
      const res = await fetch(
        `https://estylishkart.el.r.appspot.com/api/wishlist/${user?._id}`
      );
      const wishlist = await res.json();

      const detailedItems = await Promise.all(
        (wishlist?.data || []).map(async (item) => {
          const productId = item.product_id?._id;
          if (!productId) return null;

          try {
            const prodRes = await fetch(
              `https://estylishkart.el.r.appspot.com/api/products/${productId}`
            );
            const prodData = await prodRes.json();
            return {
              ...item,
              product: prodData?.data,
              variant: prodData?.data?.product_variants?.[0] || null,
            };
          } catch (error) {
            console.error("Failed to fetch product:", error);
            return null;
          }
        })
      );

      setItems(detailedItems.filter(Boolean));
    } catch (err) {
      console.error("Failed to fetch wishlist:", err);
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (wishlistId) => {
    try {
      await fetch(
        `https://estylishkart.el.r.appspot.com/api/wishlist/${wishlistId}`,
        { method: "DELETE" }
      );
      setItems((prev) => prev.filter((item) => item._id !== wishlistId));
    } catch (err) {
      console.error("Failed to remove wishlist item:", err);
    }
  };

  const handleMoveToBag = async (item) => {
    const variantId = item.variant?._id;
    if (!variantId) return toast.error("No variant found");

    try {
      const res = await fetch(
        "https://estylishkart.el.r.appspot.com/api/cart/add",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: user._id,
            product_id: item.product._id,
            variant_id: variantId,
            quantity: 1,
            size: "M",
          }),
        }
      );

      if (!res.ok) throw new Error("Failed to add to bag");
      await removeItem(item._id);
      toast.success("Moved to Bag!");
    } catch (err) {
      toast.error("Could not move to bag.");
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchWishlist();
    }
  }, [user]);

  return (
    <div className="max-w-[1440px] mx-auto px-4 py-6">
      <h2 className="text-lg font-semibold mb-4">
        My <span className="text-pink-600">Wishlist</span>{" "}
        <span className="text-sm text-gray-500">({items.length} items)</span>
      </h2>

      {loading ? (
        <p>Loading...</p>
      ) : items.length === 0 ? (
        <p>No items in wishlist.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {items.map((item) => {
            const product = item.product || {};
            const variant = item.variant || {};
            const image = variant.image || "/placeholder.jpg";
            const gallery = variant.gallery_image || [];
            const price = variant.price || 0;
            const compare = variant.compare_price || 0;

            return (
              <div
                key={item._id}
                className="border rounded-2xl shadow-sm relative hover:shadow-md transition"
              >
                <button
                  className="absolute top-2 right-2 bg-white p-1 rounded-full shadow hover:bg-gray-100"
                  onClick={() => removeItem(item._id)}
                >
                  <X className="w-4 h-4" color="#723248" />
                </button>

                <img
                  src={image}
                  alt={product?.product_name}
                  className="w-full h-60 object-cover rounded-t-2xl"
                />

                <div className="p-3 space-y-2">
                  <p className="text-sm font-medium line-clamp-2">
                    {product?.product_name}
                  </p>

                  <div className="text-xs text-gray-500">
                    <p>Type: {product?.product_type || "N/A"}</p>
                    <p>Status: {variant?.variant_status || "N/A"}</p>
                    <p>Stock: {variant?.variant_stock_availability ?? "-"}</p>
                  </div>

                  <div className="text-sm flex items-center gap-2">
                    <span className="font-semibold">Rs.{price}</span>
                    {compare > price && (
                      <>
                        <span className="line-through text-gray-500 text-xs">
                          Rs.{compare}
                        </span>
                        <span className="text-red-600 text-xs font-medium">
                          ({Math.round(((compare - price) / compare) * 100)}%
                          OFF)
                        </span>
                      </>
                    )}
                  </div>

                  <Button
                    variant="outline"
                    className="w-full mt-2 text-sm font-semibold "
                    onClick={() => handleMoveToBag(item)}
                  >
                    Move to Bag
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
