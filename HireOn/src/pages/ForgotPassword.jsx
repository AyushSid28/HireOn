import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const VITE_API = import.meta.env.VITE_API_URL;

  const sendOtp = async () => {
    try {
      await axios.post(`${VITE_API}/api/auth/forgot-password/send-otp`, {
        phoneNumber,
      });
      alert("OTP sent to your phone");
      setStep(2);
    } catch (err) {
      console.error(err);
      alert("Failed to send OTP");
    }
  };

  const resetPassword = async () => {
    try {
      await axios.post(
        `${VITE_API}/api/auth/forgot-password/verify-and-reset`,
        {
          phoneNumber,
          otp,
          newPassword,
        }
      );
      alert("Password reset successfully!");
      window.location.href = "/login";
    } catch (err) {
      console.error(err);
      alert("Failed to reset password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#f0f4ff] to-[#e8efff] px-4">
      <div className="bg-white rounded-xl shadow-lg p-10 w-full max-w-md">
        <h1
          className="text-3xl font-bold text-center text-blue-600 mb-1"
          style={{ fontFamily: "cursive" }}
        >
          HireON
        </h1>

        <h2 className="text-xl font-semibold text-center mb-2">
          Forgot Password
        </h2>

        <p className="text-center text-sm text-gray-500 mb-6">
          {step === 1
            ? "Enter your phone number to receive OTP."
            : "Enter OTP and set your new password."}
        </p>

        {step === 1 ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendOtp();
            }}
            className="space-y-5"
          >
            <div>
              <label className="block font-medium mb-1 text-gray-700">
                Phone Number
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
                placeholder="Enter your registered phone"
                className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-md transition duration-150"
            >
              Send OTP
            </button>
          </form>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              resetPassword();
            }}
            className="space-y-5"
          >
            <div>
              <label className="block font-medium mb-1 text-gray-700">
                OTP Code
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter the OTP"
                required
                className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              />
            </div>

            <div>
              <label className="block font-medium mb-1 text-gray-700">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                placeholder="Enter new password"
                className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-md transition duration-150"
            >
              Reset Password
            </button>
          </form>
        )}

        <div className="text-center text-sm mt-6 text-gray-600">
          Remembered your password?{" "}
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
