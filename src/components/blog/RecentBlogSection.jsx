const RecentBlogSection = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 px-6 py-10 gap-8">
      <img
        src="abc.jpg"
        className="w-full h-full object-cover rounded"
        alt="Recent Blog"
      />
      <div>
        <h2 className="text-3xl font-bold mb-4">Easing Into 2025 In Tulum Mexico</h2>
        <p className="text-gray-700 mb-4 text-sm leading-relaxed">
          This time last year, I decided to take a solo trip to Tulum to refresh and renew my way into the new year.
          From the moment I landed, the energy was everything I needed...
        </p>
        <button className="px-4 py-2 border border-black text-xs">View Post</button>
      </div>
    </div>
  );
  
  export default RecentBlogSection;
  