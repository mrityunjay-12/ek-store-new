import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tag } from "lucide-react";
import CouponModal from "@/components/cartPage/CouponModal";

export default function CartPage() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const [cartItems, setCartItems] = useState([]);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);

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
      })
      .catch((err) => console.error("Failed to load cart:", err));
  }, [user]);

  const updateQty = async (cartItemId, qty) => {
    try {
      await axios.put(
        `https://estylishkart.el.r.appspot.com/api/cart/item/update/${cartItemId}`,
        { quantity: Number(qty) }
      );
      setCartItems((prev) =>
        prev.map((item) =>
          item._id === cartItemId ? { ...item, quantity: Number(qty) } : item
        )
      );
    } catch (err) {
      console.error("Update quantity failed", err);
    }
  };

  const removeItem = async (cartItemId) => {
    try {
      await axios.delete(
        `https://estylishkart.el.r.appspot.com/api/cart/remove/${cartItemId}`
      );
      setCartItems((prev) => prev.filter((item) => item._id !== cartItemId));
    } catch (err) {
      console.error("Remove item failed", err);
    }
  };

  const toggleSelect = (cartItemId) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item._id === cartItemId ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const selectedItems = cartItems.filter((item) => item.selected);
  const subtotal = selectedItems.reduce(
    (sum, item) =>
      sum + (item.product.product_variant?.price ?? 0) * item.quantity,
    0
  );

  const totalMrp = selectedItems.reduce(
    (sum, item) =>
      sum + (item.product.product_variant?.compare_price ?? 0) * item.quantity,
    0
  );

  const discount = totalMrp - subtotal;
  const couponDiscount = appliedCoupon?.discountAmount || 0;
  const finalTotal = subtotal - couponDiscount;

  const handleCheckout = () => {
    navigate("/checkout");
  };

  return (
    <>
      <CouponModal
        isOpen={showCouponModal}
        onClose={() => setShowCouponModal(false)}
        onApply={(coupon) => setAppliedCoupon(coupon)}
        cartTotal={subtotal}
      />

      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* LEFT: Items */}
        <div className="md:col-span-2">
          <h2 className="text-lg font-bold mb-4 text-[#723248]">
            {selectedItems.length}/{cartItems.length} ITEMS SELECTED
          </h2>

          {cartItems.map((item) => (
            <Card key={item._id} className="mb-4">
              <CardContent className="p-4 flex gap-4">
                <input
                  type="checkbox"
                  checked={item.selected}
                  onChange={() => toggleSelect(item._id)}
                  className="mt-8"
                />
                <img
                  src={item.product.product_variant.image || "/placeholder.jpg"}
                  alt={item.product.product_name}
                  className="w-24 h-28 object-cover rounded"
                />
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-600">
                    {item.product.product_type || "Type"}
                  </p>
                  <h3 className="text-sm font-semibold">
                    {item.product.product_name}
                  </h3>
                  {/* <p className="text-xs text-gray-500 mb-2">
                    Product ID: {item.product.product_id}
                  </p> */}

                  <div className="flex gap-4 mb-2">
                    <div>
                      <label className="text-xs font-medium text-gray-600">
                        Qty:
                      </label>
                      <select
                        className="border text-xs rounded px-2 py-1 ml-2"
                        value={item.quantity}
                        onChange={(e) => updateQty(item._id, e.target.value)}
                      >
                        {[1, 2, 3, 4, 5].map((qty) => (
                          <option key={qty} value={qty}>
                            {qty}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-semibold">
                      ₹{item.product.product_variant.price}
                    </span>
                    <span className="text-gray-500 line-through text-xs">
                      ₹{item.product.product_variant.compare_price}
                    </span>
                    <span className="text-green-600 text-xs font-medium">
                      {Math.round(
                        ((item.product.product_variant.compare_price -
                          item.product.product_variant.price) /
                          item.product.product_variant.compare_price) *
                          100
                      )}
                      % OFF
                    </span>
                  </div>

                  <p className="text-xs text-gray-500 mt-1">
                    14 days return available
                  </p>

                  <div className="text-xs text-[#723248] mt-2 flex gap-4">
                    <button onClick={() => removeItem(item._id)}>REMOVE</button>
                    <button>MOVE TO WISHLIST</button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          <div className="text-sm text-[#723248] underline cursor-pointer mt-2">
            Add More From Wishlist
          </div>
        </div>

        {/* RIGHT: Summary */}
        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="space-y-1">
              <h4 className="text-sm font-bold">COUPONS</h4>
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => setShowCouponModal(true)}
              >
                <div className="flex items-center gap-2 text-sm font-medium text-[#723248]">
                  <Tag className="w-4 h-4" />
                  Apply Coupons
                </div>
                <button className="text-sm font-semibold text-[#723248] border border-[#723248] px-4 py-1 rounded">
                  APPLY
                </button>
              </div>
            </div>

            <hr />

            <h4 className="text-sm font-bold">
              PRICE DETAILS ({selectedItems.length} Item
              {selectedItems.length > 1 ? "s" : ""})
            </h4>
            <div className="text-sm space-y-2">
              <div className="flex justify-between">
                <span>Total MRP</span>
                <span>₹{totalMrp}</span>
              </div>
              <div className="flex justify-between text-green-600 font-medium">
                <span>Discount on MRP</span>
                <span>-₹{discount}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Coupon Discount</span>
                <span className="text-[#723248] font-semibold">
                  {appliedCoupon
                    ? `-₹${couponDiscount} (${appliedCoupon.code})`
                    : "Apply Coupon"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Platform Fee</span>
                <span className="text-green-600">FREE</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping Fee</span>
                <span className="text-green-600">FREE</span>
              </div>
            </div>

            <hr />

            <div className="flex justify-between font-semibold text-base">
              <span>Total Amount</span>
              <span>₹{finalTotal}</span>
            </div>

            <Button
              className="w-full bg-[#723248] hover:bg-[#5a1e38] text-white mt-2"
              onClick={handleCheckout}
            >
              PLACE ORDER
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
