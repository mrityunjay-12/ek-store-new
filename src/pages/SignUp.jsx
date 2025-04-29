import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "../redux/slices/userSlice";
import { useNavigate } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaLock,
} from "react-icons/fa";

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
    user_role: "Customer",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch(
        "https://estylishkart.el.r.appspot.com/api/users/signup",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();

      if (data?.user) {
        setSuccess(data.message || "Account created successfully!");
        dispatch(loginSuccess(data.user));
        localStorage.setItem("user", JSON.stringify(data.user));
        setTimeout(() => navigate("/"), 1000);
      } else {
        setError(data?.message || "Signup failed. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) navigate("/");
  }, [user]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-[#5b2338]">
          Create Account
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            icon={<FaUser />}
            name="name"
            value={form.name}
            placeholder="Full Name"
            handleChange={handleChange}
            required
          />
          <InputField
            icon={<FaEnvelope />}
            name="email"
            value={form.email}
            type="email"
            placeholder="Email"
            handleChange={handleChange}
            required
          />
          <InputField
            icon={<FaPhone />}
            name="phone_number"
            value={form.phone_number}
            type="number"
            placeholder="Phone Number"
            handleChange={handleChange}
            required
          />
          <InputField
            icon={<FaMapMarkerAlt />}
            name="address"
            value={form.address}
            placeholder="Address"
            handleChange={handleChange}
            required
          />
          <InputField
            icon={<FaLock />}
            name="password"
            value={form.password}
            type="password"
            placeholder="Password"
            handleChange={handleChange}
            required
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-600 text-sm">{success}</p>}

          <button
            type="submit"
            className="w-full bg-[#5b2338] text-white py-2 rounded hover:bg-[#411a2a] transition disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-[#5b2338] font-medium hover:underline"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}

// Reusable Input Field Component
const InputField = ({
  icon,
  name,
  value,
  placeholder,
  handleChange,
  type = "text",
  required = false,
}) => (
  <div className="relative">
    <div className="absolute left-3 top-3 text-gray-500">{icon}</div>
    <input
      type={type}
      name={name}
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      className="w-full pl-10 pr-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#5b2338]"
      required={required}
    />
  </div>
);
