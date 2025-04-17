const LooksSection = () => (
    <div className="px-6 py-10">
      <h2 className="text-xl font-bold mb-4">LOOKS</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="relative h-[240px] bg-gray-200 rounded overflow-hidden">
            <img
              src="abc.jpg"
              alt={`Look ${i + 1}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 bg-black/50 text-white text-sm text-center w-full py-2">#LOOK{i + 1}</div>
          </div>
        ))}
      </div>
    </div>
  );
  
  export default LooksSection;
  