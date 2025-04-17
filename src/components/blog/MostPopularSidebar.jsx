const MostPopularSidebar = () => (
    <div className="h-[600px] overflow-y-auto pr-2">
      <h3 className="text-sm font-bold mb-4">Most Popular</h3>
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex items-start mb-4 gap-3">
          <img
            src="abc.jpg"
            alt="Popular"
            className="w-[80px] h-[60px] object-cover rounded"
          />
          <div>
            <p className="text-xs font-medium">Popular Blog {i + 1}</p>
            <p className="text-[11px] text-gray-500">Jan 2025</p>
          </div>
        </div>
      ))}
    </div>
  );
  
  export default MostPopularSidebar;
  