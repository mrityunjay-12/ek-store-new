import React, { useState } from "react";
import axios from "axios";

const CreateNewAddress = ({ type, userId, onAddressAdded }) => {
  const [form, setForm] = useState({
    address_type: "Home",
    custom_address_type: "",
    address_name: "",
    street: "",
    city: "",
    state: "",
    phone_number: "",
    alternative_phone_number: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const endpoint =
      type === "shipping"
        ? "https://estylishkart.el.r.appspot.com/api/shipping-address"
        : "https://estylishkart.el.r.appspot.com/api/billing-address";

    // Prepare payload based on address_type
    const payload = {
      user_id: userId,
      address_type: form.address_type,
      address_name: form.address_name,
      street: form.street,
      city: form.city,
      state: form.state,
      phone_number: form.phone_number,
      alternative_phone_number: form.alternative_phone_number,
    };

    if (form.address_type === "Other") {
      payload.custom_address_type = form.custom_address_type;
    }

    try {
      await axios.post(endpoint, payload);
      onAddressAdded(); // refresh
      // Reset form
      setForm({
        address_type: "Home",
        custom_address_type: "",
        address_name: "",
        street: "",
        city: "",
        state: "",
        phone_number: "",
        alternative_phone_number: "",
      });
    } catch (error) {
      console.error("Failed to add address:", error);
      alert("Failed to add address. Please check console.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3 border rounded p-4 bg-gray-50 mb-6"
    >
      <h4 className="text-md font-semibold text-[#723248] mb-2">
        Add New {type} Address
      </h4>

      <select
        name="address_type"
        value={form.address_type}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      >
        <option value="Home">Home</option>
        <option value="Office">Office</option>
        <option value="Other">Other</option>
      </select>

      {form.address_type === "Other" && (
        <input
          name="custom_address_type"
          value={form.custom_address_type}
          onChange={handleChange}
          placeholder="Custom Address Type (e.g., Warehouse)"
          className="w-full border p-2 rounded"
          required
        />
      )}

      <input
        name="address_name"
        value={form.address_name}
        onChange={handleChange}
        placeholder="Address Name"
        className="w-full border p-2 rounded"
        required
      />
      <input
        name="street"
        value={form.street}
        onChange={handleChange}
        placeholder="Street"
        className="w-full border p-2 rounded"
        required
      />
      <input
        name="city"
        value={form.city}
        onChange={handleChange}
        placeholder="City"
        className="w-full border p-2 rounded"
        required
      />
      <input
        name="state"
        value={form.state}
        onChange={handleChange}
        placeholder="State"
        className="w-full border p-2 rounded"
        required
      />
      <input
        name="phone_number"
        value={form.phone_number}
        onChange={handleChange}
        placeholder="Phone Number"
        className="w-full border p-2 rounded"
        required
      />
      <input
        name="alternative_phone_number"
        value={form.alternative_phone_number}
        onChange={handleChange}
        placeholder="Alternative Phone Number"
        className="w-full border p-2 rounded"
      />

      <button
        type="submit"
        className="bg-[#723248] text-white px-4 py-2 rounded"
      >
        Add {type} Address
      </button>
    </form>
  );
};

export default CreateNewAddress;
