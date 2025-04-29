import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { setBuyNowItem } from "@/redux/slices/buyNowSlice";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useSwipeable } from "react-swipeable";
import Breadcrumb from "@/components/Breadcrumb";

export default function ProductDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedVariantId, setSelectedVariantId] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedFit, setSelectedFit] = useState("True to Size");
  const [addingToBag, setAddingToBag] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const productId = slug?.split("_").pop();

  const sizes = product?.product_variants
    ?.map(
      (v) =>
        v.attributes?.find((a) => a.attribute_name === "Size")?.attribute_value
    )
    ?.filter((v, i, arr) => arr.indexOf(v) === i);

  const sameSizeVariants = product?.product_variants?.filter((v) =>
    v.attributes.some(
      (attr) =>
        attr.attribute_name === "Size" && attr.attribute_value === selectedSize
    )
  );

  const variant =
    product?.product_variants?.find((v) => v._id === selectedVariantId) ||
    sameSizeVariants?.[0];

  const allImages = [variant?.image, ...(variant?.gallery_image || [])];

  const differentiatingAttributes = () => {
    const allAttrs = {};
    sameSizeVariants?.forEach((variant) => {
      variant.attributes.forEach(({ attribute_name, attribute_value }) => {
        if (!allAttrs[attribute_name]) {
          allAttrs[attribute_name] = new Set();
        }
        allAttrs[attribute_name].add(attribute_value);
      });
    });
    return Object.entries(allAttrs)
      .filter(([_, values]) => values.size > 1)
      .map(([name]) => name);
  };
  const colors =
    variant?.attributes
      ?.filter((attr) => attr.attribute_name === "Color")
      .map((attr) => attr.attribute_value) || [];

  useEffect(() => {
    if (productId) {
      const fetchProduct = async () => {
        try {
          const res = await axios.get(
            `https://estylishkart.el.r.appspot.com/api/products/${productId}`
          );
          const data = res.data?.data;
          setProduct(data);

          const firstSize = data?.product_variants?.[0]?.attributes?.find(
            (attr) => attr.attribute_name === "Size"
          )?.attribute_value;

          // recently viewed product

          const recent =
            JSON.parse(localStorage.getItem("recentlyViewed")) || [];

          const filtered = recent.filter((p) => p._id !== data._id);

          filtered.unshift({
            _id: data._id,
            name: data.product_name,
            main_image: data.main_image || data.product_variants?.[0]?.image,
            price: data.product_variants?.[0]?.price,
            tag: data.tagline || "", // fallback if you use product.tag
            category_name: data.categories?.[0]?.category_name || "Product",
          });

          const limited = filtered.slice(0, 2);

          localStorage.setItem("recentlyViewed", JSON.stringify(limited));

          setSelectedSize(firstSize);
          setSelectedVariantId(data?.product_variants?.[0]?._id);
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
    if (!variant) return toast.error("Select a valid variant");
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
    } catch (err) {
      toast.error("Add to cart failed");
    } finally {
      setAddingToBag(false);
    }
  };

  const handleQuickCheckout = () => {
    if (!user || !user._id) return navigate("/login");
    const quickProduct = {
      ...product,
      selected_variant: variant,
      selected_size: selectedSize,
    };
    dispatch(setBuyNowItem(quickProduct));
    navigate("/checkout");
  };

  if (!product) return <div className="p-10">Loading...</div>;

  return (
    <>
      <Breadcrumb
        category={product.categories?.[0]?.category_name}
        categoryId={product.categories?.[0]?._id}
        subcategory={product.sub_categories?.[0]?.sub_category_name}
        subcategoryId={product.sub_categories?.[0]?._id}
        productName={product.product_name}
        productId={product._id}
      />

      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Images */}
          <div>
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
            <div className="mt-4 flex gap-3 overflow-hidden">
              {allImages.slice(0, 5).map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Thumb ${idx}`}
                  onClick={() => setSelectedIndex(idx)}
                  className={`h-20 w-20 rounded border object-contain cursor-pointer ${
                    selectedIndex === idx ? "border-black" : "border-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Product Info */}
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
            {/* Colors */}
            {product?.product_variants && (
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-1">COLOR</p>
                <div className="flex gap-3">
                  {Array.from(
                    new Set(
                      product.product_variants.map(
                        (v) =>
                          v.attributes.find((a) => a.attribute_name === "Color")
                            ?.attribute_value
                      )
                    )
                  )
                    .filter(Boolean)
                    .map((color) => {
                      const match = product.product_variants.find((v) =>
                        v.attributes.some(
                          (a) =>
                            a.attribute_name === "Color" &&
                            a.attribute_value === color &&
                            (!selectedSize ||
                              v.attributes.some(
                                (a) =>
                                  a.attribute_name === "Size" &&
                                  a.attribute_value === selectedSize
                              ))
                        )
                      );
                      if (!match) return null;
                      const isSelected = match._id === variant._id;
                      return (
                        <div
                          key={color}
                          onClick={() => setSelectedVariantId(match._id)}
                          className={`w-8 h-8 rounded-full cursor-pointer transition-all duration-200 ${
                            isSelected
                              ? "ring-2 ring-black"
                              : "ring-1 ring-gray-300"
                          }`}
                          title={color}
                          style={{ backgroundColor: color.toLowerCase() }}
                        />
                      );
                    })}
                </div>
              </div>
            )}

            {/* Size buttons */}
            {sizes?.length > 0 && sizes[0] && (
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-1">SIZE</p>
                <div className="flex gap-2 flex-wrap">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => {
                        setSelectedSize(size);
                        const firstMatch = product.product_variants.find((v) =>
                          v.attributes.some(
                            (a) =>
                              a.attribute_name === "Size" &&
                              a.attribute_value === size
                          )
                        );
                        setSelectedVariantId(firstMatch._id);
                      }}
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
              </div>
            )}

            {/* Differentiating attribute buttons */}
            {differentiatingAttributes().map((attrName) => (
              <div key={attrName} className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-1">
                  {attrName.toUpperCase()}
                </p>
                <div className="flex gap-2 flex-wrap">
                  {Array.from(
                    new Set(
                      sameSizeVariants.map(
                        (v) =>
                          v.attributes.find(
                            (a) => a.attribute_name === attrName
                          )?.attribute_value
                      )
                    )
                  ).map((value) => {
                    const match = sameSizeVariants.find((v) =>
                      v.attributes.some(
                        (a) =>
                          a.attribute_name === attrName &&
                          a.attribute_value === value
                      )
                    );
                    return (
                      <button
                        key={value}
                        onClick={() => setSelectedVariantId(match._id)}
                        className={`border rounded px-4 py-2 text-sm ${
                          variant._id === match._id
                            ? "border-black font-semibold"
                            : "text-gray-600"
                        }`}
                      >
                        {value}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
            {/* Fit Selection */}
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

            <div className="grid gap-2 mb-6">
              <button
                onClick={handleAddToBag}
                className="bg-black text-white text-sm px-6 py-3 font-semibold w-full"
              >
                {addingToBag ? "Adding..." : "ADD TO BAG"}
              </button>
              <button
                onClick={handleQuickCheckout}
                className="bg-[#713248] text-white text-sm px-6 py-3 font-semibold w-full"
              >
                QUICK CHECKOUT
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
                  <p className="text-sm font-medium text-gray-800">
                    {item.name}
                  </p>
                  <p className="text-sm text-gray-600">₹{item.price}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
