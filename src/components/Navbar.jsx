import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, Heart, ShoppingBag, User2, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "@/redux/slices/userSlice";
import SearchDropdown from "./SearchDropdown";
import { Link } from "react-router-dom";
import SubCatBar from "./Navbar/subcatBar";

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
  const [selectedSubcat, setSelectedSubcat] = useState(null);

  useEffect(() => {
    function handleClickOutside(e) {
      const dropdownEl = document.getElementById("category-dropdown");
      if (
        dropdownEl &&
        !dropdownEl.contains(e.target) &&
        !e.target.closest(".category-link")
      ) {
        setHoveredCat(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

            const chunked = Array.from({ length: 5 }, (_, i) =>
              subArray.slice(
                i * Math.ceil(subArray.length / 5),
                (i + 1) * Math.ceil(subArray.length / 5)
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

  // useEffect(() => {
  //   if (searchQuery.trim()) {
  //     const suggestions = [];

  //     categories.forEach((cat) => {
  //       cat.subs.forEach((group) => {
  //         group.items.forEach((item) => {
  //           if (item.toLowerCase().includes(searchQuery.toLowerCase())) {
  //             suggestions.push({ category: cat.name, item });
  //           }
  //         });
  //       });
  //     });

  //     setFilteredSuggestions(suggestions);
  //   } else {
  //     setFilteredSuggestions([]);
  //   }
  // }, [searchQuery, categories]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredSuggestions([]);
      return;
    }
  
    const fetchSuggestions = async () => {
      try {
        const res = await fetch("https://estylishkart.el.r.appspot.com/api/products");
        const data = await res.json();
        const products = data?.data || [];
  
        const filtered = products
          .filter((product) =>
            product.product_name.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .slice(0, 10) // 👈 Limit to top 10 results
          .map((product) => ({
            item: product.product_name,
            productId: product._id,
            image: product.product_variants?.[0]?.image || "/placeholder.jpg"
          }));
  
        setFilteredSuggestions(filtered);
      } catch (err) {
        console.error("Failed to fetch product suggestions:", err);
        setFilteredSuggestions([]);
      }
    };
  
    fetchSuggestions();
  }, [searchQuery]);
  
  
  
  
  
  
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
            <p>or</p>
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
              <SheetContent side="left" className="w-72 bg-white flex flex-col">
                <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
                  <div className=" px-2 pb-6">
                    {categories.map((cat) => (
                      <div key={cat.name} className="border-b">
                        <button
                          className="w-full text-left px-4 py-2 font-medium text-gray-800 hover:bg-gray-100 flex justify-between items-center"
                          onClick={() =>
                            setHoveredCat((prev) =>
                              prev === cat.name ? null : cat.name
                            )
                          }
                        >
                          {cat.name}
                          <span className="text-xs text-gray-500">
                            {hoveredCat === cat.name ? "▲" : "▼"}
                          </span>
                        </button>

                        {hoveredCat === cat.name && (
                          <div className="px-6 py-2 space-y-1">
                            {categories
                              .find((c) => c.name === cat.name)
                              ?.subs.flatMap((group) =>
                                group.items.map((item, i) => (
                                  <Link
                                    key={i}
                                    to={`/products?subcategory=${encodeURIComponent(
                                      item
                                    )}`}
                                    className="block text-sm text-gray-700 hover:underline"
                                    onClick={() => {
                                      setIsOpen(false);
                                      setHoveredCat(null);
                                    }}
                                  >
                                    {item}
                                  </Link>
                                ))
                              )}
                          </div>
                        )}
                      </div>
                    ))}
                    {/* <Link
                      to="/blog"
                      className="flex items-center border px-4 py-1 mr-4 rounded-lg border-black "
                      onClick={() => setIsOpen(false)}
                    >
                      Blog
                    </Link> */}
                  </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t">
                  {!user ? (
                    <div className=" flex items-center gap-4">
                      <Link
                        to="/login"
                        className="uppercase block text-sm font-medium text-blue-600"
                      >
                        Sign In
                      </Link>
                      <p>or </p>
                      <Link
                        to="/signup"
                        className=" uppercase block text-sm text-gray-700"
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
        <nav className="flex space-x-12 relative ml-40 pl-20">
        {categories.map((cat) => {
          const isActive = hoveredCat?.name === cat.name;
          return (
            <div key={cat.name} className="relative">
              <span
                className="category-link cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  setHoveredCat((prev) => (prev?.name === cat.name ? null : cat));
                  setSelectedSubcat(null);
                }}
              >
                <span
                  className={`text-sm font-medium transition ${
                    cat.name.toLowerCase() === "sale"
                      ? "flicker-sale"
                      : isActive
                      ? "text-black border-b-2 border-yellow-600"
                      : "text-gray-700 hover:text-black"
                  }`}
                >
                  {cat.name}
                </span>
              </span>
            </div>
          );
        })}
      </nav>

        {/* Search + Icons */}
        <div className="flex items-center space-x-3 flex-shrink-0">
        {/* <button className="flex items-center border px-4 py-1 mr-4 rounded-lg border-black "> Blog</button> */}
        <Link
          to="/blog"
          className="flex items-center border px-4 py-1 mr-4 rounded-lg border-black "
          onClick={() => setIsOpen(false)}
          >
            Blog
        </Link> 
  <div className="w-[200px] relative"> 
   
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
                 <div className="absolute right-0 mt-2 w-60 bg-white border rounded shadow-lg z-50 text-sm">
                   <div className="px-4 py-3 border-b">
                     <p className="font-semibold text-gray-800">
                       Hello {user.name}
                     </p>
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
                     {/* <Link
                       to="/gift-cards"
                       onClick={() => setDropdown(false)}
                       className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                     >
                       Gift Cards
                     </Link> */}
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
                         setDropdown(false)
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
      <SubCatBar
        hoveredCat={hoveredCat}
        selectedSubcat={selectedSubcat}
        setSelectedSubcat={setSelectedSubcat}
        setHoveredCat={setHoveredCat}
      />
    </header>
  );
}
