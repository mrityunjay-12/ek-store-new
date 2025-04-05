import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";

const images = ["/hero.png", "/pic2.png", "/hero-2.jpg"];

export default function HeroBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Auto-scroll every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(interval); // Cleanup
  }, []);

  return (
    <section className="relative w-full bg-white overflow-hidden">
      <div className="w-full h-full transition-all duration-500 sm:h-[600px]">
        {/* Image */}
        <img
          src={images[currentIndex]}
          alt={`Slide ${currentIndex + 1}`}
          className="w-full h-auto object-cover sm:object-cover transition-all duration-500"
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
