import { ChevronRight } from "lucide-react"
import { Link } from "react-router-dom" // If using Next.js, replace with `next/link`

export default function Breadcrumb({ category, subcategory }) {
  const crumbs = [
    { label: "Home", href: "/" },
    category && { label: category, href: `/category/${category.toLowerCase()}` },
    subcategory && {
      label: subcategory,
      href: `/category/${category?.toLowerCase()}/${subcategory.toLowerCase()}`,
    },
  ].filter(Boolean)

  return (
    <nav className="flex items-center gap-1 px-4 py-2 text-sm text-muted-foreground">
      {crumbs.map((crumb, index) => (
        <span key={index} className="flex items-center gap-1">
          <Link
            to={crumb.href}
            className="hover:underline text-foreground/80 transition-colors"
          >
            {crumb.label}
          </Link>
          {index < crumbs.length - 1 && <ChevronRight className="w-4 h-4" />}
        </span>
      ))}
    </nav>
  )
}
