import React from "react";
import { Link } from "react-router-dom";

const COLLECTION_LABELS = {
  trending: "Trending Now",
  top_picks: "Top Picks",
  new_arrivals: "New Arrivals",
  sale: "Sale",
};

const SubCategoryBar = ({
  hoveredCat,
  selectedSubcat,
  setSelectedSubcat,
  setHoveredCat,
}) => {
  return (
    <div
      className="relative w-full z-40"
      onMouseLeave={() => {
        setSelectedSubcat(null);
        setHoveredCat(null);
      }}
    >
      {/* SubCategory Tags */}
      <div className="bg-[#723248] text-white px-12 py-1 w-full flex justify-center">
        {hoveredCat?.subs?.length > 0 ? (
          <div className="flex space-x-10">
            {hoveredCat.subs
              .filter((sub) => sub.items && sub.items.length > 0)
              .slice(0, 6)
              .map((sub, i) => (
                <span
                  key={i}
                  className={`cursor-pointer px-4 py-1.5 text-sm font-medium transition rounded-t-xl ${
                    selectedSubcat?.groupTitle === sub.groupTitle
                      ? "bg-white text-[#723248] shadow-sm"
                      : "text-white hover:bg-[#8a425e]"
                  }`}
                  onMouseEnter={() => setSelectedSubcat(sub)}
                >
                  {COLLECTION_LABELS[sub.groupTitle?.toLowerCase()] ||
                    sub.groupTitle}
                </span>
              ))}
          </div>
        ) : (
          <div className="text-sm font-semibold">DISCOUNT WITH TIMER 🕑</div>
        )}
      </div>

      {/* Dropdown */}
      {selectedSubcat && (
  <div className="absolute -mt-1 left-0 w-full bg-white text-black shadow-lg py-4 px-24 z-50 flex justify-center min-h-[150px]">
    <div className="w-full max-w-[850px] flex flex-col gap-6">
      
      {/* ✅ Section Heading */}
      <div className="flex items-center justify-between">
        <span className=" text-sm font-semibold text-black ">
         {COLLECTION_LABELS[selectedSubcat.groupTitle?.toLowerCase()] || selectedSubcat.groupTitle}
        </span>
        <Link
          to={`/products?group=${encodeURIComponent(selectedSubcat.groupTitle)}`}
          className="text-xs text-blue-600 hover:underline"
        >
          Shop All
        </Link>
      </div>
      <hr className="border-t border-gray-200 -mt-3" />
         

      {/* ✅ Grid Layout */}
      <div className="grid grid-cols-5 gap-x-10 gap-y-3 w-full items-start">
        {/* 4 cols for text */}
        <div className="col-span-4 grid grid-cols-3 gap-x-10 gap-y-7">
          {selectedSubcat.items.map((item, idx) => (
            <Link
              key={idx}
              to={`/products?subcategory=${encodeURIComponent(item)}`}
              className="text-xs font-medium text-gray-800 hover:text-black transition"
              onClick={() => {
                setSelectedSubcat(null);
                setHoveredCat(null);
              }}
            >
              {item}
            </Link>
          ))}
        </div>

        {/* Image column */}
        <div className="col-span-1 flex flex-col gap-4">
          <div className="h-[200px] w-full overflow-hidden rounded-sm">
            <img
              src="/product1.png"
              alt="Collection"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default SubCategoryBar;
