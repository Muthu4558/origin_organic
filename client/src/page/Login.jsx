// src/pages/Login.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { motion } from "framer-motion";
import { GoogleLogin } from "@react-oauth/google";
import { useCart } from "../context/CartContext";

import LeftImg from "../assets/Login.png";
import Logo from "../assets/logo.png";

const BRAND = "#57b957";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || null;

  const { fetchCart } = useCart();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(false);

  /* ---------------- LOGIN ---------------- */
  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_APP_BASE_URL}/api/auth/login`,
        { email, password },
        { withCredentials: true }
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("isAdmin", res.data.isAdmin ? "true" : "false");

      remember
        ? localStorage.setItem("rememberEmail", email)
        : localStorage.removeItem("rememberEmail");

      toast.success("Login successful");

      if (typeof fetchCart === "function") {
        await fetchCart();
      }

      if (from) {
        navigate(from, { replace: true });
      } else {
        navigate(res.data.isAdmin ? "/admin" : "/", { replace: true });
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Login failed. Check credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- GOOGLE LOGIN ---------------- */
  const handleGoogleLogin = async (credentialResponse) => {
    try {
      setLoading(true);

      await axios.post(
        `${import.meta.env.VITE_APP_BASE_URL}/api/auth/google`,
        { token: credentialResponse.credential },
        { withCredentials: true }
      );

      toast.success("Logged in with Google");

      if (typeof fetchCart === "function") {
        await fetchCart();
      }

      navigate(from || "/", { replace: true });
    } catch {
      toast.error("Google login failed");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- REMEMBER EMAIL ---------------- */
  useEffect(() => {
    const rem = localStorage.getItem("rememberEmail");
    if (rem) {
      setEmail(rem);
      setRemember(true);
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f0f6f0] via-white to-[#fffaf6] px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl bg-transparent max-h-[95vh] flex"
      >
        {/* LEFT PANEL */}
        <div className="hidden lg:flex lg:w-1/2 items-center justify-center bg-[linear-gradient(135deg,#eef8ef,#ffffff)] p-18 h-full">
          <div className="max-w-xs text-center">
            <div className="flex justify-center mb-10">
              <img width={200} src={Logo} alt="Origin Organic" />
            </div>

            <h2 className="text-2xl font-extrabold text-gray-900 mb-2">
              Welcome <span className="text-[#57b957]">back!</span>
            </h2>
            <p className="text-sm text-gray-600">
              Sign in to continue — fast checkout, order tracking and personalised recommendations.
            </p>

            <div className="mt-6 flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={() => toast.error("Google login failed")}
              />
            </div>
          </div>
        </div>

        {/* RIGHT FORM */}
        <div className="w-full lg:w-1/2 bg-white p-4 sm:p-8 overflow-auto h-full">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-4">
              <div className="inline-flex items-center justify-center mb-3 w-14 h-14 rounded-full bg-[#f2f7f2] mx-auto lg:hidden">
                <img src={Logo} alt="logo" className="w-20" />
              </div>

              <h1 className="text-2xl font-extrabold text-gray-900">
                Login in to <span className="text-[#57b957]">your account</span>
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Use your registered email to continue.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              {/* EMAIL */}
              <label className="block">
                <span className="text-xs font-medium text-gray-600">Email</span>
                <div className="mt-2 relative">
                  <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-3 py-3 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#dfeee0]"
                    placeholder="you@domain.com"
                  />
                </div>
              </label>

              {/* PASSWORD */}
              <label className="block">
                <span className="text-xs font-medium text-gray-600">Password</span>
                <div className="mt-2 relative">
                  <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    required
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-12 py-3 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#dfeee0]"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </label>

              {/* REMEMBER */}
              <div className="flex items-center justify-between text-sm text-gray-600">
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  Remember me
                </label>

                <button
                  type="button"
                  className="text-[#57b957] hover:underline"
                >
                  Forgot password?
                </button>
              </div>

              {/* SUBMIT */}
              <motion.button
                whileTap={{ scale: 0.97 }}
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-full text-white font-semibold shadow transition ${
                  loading ? "opacity-70 cursor-not-allowed" : "cursor-pointer"
                }`}
                style={{ background: BRAND }}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Signing in...
                  </div>
                ) : (
                  "Sign in"
                )}
              </motion.button>
            </form>

            {/* MOBILE GOOGLE */}
            <div className="mt-6 flex justify-center lg:hidden">
              <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={() => toast.error("Google login failed")}
              />
            </div>

            <p className="mt-6 text-center text-sm text-gray-500">
              Don’t have an account?{" "}
              <a href="/register" className="text-[#57b957] font-semibold hover:underline">
                Create one
              </a>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
