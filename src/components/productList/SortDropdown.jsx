export default function SortDropdown({ selected, onChange }) {
    return (
      <div className="flex justify-end mb-4 pr-20">
        <div className="flex items-center gap-2 ">
          <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
            Sort By:
          </label>
          <select
            value={selected}
            onChange={(e) => onChange(e.target.value)}
            className="border px-3 py-2 rounded text-sm"
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
  