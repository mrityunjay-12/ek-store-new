export default function TopBar() {
    return (
      <div>
        {/* Static Bar */}
        <div className="bg-[#723248] text-white text-sm text-center py-2 px-4 font-semibold">
          🎉 Global Shipping For You! | Free Shipping on Order Above ₹999 | Global Shipping Available
        </div>
  
        {/* Marquee Bar */}
        <div className="relative overflow-hidden bg-orange-200 py-2">
          <div className="marquee whitespace-nowrap font-semibold text-sm text-white">
            <span className="mx-8">
              🌎 GLOBAL SHIPPING WORLDWIDE
            </span>
            <span className="mx-8">
              🛍️ COD AVAILABLE
            </span>
            <span className="mx-8">
              📦 TRACK YOUR ORDER
            </span>
            <span className="mx-8">
              📞 24/7 SUPPORT
            </span>
            {/* repeat to loop seamlessly */}
            <span className="mx-8">
              🌎 GLOBAL SHIPPING WORLDWIDE
            </span>
            <span className="mx-8">
              🛍️ COD AVAILABLE
            </span>
            <span className="mx-8">
              📦 TRACK YOUR ORDER
            </span>
            <span className="mx-8">
              📞 24/7 SUPPORT
            </span>
          </div>
        </div>
      </div>
    )
  }
  