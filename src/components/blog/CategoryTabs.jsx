const CategoryTabs = () => (
    <div className="flex flex-wrap justify-center gap-4 px-6 py-4">
      {['Fashion', 'Beauty', 'Home', 'Travel', 'Family', 'Accessory'].map((tab, i) => (
        <button key={i} className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-100">
          {tab}
        </button>
      ))}
    </div>
  );
  
  export default CategoryTabs;
  