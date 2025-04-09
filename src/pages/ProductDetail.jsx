import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { useSwipeable } from "react-swipeable";
import Footer from "@/components/Footer";

export default function ProductDetailPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedFit, setSelectedFit] = useState("True to Size");
  const [addingToBag, setAddingToBag] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const variant = product?.product_variants?.[0];
  const allImages = [variant?.image, ...(variant?.gallery_image || [])];

  const colors =
    variant?.attributes
      ?.filter((attr) => attr.attribute_name === "Color")
      .map((attr) => attr.attribute_value) || [];

  const sizes = product?.product_variants
    ?.map(
      (v) =>
        v.attributes?.find((a) => a.attribute_name === "Size")?.attribute_value
    )
    .filter((v, i, arr) => arr.indexOf(v) === i);

  useEffect(() => {
    if (productId) {
      const fetchProduct = async () => {
        try {
          const res = await axios.get(
            `https://estylishkart.el.r.appspot.com/api/products/${productId}`
          );
          const data = res.data?.data;

          setProduct(data);
          setSelectedSize(
            data?.product_variants?.[0]?.attributes?.find(
              (attr) => attr.attribute_name === "Size"
            )?.attribute_value
          );
        } catch (err) {
          console.error("Error fetching product:", err);
        }
      };

      fetchProduct();
    }
  }, [productId]);

  useEffect(() => {
    setSelectedImage(allImages[selectedIndex]);
  }, [selectedIndex, allImages]);

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      if (selectedIndex < allImages.length - 1)
        setSelectedIndex((prev) => prev + 1);
    },
    onSwipedRight: () => {
      if (selectedIndex > 0) setSelectedIndex((prev) => prev - 1);
    },
    trackMouse: true,
  });

  const handleAddToWishlist = async () => {
    if (!user || !user._id) return navigate("/login");

    try {
      const res = await fetch(
        "https://estylishkart.el.r.appspot.com/api/wishlist",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: user._id,
            product_id: product._id,
            variant_id: variant._id,
          }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success("Added to Wishlist!");
    } catch {
      toast.error("Wishlist failed");
    }
    
  };

  const handleAddToBag = async () => {
    if (!user || !user._id) return navigate("/login");

    if (!selectedSize) return toast.error("Please select a size");

    try {
      setAddingToBag(true);
      const res = await fetch(
        "https://estylishkart.el.r.appspot.com/api/cart/add",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: user._id,
            product_id: product._id,
            variant_id: variant._id,
            quantity: 1,
            size: selectedSize,
          }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast.success("Added to cart!");
      setTimeout(() => navigate("/cart"), 1000);
    } catch {
      toast.error("Wishlist failed");
    }
     finally {
      setAddingToBag(false);
    }
  };

  if (!product) return <div className="p-10">Loading...</div>;

  return (
    <>
      <Toaster position="center" />
      <div className="bg-[#723248] text-white text-sm text-center py-2 px-4 font-semibold">
        Sub Categories
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* LEFT: Images */}
        <div>
          {/* Main image */}
          <div
            className="w-full h-[400px] sm:h-[500px] bg-white border rounded-md flex items-center justify-center cursor-pointer"
            onClick={() => setShowPopup(true)}
            {...swipeHandlers}
          >
            <img
              src={selectedImage}
              alt="Product"
              className="max-h-full max-w-full object-contain"
            />
          </div>

          {/* Thumbnails below (max 5) */}
          <div className="mt-4 flex gap-3 overflow-hidden">
            {allImages.slice(0, 5).map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Thumb ${idx}`}
                onClick={() => {
                  setSelectedIndex(idx);
                }}
                className={`h-20 w-20 rounded border object-contain cursor-pointer ${
                  selectedIndex === idx ? "border-black" : "border-gray-300"
                }`}
              />
            ))}
          </div>

          {/* Popup full viewer */}
          {showPopup && (
            <div
              className="fixed inset-0 bg-black bg-opacity-80 z-50 flex flex-col sm:flex-row"
              onClick={() => setShowPopup(false)}
            >
              {/* Sidebar thumbnails */}
              <div
                className="sm:h-full sm:w-24 w-full sm:overflow-y-auto flex sm:flex-col flex-row gap-2 p-2 bg-black bg-opacity-60"
                onClick={(e) => e.stopPropagation()}
              >
                {allImages.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`Popup Thumb ${idx}`}
                    onClick={() => setSelectedIndex(idx)}
                    className={`h-16 w-16 object-contain rounded cursor-pointer border ${
                      selectedIndex === idx
                        ? "border-white"
                        : "border-transparent"
                    }`}
                  />
                ))}
              </div>

              {/* Main swipeable image */}
              <div
                className="flex-grow flex items-center justify-center p-4"
                onClick={(e) => e.stopPropagation()}
                {...swipeHandlers}
              >
                <img
                  src={selectedImage}
                  alt="Zoom"
                  className="max-h-[90%] max-w-[90%] object-contain"
                />
                <button
                  onClick={() => setShowPopup(false)}
                  className="absolute top-4 right-4 text-white bg-black bg-opacity-50 p-2 rounded-full text-xl"
                >
                  ✕
                </button>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: Info */}
        <div>
          <h1 className="text-2xl font-semibold mb-2">
            {product.product_name}
          </h1>

          <p className="text-xl font-medium mb-1">
            ₹{variant?.price}
            {variant?.compare_price > variant?.price && (
              <>
                <span className="text-base text-gray-500 line-through ml-2">
                  ₹{variant.compare_price}
                </span>
                <span className="text-sm font-semibold text-red-600 ml-2">
                  {Math.round(
                    ((variant.compare_price - variant.price) /
                      variant.compare_price) *
                      100
                  )}
                  % OFF
                </span>
              </>
            )}
          </p>

          {/* Colors */}
          {colors.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-1">COLOR</p>
              <div className="flex gap-2">
                {colors.map((color, idx) => (
                  <div
                    key={idx}
                    className="w-6 h-6 rounded-full border"
                    style={{ backgroundColor: color.toLowerCase() }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Sizes */}
          {sizes.length > 0 && (
            <>
              <div className="mb-4 flex justify-between items-center">
                <p className="text-sm font-medium text-gray-700">SIZE</p>
                <span className="text-xs underline font-medium text-gray-700">
                  FIND YOUR FIT
                </span>
              </div>
              <div className="flex gap-2 mb-4 flex-wrap">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`border rounded px-4 py-2 text-sm ${
                      selectedSize === size
                        ? "border-black font-semibold"
                        : "text-gray-600"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Fit Selection */}
          <div className="grid grid-cols-3 text-xs text-gray-600 border mb-4 cursor-pointer">
            {["Runs Small", "True to Size", "Runs Large"].map((fit) => (
              <div
                key={fit}
                onClick={() => setSelectedFit(fit)}
                className={`py-2 text-center transition ${
                  selectedFit === fit
                    ? "bg-gray-100 font-semibold text-black"
                    : "hover:bg-gray-50"
                }`}
              >
                {fit.toUpperCase()}
              </div>
            ))}
          </div>

          {/* Add to Cart & Wishlist */}
          <div className="grid gap-2 mb-6">
            <button
              onClick={handleAddToBag}
              className="bg-black text-white text-sm px-6 py-3 font-semibold w-full"
            >
              {addingToBag ? "Adding..." : "ADD TO BAG"}
            </button>

            <button
              onClick={handleAddToWishlist}
              className="border text-sm px-6 py-3 font-medium w-full flex items-center justify-center gap-2 text-gray-700"
            >
              <Heart className="w-4 h-4" /> ADD TO WISHLIST
            </button>
          </div>

          {/* Description */}
          <details className="border-b py-2" open>
            <summary className="font-medium text-sm cursor-pointer">
              PRODUCT DETAILS
            </summary>
            <div
              className="text-sm text-gray-600 mt-2"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          </details>
        </div>
      </div>

      <Footer />
    </>
  );
}
