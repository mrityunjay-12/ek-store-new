import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function Breadcrumb({
  category,
  categoryId,
  subcategory,
  subcategoryId,
  loading = false,
}) {
  if (loading) {
    return (
      <nav className="flex items-center gap-2 px-4 py-2 animate-pulse">
        <div className="h-4 w-16 bg-gray-300 rounded"></div>
        <ChevronRight className="w-4 h-4 text-gray-400" />
        <div className="h-4 w-20 bg-gray-300 rounded"></div>
        {subcategory && (
          <>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <div className="h-4 w-24 bg-gray-300 rounded"></div>
          </>
        )}
      </nav>
    );
  }

  const crumbs = [
    { label: "Home", href: "/" },
    category && {
      label: category,
      href: `/product/category/${category
        .toLowerCase()
        .replace(/\s+/g, "-")}_${categoryId}`,
    },
    subcategory && {
      label: subcategory,
      href: `/product/category/${category
        .toLowerCase()
        .replace(/\s+/g, "-")}_${categoryId}/${subcategory
        .toLowerCase()
        .replace(/\s+/g, "-")}_${subcategoryId}`,
    },
  ].filter(Boolean);

  return (
    <nav className="flex items-center gap-1 px-4 py-2 text-sm text-muted-foreground">
      {crumbs.map((crumb, index) => (
        <span key={index} className="flex items-center gap-1">
          <Link
            to={crumb.href}
            className="text-foreground/80 hover:underline transition-colors"
          >
            {titleCase(crumb.label)}
          </Link>
          {index < crumbs.length - 1 && <ChevronRight className="w-4 h-4" />}
        </span>
      ))}
    </nav>
  );
}

function titleCase(str) {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
