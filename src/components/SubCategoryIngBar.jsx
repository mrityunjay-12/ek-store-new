import { subcategories } from "@/data/subcategories";

export default function SubCategoryImgBar() {
  const visibleItems = subcategories.slice(0, 6); 

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-6">
      <h2 className="text-center text-lg font-semibold mb-4">
        Spring’s Best Styles
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
        {visibleItems.map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center text-center cursor-pointer group"
          >
            <div className="w-full aspect-[2/3] bg-gray-100 overflow-hidden rounded">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
              />
            </div>
            <p className="mt-2 text-sm text-gray-800 group-hover:underline">
              {item.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
