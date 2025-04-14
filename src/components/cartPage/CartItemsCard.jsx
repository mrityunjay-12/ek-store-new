import { Card, CardContent } from "@/components/ui/card";

export default function CartItemCard({ item, toggleSelect, updateQty, removeItem, moveToWishlist }) {
  const discountPercentage = Math.round(
    ((item.product.product_variant.compare_price - item.product.product_variant.price) /
      item.product.product_variant.compare_price) * 100
  );

  return (
    <Card className="mb-4">
      <CardContent className="p-4 flex gap-4">
        <input
          type="checkbox"
          checked={item.selected}
          onChange={() => toggleSelect(item._id)}
          className="mt-8"
        />
        <img
          src={item.product.product_variant.image || "/placeholder.jpg"}
          alt={item.product.product_name}
          className="w-24 h-28 object-cover rounded"
        />
        <div className="flex-1">
          <p className="text-xs font-medium text-gray-600">
            {item.product.product_type || "Type"}
          </p>
          <h3 className="text-sm font-semibold">
            {item.product.product_name}
          </h3>

          <div className="flex gap-4 mb-2">
            <div>
              <label className="text-xs font-medium text-gray-600">Qty:</label>
              <select
                className="border text-xs rounded px-2 py-1 ml-2"
                value={item.quantity}
                onChange={(e) => updateQty(item._id, e.target.value)}
              >
                {[1, 2, 3, 4, 5].map((qty) => (
                  <option key={qty} value={qty}>
                    {qty}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <span className="font-semibold">₹{item.product.product_variant.price}</span>
            <span className="text-gray-500 line-through text-xs">
              ₹{item.product.product_variant.compare_price}
            </span>
            <span className="text-green-600 text-xs font-medium">
              {discountPercentage}% OFF
            </span>
          </div>

          <p className="text-xs text-gray-500 mt-1">14 days return available</p>

          <div className="text-xs text-[#723248] mt-2 flex gap-4">
            <button onClick={() => removeItem(item._id)}>REMOVE</button>
            <button onClick={() => moveToWishlist(item)}>MOVE TO WISHLIST</button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
