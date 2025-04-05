import { useEffect, useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

export default function FilterSidebar({ filters, setFilters }) {
  const [openSections, setOpenSections] = useState({});
  const [filterOptions, setFilterOptions] = useState({});

  useEffect(() => {
    fetch("https://estylishkart.el.r.appspot.com/api/product-attributes")
      .then((res) => res.json())
      .then((data) => {
        const grouped = {};

        // Group by attribute_name
        for (let item of data.data || []) {
          const key = item.attribute_name;
          const value = item.attribute_value;

          if (!grouped[key]) grouped[key] = new Set();
          grouped[key].add(value);
        }

        // Convert Sets to arrays
        const formatted = {};
        for (let key in grouped) {
          formatted[key] = Array.from(grouped[key]);
        }

        setFilterOptions(formatted);
      })
      .catch((err) => console.error("Failed to load attributes:", err));
  }, []);

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleCheckbox = (section, value) => {
    setFilters((prev) => {
      const current = new Set(prev[section] || []);
      current.has(value) ? current.delete(value) : current.add(value);
      return { ...prev, [section]: [...current] };
    });
  };

  return (
    <aside className="w-full md:w-80 p-4 border-r flex-none overflow-y-auto thin-scrollbar h-[85vh] max-h-screen">
      {Object.entries(filterOptions).map(([section, values]) => {
        if (!values.length) return null;
        const isOpen = openSections[section];
        return (
          <div key={section} className="mb-3 border-b pb-2">
            <div
              className="flex justify-between items-center cursor-pointer select-none"
              onClick={() => toggleSection(section)}
            >
              <h4 className="font-semibold text-sm text-gray-800">{section}</h4>
              {isOpen ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </div>

            {isOpen && (
              <div className="mt-2 pl-1 flex flex-col gap-2">
                {values.map((val) => (
                  <label key={val} className="text-sm text-gray-700 py-1">
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={filters[section]?.includes(val) || false}
                      onChange={() => handleCheckbox(section, val)}
                    />
                    {val}
                  </label>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </aside>
  );
}
