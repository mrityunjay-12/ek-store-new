import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import CreateNewAddress from "./CreateNewAddress"; // import

const AddressBook = () => {
  const user = useSelector((state) => state.user.user);
  const userId = user?._id;

  const [shippingAddresses, setShippingAddresses] = useState([]);
  const [billingAddresses, setBillingAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAddresses = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const [shippingRes, billingRes] = await Promise.all([
        axios.get(
          `https://estylishkart.el.r.appspot.com/api/shipping-address/${userId}`
        ),
        axios.get(
          `https://estylishkart.el.r.appspot.com/api/billing-address/${userId}`
        ),
      ]);
      setShippingAddresses(shippingRes.data?.data || []);
      setBillingAddresses(billingRes.data?.data || []);
    } catch (error) {
      console.error("Error fetching addresses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, [userId]);

  if (loading) return <p>Loading addresses...</p>;

  return (
    <div className="space-y-8">
      <div>
        <CreateNewAddress
          type="shipping"
          userId={userId}
          onAddressAdded={fetchAddresses}
        />
        <h3 className="text-lg font-semibold text-[#723248] mb-2">
          Shipping Addresses
        </h3>
        {shippingAddresses.length === 0 ? (
          <p>No shipping addresses found.</p>
        ) : (
          shippingAddresses.map((addr) => (
            <div key={addr._id} className="p-4 border rounded mb-2">
              <p>
                <strong>Name:</strong> {addr.full_name}
              </p>
              <p>
                <strong>Address:</strong> {addr.address_line}, {addr.city},{" "}
                {addr.state} - {addr.zip}
              </p>
              <p>
                <strong>Phone:</strong> {addr.phone_number}
              </p>
            </div>
          ))
        )}
      </div>

      <div>
        <CreateNewAddress
          type="billing"
          userId={userId}
          onAddressAdded={fetchAddresses}
        />
        <h3 className="text-lg font-semibold text-[#723248] mb-2">
          Billing Addresses
        </h3>
        {billingAddresses.length === 0 ? (
          <p>No billing addresses found.</p>
        ) : (
          billingAddresses.map((addr) => (
            <div key={addr._id} className="p-4 border rounded mb-2">
              <p>
                <strong>Name:</strong> {addr.full_name}
              </p>
              <p>
                <strong>Address:</strong> {addr.address_line}, {addr.city},{" "}
                {addr.state} - {addr.zip}
              </p>
              <p>
                <strong>Phone:</strong> {addr.phone_number}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AddressBook;
