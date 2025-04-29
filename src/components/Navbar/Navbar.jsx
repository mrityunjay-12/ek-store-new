import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Heart, ShoppingBag, User2, Search } from "lucide-react";
import { Button } from "@headlessui/react";
import { logout } from "@/redux/slices/userSlice";
import MobileNavbar from "./MobileNavbar";
import SubCatBar from "./subcatBar";

export default function Navbar() {
  const { user } = useSelector((state) => state.user);
  const cartItems = useSelector((state) => state.cart?.items || []);
  const wishlistItems = useSelector((state) => state.wishlist?.items || []);
  const dispatch = useDispatch();

  const [categories, setCategories] = useState([]);
  const [hoveredCat, setHoveredCat] = useState(null);
  const [selectedSubcat, setSelectedSubcat] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [dropdown, setDropdown] = useState(false);
  const [typedPlaceholder, setTypedPlaceholder] = useState("");
  const [categoryPlaceholders, setCategoryPlaceholders] = useState([]);
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetch("https://estylishkart.el.r.appspot.com/api/product-categories")
      .then((res) => res.json())
      .then((data) => {
        const names = (data?.data || [])
          .map((cat) => `Search for ${cat.category_name}`)
          .filter(Boolean);
        setCategoryPlaceholders(names);
        resetTyping();
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    fetch(
      "https://estylishkart.el.r.appspot.com/api/menus/6805e45d041d1213ad92e203"
    )
      .then((res) => res.json())
      .then((data) => setCategories(data?.data?.items || []))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!categoryPlaceholders.length) return;
    const current = categoryPlaceholders[wordIndex];
    const timeout = setTimeout(
      () => {
        if (!isDeleting && charIndex < current.length) {
          setTypedPlaceholder((prev) => prev + current.charAt(charIndex));
          setCharIndex((prev) => prev + 1);
        } else if (!isDeleting && charIndex === current.length) {
          setTimeout(() => setIsDeleting(true), 1500);
        } else if (isDeleting && charIndex > 0) {
          setTypedPlaceholder((prev) => prev.slice(0, -1));
          setCharIndex((prev) => prev - 1);
        } else {
          setIsDeleting(false);
          setWordIndex((prev) => (prev + 1) % categoryPlaceholders.length);
        }
      },
      isDeleting ? 50 : 100
    );
    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, wordIndex, categoryPlaceholders]);

  useEffect(() => {
    if (!searchQuery.trim()) return setFilteredSuggestions([]);
    const fetchSuggestions = async () => {
      try {
        const res = await fetch(
          "https://estylishkart.el.r.appspot.com/api/products"
        );
        const data = await res.json();
        const suggestions = (data?.data || [])
          .filter((product) =>
            product.product_name
              .toLowerCase()
              .includes(searchQuery.toLowerCase())
          )
          .slice(0, 10)
          .map((product) => ({
            item: product.product_name,
            productId: product._id,
            image: product.product_variants?.[0]?.image || "/placeholder.jpg",
          }));
        setFilteredSuggestions(suggestions);
      } catch (error) {
        console.error(error);
      }
    };
    fetchSuggestions();
  }, [searchQuery]);

  const resetTyping = () => {
    setTypedPlaceholder("");
    setWordIndex(0);
    setCharIndex(0);
    setIsDeleting(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      const dropdownEl = document.getElementById("category-dropdown");
      if (
        dropdownEl &&
        !dropdownEl.contains(e.target) &&
        !e.target.closest(".category-link")
      ) {
        setHoveredCat(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <MobileNavbar
        categories={categories}
        wishlistItems={wishlistItems}
        cartItems={cartItems}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        typedPlaceholder={typedPlaceholder}
        isDeleting={isDeleting}
        wordIndex={wordIndex}
        charIndex={charIndex}
        categoryPlaceholders={categoryPlaceholders}
        searchFocused={searchFocused}
        setSearchFocused={setSearchFocused}
        filteredSuggestions={filteredSuggestions}
      />

      {/* Desktop Topbar */}
      <div className="hidden md:flex justify-end px-8 pt-2 text-sm font-medium text-gray-700">
        {!user && (
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="text-blue-600 hover:underline flex items-center"
            >
              <User2 className="w-4 h-4 mr-1" /> Sign In
            </Link>
            <span className="text-gray-400">or</span>
            <Link to="/signup" className="hover:underline">
              Sign Up
            </Link>
          </div>
        )}
      </div>

      {/* Desktop Main Navbar */}
      <div className="hidden md:flex items-center justify-between px-4 md:px-8 py-2 flex-wrap gap-y-3">
        {/* Logo */}
        <Link to="/" className="mr-4 flex items-center flex-shrink-0">
          <img src="/logo.png" alt="ek" className="h-10 w-auto" />
        </Link>

        {/* Category Links (Dynamic) */}
        <nav className="flex flex-wrap gap-x-10 gap-y-2 justify-end flex-1 overflow-x-auto max-w-full md:pl-10">
          {categories.map((cat) => {
            const isActive = hoveredCat?.label === cat.label;
            const isBlog = cat.label?.toLowerCase() === "blog";
            if (isBlog && cat.link) {
              return (
                <Link
                  key={cat._id || cat.label}
                  to={cat.link}
                  className="hidden sm:flex items-center border px-3 py-1 rounded-lg border-black text-sm font-semibold"
                >
                  {cat.label}
                </Link>
              );
            }
            return (
              <div
                key={cat._id || cat.label}
                className="relative whitespace-nowrap"
              >
                <span
                  className="category-link cursor-pointer"
                  onClick={() => {
                    setHoveredCat((prev) =>
                      prev?.label === cat.label ? null : cat
                    );
                    setSelectedSubcat(null);
                  }}
                >
                  <span
                    className={`text-sm md:text-md font-semibold transition ${
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

        {/* Search and Icons */}
        <div className="flex items-center justify-end flex-2 gap-6 ml-10">
          {/* Search Box */}
          <div className="w-[200px] relative hidden sm:block">
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
                {filteredSuggestions.map((suggestion, idx) => {
                  const slug = `${suggestion.item
                    .replace(/\s+/g, "-")
                    .toLowerCase()}_${suggestion.productId}`;
                  return (
                    <Link
                      key={idx}
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

          {/* Wishlist */}
          <Link to="/wishlist">
            <Button variant="ghost" size="icon" className="relative">
              <Heart className="w-6 h-6 text-gray-700" />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-1 right-0 bg-red-500 text-white text-xs rounded-full px-1.5">
                  {wishlistItems.length}
                </span>
              )}
            </Button>
          </Link>

          {/* Cart */}
          <Link to="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingBag className="w-6 h-6 text-gray-700" />
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
                    <p className="font-semibold text-gray-800">
                      Hello {user.name}
                    </p>
                    <p className="text-gray-600 text-sm">{user.phone}</p>
                  </div>
                  <div className="py-2">
                    <UserLinks setDropdown={setDropdown} />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Sub Category Bar */}
      <SubCatBar
        hoveredCat={hoveredCat}
        selectedSubcat={selectedSubcat}
        setSelectedSubcat={setSelectedSubcat}
        setHoveredCat={setHoveredCat}
      />
    </header>
  );
}

function UserLinks({ setDropdown }) {
  const dispatch = useDispatch();
  return (
    <>
      {["Orders", "Wishlist", "Contact Us"].map((item) => (
        <Link
          key={item}
          to={`/profile?tab=${item.toLowerCase().replace(/\s/g, "")}`}
          className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
          onClick={() => setDropdown(false)}
        >
          {item}
        </Link>
      ))}
      <hr />
      {["Coupons", "Addresses"].map((item) => (
        <Link
          key={item}
          to={`/profile?tab=${item.toLowerCase()}`}
          className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
          onClick={() => setDropdown(false)}
        >
          {item}
        </Link>
      ))}
      <hr />
      <Link
        to="/profile"
        className="block px-4 py-2 text-gray-600 hover:bg-gray-100"
        onClick={() => setDropdown(false)}
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
    </>
  );
}
