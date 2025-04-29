import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Sitemap = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(
          "https://estylishkart.el.r.appspot.com/api/product-categories"
        );
        setCategories(res.data?.data || []);
      } catch (error) {
        console.error("Failed to fetch sitemap categories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8 text-center">Sitemap</h1>
      <div className="space-y-8">
        {categories.map((cat) => {
          const categorySlug = `${cat.category_name
            .replace(/\s+/g, "-")
            .toLowerCase()}_${cat._id}`;

          return (
            <div key={cat._id} className="border-b pb-6">
              {/* Main Category Name */}
              <Link
                to={`/product/category/${categorySlug}`}
                className="text-2xl font-semibold text-blue-700 hover:underline"
              >
                {cat.category_name}
              </Link>

              {/* Subcategories */}
              {cat.sub_categories?.length > 0 && (
                <div className="mt-4 ml-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {cat.sub_categories.map((sub) => {
                    const subcategorySlug = `${sub.sub_category_name
                      .replace(/\s+/g, "-")
                      .toLowerCase()}_${sub._id}`;
                    return (
                      <Link
                        key={sub._id}
                        to={`/product/category/${categorySlug}/${subcategorySlug}`}
                        className="text-sm text-gray-600 hover:text-black hover:underline"
                      >
                        {sub.sub_category_name}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Sitemap;
