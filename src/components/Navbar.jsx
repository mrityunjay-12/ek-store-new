import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, Heart, ShoppingBag, User2, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "@/redux/slices/userSlice";
import SearchDropdown from "./SearchDropdown";
import { Link } from "react-router-dom";

export default function Navbar() {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [dropdown, setDropdown] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [categories, setCategories] = useState([]);
  const [hoveredCat, setHoveredCat] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
 const cartItems = useSelector((state) => state.cart?.items || []);
 const wishlistItems = useSelector((state) => state.wishlist?.items || []);

// all categories 
  useEffect(() => {
    const allowedCategories = [
      "Women",
      "Men",
      "Kids-Boys",
      "Kids-Girls",
      "Home",
      "Beauty",
      "Sports",
      "Sale",
      "Accessories",
    ];

    //api fetch
    fetch("https://estylishkart.el.r.appspot.com/api/product-categories")
      .then((res) => res.json())
      .then((data) => {
        const allCategories = data?.data || [];

        const filtered = allCategories
          .filter((cat) => allowedCategories.includes(cat.category_name))
          .map((cat) => {
            const subArray =
              cat.sub_categories?.map((s) => s.sub_category_name) || [];

            const chunked = Array.from({ length: 3 }, (_, i) =>
              subArray.slice(
                i * Math.ceil(subArray.length / 3),
                (i + 1) * Math.ceil(subArray.length / 3)
              )
            );

            const groupedSubs = chunked.map((items, i) => ({
              groupTitle: `Collection ${i + 1}`,
              items,
            }));

            return {
              name: cat.category_name,
              subs: groupedSubs,
            };
          });

        setCategories(filtered);
      })
      .catch((err) => console.error("Category fetch failed:", err));
  }, []);


  
  useEffect(() => {
    if (searchQuery.trim()) {
      const suggestions = [];

      categories.forEach((cat) => {
        cat.subs.forEach((group) => {
          group.items.forEach((item) => {
            if (item.toLowerCase().includes(searchQuery.toLowerCase())) {
              suggestions.push({ category: cat.name, item });
            }
          });
        });
      });

      setFilteredSuggestions(suggestions);
    } else {
      setFilteredSuggestions([]);
    }
  }, [searchQuery, categories]);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      {/* Mobile Topbar */}
      <div className="hidden md:flex justify-end px-4 pt-2 gap-4 text-xs font-medium">
        {!user ? (
          <>
            <Link to="/login" className="text-blue-600 flex items-center gap-1">
              <User2 className="w-3.5 h-3.5" />
              SIGN IN
            </Link>
            <Link to="/signup" className="text-gray-800">
              SIGN UP
            </Link>
          </>
        ) : null}
      </div>

      {/* ===================== MOBILE NAV ===================== */}
      <div className="flex md:hidden flex-col px-4 py-2 gap-2">
        <div className="flex items-center justify-between">
          {/* Left - Hamburger & Logo */}
          <div className="flex items-center gap-2">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-64 bg-white flex flex-col justify-between"
              >
                <div className="mt-10">
                  {categories.map((cat) => (
                    <div key={cat.name} className="border-b">
                      <button
                        className="w-full text-left px-4 py-2 font-medium text-gray-800 hover:bg-gray-100"
                        onClick={() =>
                          setHoveredCat(
                            hoveredCat?.name === cat.name ? null : cat
                          )
                        }
                      >
                        {cat.name}
                      </button>

                      {hoveredCat?.name === cat.name &&
                        cat.subs?.length > 0 && (
                          <div className="px-6 py-2 space-y-2">
                            {cat.subs.map((group, idx) => (
                              <div key={idx}>
                                <h4 className="text-sm font-semibold text-purple-700 mb-1">
                                  {group.groupTitle}
                                </h4>
                                <ul className="space-y-1 text-sm text-gray-700">
                                  {group.items.map((item, i) => (
                                    <li key={i}>
                                      <Link
                                        to={`/products?subcategory=${encodeURIComponent(
                                          item
                                        )}`}
                                        className="hover:underline"
                                        onClick={() => setIsOpen(false)}
                                      >
                                        {item}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        )}
                    </div>
                  ))}
                  <Link
                    to="/blog"
                    className="block px-4 py-2 mt-4 text-base font-medium text-gray-800 hover:text-black"
                    onClick={() => setIsOpen(false)}
                  >
                    Blog
                  </Link>
                </div>

                <div className="p-4 border-t">
                  {!user ? (
                    <div className="space-y-2">
                      <Link
                        to="/login"
                        className="block text-sm font-medium text-blue-600"
                      >
                        Sign In
                      </Link>
                      <Link
                        to="/signup"
                        className="block text-sm text-gray-700"
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
                          window.location.reload();
                        }}
                        className="block text-sm text-left text-gray-700 hover:underline"
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
                <Heart className="w-7 h-7 text-gray-700" />
                {wishlistItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5">
                    {wishlistItems.length}
                  </span>
                )}
              </Button>
            </Link>

            <Link to="/cart" className="relative">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingBag className="w-7 h-7 text-gray-700" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5">
                    {cartItems.length}
                  </span>
                )}
              </Button>
            </Link>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="w-full px-1">
          <div className="flex items-center border rounded-full px-3 py-1.5 shadow-sm bg-white">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search for Fashion"
              className="ml-2 w-full outline-none text-sm placeholder:text-gray-400 bg-transparent"
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
            />
          </div>
          {searchFocused && (
            <SearchDropdown
              suggestions={filteredSuggestions}
              searchQuery={searchQuery}
            />
          )}
        </div>
      </div>

      {/* ===================== DESKTOP NAV ===================== */}
      <div className="hidden md:flex items-center justify-between px-8 py-2">
        {/* Logo */}
        <Link to="/" className="mr-6">
          <img src="/logo.png" alt="ek" className="h-10 w-auto" />
        </Link>

        {/* Category Links */}
        <nav className="flex space-x-6 items-center relative">
          {categories.map((cat) => {
            const isActive = hoveredCat?.name === cat.name;
            return (
              <div key={cat.name} className="relative">
                <button
                  onClick={() => setHoveredCat(isActive ? null : cat)}
                  className={`text-sm font-medium transition ${
                    cat.name.toLowerCase() === "sale"
                      ? "text-red-500 font-semibold"
                      : isActive
                      ? "text-black border-b-2 border-purple-600"
                      : "text-gray-700 hover:text-black"
                  }`}
                >
                  {cat.name}
                </button>
              </div>
            );
          })}

          {/* Dropdown */}
          {hoveredCat?.subs?.length > 0 && (
            <div
              className="absolute top-full left-[-80px] mt-2 p-6 bg-white shadow-lg border z-50 min-w-[600px] grid grid-cols-3 gap-8 rounded-md"
              onMouseLeave={() => setHoveredCat(null)}
            >
              {hoveredCat.subs.map((sub, i) => (
                <div key={i}>
                  <h4 className="text-[15px] font-semibold text-[#d6336c] mb-2">
                    {sub.groupTitle}
                  </h4>
                  <ul className="space-y-1 text-[14px] text-gray-700">
                    {sub.items.map((item, idx) => (
                      <li key={idx}>
                        <Link
                          to={`/products?subcategory=${encodeURIComponent(
                            item
                          )}`}
                          className="hover:underline block"
                          onClick={() => setHoveredCat(null)}
                        >
                          {item}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </nav>

        {/* Search + Icons */}
        <div className="flex items-center space-x-3 flex-shrink-0">
          <div className="w-[320px] relative">
            <div className="flex items-center border rounded-full px-3 py-1 bg-white">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search for Fashion"
                className="ml-2 w-full outline-none text-sm placeholder:text-gray-400 bg-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
              />
            </div>
            {searchFocused && filteredSuggestions.length > 0 && (
              <div className="absolute w-full bg-white border rounded shadow-md mt-1 z-50 max-h-60 overflow-auto">
                {filteredSuggestions.map((suggestion, index) => (
                  <Link
                    key={index}
                    to={`/products?subcategory=${encodeURIComponent(
                      suggestion.item
                    )}`}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setSearchQuery("")}
                  >
                    {suggestion.item}
                    <span className="text-xs text-gray-500 ml-2">
                      ({suggestion.category})
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link to="/wishlist">
            <Button variant="ghost" size="icon">
              <Heart className="w-6 h-6 text-gray-700" />
            </Button>
          </Link>
          <Link to="/cart">
            <Button variant="ghost" size="icon">
              <ShoppingBag className="w-6 h-6 text-gray-700" />
            </Button>
          </Link>
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
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-50 p-2">
                  <p className="px-3 py-2 text-sm font-medium text-gray-800">
                    {user.name}
                  </p>
                  <hr />
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setDropdown(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      dispatch(logout());
                      window.location.reload();
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
