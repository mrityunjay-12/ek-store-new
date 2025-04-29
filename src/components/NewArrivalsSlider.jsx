import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const NewArrivalsSlider = () => {
  const scrollRef = useRef(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(
          "https://estylishkart.el.r.appspot.com/api/product-categories"
        );
        const allCategories = res.data?.data || [];

        const subcategories = allCategories.flatMap((cat) =>
          cat.sub_categories.map((sub) => ({
            ...sub,
            parent_category: cat.category_name,
            parent_category_id: cat._id, // ✅ store parent category id too
          }))
        );

        setCategories(subcategories.slice(0, 10)); // Show top 10
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    };

    fetchCategories();
  }, []);

  return (
    <section className="w-full px-4 py-6">
      <div className="flex">
        {/* Static "JUST IN" Block */}
        <div className="min-w-[180px] max-w-[150px] h-[220px] bg-neutral-100 flex flex-col items-center justify-center border text-center shrink-0">
          <h2 className="font-extrabold text-xl">JUST IN</h2>
          <p className="text-sm mt-2 text-gray-600">New Arrivals</p>
        </div>

        {/* Scrollable Categories */}
        <div
          ref={scrollRef}
          className="flex overflow-x-auto gap-4 scrollbar-hide pl-4"
        >
          {categories.map((cat, index) => {
            const categorySlug = `${cat.parent_category
              .replace(/\s+/g, "-")
              .toLowerCase()}_${cat.parent_category_id}`;
            const subcategorySlug = `${cat.sub_category_name
              .replace(/\s+/g, "-")
              .toLowerCase()}_${cat._id}`;

            return (
              <Link
                to={`/product/category/${categorySlug}/${subcategorySlug}`}
                key={cat._id || index}
                className="min-w-[180px] max-w-[150px] text-center shrink-0"
              >
                <div className="w-full h-[220px] overflow-hidden">
                  <img
                    src={cat.sub_category_image || "/product1.png"}
                    alt={cat.sub_category_name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="mt-1 text-sm font-medium text-gray-800 truncate">
                  {cat.sub_category_name}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default NewArrivalsSlider;
