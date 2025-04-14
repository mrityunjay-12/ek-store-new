import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import CreateNewAddress from "../CreateNewAddress";

const AddressBook = () => {
  const user = useSelector((state) => state.user.user);
  const userId = user?._id;

  const [shippingAddresses, setShippingAddresses] = useState([]);
  const [billingAddresses, setBillingAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showDrawer, setShowDrawer] = useState(false);
  const [formType, setFormType] = useState("shipping");
  const [editData, setEditData] = useState(null);

  const fetchAddresses = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const [shippingRes, billingRes] = await Promise.all([
        axios.get(`https://estylishkart.el.r.appspot.com/api/shipping-address/${userId}`),
        axios.get(`https://estylishkart.el.r.appspot.com/api/billing-address/${userId}`),
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

  const handleDelete = async (id, type) => {
    const confirmed = window.confirm("Are you sure you want to delete this address?");
    if (!confirmed) return;
  
    const endpoint =
      type === "shipping"
        ? `https://estylishkart.el.r.appspot.com/api/shipping-address/${userId}/${id}`
        : `https://estylishkart.el.r.appspot.com/api/billing-address/${userId}/${id}`;
  
    try {
      console.log("Deleting:", endpoint);
      await axios.delete(endpoint);
      fetchAddresses(); // refresh after delete
    } catch (error) {
      console.error("Delete failed:", error.response?.data || error.message);
      alert("Delete failed — check console for more.");
    }
  };
  

  const renderAddressCard = (addr, type) => (
    <div key={addr._id} className="p-4 border rounded mb-2">
      <div className="flex justify-between items-start">
        <div>
          <p className="font-semibold text-lg">{addr.address_name}</p>
          <p>{addr.street}</p>
          <p>{addr.city}, {addr.state}</p>
          <p className="mt-1 text-sm">Mobile: {addr.phone_number}</p>
          {addr.alternative_phone_number && (
            <p className="text-sm text-gray-600">Alt: {addr.alternative_phone_number}</p>
          )}
        </div>
        <span className="px-2 py-1 bg-gray-100 text-xs rounded-full h-fit">
          {addr.address_type === "Other" ? addr.custom_address_type : addr.address_type}
        </span>
      </div>

      <div className="flex justify-between items-center border-t pt-3 mt-4 text-sm text-indigo-600 font-medium">
        <button
          onClick={() => {
            setFormType(type);
            setEditData(addr);
            setShowDrawer(true);
          }}
        >
          Edit
        </button>
        <button
          onClick={() => handleDelete(addr._id, type)}
          className="text-red-600"
        >
          Remove
        </button>
      </div>
    </div>
  );

  if (loading) return <p>Loading addresses...</p>;

  return (
    <div className="space-y-8 relative">
      {/* Shipping */}
      <div>
        <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-semibold text-[#723248] mb-4">Shipping Addresses</h2>
          <button
            className="border px-4 py-1.5 text-sm text-indigo-600 font-medium rounded hover:bg-indigo-50"
            onClick={() => {
              setFormType("shipping");
              setEditData(null);
              setShowDrawer(true);
            }}
          >
            + ADD NEW ADDRESS
          </button>
        </div>
        {shippingAddresses.length === 0
          ? <p>No shipping addresses found.</p>
          : shippingAddresses.map(addr => renderAddressCard(addr, "shipping"))}
      </div>

      {/* Billing */}
      <div>
        <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-semibold text-[#723248] mb-4">Billing Addresses</h2>

          <button
            className="border px-4 py-1.5 text-sm text-indigo-600 font-medium rounded hover:bg-indigo-50"
            onClick={() => {
              setFormType("billing");
              setEditData(null);
              setShowDrawer(true);
            }}
          >
            + ADD NEW ADDRESS
          </button>
        </div>
        {billingAddresses.length === 0
          ? <p>No billing addresses found.</p>
          : billingAddresses.map(addr => renderAddressCard(addr, "billing"))}
      </div>

      {/* Drawer */}
      {showDrawer && (
      <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
        <div className="bg-white w-full max-w-xl max-h-[90vh] p-6 rounded-lg shadow-lg overflow-y-auto relative">

            <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-[#723248] mb-4">
              {editData ? "Edit" : "Add New"} {formType} Address
            </h2>

              <button
                className="text-sm text-gray-500 hover:text-gray-700"
                onClick={() => {
                  setShowDrawer(false);
                  setEditData(null);
                }}
              >
                ✕
              </button>
            </div>
            <CreateNewAddress
              type={formType}
              userId={userId}
              editData={editData}
              onAddressAdded={() => {
                setShowDrawer(false);
                setEditData(null);
                fetchAddresses();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressBook;
