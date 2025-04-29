import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function CategorySlider() {
  const scrollRef = useRef(null);
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios
      .get("https://estylishkart.el.r.appspot.com/api/product-categories")
      .then((res) => {
        if (Array.isArray(res.data)) {
          setCategories(res.data);
        } else if (res.data.data && Array.isArray(res.data.data)) {
          setCategories(res.data.data);
        } else {
          console.error("Unexpected response structure:", res.data);
        }
      })
      .catch((err) => {
        console.error("Error fetching categories:", err);
      });
  }, []);

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: dir === "left" ? -300 : 300,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="py-1 bg-white relative">
      <div className="max-w-[980px] mx-auto px-4 relative mb-1 mt-1">
        {/* Left Arrow */}
        <button
          onClick={() => scroll("left")}
          className="absolute -left-2 top-1/2 -translate-y-1/2 z-10 "
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="flex flex-shrink-0 items-center justify-center px-2">
          <div className="flex-shrink-0 p-2 w-24 sm:w-28 md:w-32">
            <img
              src="/noimg.png"
              alt="Browse All"
              className="w-full h-[110px] sm:h-[125px] object-cover rounded-lg border shadow"
            />
            <p className="text-center text-xs mt-1 text-blue-600 font-medium">
              Browse
            </p>
          </div>

          {/* Scrollable Container */}
          <div
            ref={scrollRef}
            className="max-w-[987px] flex justify-start gap-0 overflow-x-auto hide-scrollbar snap-x snap-mandatory"
          >
            {categories.map((cat, index) => (
              <div
                key={cat._id || index}
                onClick={() => {
                  const slug = `${cat.category_name
                    .replace(/\s+/g, "-")
                    .toLowerCase()}_${cat._id}`;
                  navigate(`/product/category/${slug}`);
                }}
                className="flex-shrink-0 snap-center w-30 flex flex-col items-center text-center cursor-pointer hover:bg-gray-100 p-2 rounded-md transition"
              >
                <img
                  src={
                    cat.category_image?.trim()
                      ? cat.category_image
                      : "/icons/men.png"
                  }
                  alt={cat.category_name}
                  // change2
                  className="w-[100px] h-[125px] object-cover rounded-lg border shadow"
                />
                <span className="text-xs mt-1 font-medium text-gray-700">
                  {cat.category_name}
                </span>
              </div>
            ))}
          </div>
        </div>
        {/* Right Arrow */}
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 "
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </section>
  );
}
