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
  const [attributesMap, setAttributesMap] = useState({});
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [selectedVariantId, setSelectedVariantId] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedFit, setSelectedFit] = useState("True to Size");
  const [addingToBag, setAddingToBag] = useState(false);
  const [availableAttributes, setAvailableAttributes] = useState({});
  const [relatedProducts, setRelatedProducts] = useState([]);

  // const [showPopup, setShowPopup] = useState(false);

  const productId = slug?.split("_").pop();

  const variant = product?.product_variants?.find(
    (v) => v._id === selectedVariantId
  );

  const allImages = [variant?.image, ...(variant?.gallery_image || [])];

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

  // Fetch Product
  useEffect(() => {
    if (productId) {
      const fetchProduct = async () => {
        try {
          const res = await axios.get(
            `https://estylishkart.el.r.appspot.com/api/products/${productId}`
          );
          const data = res.data?.data;
          setProduct(data);

          // Fetch related products from the same category
          if (data.categories?.[0]?._id) {
            try {
              const relatedRes = await axios.get(
                `https://estylishkart.el.r.appspot.com/api/products?categoryId=${data.categories[0]._id}`
              );
              const relatedData = relatedRes.data?.data || [];

              // Filter out the current product
              const filteredRelated = relatedData.filter(
                (item) => item._id !== data._id
              );

              // Take top 2
              setRelatedProducts(filteredRelated.slice(0, 2));
            } catch (err) {
              console.error("Error fetching related products:", err);
            }
          }

          // Build Attribute Map (All attributes)
          const map = {};
          data.product_variants.forEach((variant) => {
            variant.attributes.forEach(
              ({ attribute_name, attribute_value }) => {
                if (!map[attribute_name]) map[attribute_name] = new Set();
                map[attribute_name].add(attribute_value);
              }
            );
          });
          const attributeOptions = {};
          for (const key in map) {
            attributeOptions[key] = Array.from(map[key]);
          }
          setAttributesMap(attributeOptions);

          // Build Available Attributes (only in-stock)
          const available = {};
          data.product_variants.forEach((variant) => {
            if (variant.variant_stock_availability > 0) {
              variant.attributes.forEach(
                ({ attribute_name, attribute_value }) => {
                  if (!available[attribute_name]) {
                    available[attribute_name] = new Set();
                  }
                  available[attribute_name].add(attribute_value);
                }
              );
            }
          });
          setAvailableAttributes(available);

          // Set Default Variant Selection
          if (data.product_variants.length) {
            const defaultVariant = data.product_variants[0];
            const initialAttributes = {};
            defaultVariant.attributes.forEach(
              ({ attribute_name, attribute_value }) => {
                initialAttributes[attribute_name] = attribute_value;
              }
            );
            setSelectedAttributes(initialAttributes);
            setSelectedVariantId(defaultVariant._id);
          }

          // Recently Viewed Products (limit to 2 recent)
          const recent =
            JSON.parse(localStorage.getItem("recentlyViewed")) || [];
          const filtered = recent.filter((p) => p._id !== data._id);
          filtered.unshift({
            _id: data._id,
            name: data.product_name,
            main_image: data.main_image || data.product_variants?.[0]?.image,
            price: data.product_variants?.[0]?.price,
            tag: data.tagline || "",
            category_name: data.categories?.[0]?.category_name || "Product",
          });
          const limited = filtered.slice(0, 2);
          localStorage.setItem("recentlyViewed", JSON.stringify(limited));
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

  // Handle Attribute Change
  const handleAttributeChange = (attributeName, attributeValue) => {
    const updatedAttributes = {
      ...selectedAttributes,
      [attributeName]: attributeValue,
    };
    setSelectedAttributes(updatedAttributes);

    // Find matching variant
    const matchingVariant = product.product_variants.find((variant) => {
      return variant.attributes.every(({ attribute_name, attribute_value }) => {
        return updatedAttributes[attribute_name] === attribute_value;
      });
    });

    if (matchingVariant) {
      setSelectedVariantId(matchingVariant._id);
      setSelectedIndex(0);
    }
  };

  const handleAddToBag = async () => {
    if (!user || !user._id) return navigate("/login");

    // Check if all attributes selected
    const requiredAttributes = Object.keys(attributesMap);
    const missingAttribute = requiredAttributes.find(
      (attr) => !selectedAttributes[attr]
    );

    if (missingAttribute) {
      const element = document.getElementById(`attribute-${missingAttribute}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      toast.error(`Please select ${missingAttribute}`);
      return;
    }

    if (!variant) {
      toast.error("Select a valid variant");
      return;
    }

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
      selected_size: selectedAttributes["Size"] || "",
    };
    dispatch(setBuyNowItem(quickProduct));
    navigate("/checkout");
  };

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
          {/* Images Section */}
          <div>
            <div
              className="w-full h-[400px] sm:h-[500px] bg-white border rounded-md flex items-center justify-center cursor-pointer"
              // onClick={() => setShowPopup(true)}
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

            {/* Dynamic Attributes */}
            {Object.entries(attributesMap).map(([attrName, attrValues]) => (
              <div key={attrName} id={`attribute-${attrName}`} className="mb-6">
                <p className="text-sm font-semibold text-gray-800 mb-2 tracking-wide">
                  {attrName.toUpperCase()}
                </p>
                <div className="flex flex-wrap gap-3">
                  {attrValues.map((value) => {
                    const isSelected = selectedAttributes[attrName] === value;
                    const isAvailable =
                      availableAttributes[attrName]?.has(value);

                    return (
                      <div key={value} className="relative">
                        <button
                          onClick={() => {
                            if (isAvailable)
                              handleAttributeChange(attrName, value);
                          }}
                          disabled={!isAvailable}
                          className={`min-w-[80px] rounded-full px-4 py-2 text-sm font-medium transition relative
                ${
                  isSelected
                    ? "bg-black text-white"
                    : isAvailable
                    ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
                        >
                          {value}
                        </button>

                        {/* Out of Stock Badge */}
                        {!isAvailable && (
                          <div className="absolute top-0 right-0 bg-red-500 text-white text-[10px] px-1 py-0.5 rounded-full transform translate-x-1/2 -translate-y-1/2">
                            OUT
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

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

            {/* Product Details */}
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
              {relatedProducts.length > 0 ? (
                relatedProducts.map((item) => (
                  <div
                    key={item._id}
                    className="p-3 text-center hover:transition cursor-pointer"
                    onClick={() => {
                      const slug = `${item.product_name
                        .replace(/\s+/g, "-")
                        .toLowerCase()}_${item._id}`;
                      navigate(`/product/${slug}`);
                    }}
                  >
                    <img
                      src={item.main_image || item.product_variants?.[0]?.image}
                      alt={item.product_name}
                      className="w-full h-60 object-cover rounded mb-3"
                    />
                    <p className="text-sm font-medium text-gray-800">
                      {item.product_name}
                    </p>
                    <p className="text-sm text-gray-600">
                      ₹{item.product_variants?.[0]?.price}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-600">
                  No complementary products available.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
