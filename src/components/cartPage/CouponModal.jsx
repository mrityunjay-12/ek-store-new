import { Dialog } from "@headlessui/react";
import { X } from "lucide-react";
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function CouponModal({ isOpen, onClose, onApply, cartTotal }) {
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [codeInput, setCodeInput] = useState("");

  const availableCoupons = [
    {
      code: "ZEROPAY350",
      discountAmount: 350,
      description: "40% off on minimum purchase of Rs. 700",
      minAmount: 700,
      expiry: "17th December 2025 | 11:59 PM",
    },
    {
      code: "SUPER200",
      discountAmount: 200,
      description: "Flat ₹200 off on orders above ₹500",
      minAmount: 500,
      expiry: "31st December 2025 | 11:59 PM",
    },
  ];

  useEffect(() => {
    if (isOpen) {
      const best = availableCoupons
        .filter((c) => cartTotal >= c.minAmount)
        .sort((a, b) => b.discountAmount - a.discountAmount)[0];
      setSelectedCoupon(best || null);
    }
  }, [isOpen, cartTotal]);

  const applySelected = () => {
    if (selectedCoupon === "none") {
      onApply(null);
      onClose();
      return;
    }

    if (selectedCoupon && cartTotal >= selectedCoupon.minAmount) {
      onApply(selectedCoupon);
      onClose();
    } else {
      alert("Coupon is not valid for your current cart total.");
    }
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
            {/* Manual code input (optional) */}
            <div className="flex gap-2">
              <input
                placeholder="Enter coupon code"
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value)}
                className="border w-full px-3 py-2 rounded text-sm"
              />
              <button className="text-[#723248] font-semibold text-sm">
                CHECK
              </button>
            </div>

            {/* No Coupon Option */}
            <div
              className={`border rounded p-3 mt-2 cursor-pointer ${
                selectedCoupon === "none"
                  ? "border-[#723248] bg-[#fef6f8]"
                  : "border-gray-300 "
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

            {/* Available Coupons */}
            {availableCoupons.map((coupon) => (
              <div
                key={coupon.code}
                className={`border rounded p-3 mt-3 relative cursor-pointer ${
                  selectedCoupon?.code === coupon.code
                    ? "border-[#723248] bg-[#fef6f8]"
                    : "border-gray-300"
                }`}
                onClick={() => setSelectedCoupon(coupon)}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="coupon"
                    checked={selectedCoupon?.code === coupon.code}
                    readOnly
                  />
                  <span className="text-sm font-semibold border border-dashed px-2 py-1 rounded text-[#723248]">
                    {coupon.code}
                  </span>
                </div>
                <p className="text-sm mt-2 font-medium">
                  Save ₹{coupon.discountAmount}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  {coupon.description}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Expires on: {coupon.expiry}
                </p>
              </div>
            ))}

            {/* Footer */}
            <div className="flex justify-between items-center pt-4 border-t">
              <p className="text-sm">
                Maximum savings:{" "}
                <strong>
                  ₹
                  {selectedCoupon === "none"
                    ? 0
                    : selectedCoupon?.discountAmount || 0}
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
