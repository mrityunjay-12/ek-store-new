import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";

const CouponList = () => {
  const user = useSelector((state) => state.user.user);
  const userId = user?._id;

  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCoupons = async () => {
    if (!userId) return;

    setLoading(true);
    try {
      const res = await fetch("https://estylishkart.el.r.appspot.com/api/coupons/all");
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to fetch");

      const rawCoupons = data?.data || [];

      const validCoupons = rawCoupons.filter((coupon) => {
        const meetsAmount = true; // No cartTotal here, assume valid for display
        const isActive = coupon.discount_coupon_status === "Active";
        const isEligible =
          coupon.eligibility === "All Customers" ||
          coupon.specific_customers?.includes(userId);

        return isActive && meetsAmount && isEligible;
      });

      setCoupons(validCoupons);
    } catch (err) {
      console.error("Failed to load coupons:", err);
      toast.error("Could not load coupons");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, [userId]);

  if (loading) return <p>Loading coupons...</p>;

  return (
    <div className="space-y-8 relative">
    <h2 className="text-xl font-semibold text-[#723248] mb-4">Coupons</h2>
    <div className="space-y-4">
      {coupons.length === 0 ? (
        <p className="text-gray-600">No available coupons.</p>
      ) : (
        coupons.map((coupon) => (
          <div key={coupon._id} className="p-4 border rounded shadow-sm">
            <h3 className="text-lg font-semibold text-[#723248]">{coupon.code}</h3>
            <p className="text-sm text-gray-600">{coupon.description}</p>
            <p className="text-sm font-medium mt-1">
              Discount:{" "}
              {coupon.discount_type === "Percentage"
                ? `${coupon.discount_value}%`
                : `₹${coupon.discount_value}`}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Min. Purchase: ₹{coupon.minimum_purchase_amount}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Valid Till: {new Date(coupon.expiry_date).toLocaleDateString()}
            </p>
          </div>
        ))
      )}
    </div>
    </div>
  );
};

export default CouponList;
