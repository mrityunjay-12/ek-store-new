import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function MidBanner() {
  const navigate = useNavigate(); // 👈 Hook for navigation

  return (
    <section className="relative w-full py-8">
      <div className="relative w-full">
        {/* Background Image */}
        <img
          src="/trends.jpg"
          alt="Create New Trends"
          className="w-full object-cover h-[280px] sm:h-[350px] md:h-[450px] lg:h-[550px]"
        />

        {/* Overlay Content */}
        <div className="absolute inset-0 flex flex-col justify-center items-center px-6 text-center bg-black/30 rounded-lg">
          <div className="text-white space-y-4 max-w-xl py-9">
            {/* change4 */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
              Create New Trends
            </h2>
            <p className="text-sm md:text-base  ">
              Discover fresh fashion inspirations that define your style. We
              curate the most stunning pieces from top brands.
            </p>
            
          </div>
          <Button
              variant="secondary"
              className="border text-black font-bold bg-white py-3 px-6 sm:py-5  sm:px-8"
              onClick={() => navigate("/products")} // 👈 Navigate on click
            >
              Explore All Collection
            </Button>
        </div>
      </div>
    </section>
  );
}
