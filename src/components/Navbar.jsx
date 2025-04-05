import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Menu,
  Heart,
  ShoppingBag,
  Globe,
  User2,
  Search,
  Mic,
} from "lucide-react";
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

  // const handleLogout = () => {
  //   dispatch(logout());
  //   window.location.reload();
  // };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      {/* Top Bar */}
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
        ) : (
          <div className="relative">
            {/* <button
              className="text-sm text-gray-700 hover:text-[#5b2338]"
              onClick={() => setDropdown(!dropdown)}
            >
              {user.name?.split(" ")[0]}
            </button> */}
            {/* {dropdown && (
              <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-50">
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )} */}
          </div>
        )}
      </div>

      {/* Main Navbar */}
      <div className="container flex flex-col md:flex-row md:items-center justify-between px-4 md:px-8 py-2 gap-2">
        {/* Left: Logo + Mobile Menu */}
        <div className="flex items-center justify-between md:justify-start gap-4 w-full md:w-auto">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 bg-white">
              <div className="mt-10 space-y-4">
                <div className="mt-10 space-y-4">
                  {categories.map((cat) => (
                    <Link
                      key={cat.name}
                      to={`/${cat.name.toLowerCase().replace(/\s+/g, "-")}`}
                      className="block text-base font-medium text-gray-800 hover:text-black px-4 py-2"
                      onClick={() => setIsOpen(false)}
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <Link to="/" className="text-2xl font-bold text-purple-900">
            <img
              src="/logo.png"
              alt="ek"
              className="h-10 w-auto px-4 md:px-0"
            />
          </Link>
        </div>

        {/* Mobile Search Bar */}
        <div className="block md:hidden w-full px-1">
          <div className="flex items-center border rounded-full px-3 py-1.5 shadow-sm bg-white">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search for Fashion"
              className="ml-2 w-full outline-none text-sm placeholder:text-gray-400 bg-transparent"
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
            />
            {/* <Mic className="w-4 h-4 text-gray-400" /> */}
          </div>
          {searchFocused && (
            <SearchDropdown
              suggestions={filteredSuggestions}
              searchQuery={searchQuery}
            />
          )}
        </div>

        {/* Center Nav Links */}
        <nav className="hidden md:flex flex-wrap justify-center flex-1 space-x-6 relative">
          {categories.map((cat) => (
            <div
              key={cat.name}
              className="relative group"
              onMouseEnter={() => setHoveredCat(cat)}
              onMouseLeave={() => setHoveredCat(null)}
            >
              <Link
                to={`/${cat.name.toLowerCase().replace(/\s+/g, "-")}`}
                className={`text-sm font-medium ${
                  cat.name.toLowerCase() === "sale"
                    ? "text-red-500 font-semibold"
                    : "text-gray-700 hover:text-black"
                }`}
              >
                {cat.name}
              </Link>
              {hoveredCat?.name === cat.name && hoveredCat.subs?.length > 0 && (
                <div
                  onMouseEnter={() => setHoveredCat(cat)}
                  onMouseLeave={() => setHoveredCat(null)}
                  className="absolute top-full left-0 mt-2 p-6 bg-white shadow-lg border z-50 w-[900px] grid grid-cols-3 gap-8 rounded-md"
                >
                  {hoveredCat.subs.map((sub, i) => (
                    <div key={i}>
                      <h4 className="text-[15px] font-semibold text-[#d6336c] mb-2">
                        {sub.groupTitle || "Collection"}
                      </h4>
                      <ul className="space-y-1 text-[14px] text-gray-700">
                        {sub.items.map((item, idx) => (
                          <li key={idx}>
                            <Link
                              to={`/products?subcategory=${encodeURIComponent(
                                item
                              )}`}
                              className="hover:underline block"
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
        </nav>

        {/* Right Actions */}
        {/* Right Actions */}
        <div className="flex items-center space-x-3 relative mt-2 md:mt-0">
          <Link to="/blog">
            <Button variant="outline" size="sm">
              Blog
            </Button>
          </Link>

          {/* Search (Desktop) */}
          <div className="relative hidden md:block w-[340px]">
            <div className="flex items-center border rounded-full px-3 py-1.5 shadow-sm bg-white">
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
                    {suggestion.item}{" "}
                    <span className="text-xs text-gray-500">
                      ({suggestion.category})
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Icons */}
          <Link to="/wishlist">
            <Button variant="ghost" size="icon">
              <Heart className="w-5 h-5 text-gray-700" />
            </Button>
          </Link>

          {/* <Button variant="ghost" size="icon">
            <Globe className="w-5 h-5 text-gray-700" />
          </Button> */}
          <Link to="/cart">
            <Button variant="ghost" size="icon">
              <ShoppingBag className="w-5 h-5 text-gray-700" />
            </Button>
          </Link>

          {/* 👤 Profile Dropdown */}
          {user && (
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setDropdown(!dropdown)}
                className="rounded-full bg-gray-100 hover:bg-gray-200 border"
              >
                <User2 className="w-5 h-5 text-gray-700" />
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
