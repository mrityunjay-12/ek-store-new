import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { toast } from "react-hot-toast";

import CouponModal from "@/components/cartPage/CouponModal";
import CartOperations from "@/components/cartPage/CartOperations";
import CartSummary from "@/components/cartPage/CartSummary";
import { FinalCart, setCoupon } from "@/redux/slices/cartSlice";

export default function CartPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const appliedCoupon = useSelector((state) => state.cart.coupon);

  const [cartItems, setCartItems] = useState([]);
  const [showCouponModal, setShowCouponModal] = useState(false);

  useEffect(() => {
    if (!user || !user._id) {
      navigate("/login");
      return;
    }

    axios
      .get(`https://estylishkart.el.r.appspot.com/api/cart/user/${user._id}`)
      .then((res) => {
        const items =
          res.data?.data?.items?.map((item) => ({
            ...item,
            selected: true,
          })) || [];
        setCartItems(items);
        dispatch(FinalCart(items));
      })
      .catch((err) => console.error("Failed to load cart:", err));
  }, [user]);

  const updateQty = async (cartItemId, qty) => {
    try {
      await axios.put(
        `https://estylishkart.el.r.appspot.com/api/cart/item/update/${cartItemId}`,
        { quantity: Number(qty) }
      );
      setCartItems((prev) => {
        const updated = prev.map((item) =>
          item._id === cartItemId ? { ...item, quantity: Number(qty) } : item
        );
        dispatch(FinalCart(updated));
        return updated;
      });
    } catch (err) {
      console.error("Update quantity failed", err);
    }
  };

  const removeItem = async (cartItemId) => {
    try {
      await axios.delete(
        `https://estylishkart.el.r.appspot.com/api/cart/remove/${cartItemId}`
      );
      setCartItems((prev) => {
        const updated = prev.filter((item) => item._id !== cartItemId);
        dispatch(FinalCart(updated));
        return updated;
      });
    } catch (err) {
      console.error("Remove item failed", err);
    }
  };

  //   if (!user || !user._id) return navigate("/login");

  //   try {
  //     const res = await fetch(
  //       "https://estylishkart.el.r.appspot.com/api/wishlist",
  //       {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({
  //           user_id: user._id,
  //           product_id: user.product._id,
  //           variant_id: user.product.product_variant._id,
  //         }),
  //       }
  //     );
  //     const data = await res.json();
  //     if (!res.ok) throw new Error(data.message);
  //     toast.success("Added to Wishlist!");
  //   } catch {
  //     toast.error("Wishlist failed");
  //   }
  // };
  const moveToWishlist = async (item) => {
    if (!user || !user._id) return navigate("/login");

    try {
      const res = await fetch(
        "https://estylishkart.el.r.appspot.com/api/wishlist",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: user._id,
            product_id: item.product.product_id,
            variant_id: item.variant_id,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast.success("Added to Wishlist!");

      // Optionally remove from cart after moving to wishlist:
      removeItem(item._id);
    } catch (err) {
      toast.error("Failed to move to wishlist");
      console.error(err);
    }
  };

  const toggleSelect = (cartItemId) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item._id === cartItemId ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const handleCheckout = () => navigate("/checkout");
  const handleGoToWishlist = () => navigate("/wishlist");

  const selectedItems = cartItems.filter((item) => item.selected);
  const subtotal = selectedItems.reduce(
    (sum, item) =>
      sum + (item.product.product_variant?.price ?? 0) * item.quantity,
    0
  );
  const totalMrp = selectedItems.reduce((sum, item) => {
    const comparePrice =
      item.compare_price ?? item.product.product_variant?.compare_price ?? 0;
    return sum + comparePrice * item.quantity;
  }, 0);

  const discount = selectedItems.reduce((sum, item) => {
    const compare =
      item.compare_price ?? item.product.product_variant?.compare_price ?? 0;
    const price = item.price ?? item.product.product_variant?.price ?? 0;
    return sum + (compare - price) * item.quantity;
  }, 0);

  const couponDiscount = appliedCoupon ? appliedCoupon.discount_value : 0;

  const finalTotal = totalMrp - discount - couponDiscount;
  function EmptyCart({ onGoToWishlist }) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <img
          src="/cart-image.png" // or use a hosted image URL
          alt="Empty Cart"
          className="w-32 h-32 mb-6"
        />
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Hey, it feels so light!
        </h2>
        <p className="text-gray-500 mb-6">
          There is nothing in your bag. Let's add some items.
        </p>
        <button
          onClick={onGoToWishlist}
          className="px-6 py-2 border font-semibold rounded hover:bg-pink-50 transition border-[#723248] px-6 py-3 text-[#723248]"
        >
          ADD ITEMS FROM WISHLIST
        </button>
      </div>
    );
  }

  return (
    <>
      {cartItems.length === 0 ? (
        <EmptyCart onGoToWishlist={handleGoToWishlist} />
      ) : (
        <>
          <CouponModal
            isOpen={showCouponModal}
            onClose={() => setShowCouponModal(false)}
            onApply={(coupon) => dispatch(setCoupon(coupon))}
            cartTotal={subtotal}
          />

          <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* LEFT: Cart Items */}
            <CartOperations
              cartItems={cartItems}
              toggleSelect={toggleSelect}
              updateQty={updateQty}
              removeItem={removeItem}
              moveToWishlist={moveToWishlist}
              onGoToWishlist={handleGoToWishlist}
            />

            {/* RIGHT: Summary */}
            <CartSummary
              selectedItems={selectedItems}
              totalMrp={totalMrp}
              discount={discount}
              couponDiscount={couponDiscount}
              finalTotal={finalTotal}
              appliedCoupon={appliedCoupon}
              onCheckoutClick={handleCheckout}
              onCouponClick={() => setShowCouponModal(true)}
            />
          </div>
        </>
      )}
    </>
  );
}
