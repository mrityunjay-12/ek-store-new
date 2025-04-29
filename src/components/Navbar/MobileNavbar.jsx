import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, Heart, ShoppingBag, Search } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/redux/slices/userSlice";

export default function MobileNavbar({
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
}) {
  const dispatch = useDispatch();
  const userState = useSelector((state) => state.user || {});
  const { user } = userState || {};

  const [isOpen, setIsOpen] = useState(false);
  const [hoveredCat, setHoveredCat] = useState(null);

  return (
    <div className="flex md:hidden flex-col px-4 py-2 gap-2 sticky bg-white z-50">
      <div className="flex items-center justify-between">
        {/* Left: Hamburger + Logo */}
        <div className="flex items-center gap-2">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 bg-white flex flex-col">
              <div className="flex-1 overflow-y-auto scrollbar-thin">
                <div className="px-2 pb-6">
                  {categories.map((cat) => (
                    <div key={cat.label} className="border-b">
                      {/* Main category toggle */}
                      <button
                        className="w-full text-left px-4 py-2 font-semibold text-gray-800 hover:bg-gray-100 flex justify-between items-center"
                        onClick={() =>
                          setHoveredCat((prev) =>
                            prev?.label === cat.label ? null : cat
                          )
                        }
                      >
                        {cat.label}
                        <span className="text-xs text-gray-500">
                          {hoveredCat?.label === cat.label ? "▲" : "▼"}
                        </span>
                      </button>

                      {/* Inner Items */}
                      {hoveredCat?.label === cat.label && cat.inner_items && (
                        <div className="pl-6 pr-2 pb-3 space-y-3">
                          {cat.inner_items.map((sub, i) => (
                            <div key={i}>
                              <p className="text-sm font-medium text-gray-700">
                                {sub.label}
                              </p>
                              <div className="pl-4 mt-1 space-y-1">
                                {sub.sub_inner_items?.map((item, j) =>
                                  item.link ? (
                                    <Link
                                      key={j}
                                      to={item.link}
                                      className="block text-xs text-gray-600 hover:text-black transition"
                                      onClick={() => setIsOpen(false)}
                                    >
                                      {item.label}
                                    </Link>
                                  ) : (
                                    <span
                                      key={j}
                                      className="block text-xs text-gray-400 cursor-not-allowed opacity-60"
                                    >
                                      {item.label}
                                    </span>
                                  )
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t">
                {!user ? (
                  <div className="flex items-center gap-4">
                    <Link
                      to="/login"
                      className="uppercase text-sm font-medium text-blue-600"
                    >
                      Sign In
                    </Link>
                    <p>or</p>
                    <Link
                      to="/signup"
                      className="uppercase text-sm text-gray-700"
                    >
                      Sign Up
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-800">
                      {user.name}
                    </p>
                    <Link
                      to="/profile"
                      className="block text-sm text-gray-700 hover:underline"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        dispatch(logout());
                        setIsOpen(false);
                        window.location.reload();
                      }}
                      className="block w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>

          <Link to="/" className="text-2xl font-bold text-purple-900">
            <img src="/logo.png" alt="ek" className="h-10 w-auto" />
          </Link>
        </div>

        {/* Right Icons */}
        <div className="flex items-center gap-2">
          <Link to="/wishlist" className="relative">
            <Button variant="ghost" size="icon" className="relative">
              <Heart className="w-6 h-6 text-gray-700" />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5">
                  {wishlistItems.length}
                </span>
              )}
            </Button>
          </Link>

          <Link to="/cart" className="relative">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingBag className="w-6 h-6 text-gray-700" />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5">
                  {cartItems.length}
                </span>
              )}
            </Button>
          </Link>
        </div>
      </div>

      {/* Mobile Search */}
      <div className="w-full px-1">
        <div className="relative w-full sm:w-[200px] mx-auto">
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
            <div className="absolute left-0 w-full bg-white border rounded shadow-md mt-1 z-50 max-h-80 overflow-auto">
              {filteredSuggestions.map((suggestion, index) => {
                const slug = `${suggestion.item
                  .replace(/\s+/g, "-")
                  .toLowerCase()}_${suggestion.productId}`;
                return (
                  <Link
                    key={index}
                    to={`/product/${slug}`}
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
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
