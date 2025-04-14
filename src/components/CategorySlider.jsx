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
      <div className="max-w-4xl mx-auto px-4 relative mb-1 mt-1">
        {/* Left Arrow */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full border shadow"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Scrollable Container */}
        <div
          ref={scrollRef}
          className="flex justify-start gap-0 overflow-x-auto px-10 hide-scrollbar"
        >
          {categories.map((cat, index) => (
            <div
              key={cat._id || index}
              onClick={() =>
                navigate(`/products?categoryId=${cat._id}`)
              }
              className="flex-shrink-0 w-24 flex flex-col items-center text-center cursor-pointer hover:bg-gray-100 p-2 rounded-md transition"
            >
              <img
                src={
                  cat.category_image?.trim()
                    ? cat.category_image
                    : "/icons/men.png"
                }
                alt={cat.category_name}
                className="w-20 h-20 object-cover rounded-lg border shadow"
              />
              <span className="text-xs mt-1 font-medium text-gray-700">
                {cat.category_name}
              </span>
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full border shadow"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
}
