export default function SortDropdown({ selected, onChange }) {
  return (
    <div className="w-full flex justify-end sm:justify-between items-center mb-2 sm:mb-4">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
          Sort By:
        </label>

        <select
          value={selected}
          onChange={(e) => onChange(e.target.value)}
          className="border px-3 py-2 rounded text-sm outline-none focus:ring-2 focus:ring-[#723248]"
        >
          <option value="Recommended">Recommended</option>
          <option value="Newest">What's New</option>
          <option value="Popularity">Popularity</option>
          <option value="Discount">Better Discount</option>
          <option value="PriceHigh">Price: High to Low</option>
          <option value="PriceLow">Price: Low to High</option>
          <option value="Rating">Customer Rating</option>
        </select>
      </div>
    </div>
  );
}
