import { useEffect, useState } from "react";

export default function FilterSidebar({
  filters,
  setFilters,
  products,
  isMobileOpen,
  onClose,
}) {
  const [openSections, setOpenSections] = useState({});
  const [filterOptions, setFilterOptions] = useState({});
  const [valueCounts, setValueCounts] = useState({});

  useEffect(() => {
    if (!Array.isArray(products)) return;

    const grouped = {};
    const counts = {};

    products.forEach((product) => {
      product.product_variants?.forEach((variant) => {
        variant.attributes?.forEach((attr) => {
          const key = attr.attribute_name;
          const value = attr.attribute_value;

          if (!grouped[key]) grouped[key] = new Set();
          grouped[key].add(value);

          const countKey = `${key}::${value}`;
          counts[countKey] = (counts[countKey] || 0) + 1;
        });
      });
    });

    const formatted = {};
    for (let key in grouped) {
      formatted[key] = Array.from(grouped[key]);
    }

    setFilterOptions(formatted);
    setValueCounts(counts);
  }, [products]);

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

  const clearAllFilters = () => {
    setFilters({});
  };

  const renderFilters = () =>
    Object.entries(filterOptions).map(([section, values]) => (
      <div key={section} className="mb-4 border-b pb-2">
        <div
          className="flex justify-between items-center cursor-pointer select-none"
          onClick={() => toggleSection(section)}
        >
          <h4 className="font-semibold text-sm text-gray-800">{section}</h4>
          <span className="w-6 h-6 flex items-center justify-center text-lg font-bold text-gray-600">
            {openSections[section] ? "-" : "+"}
          </span>
        </div>
        {openSections[section] && (
          <div className="mt-2 pl-1 flex flex-col gap-1">
            {values.map((val) => {
              const count = valueCounts[`${section}::${val}`] || 0;
              return (
                <label
                  key={val}
                  className="text-sm text-gray-700 flex items-center gap-2"
                >
                  <input
                    type="checkbox"
                    className="accent-[#723248]"
                    checked={filters[section]?.includes(val) || false}
                    onChange={() => handleCheckbox(section, val)}
                  />
                  {val} ({count})
                </label>
              );
            })}
          </div>
        )}
      </div>
    ));

  const Wrapper = ({ children }) => (
    <div className="bg-white p-4 overflow-y-auto max-h-[85vh] pr-2 thin-scrollbar border-r shadow-sm">
      {Object.keys(filters).length > 0 && (
        <div className="flex justify-end mb-2">
          <button
            className="text-sm text-[#723248] underline font-medium"
            onClick={clearAllFilters}
          >
            Clear All Filters
          </button>
        </div>
      )}
      {children}
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="hidden md:block w-full md:w-[250px]">
        <Wrapper>{renderFilters()}</Wrapper>
      </aside>

      {/* Mobile */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex md:hidden">
          <div className="w-4/5 bg-white p-4 overflow-y-auto max-h-screen">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Filters</h2>
              <button onClick={onClose} className="text-gray-600 text-xl">
                &times;
              </button>
            </div>
            <Wrapper>{renderFilters()}</Wrapper>
          </div>
        </div>
      )}
    </>
  );
}
