import { Link } from "react-router-dom";

export default function SubCatBar({
  hoveredCat,
  selectedSubcat,
  setSelectedSubcat,
  setHoveredCat,
}) {
  const handleMouseLeave = () => setSelectedSubcat(null);

  return (
    <div className="relative w-full z-40 hidden lg:block" onMouseLeave={handleMouseLeave} >
      {/* Maroon Tab Bar */}
      <div
        className={`bg-[#723248] text-white py-1 w-full transition-all duration-300 ${
          selectedSubcat ? "sticky top-[72px] z-50" : ""
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-8 flex justify-center">
          {hoveredCat?.inner_items?.length > 0 ? (
            <div className="flex space-x-6 justify-center">
              {hoveredCat.inner_items
                .filter((item) => item?.label)
                .slice(0, 6)
                .map((sub, idx) => (
                  <span
                    key={idx}
                    onClick={() => setSelectedSubcat(sub)}
                    className={`cursor-pointer px-4 py-1.5 text-sm font-semibold transition rounded-t-md ${
                      selectedSubcat?._id === sub._id
                        ? "bg-white text-[#723248] shadow-sm"
                        : "text-white hover:bg-[#8a425e]"
                    }`}
                  >
                    {sub.label}
                  </span>
                ))}
            </div>
          ) : (
            <div className="text-sm font-medium text-center p-1.5">
              DISCOUNT TIMER 🕑
            </div>
          )}
        </div>
      </div>

      {/* Sub-Inner Items Dropdown */}
      {selectedSubcat?.sub_inner_items?.length > 0 && (
        <div className="absolute -mt-1 left-0 w-full bg-white text-black shadow-lg py-4 px-24 z-50 flex justify-center min-h-[150px]">
          <div className="w-full max-w-[850px] flex flex-col gap-6">
            {/* Grid of Sub-Inner Items */}
            <div className="grid grid-cols-5 gap-x-10 gap-y-3 w-full items-start">
              {/* Text Links */}
              <div className="col-span-4 grid grid-cols-3 gap-x-10 gap-y-7">
                {selectedSubcat.sub_inner_items.map((item, idx) =>
                  item.link ? (
                    <Link
                      key={idx}
                      to={item.link}
                      className="text-xs font-medium text-gray-800 hover:text-black transition"
                      onClick={() => {
                        setTimeout(() => {
                          setSelectedSubcat(null);
                          setHoveredCat(null);
                        }, 200);
                      }}
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <span
                      key={idx}
                      className="text-xs font-medium text-gray-400 cursor-not-allowed opacity-60"
                    >
                      {item.label}
                    </span>
                  )
                )}
              </div>

              {/* Static Image */}
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
}
