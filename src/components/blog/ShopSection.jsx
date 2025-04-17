const ShopSection = () => (
    <div className="px-6 py-10">
      <h2 className="text-xl font-bold mb-4">SHOP</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-gray-100 h-[240px] flex items-center justify-center text-sm">
            <img
              src="blog-placeholder.jpg"
              alt={`Shop Item ${i + 1}`}
              className="w-full h-full object-cover rounded"
            />
          </div>
        ))}
      </div>
    </div>
  );
  
  export default ShopSection;
  