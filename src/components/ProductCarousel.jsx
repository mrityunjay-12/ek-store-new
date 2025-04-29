import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import ProductCard from "./ProductCard";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function ProductCarousel({ title, products , category = [] }) {
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
  };

  return (
    <section className="w-full py-8 px-4 md:px-8">
      <div className="container mx-auto relative">
        {/* Title and Controls */}
        <div className="relative mb-6 flex flex-col md:flex-row md:items-center md:justify-center">
  <h2 className="text-xl md:text-2xl font-semibold text-gray-800 text-left md:text-center w-full md:w-auto">
    {title}
  </h2>

          {/* Controls */}
          <div className="absolute right-0 flex items-center gap-2">
          <Button
            className="
              bg-zinc-900 text-white
              text-[10px] sm:text-xs md:text-sm
              px-3 sm:px-4 md:px-6
              py-1.5 sm:py-2
              rounded
              hover:bg-zinc-800
            "
            onClick={() =>
              navigate(`/products?category=${category?.toLowerCase()}`)
            }
          >
            VIEW ALL
          </Button>


            <button onClick={scrollLeft}>
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button onClick={scrollRight}>
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Carousel */}
        <div
          ref={scrollRef}
          className="flex overflow-x-auto scroll-smooth hide-scrollbar gap-3 md:gap-4"
        >
          {(products.length > 0 ? products : Array(5).fill(null)).map(
            (product, index) => (
              <div
                key={product?.id ?? index}
                className="
                  flex-shrink-0
                  w-full
                  sm:w-1/2       // 2 cards per row on small screens
                  md:w-1/3       // 3 cards per row on medium
                  lg:w-1/5       // 5 cards on large
                  xl:w-1/6       // 6 cards on extra large
                  px-2
                "
              >
                <ProductCard product={product} />
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}
