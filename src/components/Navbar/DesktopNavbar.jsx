import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Search, ShoppingBag, User2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/redux/slices/userSlice";

export default function DesktopNavbar({
  categories,
  wishlistItems,
  cartItems,
  searchQuery,
  setSearchQuery,
  typedPlaceholder,
  isDeleting,
  wordIndex,
  charIndex,
  categoryPlaceholders,
  searchFocused,
  setSearchFocused,
  filteredSuggestions,
  hoveredCat,
  setHoveredCat,
  setSelectedSubcat,
}) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const [dropdown, setDropdown] = useState(false);

  return (
    <div className="hidden md:flex items-center justify-between px-8 py-2">
      {/* Logo */}
      <Link to="/" className="mr-6">
        <img src="/logo.png" alt="ek" className="h-10 w-auto" />
      </Link>

      {/* Category Links */}
      <nav className="flex space-x-10 relative ml-40 pl-20">
        {categories.map((cat) => {
          const isActive = hoveredCat?.label === cat.label;
          return (
            <div key={cat._id || cat.label} className="relative">
              <span
                className="category-link cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  setHoveredCat((prev) =>
                    prev?.label === cat.label ? null : cat
                  );
                  setSelectedSubcat(null);
                }}
              >
                <span
                  className={`text-md font-bold transition ${
                    cat.label.toLowerCase() === "sale"
                      ? "flicker-sale"
                      : isActive
                      ? "text-[rgb(103,31,20)]"
                      : "text-gray-700 hover:text-black"
                  }`}
                >
                  {cat.label}
                </span>
              </span>
            </div>
          );
        })}
      </nav>

      {/* Search + Icons */}
      <div className="flex items-center space-x-3 flex-shrink-0">
        <Link
          to="/blog"
          className="flex items-center border px-4 py-1 mr-4 rounded-lg border-black text-md font-bold"
        >
          Blog
        </Link>

        {/* Search */}
        <div className="w-[200px] relative">
          <div className="flex items-center border rounded-full px-3 py-1 bg-white">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder={`${typedPlaceholder}${
                !isDeleting &&
                charIndex !== categoryPlaceholders[wordIndex]?.length
                  ? "|"
                  : ""
              }`}
              className="ml-2 w-full outline-none text-sm placeholder:text-gray-400 bg-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
            />
          </div>

          {searchFocused && filteredSuggestions.length > 0 && (
            <div className="absolute left-[-80px] w-[400px] bg-white border rounded shadow-md mt-1 z-50 max-h-80 overflow-auto">
              {filteredSuggestions.map((suggestion, index) => (
                <Link
                  key={index}
                  to={`/products/${suggestion.productId}`}
                  className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setSearchQuery("")}
                >
                  <img
                    src={suggestion.image}
                    alt={suggestion.item}
                    className="w-10 h-10 object-cover rounded border"
                  />
                  <span className="truncate">{suggestion.item}</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Icons */}
        <Link to="/wishlist">
          <Button variant="ghost" size="icon" className="relative">
            <Heart className="w-6 h-6 m-0.5 text-gray-700" />
            {wishlistItems.length > 0 && (
              <span className="absolute -top-1 right-0 bg-red-500 text-white text-xs rounded-full px-1.5">
                {wishlistItems.length}
              </span>
            )}
          </Button>
        </Link>

        <Link to="/cart">
          <Button variant="ghost" size="icon" className="relative">
            <ShoppingBag className="w-5.5 h-5.5 m-0.5 text-gray-700" />
            {cartItems.length > 0 && (
              <span className="absolute -top-1 right-0 bg-red-500 text-white text-xs rounded-full px-1">
                {cartItems.length}
              </span>
            )}
          </Button>
        </Link>

        {/* User Dropdown */}
        {user && (
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setDropdown(!dropdown)}
              className="rounded-full bg-gray-100 hover:bg-gray-200 border"
            >
              <User2 className="w-6 h-6 text-gray-700" />
            </Button>
            {dropdown && (
              <div className="absolute right-0 mt-2 w-60 bg-white border rounded shadow-lg z-50 text-sm">
                <div className="px-4 py-3 border-b">
                  <p className="font-semibold text-gray-800">Hello {user.name}</p>
                  <p className="text-gray-600 text-sm">{user.phone}</p>
                </div>

                <div className="py-2">
                  <Link
                    to="/profile?tab=orders"
                    onClick={() => setDropdown(false)}
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                  >
                    Orders
                  </Link>
                  <Link
                    to="/wishlist"
                    onClick={() => setDropdown(false)}
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                  >
                    Wishlist
                  </Link>
                  <Link
                    to="/faq"
                    onClick={() => setDropdown(false)}
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                  >
                    Contact Us
                  </Link>
                </div>

                <hr />
                <div className="py-2">
                  <Link
                    to="/profile?tab=coupons"
                    onClick={() => setDropdown(false)}
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                  >
                    Coupons
                  </Link>
                  <Link
                    to="/profile?tab=addresses"
                    onClick={() => setDropdown(false)}
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                  >
                    Saved Addresses
                  </Link>
                </div>

                <hr />
                <div className="py-2">
                  <Link
                    to="/profile"
                    onClick={() => setDropdown(false)}
                    className="block px-4 py-2 text-gray-600 hover:bg-gray-100"
                  >
                    Edit Profile
                  </Link>
                  <button
                    onClick={() => {
                      dispatch(logout());
                      setDropdown(false);
                      window.location.reload();
                    }}
                    className="block w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
