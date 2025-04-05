import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom"; // ✅ import useNavigate
import axios from "axios";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast, Toaster } from "react-hot-toast"; // for notifications

export default function ProductDetailPage() {
  const { productId } = useParams();
  const navigate = useNavigate(); // ✅ initialize navigate
  const { user } = useSelector((state) => state.user);
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedFit, setSelectedFit] = useState("True to Size");
  const [addingToBag, setAddingToBag] = useState(false);

  const handleAddToWishlist = async () => {
    if (!user || !user._id) {
      navigate("/login");
      return;
    }

    const variantId = product?.product_variants?.[0]?._id;

    if (!product?._id || !variantId) {
      toast.error("Missing Product or Variant ID");
      return;
    }

    try {
      const res = await fetch(
        "https://estylishkart.el.r.appspot.com/api/wishlist",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: user._id,
            product_id: product._id,
            variant_id: variantId,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success("Added to Wishlist!");
    } catch (err) {
      toast.error("Wishlist failed");
      console.error("Wishlist error:", err);
    }
  };

  const handleAddToBag = async () => {
    if (!user || !user._id) {
      navigate("/login");
      return;
    }

    const variantId = product?.product_variants?.[0]?._id;

    if (!variantId || !selectedSize) {
      toast.error("Please select a size");
      return;
    }

    try {
      setAddingToBag(true);

      const res = await fetch(
        "https://estylishkart.el.r.appspot.com/api/cart/add",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: user._id,
            product_id: product._id,
            variant_id: variantId,
            quantity: 1,
            size: selectedSize,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast.success("Added to cart!");

      // Wait a moment for the toast, then redirect
      setTimeout(() => {
        navigate("/cart");
      }, 1000);
    } catch (err) {
      toast.error("Add to cart failed");
      console.error(err);
    } finally {
      setAddingToBag(false);
    }
  };

  useEffect(() => {
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
        setSelectedImage(
          data?.product_variants?.[0]?.image ||
            data?.product_variants?.[0]?.gallery_image?.[0]
        );
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    if (productId) fetchProduct();
  }, [productId]);

  if (!product) return <div className="p-10">Loading...</div>;

  const variant = product.product_variants?.[0];
  const colors =
    variant?.attributes
      ?.filter((attr) => attr.attribute_name === "Color")
      .map((attr) => attr.attribute_value) || [];

  const sizes = product.product_variants
    ?.map(
      (v) =>
        v.attributes?.find((a) => a.attribute_name === "Size")?.attribute_value
    )
    .filter((v, i, arr) => arr.indexOf(v) === i); // Unique sizes

  return (
    <>
      {/* <Navbar /> */}
      <Toaster position="center" />

      <div className="bg-[#723248] text-white text-sm text-center py-2 px-4 font-semibold">
        Sub Categories
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* LEFT COLUMN - Images */}
        <div>
          <img
            src={selectedImage}
            alt={product.product_name}
            className="w-full object-cover rounded-md"
          />
          <div className="mt-4 flex gap-2">
            {[variant?.image, ...(variant?.gallery_image || [])].map(
              (img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Gallery ${idx}`}
                  className={`w-20 h-20 object-cover rounded border cursor-pointer ${
                    selectedImage === img ? "border-black" : "border-gray-300"
                  }`}
                  onClick={() => setSelectedImage(img)}
                />
              )
            )}
          </div>
        </div>

        {/* RIGHT COLUMN - Details */}
        <div>
          <h1 className="text-2xl font-semibold mb-2">
            {product.product_name}
          </h1>
          <p className="text-xl font-medium mb-1">
            ₹{variant?.price}{" "}
            {variant?.compare_price > variant?.price && (
              <span className="text-base text-gray-500 line-through ml-2">
                ₹{variant.compare_price}
              </span>
            )}{" "}
            {variant?.compare_price > variant?.price && (
              <span className="text-sm font-semibold text-red-600 ml-2">
                {Math.round(
                  ((variant.compare_price - variant.price) /
                    variant.compare_price) *
                    100
                )}
                % OFF
              </span>
            )}
          </p>

          {/* Color */}
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

          {/* Size */}
          {sizes.length > 0 && (
            <>
              <div className="mb-4 flex justify-between items-center">
                <p className="text-sm font-medium text-gray-700">SIZE</p>
                <a
                  href="#"
                  className="text-xs underline font-medium text-gray-700"
                >
                  FIND YOUR FIT
                </a>
              </div>
              <div className="flex gap-2 mb-4">
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

          {/* Fit Feedback */}
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

          {/* Buttons */}
          <div className="grid gap-2 mb-6">
            <button
              onClick={handleAddToBag}
              className="bg-black text-white text-sm px-6 py-3 font-semibold w-full"
            >
              {addingToBag ? "Adding..." : "ADD TO BAG"}
            </button>

            <button
              className="border text-sm px-6 py-3 font-medium w-full flex items-center justify-center gap-2 text-gray-700"
              onClick={handleAddToWishlist}
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

          <details className="border-b py-2">
            <summary className="font-medium text-sm cursor-pointer">
              SIZING
            </summary>
            <p className="text-sm text-gray-600 mt-2">
              Check the sizing guide for more details.
            </p>
          </details>

          <details className="border-b py-2">
            <summary className="font-medium text-sm cursor-pointer">
              FAST & EASY 30 DAY RETURNS
            </summary>
            <p className="text-sm text-gray-600 mt-2">
              We offer hassle-free returns on all orders.
            </p>
          </details>
          {/* Complete the Look */}

          <h4 className="text-base font-semibold mb-4 mt-6">
            COMPLETE THE LOOK
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
            {(
              product.complementaryItems || [
                {
                  id: "1",
                  name: "JASMINE BRACELET · PEARL",
                  price: 299,
                  image: "/product2.png",
                },
                {
                  id: "2",
                  name: "SHELLY HAIR CLIP · GOLD",
                  price: 600,
                  image: "/product2.png",
                },
              ]
            ).map((item) => (
              <div key={item.id} className="p-3 text-center hover:transition">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-60 object-cover rounded mb-3"
                />
                <p className="text-sm font-medium text-gray-800">{item.name}</p>
                <p className="text-sm text-gray-600">₹{item.price}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
