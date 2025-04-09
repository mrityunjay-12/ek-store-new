import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function CollectionHub() {
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

  return (
    <section className=" bg-white mb-5">
      <div className="max-w-6xl mx-auto px-3">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2 text-center">
          COLLECTION HUB
        </h2>

        <div className="flex justify-center">
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-8 gap-4">
            {categories.map((cat, index) => (
              <Link
                key={cat._id || index}
                to={`/products?category=${encodeURIComponent(
                  cat.category_name.toLowerCase()
                )}`}
                className="flex flex-col items-center justify-center text-center hover:bg-gray-100 p-3 rounded-lg transition w-[100px]"
              >
                <img
                   src={cat.category_image?.trim() ? cat.category_image : "/icons/bag.png"}
                  alt={cat.category_name}
                  className="w-20 h-20 object-contain mb-2"
                />
                <span className="text-sm font-medium text-gray-700">
                  {cat.category_name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
