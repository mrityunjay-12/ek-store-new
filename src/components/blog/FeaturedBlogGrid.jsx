const FeaturedBlogGrid = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-6 py-10">
      {[1, 2].map((_, i) => (
        <div key={i} className="bg-white shadow rounded overflow-hidden">
          <img src="/product2.png" className="w-full h-[220px] object-cover" alt="Featured" />
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-2">Weekly Top 10 Estylish Blog</h3>
            <p className="text-sm text-gray-600">January 16</p>
            <button className="mt-4 px-4 py-2 border border-black text-xs">Start Reading</button>
          </div>
        </div>
      ))}
    </div>
  );
  
  export default FeaturedBlogGrid;
  