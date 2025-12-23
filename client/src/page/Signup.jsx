import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaGoogle,
  FaApple,
  FaFacebookF,
  FaPhoneAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import LeftImg from "../assets/Login.png";
import Logo from "../assets/logo.png";
import { GoogleLogin } from "@react-oauth/google";

const BRAND = "#57b957";

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    number: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_APP_BASE_URL}/api/auth/register`, form, {
        withCredentials: true,
      });
      toast.success("Verification email sent. Please verify before login.");
      setTimeout(() => navigate("/login"), 900);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f6f0] via-white to-[#fffaf6] px-4 py-12 flex items-center justify-center overflow-auto">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.36 }}
        className="w-full max-w-5xl mx-auto rounded-3xl overflow-hidden shadow-2xl bg-transparent flex flex-col lg:flex-row min-h-[600px]"
      >
        {/* Left Side (Illustration + Info) */}
        <div className="hidden lg:flex lg:w-1/2 items-center justify-center bg-[linear-gradient(135deg,#eef8ef,#ffffff)] p-4">
          <div className="max-w-xs text-center">
            <img src={Logo} alt="illustration" className="w-64 mx-auto mb-6" />
            <h2 className="text-2xl font-extrabold text-gray-900 mb-2">
              Join <span className="text-[#57b957]">Origin Organic</span>
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Create an account to save favorites, track orders, and enjoy exclusive offers!
            </p>

            <div className="flex justify-center gap-3">
              <button
                // onClick={() => toast.info("Social signup not configured")}
                // className="inline-flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-gray-100 bg-white hover:shadow transition"
              >
                <GoogleLogin
                  onSuccess={async (credentialResponse) => {
                    try {
                      const res = await axios.post(
                        `${import.meta.env.VITE_APP_BASE_URL}/api/auth/google`,
                        { token: credentialResponse.credential },
                        { withCredentials: true }
                      );

                      toast.success("Google signup successful!");
                      navigate("/");
                    } catch (err) {
                      toast.error("Google signup failed");
                    }
                  }}
                  onError={() => toast.error("Google login failed")}
                />
                {/* Continue with Google */}
              </button>
              {/* <button
                onClick={() => toast.info("Social signup not configured")}
                className="inline-flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-gray-100 bg-white hover:shadow transition"
              >
                <FaFacebookF className="text-blue-600" /> Continue with Facebook
              </button>
              <button
                onClick={() => toast.info("Social signup not configured")}
                className="inline-flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-gray-100 bg-black text-white hover:shadow transition"
              >
                <FaApple /> Continue with Apple
              </button> */}
            </div>
          </div>
        </div>

        {/* Right Side (Signup Form) */}
        <div className="w-full lg:w-1/2 bg-white flex flex-col justify-center p-8 sm:p-10 overflow-auto">
          <div className="inline-flex items-center justify-center mb-3 w-14 h-14 rounded-full bg-[#f2f7f2] mx-auto lg:hidden">
            <img src={Logo} alt="logo" className="w-20" />
          </div>
          <div className="max-w-md mx-auto w-full">

            <div className="text-center mb-6">
              <h1 className="text-2xl font-extrabold text-gray-900">
                Create your <span style={{ color: BRAND }}>account</span>
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Sign up to start shopping and enjoy member perks.
              </p>
            </div>

            <form onSubmit={handleSignup} className="space-y-5">
              {/* Name */}
              <label className="block">
                <span className="text-xs font-medium text-gray-600">Full name</span>
                <div className="mt-2 relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <FaUser />
                  </span>
                  <input
                    required
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    type="text"
                    placeholder="Your full name"
                    className="w-full pl-11 pr-3 py-3 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#dfeee0] transition"
                  />
                </div>
              </label>

              {/* Phone */}
              <label className="block">
                <span className="text-xs font-medium text-gray-600">Phone number</span>
                <div className="mt-2 relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <FaPhoneAlt />
                  </span>
                  <input
                    required
                    name="number"
                    value={form.number}
                    onChange={handleChange}
                    type="tel"
                    placeholder="10 digit mobile number"
                    className="w-full pl-11 pr-3 py-3 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#dfeee0] transition"
                  />
                </div>
              </label>

              {/* Email */}
              <label className="block">
                <span className="text-xs font-medium text-gray-600">Email</span>
                <div className="mt-2 relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <FaEnvelope />
                  </span>
                  <input
                    required
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    type="email"
                    placeholder="you@domain.com"
                    className="w-full pl-11 pr-3 py-3 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#dfeee0] transition"
                  />
                </div>
              </label>

              {/* Password */}
              <label className="block">
                <span className="text-xs font-medium text-gray-600">Password</span>
                <div className="mt-2 relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <FaLock />
                  </span>
                  <input
                    required
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    className="w-full pl-11 pr-12 py-3 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#dfeee0] transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </label>

              <div className="text-sm text-gray-600 rounded-md p-3 bg-[#f7fbf7] border border-[#eaf5ea]">
                Tip: Use 8+ characters with a mix of letters and numbers.
              </div>

              {/* Submit */}
              <motion.button
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-full text-white font-semibold shadow cursor-pointer"
                style={{ background: BRAND }}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-3">
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      ></path>
                    </svg>
                    Creating...
                  </div>
                ) : (
                  "Create Account"
                )}
              </motion.button>

              <div className="mt-4 flex items-center gap-3">
                <div className="flex-1 h-[1px] bg-gray-100" />
                <div className="text-xs text-gray-400">or</div>
                <div className="flex-1 h-[1px] bg-gray-100" />
              </div>

              <div className="mt-4 flex justify-center lg:hidden">
                <button
                // onClick={() => toast.info("Social sign-in not configured")}
                // className="flex items-center justify-center gap-2 py-2 rounded-lg border border-gray-100 hover:shadow transition"
                >
                  <GoogleLogin
                    onSuccess={async (credentialResponse) => {
                      try {
                        const res = await axios.post(
                          `${import.meta.env.VITE_APP_BASE_URL}/api/auth/google`,
                          { token: credentialResponse.credential },
                          { withCredentials: true }
                        );

                        toast.success("Google signup successful!");
                        navigate("/");
                      } catch (err) {
                        toast.error("Google signup failed");
                      }
                    }}
                    onError={() => toast.error("Google login failed")}
                  />
                </button>
              </div>

              <p className="mt-6 text-center text-sm text-gray-500">
                Already have an account?{" "}
                <a href="/login" className="text-[#57b957] font-semibold hover:underline">
                  Login
                </a>
              </p>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;