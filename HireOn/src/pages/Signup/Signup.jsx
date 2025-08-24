import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; // 👈 import Link

export default function Signup() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    dateOfBirth: "",
  });

  const VITE_API = import.meta.env.VITE_API_URL;

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${VITE_API}/api/auth/register`, form);
      alert("Signup successful");
    } catch (err) {
      console.error(err);
      alert("Signup failed");
    }
  };

  return (
    <div className="min-h-screen py-10 flex items-center justify-center bg-gradient-to-b from-[#f0f4ff] to-[#e8efff] px-4">
      <div className="bg-white rounded-xl shadow-lg p-10 w-full max-w-4xl">
        <div className="text-center mb-10">
          <h1
            className="text-3xl font-bold text-blue-600"
            style={{ fontFamily: "cursive" }}
          >
            HireON
          </h1>
          <h2 className="text-2xl font-bold mt-2">Create Your Profile</h2>
          <p className="text-gray-500 mt-1">
            Complete your profile to enable AI-powered job applications
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <h3 className="text-lg font-semibold mb-4">Basic Information</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Full Name *
              </label>
              <input
                type="text"
                name="fullName"
                placeholder="Enter your full name"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                value={form.fullName}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Phone Number *
              </label>
              <input
                type="tel"
                name="phoneNumber"
                placeholder="Enter your phone number"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                value={form.phoneNumber}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                value={form.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Password *
              </label>
              <input
                type="password"
                name="password"
                required
                placeholder="Create password"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                value={form.password}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Confirm Password *
              </label>
              <input
                type="password"
                name="confirmPassword"
                required
                placeholder="Confirm password"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                value={form.confirmPassword}
                onChange={handleChange}
              />
            </div>
          </div>

          <button
            type="submit"
            className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition w-[180px]"
          >
            Register
          </button>
        </form>

        {/* SIGN IN + BACK TO HOMEPAGE LINKS */}
        <div className="text-center text-sm mt-6 text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Sign in here
          </Link>
        </div>

        <div className="text-center text-sm mt-2">
          <Link to="/" className="text-blue-600 hover:underline">
            ← Back to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
