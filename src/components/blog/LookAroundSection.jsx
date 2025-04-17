const LookAroundSection = () => (
    <div className="px-6 py-10">
      <h2 className="text-xl font-bold mb-4">LOOK AROUND <span className="text-[#723248]">ESTYLISHKART</span></h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        {['Fashion', 'Beauty', 'Holiday', 'Travel', 'Home', 'Jewelry', 'Decor', 'Video'].map((cat, i) => (
          <div key={i} className="relative bg-gray-100 h-[200px] flex items-center justify-center">
            <img
              src="abc.jpg"
              alt={cat}
              className="absolute inset-0 w-full h-full object-cover rounded"
            />
            <div className="relative z-10 bg-black/40 text-white text-sm px-2 py-1 rounded">{cat}</div>
          </div>
        ))}
      </div>
    </div>
  );
  
  export default LookAroundSection;
  