const BlogGrid = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-white p-4 shadow">
          <img
            src="blog-placeholder.jpg"
            alt="Blog Post"
            className="w-full h-[180px] object-cover mb-3 rounded"
          />
          <h4 className="text-sm font-semibold mb-1">Blog Post Title {i + 1}</h4>
          <p className="text-xs text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </div>
      ))}
      <button className="col-span-full mt-6 mx-auto px-4 py-2 border border-black rounded text-sm">
        Load More
      </button>
    </div>
  );
  
  export default BlogGrid;
  