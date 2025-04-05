export default function RecentlyViewed() {
    return (
      <div className="mt-8 border-t pt-4">
        <h3 className="text-base font-semibold mb-3">Recently Viewed</h3>
  
        <div className="space-y-3">
          {/* Card */}
          <div className="bg-white">
            <img
              src="/recently-pants.jpg"
              alt="recent"
              className="w-full rounded object-cover aspect-[3/4]"
            />
  
            <div className="mt-2">
              <p className="text-xs text-gray-500">Popular</p>
  
              {/* Color Dots */}
              <div className="flex gap-1 mt-1">
                <span className="w-4 h-4 rounded-full border bg-black"></span>
                <span className="w-4 h-4 rounded-full border bg-white"></span>
                <span className="w-4 h-4 rounded-full border bg-[#656A4E]"></span>
              </div>
  
              {/* Promo */}
              <p className="text-xs text-red-600 font-semibold mt-2">
                Limited-Time Sale
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  