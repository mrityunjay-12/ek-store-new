import { Dialog } from "@headlessui/react";
import { X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import toast from "react-hot-toast";
import { setCoupon } from "@/redux/slices/cartSlice";

export default function CouponModal({ isOpen, onClose, onApply, cartTotal }) {
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [codeInput, setCodeInput] = useState("");
  const [filteredCoupons, setFilteredCoupons] = useState([]);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const mapCouponType = (type) => {
    switch (type) {
      case "Product Discount":
        return "ProductDiscount";
      case "Order Discount":
        return "OrderDiscount";
      case "Shipping Discount":
        return "ShippingDiscount";
      case "BuyXgetY":
        return "BuyXgetY";
      default:
        return type;
    }
  };

  useEffect(() => {
    if (user && isOpen) {
      const fetchCoupons = async () => {
        try {
          const res = await fetch("https://estylishkart.el.r.appspot.com/api/coupons/all");
          const data = await res.json();

          if (!res.ok) throw new Error(data.message || "Failed to fetch");

          const rawCoupons = data?.data || [];
          const validCoupons = rawCoupons.filter((coupon) => {
            const meetsAmount = cartTotal >= coupon.minimum_purchase_amount;
            const isActive = coupon.discount_coupon_status === "Active";
            const isEligible =
              coupon.eligibility === "All Customers" ||
              coupon.specific_customers?.includes(user._id);
            return isActive && meetsAmount && isEligible;
          });

          setAvailableCoupons(validCoupons);
          setFilteredCoupons(validCoupons);

          const best = validCoupons
            .filter((c) => cartTotal >= c.minimum_purchase_amount)
            .sort((a, b) => b.discount_value - a.discount_value)[0];

          setSelectedCoupon(best || null);
        } catch (err) {
          console.error("Failed to load coupons:", err);
          toast.error("Could not load coupons");
        }
      };

      fetchCoupons();
    }
  }, [user, isOpen, cartTotal]);

  const applySelected = async () => {
    if (selectedCoupon === "none") {
      onApply(null);
      onClose();
      return;
    }

    if (!selectedCoupon || cartTotal < selectedCoupon.minimum_purchase_amount) {
      alert("Coupon is not valid for your current cart total.");
      return;
    }

    try {
      const res = await fetch("https://estylishkart.el.r.appspot.com/api/apply-coupon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user?._id,
          coupon_type: mapCouponType(selectedCoupon.discount_category),
          coupon_id: selectedCoupon._id,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Could not apply coupon.");
        return;
      }

      toast.success("Coupon applied successfully!");
      dispatch(setCoupon(selectedCoupon));
      onApply(selectedCoupon);
      onClose();
    } catch (err) {
      console.error("Failed to apply coupon:", err);
      alert("Could not apply coupon.");
    }
  };

  const handleSearch = () => {
    const input = codeInput.trim().toLowerCase();
    const matches = availableCoupons.filter((c) =>
      c.title.toLowerCase().includes(input)
    );

    if (!input) {
      setFilteredCoupons(availableCoupons);
      return;
    }

    if (matches.length === 0) {
      toast.error("No matching coupon found.");
    }

    setFilteredCoupons(matches);
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Card className="max-w-md w-full rounded shadow-lg bg-white">
          <CardHeader className="flex flex-row items-center justify-between px-6 pt-6 pb-2">
            <CardTitle className="text-lg">APPLY COUPON</CardTitle>
            <button onClick={onClose}>
              <X className="w-5 h-5" />
            </button>
          </CardHeader>

          <CardContent className="space-y-4 px-6 pb-6">
            {/* Manual coupon code input */}
            <div className="flex gap-2">
              <input
                placeholder="Search or enter coupon code"
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value)}
                className="border w-full px-3 py-2 rounded text-sm"
              />
              <button
                className="text-[#723248] font-semibold text-sm"
                onClick={handleSearch}
              >
                SEARCH
              </button>
            </div>

            {/* "No Coupon" Option */}
            <div
              className={`border rounded p-3 mt-2 cursor-pointer ${
                selectedCoupon === "none"
                  ? "border-[#723248] bg-[#fef6f8]"
                  : "border-gray-300"
              }`}
              onClick={() => setSelectedCoupon("none")}
            >
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  name="coupon"
                  checked={selectedCoupon === "none"}
                  readOnly
                />
                <span className="text-sm font-semibold text-gray-700">
                  Don’t apply any coupon
                </span>
              </div>
            </div>

            {/* Scrollable Coupons Section */}
            <div className="max-h-60 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              {filteredCoupons.map((coupon) => (
                <div
                  key={coupon._id}
                  className={`border rounded p-3 mt-3 relative cursor-pointer ${
                    selectedCoupon?._id === coupon._id
                      ? "border-[#723248] bg-[#fef6f8]"
                      : "border-gray-300"
                  }`}
                  onClick={() => setSelectedCoupon(coupon)}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="coupon"
                      checked={selectedCoupon?._id === coupon._id}
                      readOnly
                    />
                    <span className="text-sm font-semibold border border-dashed px-2 py-1 rounded text-[#723248]">
                      {coupon.title}
                    </span>
                  </div>
                  <p className="text-sm mt-2 font-medium">
                    Save ₹{coupon.discount_value}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    Minimum Order: ₹{coupon.minimum_purchase_amount}
                  </p>
                  <p className="text-xs text-gray-500">
                    {coupon.discount_category} | {coupon.method}
                  </p>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center pt-4 border-t">
              <p className="text-sm">
                Maximum savings:{" "}
                <strong>
                  ₹
                  {selectedCoupon === "none"
                    ? 0
                    : selectedCoupon?.discount_value || 0}
                </strong>
              </p>
              <button
                className="bg-[#723248] text-white text-sm px-6 py-2 rounded"
                onClick={applySelected}
              >
                APPLY
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Dialog>
  );
}
