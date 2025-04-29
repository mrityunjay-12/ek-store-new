import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";

export default function HeroBanner() {
  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch banners on mount
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await axios.get(
          "https://estylishkart.el.r.appspot.com/api/banners"
        );
        setBanners(res.data?.data || []);
      } catch (err) {
        console.error("Failed to load banners", err);
      }
    };

    fetchBanners();
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  // Auto-scroll every 6 seconds
  useEffect(() => {
    if (banners.length === 0) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(interval); // Cleanup on unmount
  }, [banners]);

  if (banners.length === 0) {
    return (
      <div className="w-full h-[435px] flex items-center justify-center bg-gray-100">
        Loading banners...
      </div>
    );
  }

  return (
    <section className="relative w-full bg-white overflow-hidden">
      <div className="w-full h-full transition-all duration-500 sm:h-[435px]">
        {/* Image */}
        <img
          src={banners[currentIndex]?.banner_image}
          alt={`Banner ${currentIndex + 1}`}
          className="w-full h-auto object-contain sm:object-cover transition-all duration-500"
        />

        {/* Prev Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white shadow-md"
          onClick={prevSlide}
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>

        {/* Next Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white shadow-md"
          onClick={nextSlide}
        >
          <ChevronRight className="w-6 h-6" />
        </Button>
      </div>
    </section>
  );
}
