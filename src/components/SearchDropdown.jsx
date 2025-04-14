import { Link } from "react-router-dom";

export default function SearchDropdown({ suggestions = [], searchQuery = "" }) {
  const showSuggestions =
    searchQuery.trim().length > 0 && suggestions.length > 0;

  return (
    <div className="absolute z-50 mt-2 w-full bg-white border rounded-xl shadow-lg p-4 text-sm space-y-9 max-h-[500px] overflow-y-auto">
      {/* Search Suggestions */}
      {showSuggestions && (
        <div>
          <p className="font-medium text-gray-700 mb-1">Search Suggestions</p>
          <ul className="space-y-2">
            {suggestions.map((s, i) => (
              <li key={i}>
                <Link
                  to={`/products?subcategory=${encodeURIComponent(s.item)}`}
                  className="block px-3 py-1 hover:bg-gray-100 rounded"
                >
                  {s.item}{" "}
                  <span className="text-xs text-gray-500">({s.category})</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Trending Searches */}
      {!showSuggestions && (
        <>
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="font-medium text-gray-700">Recent Searches</span>
              <button className="text-blue-500 text-xs">Clear</button>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-gray-100 rounded-full">dress</span>
            </div>
          </div>

          <div>
            <p className="font-medium text-gray-700 mb-1">Trending Searches</p>
            <div className="flex flex-wrap gap-2">
              {["EID", "Watches for men", "Ramadan", "Bags for women"].map(
                (item, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-gray-100 rounded-full flex items-center gap-1"
                  >
                    <span>🔥</span> {item}
                  </span>
                )
              )}
            </div>
          </div>

          <div>
            <p className="font-medium text-gray-700 mb-2">
              Trending Categories
            </p>
            <div className="flex gap-4 overflow-x-auto hide-scrollbar">
              {[
                { label: "DRESSES", image: "/product2.png" },
                { label: "HEELS", image: "/product2.png" },
                { label: "SNEAKERS", image: "/product.png" },
              ].map((cat, i) => (
                <div key={i} className="flex-shrink-0 w-20 text-center">
                  <img
                    src={cat.image}
                    alt={cat.label}
                    className="w-16 h-16 object-cover rounded-md mx-auto"
                  />
                  <p className="text-xs mt-1">{cat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="font-medium text-gray-700 mb-2">
              Most Searched Products
            </p>
            <div className="flex gap-4 overflow-x-auto hide-scrollbar">
              {[1, 2, 3].map((_, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 w-40 border rounded-md p-2"
                >
                  <img
                    src="/product.png"
                    alt="Product"
                    className="w-full h-36 object-cover rounded-md"
                  />
                  <p className="text-xs mt-2 text-red-600 font-semibold">
                    AED 364{" "}
                    <span className="line-through text-gray-400">AED 520</span>
                  </p>
                  <p className="text-xs text-gray-700 mt-1 line-clamp-2">
                    Golden Apple Shimmer One Shoulder Maxi Dress with Bow Detail
                  </p>
                  <div className="text-[10px] text-white bg-green-500 w-fit mt-2 px-2 py-0.5 rounded">
                    30% OFF
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
