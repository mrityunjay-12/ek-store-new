import { Heart } from "lucide-react";

export default function ProductInfo({
  product,
  variant,
  colors,
  sizes,
  selectedSize,
  setSelectedSize,
  selectedFit,
  setSelectedFit,
  handleAddToBag,
  handleAddToWishlist,
  addingToBag,
}) {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-2">{product.product_name}</h1>

      <p className="text-xl font-medium mb-1">
        ₹{variant?.price}
        {variant?.compare_price > variant?.price && (
          <>
            <span className="text-base text-gray-500 line-through ml-2">
              ₹{variant.compare_price}
            </span>
            <span className="text-sm font-semibold text-red-600 ml-2">
              {Math.round(
                ((variant.compare_price - variant.price) / variant.compare_price) *
                  100
              )}
              % OFF
            </span>
          </>
        )}
      </p>

      {/* Colors */}
      {colors.length > 0 && (
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 mb-1">COLOR</p>
          <div className="flex gap-2">
            {colors.map((color, idx) => (
              <div
                key={idx}
                className="w-6 h-6 rounded-full border"
                style={{ backgroundColor: color.toLowerCase() }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Sizes */}
      {sizes.length > 0 && (
        <>
          <div className="mb-4 flex justify-between items-center">
            <p className="text-sm font-medium text-gray-700">SIZE</p>
            <span className="text-xs underline font-medium text-gray-700">
              FIND YOUR FIT
            </span>
          </div>
          <div className="flex gap-2 mb-4 flex-wrap">
            {sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`border rounded px-4 py-2 text-sm ${
                  selectedSize === size
                    ? "border-black font-semibold"
                    : "text-gray-600"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </>
      )}

      {/* Fit Selection */}
      <div className="grid grid-cols-3 text-xs text-gray-600 border mb-4 cursor-pointer">
        {["Runs Small", "True to Size", "Runs Large"].map((fit) => (
          <div
            key={fit}
            onClick={() => setSelectedFit(fit)}
            className={`py-2 text-center transition ${
              selectedFit === fit
                ? "bg-gray-100 font-semibold text-black"
                : "hover:bg-gray-50"
            }`}
          >
            {fit.toUpperCase()}
          </div>
        ))}
      </div>

      {/* Add to Cart & Wishlist */}
      <div className="grid gap-2 mb-6">
        <button
          onClick={handleAddToBag}
          className="bg-black text-white text-sm px-6 py-3 font-semibold w-full"
        >
          {addingToBag ? "Adding..." : "ADD TO BAG"}
        </button>

        <button
          onClick={handleAddToWishlist}
          className="border text-sm px-6 py-3 font-medium w-full flex items-center justify-center gap-2 text-gray-700"
        >
          <Heart className="w-4 h-4" /> ADD TO WISHLIST
        </button>
      </div>

      {/* Description */}
      <details className="border-b py-2" open>
        <summary className="font-medium text-sm cursor-pointer">
          PRODUCT DETAILS
        </summary>
        <div
          className="text-sm text-gray-600 mt-2"
          dangerouslySetInnerHTML={{ __html: product.description }}
        />
      </details>
    </div>
  );
}
