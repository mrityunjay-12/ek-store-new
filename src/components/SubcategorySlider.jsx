import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const SubcategorySlider = () => {
  const [subcategories, setSubcategories] = useState([]);
  const scrollRef = useRef(null);

  // Fetch categories and flatten subcategories
  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        const res = await axios.get("https://estylishkart.el.r.appspot.com/api/product-categories");
        const allCategories = res.data?.data || [];

        // Flatten all subcategories from all categories
        const allSubs = allCategories.flatMap((cat) =>
          cat.sub_categories.map((sub) => ({
            ...sub,
            parent_category: cat.category_name, // for optional use
          }))
        );

        setSubcategories(allSubs);
      } catch (err) {
        console.error("Failed to load subcategories", err);
      }
    };

    fetchSubcategories();
  }, []);

  // Auto-scroll horizontally
  useEffect(() => {
    const scrollInterval = setInterval(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollBy({
          left: 160,
          behavior: "smooth",
        });
      }
    }, 3000);
    return () => clearInterval(scrollInterval);
  }, []);

  // Mouse wheel scroll support
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onWheel = (e) => {
      if (e.deltaY === 0) return;
      e.preventDefault();
      el.scrollTo({
        left: el.scrollLeft + e.deltaY,
        behavior: "smooth",
      });
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  return (
    <div className="max-w-[1440px] mx-auto px-4 py-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4"></h2>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scroll-smooth scrollbar-hide"
        style={{ scrollbarWidth: "none" }}
      >
        {subcategories.map((sub, i) => (
          <Link
            key={sub._id || i}
            to={`/products?subcategory=${encodeURIComponent(sub.sub_category_name)}`}
            className="min-w-[140px] w-[140px] flex-shrink-0 text-center"
          >
            <div className="relative h-[180px] w-[140px] bg-gray-100 rounded overflow-hidden mb-2">
              <img
                src={sub.sub_category_image || "/product1.png"}
                alt={sub.sub_category_name}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 w-full bg-black bg-opacity-50 text-white text-xs font-medium py-1">
                {sub.sub_category_name}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SubcategorySlider;
