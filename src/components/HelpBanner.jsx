export default function HelpBanner() {
    return (
      <div className="mt-8 relative h-[260px] w-full bg-cover bg-center" style={{ backgroundImage: `url('/bg-pattern.png')` }}>
        {/* Content Container */}
        <div className="max-w-screen-xl mx-auto px-4 py-16 flex flex-col items-center text-center">
         
          <h2 className="text-2xl font-bold mb-4 ">Need help?</h2>
          <input
            type="text"
            placeholder="Search"
            // chnage7
            className="w-full max-w-lg h-14 px-4 rounded-full bg-zinc-800 text-white placeholder:text-gray-300"
          />
        </div>
  
        {/* Girl Image on the right */}
        <img
          src="/girl.png"
          alt="Girl"
          className="absolute hidden md:block bottom-0 right-0 h-[260px] object-contain"
        />
      </div>
    );
  }
  