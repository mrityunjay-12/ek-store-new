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
          <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-5 gap-10">
            {categories.slice(0, 10).map((cat, index) => (
              <Link
                key={cat._id || index}
                to={`/product/category/${cat.category_name
                  .replace(/\s+/g, "-")
                  .toLowerCase()}_${cat._id}`}
                className="flex flex-col items-center justify-center text-center hover:scale-105 ease-in-out p-3 rounded-lg transition w-[120px]"
              >
                <img
                  src={
                    cat.category_image?.trim()
                      ? cat.category_image
                      : "/icons/bag.png"
                  }
                  alt={cat.category_name}
                  className=" h-[100px] object-contain mb- rounded-md m-2 "
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
