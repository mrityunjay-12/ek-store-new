import { useEffect, useState } from "react";

export default function SubCategoryPill({ selected, onSelect }) {
  const [data, setData] = useState([]);
  const [activeCategory, setActiveCategory] = useState("Clothing");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/data/category-subcategory.json");
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Failed to load categories:", err);
      }
    };

    fetchCategories();
  }, []);

  const current = data.find((cat) => cat.category === activeCategory);

  return (
    <div className="mb-6">
      {/* Category Pills with Icons */}
      <div className="flex flex-wrap gap-3 mb-3">
        {data.slice(0, 5).map((cat) => (
          <button
            key={cat.category}
            onClick={() => setActiveCategory(cat.category)}
            className={`flex items-center gap-2 px-3 py-1 text-sm rounded-full border ${
              cat.category === activeCategory
                ? "bg-black text-white"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            <img
              src={`/icons/${cat.image}`}
              alt={cat.category}
              className="w-4 h-4 object-contain"
            />
            {cat.category}
          </button>
        ))}
      </div>

      {/* Subcategory Pills */}
      {current && (
        <div className="flex flex-wrap gap-2">
          {current.subcategories.map((sub) => (
            <button
              key={sub}
              onClick={() => onSelect(sub)}
              className={`px-3 py-1 text-sm rounded-full border ${
                selected === sub
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {sub}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
