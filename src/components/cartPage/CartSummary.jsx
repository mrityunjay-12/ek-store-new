import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function CartSummary({
  selectedItems,
  totalMrp,
  discount,
  couponDiscount,
  finalTotal,
  appliedCoupon,
  onCheckoutClick,
  onCouponClick,
}) {
  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        {/* COUPONS */}
        <div className="space-y-1">
          <h4 className="text-sm font-bold">COUPONS</h4>
          <div
            className="flex justify-between items-center cursor-pointer"
            onClick={onCouponClick}
          >
            <div className="flex items-center gap-2 text-sm font-medium text-[#723248]">
              <span className="w-4 h-4">🏷️</span>
              Apply Coupons
            </div>
            <button className="text-sm font-semibold text-[#723248] border border-[#723248] px-4 py-1 rounded">
              APPLY
            </button>
          </div>
        </div>

        <hr />

        {/* PRICE DETAILS */}
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
                ? `-₹${couponDiscount} (${
                    appliedCoupon.title || appliedCoupon.code
                  })`
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

        {/* TOTAL */}
        <div className="flex justify-between font-semibold text-base">
          <span>Total Amount</span>
          <span>₹{finalTotal}</span>
        </div>

        <Button
          className="w-full bg-[#723248] hover:bg-[#5a1e38] text-white mt-2"
          onClick={onCheckoutClick}
        >
          PLACE ORDER
        </Button>
      </CardContent>
    </Card>
  );
}
