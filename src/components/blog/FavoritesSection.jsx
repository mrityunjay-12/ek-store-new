const FavoritesSection = () => (
    <div className="px-6 py-10">
      <h2 className="text-xl italic mb-4">FAVORITES <span className="not-italic">lately</span></h2>
      <div className="grid grid-cols-3 gap-4 text-sm">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 border-b pb-2">
            <img
              src= "product1.png"
              alt="Fav"
              className="w-[60px] h-[60px] object-cover rounded"
            />
            <p className="text-xs">Favorite item {i + 1}</p>
          </div>
        ))}
      </div>
    </div>
  );
  
  export default FavoritesSection;
  