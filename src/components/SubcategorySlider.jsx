// import React, { useEffect, useRef, useState } from "react";
// import axios from "axios";
// import { Link } from "react-router-dom";

// const SubcategorySlider = () => {
//   const [subcategories, setSubcategories] = useState([]);
//   const scrollRef = useRef(null);

//   useEffect(() => {
//     const fetchSubcategories = async () => {
//       try {
//         const res = await axios.get(
//           "https://estylishkart.el.r.appspot.com/api/product-categories"
//         );
//         const allCategories = res.data?.data || [];

//         const allSubs = allCategories.flatMap((cat) =>
//           cat.sub_categories.map((sub) => ({
//             ...sub,
//             parent_category: cat.category_name,
//           }))
//         );

//         setSubcategories(allSubs);
//       } catch (err) {
//         console.error("Failed to load subcategories", err);
//       }
//     };

//     fetchSubcategories();
//   }, []);

//   useEffect(() => {
//     const scrollInterval = setInterval(() => {
//       if (scrollRef.current) {
//         scrollRef.current.scrollBy({
//           left: 160,
//           behavior: "smooth",
//         });
//       }
//     }, 3000);
//     return () => clearInterval(scrollInterval);
//   }, []);

//   useEffect(() => {
//     const el = scrollRef.current;
//     if (!el) return;

//     const onWheel = (e) => {
//       if (e.deltaY === 0) return;
//       e.preventDefault();
//       el.scrollTo({
//         left: el.scrollLeft + e.deltaY,
//         behavior: "smooth",
//       });
//     };

//     el.addEventListener("wheel", onWheel, { passive: false });
//     return () => el.removeEventListener("wheel", onWheel);
//   }, []);

//   return (
//     <div className="max-w-auto mx-auto  py-6">
//       <div
//         ref={scrollRef}
//         className="flex gap-4 overflow-x-auto scroll-smooth scrollbar-hide"
//         style={{ scrollbarWidth: "none" }}
//       >
//         {subcategories.map((sub, i) => (
//           <Link
//             key={sub._id || i}
//             to={`/products?subcategory=${encodeURIComponent(
//               sub.sub_category_name
//             )}`}
//             className="flex-shrink-0"
//             style={{ flexBasis: "clamp(100px, 14vw, 140px)" }}
//           >
//             <div className="relative aspect-[4/5] bg-gray-100 rounded overflow-hidden mb-2">
//               <img
//                 src={sub.sub_category_image || "/product1.png"}
//                 alt={sub.sub_category_name}
//                 className="w-full h-full object-cover"
//               />
//               <div className="absolute bottom-0 w-full bg-black bg-opacity-50 text-white text-xs font-medium py-1 text-center">
//                 {sub.sub_category_name}
//               </div>
//             </div>
//           </Link>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default SubcategorySlider;

import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

const SubcategorySlider = () => {
  const [subcategories, setSubcategories] = useState([]);
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 300, behavior: "smooth" });
  };

  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        const res = await axios.get(
          "https://estylishkart.el.r.appspot.com/api/product-categories"
        );
        const allCategories = res.data?.data || [];

        const allSubs = allCategories.flatMap((cat) =>
          cat.sub_categories.map((sub) => ({
            ...sub,
            parent_category: cat.category_name,
            parent_category_id: cat._id,
          }))
        );

        setSubcategories(allSubs.slice(0, 7)); // Limit to top 5
      } catch (err) {
        console.error("Failed to load subcategories", err);
      }
    };

    fetchSubcategories();
  }, []);

  return (
    <section className="w-full py-8 px-4 md:px-8">
      <div className="container mx-auto relative">
        {/* Scroll Buttons + View All */}
        <div className="absolute top-0 right-0 z-10 flex items-center gap-2 mb-2">
          <button
            className="bg-zinc-900 text-white text-xs sm:text-sm px-4 py-1.5 rounded hover:bg-zinc-800"
            onClick={() => navigate("/products")}
          >
            VIEW ALL
          </button>
          <button onClick={scrollLeft}>
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button onClick={scrollRight}>
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Cards */}
        <div
          ref={scrollRef}
          className="flex overflow-x-auto gap-6 scrollbar-hide scroll-smooth pt-10"
        >
          {subcategories.map((sub, i) => (
            <Link
              key={sub._id || i}
              to={`/product/category/${sub.parent_category
                .replace(/\s+/g, "-")
                .toLowerCase()}_${
                sub.parent_category_id
              }/${sub.sub_category_name.replace(/\s+/g, "-").toLowerCase()}_${
                sub._id
              }`}
              className="min-w-[280px] max-w-[280px] bg-white shadow-md overflow-hidden flex-shrink-0 h-[360px]"
            >
              <img
                src={sub.sub_category_image || "/product1.png"}
                alt={sub.sub_category_name}
                className="w-full h-[220px] object-cover"
              />
              <div className="p-3">
                <h3 className="font-semibold text-sm text-gray-800 uppercase truncate">
                  {sub.sub_category_name}
                </h3>
                <p className="text-xs text-gray-500 mb-2">
                  Serve graceful looks
                </p>
                <span className="text-xs font-bold text-black underline">
                  SHOP NOW
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SubcategorySlider;
