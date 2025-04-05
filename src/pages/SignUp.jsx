import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "../redux/slices/userSlice";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone_number: "",
    password: "",
    address: "",
    user_role: "Customer", // default
  });
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(
        "https://estylishkart.el.r.appspot.com/api/users/signup",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
          credentials: "include",
        }
      );
      const data = await res.json();

      if (data?.user) {
        dispatch(loginSuccess(data.user));
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/");
      } else {
        setError(data?.message || "Signup failed. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong!");
    }
  };

  useEffect(() => {
    if (user) navigate("/");
  }, [user]);

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Create Account</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Full Name"
          className="border w-full p-2 rounded"
          required
        />
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          className="border w-full p-2 rounded"
          required
        />
        <input
          type="number"
          name="phone_number"
          value={form.phone_number}
          onChange={handleChange}
          placeholder="Phone Number"
          className="border w-full p-2 rounded"
          required
        />
        <input
          type="text"
          name="address"
          value={form.address}
          onChange={handleChange}
          placeholder="Address"
          className="border w-full p-2 rounded"
          required
        />
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          className="border w-full p-2 rounded"
          required
        />
       

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          className="bg-[#5b2338] text-white px-4 py-2 rounded w-full"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}
