import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios"; // ✅ correct
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { clearCart } from "@/redux/slices/cartSlice";
import { toast, Toaster } from "react-hot-toast"; // for notifications

export default function CheckoutPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [shippingAddressId, setShippingAddressId] = useState(null);
  const [billingAddressId, setBillingAddressId] = useState(null);

  const { user } = useSelector((state) => state.user);
  const allItems = useSelector((state) => state.cart.items || []);
  const appliedCoupon = useSelector((state) => state.cart.coupon);

  const cartItems = allItems.filter((item) => item.selected);
  const couponDiscount = appliedCoupon?.discountAmount || 0;

  useEffect(() => {
    if (!user || !user._id) return;

    const fetchAddresses = async () => {
      try {
        const [shippingRes, billingRes] = await Promise.all([
          axios.get(
            `https://estylishkart.el.r.appspot.com/api/shipping-address/${user._id}`
          ),
          axios.get(
            `https://estylishkart.el.r.appspot.com/api/billing-address/${user._id}`
          ),
        ]);

        const shipping = shippingRes.data?.data?.[0];
        const billing = billingRes.data?.data?.[0];

        if (shipping) {
          setShippingAddressId(shipping._id);
          setAddress({
            fullName: shipping.full_name || "",
            phone: shipping.phone_number || "",
            street: shipping.street || "",
            city: shipping.city || "",
            pincode: shipping.zip || "",
          });
        }

        if (billing) {
          setBillingAddressId(billing._id);
          setBillingAddress({
            fullName: billing.full_name || "",
            phone: billing.phone_number || "",
            street: billing.street || "",
            city: billing.city || "",
            pincode: billing.zip || "",
          });
        }
      } catch (err) {
        console.error("Failed to fetch addresses", err);
      }
    };

    fetchAddresses();
  }, [user]);

  const handlePay = async () => {
    if (!validateFields()) {
      alert("Please fill all required fields.");
      return;
    }

    try {
      let finalShippingId = shippingAddressId;
      if (!finalShippingId) {
        const res = await axios.post(
          "https://estylishkart.el.r.appspot.com/api/shipping-address",
          {
            user_id: user._id,
            address_type: "Home",
            address_name: address.fullName,
            street: address.street,
            city: address.city,
            state: "",
            phone_number: address.phone,
            alternative_phone_number: "",
          }
        );
        finalShippingId = res.data?.data?._id;
      }

      let finalBillingId = billingAddressId;
      if (!sameAsShipping && !finalBillingId) {
        const res = await axios.post(
          "https://estylishkart.el.r.appspot.com/api/billing-address",
          {
            user_id: user._id,
            address_type: "Home",
            address_name: billingAddress.fullName || "Billing Address",
            street: billingAddress.street,
            city: billingAddress.city,
            state: "DefaultState",
            phone_number: billingAddress.phone,
            alternative_phone_number: billingAddress.phone,
          }
        );
        finalBillingId = res.data?.data?._id;
      }

      // ✅ POST to /checkout (this will return full HTML page)
      const orderRes = await axios.post(
        "https://estylishkart.el.r.appspot.com/api/orders/checkout",
        {
          user_id: user._id,
          shipping_address_id: finalShippingId,
          billing_address_id: sameAsShipping ? finalShippingId : finalBillingId,
          payment_method: paymentMethod === "cod" ? "COD" : "Online Payment",
        },
        { responseType: "text" } // ✅ this is important!
      );

      if (paymentMethod === "online") {
        // ✅ Open form HTML returned by backend in a new tab
        const newWindow = window.open("", "_blank");
        newWindow.location.href = response.data.payment_url;
        newWindow.document.open();
        newWindow.document.write(orderRes.data); // full HTML with auto-submitting form

        newWindow.document.close();
      } else {
        // COD Flow
        dispatch(clearCart());
        toast.success("Order placed with COD.");
        navigate("/order-confirmation");
      }
    } catch (err) {
      console.error("Checkout failed", err);
      toast.error("Something went wrong during checkout.");
    }
  };

  useEffect(() => {
    if (!user || !user._id) {
      navigate("/login");
    }
  }, [user, navigate]);

  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    pincode: "",
  });

  const [billingAddress, setBillingAddress] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    pincode: "",
  });

  const [sameAsShipping, setSameAsShipping] = useState(false);
  const [errors, setErrors] = useState({});
  const [paymentMethod, setPaymentMethod] = useState("cod");

  useEffect(() => {
    if (sameAsShipping) {
      setBillingAddress({ ...address });
    }
  }, [sameAsShipping, address]);

  const validateFields = () => {
    const requiredFields = [
      { field: "fullName", label: "Full Name" },
      { field: "phone", label: "Phone" },
      { field: "street", label: "Street Address" },
      { field: "city", label: "City" },
      { field: "pincode", label: "Pincode" },
    ];

    const newErrors = {};
    requiredFields.forEach(({ field, label }) => {
      if (!address[field]) newErrors[field] = `Shipping: ${label} is required.`;
      if (!billingAddress[field])
        newErrors[`billing_${field}`] = `Billing: ${label} is required.`;
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const subtotal = cartItems.reduce(
    (sum, item) =>
      sum +
      (item.product?.product_variant?.price ?? item.price ?? 0) * item.quantity,
    0
  );

  const totalMrp = cartItems.reduce(
    (sum, item) =>
      sum +
      (item.product?.product_variant?.compare_price ??
        item.originalPrice ??
        0) *
        item.quantity,
    0
  );

  const discount = totalMrp - subtotal;
  const finalTotal = subtotal - couponDiscount;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold mb-6 text-[#723248]">Checkout</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-4 space-y-4">
              <h3 className="text-lg font-semibold">Contact Details</h3>
              <Input
                placeholder="Full Name"
                value={address.fullName}
                onChange={(e) =>
                  setAddress({ ...address, fullName: e.target.value })
                }
              />
              {errors.fullName && (
                <p className="text-red-500 text-xs">{errors.fullName}</p>
              )}
              <Input
                placeholder="Phone Number"
                value={address.phone}
                onChange={(e) =>
                  setAddress({ ...address, phone: e.target.value })
                }
              />
              {errors.phone && (
                <p className="text-red-500 text-xs">{errors.phone}</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 space-y-4">
              <h3 className="text-lg font-semibold">Shipping Address</h3>
              <Input
                placeholder="Street Address"
                value={address.street}
                onChange={(e) =>
                  setAddress({ ...address, street: e.target.value })
                }
              />
              {errors.street && (
                <p className="text-red-500 text-xs">{errors.street}</p>
              )}
              <Input
                placeholder="City"
                value={address.city}
                onChange={(e) =>
                  setAddress({ ...address, city: e.target.value })
                }
              />
              {errors.city && (
                <p className="text-red-500 text-xs">{errors.city}</p>
              )}
              <Input
                placeholder="Pincode"
                value={address.pincode}
                onChange={(e) =>
                  setAddress({ ...address, pincode: e.target.value })
                }
              />
              {errors.pincode && (
                <p className="text-red-500 text-xs">{errors.pincode}</p>
              )}
            </CardContent>
          </Card>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="sameAsShipping"
              checked={sameAsShipping}
              onChange={(e) => setSameAsShipping(e.target.checked)}
              className="w-4 h-4"
            />
            <label htmlFor="sameAsShipping" className="text-sm">
              Billing address same as shipping
            </label>
          </div>

          <Card>
            <CardContent className="p-4 space-y-4">
              <h3 className="text-lg font-semibold">Billing Address</h3>
              <Input
                placeholder="Full Name"
                value={billingAddress.fullName}
                onChange={(e) =>
                  setBillingAddress({
                    ...billingAddress,
                    fullName: e.target.value,
                  })
                }
              />
              {errors["billing_fullName"] && (
                <p className="text-red-500 text-xs">
                  {errors["billing_fullName"]}
                </p>
              )}
              <Input
                placeholder="Phone Number"
                value={billingAddress.phone}
                onChange={(e) =>
                  setBillingAddress({
                    ...billingAddress,
                    phone: e.target.value,
                  })
                }
              />
              {errors["billing_phone"] && (
                <p className="text-red-500 text-xs">
                  {errors["billing_phone"]}
                </p>
              )}
              <Input
                placeholder="Street Address"
                value={billingAddress.street}
                onChange={(e) =>
                  setBillingAddress({
                    ...billingAddress,
                    street: e.target.value,
                  })
                }
              />
              {errors["billing_street"] && (
                <p className="text-red-500 text-xs">
                  {errors["billing_street"]}
                </p>
              )}
              <Input
                placeholder="City"
                value={billingAddress.city}
                onChange={(e) =>
                  setBillingAddress({ ...billingAddress, city: e.target.value })
                }
              />
              {errors["billing_city"] && (
                <p className="text-red-500 text-xs">{errors["billing_city"]}</p>
              )}
              <Input
                placeholder="Pincode"
                value={billingAddress.pincode}
                onChange={(e) =>
                  setBillingAddress({
                    ...billingAddress,
                    pincode: e.target.value,
                  })
                }
              />
              {errors["billing_pincode"] && (
                <p className="text-red-500 text-xs">
                  {errors["billing_pincode"]}
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 space-y-4">
              <h3 className="text-lg font-semibold">Payment Method</h3>
              <RadioGroup
                defaultValue={paymentMethod}
                onValueChange={setPaymentMethod}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cod" id="cod" />
                  <Label htmlFor="cod">Cash on Delivery</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="online" id="online" />
                  <Label htmlFor="online">Online Payment</Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
        </div>

        {/* Summary */}
        <Card>
          <CardContent className="p-4 space-y-4">
            <h4 className="text-sm font-bold text-[#723248]">
              ORDER SUMMARY ({cartItems.length} Item
              {cartItems.length > 1 ? "s" : ""})
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
              className="w-full mt-4 bg-[#723248] hover:bg-[#5a1e38] text-white"
              onClick={handlePay}
            >
              Pay
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
