import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import CheckoutNav from "@/components/cartPage/CheckoutNav";

export default function CheckoutPage() {
  const cartItems = [
    {
      id: "1",
      name: "Floral Kurti",
      price: 999,
      originalPrice: 1899,
      quantity: 1,
      image: "/product1.png",
    },
    {
      id: "2",
      name: "Green Top",
      price: 799,
      originalPrice: 1499,
      quantity: 2,
      image: "/product2.png",
    },
  ];

  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    pincode: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("cod");

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const totalMrp = cartItems.reduce(
    (sum, item) => sum + item.originalPrice * item.quantity,
    0
  );

  const discount = totalMrp - subtotal;

  const handlePay = () => {
    const orderData = {
      address,
      paymentMethod,
      cartItems,
      total: subtotal,
    };
    console.log("Placing Order:", orderData);
    alert("Order placed!");
  };

  return (
    <>
      {/* <CheckoutNav/> */}

      <div className="max-w-6xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold mb-6 text-[#723248]">Checkout</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column */}
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
                <Input
                  placeholder="Phone Number"
                  value={address.phone}
                  onChange={(e) =>
                    setAddress({ ...address, phone: e.target.value })
                  }
                />
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
                <Input
                  placeholder="City"
                  value={address.city}
                  onChange={(e) =>
                    setAddress({ ...address, city: e.target.value })
                  }
                />
                <Input
                  placeholder="Pincode"
                  value={address.pincode}
                  onChange={(e) =>
                    setAddress({ ...address, pincode: e.target.value })
                  }
                />
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

          {/* Right Column – Summary */}
          <Card>
  <CardContent className="p-4 space-y-4">
    <h4 className="text-sm font-bold text-[#723248]">
      ORDER SUMMARY ({cartItems.length} Item{cartItems.length > 1 ? "s" : ""})
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
        <span className="text-[#723248] cursor-pointer font-medium">
          Apply Coupon
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
      <span>₹{subtotal}</span>
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
    </>
  );
}
