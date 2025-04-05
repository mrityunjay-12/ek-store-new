import { Link } from "react-router-dom";

export default function CategoryDropdown({ subcategories }) {
  return (
    <div className="absolute top-full left-0 mt-2 p-4 bg-white shadow-lg border z-50 grid grid-cols-3 gap-6 w-[900px] rounded-md">
      {subcategories?.map((item, idx) => (
        <div key={idx}>
          <h4 className="font-semibold text-md mb-2">{item.name}</h4>
          <ul className="space-y-1 text-sm text-gray-600">
            {item.subs?.map((sub, i) => (
              <li key={i}>
                <Link to={`/subcategory/${sub}`} className="hover:underline">
                  {sub}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
