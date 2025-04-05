// src/pages/Login.jsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "../redux/slices/userSlice";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const [form, setForm] = useState({ login: "", password: "" });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(
      "https://estylishkart.el.r.appspot.com/api/users/login",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      }
    );
    const data = await res.json();
    if (data?.user) {
      dispatch(loginSuccess(data.user));
      navigate("/");
    }
  };

  useEffect(() => {
    if (user) navigate("/");
  }, [user]);

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Sign In</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          name="login"
          value={form.login}
          onChange={handleChange}
          placeholder="Email or Phone"
          className="border w-full p-2 rounded"
        />
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          className="border w-full p-2 rounded"
        />
        <button
          type="submit"
          className="bg-[#5b2338] text-white px-4 py-2 rounded w-full"
        >
          Login
        </button>
      </form>
    </div>
  );
}
