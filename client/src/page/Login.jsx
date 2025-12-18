// src/pages/Login.jsx
import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaGoogle, FaApple, FaFacebookF } from "react-icons/fa";
import { motion } from "framer-motion";
import LeftImg from "../assets/Login.png";
import Logo from "../assets/logo.png";
import { useCart } from "../context/CartContext"; // <- added

const BRAND = "#57b957";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || null; // preserve original destination

  const { fetchCart } = useCart(); // <- get fetchCart from context

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_APP_BASE_URL}/api/auth/login`,
        { email, password },
        { withCredentials: true }
      );

      // Save token and admin flag for PrivateRoute checks
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("isAdmin", res.data.isAdmin ? "true" : "false");

      if (remember) localStorage.setItem("rememberEmail", email);
      else localStorage.removeItem("rememberEmail");

      toast.success("Login successful");

      // IMPORTANT: refresh cart data immediately so protected pages (like /cart) show up-to-date items
      try {
        // fetchCart is async; wait for it so UI shows fresh data before navigation
        if (typeof fetchCart === "function") {
          await fetchCart();
        }
      } catch (err) {
        // non-fatal: if fetchCart fails, we'll still navigate — user can refresh or retry
        // console.warn("fetchCart after login failed", err);
      }

      // Navigate to the original intended page if present, otherwise fallback
      if (from) {
        navigate(from, { replace: true });
      } else {
        if (res.data.isAdmin) navigate("/admin", { replace: true });
        else navigate("/profile", { replace: true });
      }
    } catch (error) {
      const msg = error?.response?.data?.message || "Login failed. Check credentials.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    const rem = localStorage.getItem("rememberEmail");
    if (rem) {
      setEmail(rem);
      setRemember(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f0f6f0] via-white to-[#fffaf6] px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl bg-transparent max-h-[90vh] flex"
        aria-live="polite"
      >
        <div className="hidden lg:flex lg:w-1/2 items-center justify-center bg-[linear-gradient(135deg,#eef8ef,#ffffff)] p-6 h-full">
          <div className="max-w-xs text-center overflow-auto">
            <div className="flex justify-center mb-10">
              <img width={200} src={LeftImg} alt="img" />
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Welcome <span className="text-[#57b957]">back!</span></h2>
            <p className="text-sm text-gray-600">
              Sign in to continue — fast checkout, order tracking and personalised recommendations.
            </p>

            <div className="mt-6 flex flex-col gap-3">
              <button
                onClick={() => toast.info("Social sign-in not configured")}
                className="inline-flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-gray-100 bg-white hover:shadow transition"
              >
                <FaGoogle className="text-red-500" /> Sign in with Google
              </button>
              <button
                onClick={() => toast.info("Social sign-in not configured")}
                className="inline-flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-gray-100 bg-white hover:shadow transition"
              >
                <FaFacebookF className="text-blue-600" /> Sign in with Facebook
              </button>
              <button
                onClick={() => toast.info("Social sign-in not configured")}
                className="inline-flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-gray-100 bg-black text-white hover:shadow transition"
              >
                <FaApple /> Sign in with Apple
              </button>
            </div>
          </div>
        </div>

        {/* form side */}
        <div className="w-full lg:w-1/2 bg-white p-6 sm:p-8 overflow-auto h-full">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-4">
              <div className="inline-flex items-center justify-center mb-3 w-14 h-14 rounded-full bg-[#f2f7f2] mx-auto">
                <img src={Logo} alt="logo" className="w-20" />
              </div>
              <h1 className="text-2xl font-extrabold text-gray-900">Login in to <span className="text-[#57b957]">your account</span></h1>
              <p className="text-sm text-gray-500 mt-1">Use your registered email to continue.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <label className="block">
                <span className="text-xs font-medium text-gray-600">Email</span>
                <div className="mt-2 relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <FaEnvelope />
                  </span>
                  <input
                    required
                    autoFocus
                    aria-label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-3 py-3 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#dfeee0] transition"
                    placeholder="you@domain.com"
                  />
                </div>
              </label>

              <label className="block">
                <span className="text-xs font-medium text-gray-600">Password</span>
                <div className="mt-2 relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <FaLock />
                  </span>
                  <input
                    required
                    aria-label="Password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-12 py-3 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#dfeee0] transition"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </label>

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
                  onClick={() => toast.info("Forgot password flow not implemented")}
                  className="text-sm text-[#57b957] hover:underline"
                >
                  Forgot password?
                </button>
              </div>

              <motion.button
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-full text-white font-semibold shadow cursor-pointer"
                style={{ background: BRAND }}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-3">
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                    </svg>
                    Signing in...
                  </div>
                ) : (
                  "Sign in"
                )}
              </motion.button>
            </form>

            <div className="mt-4 flex items-center gap-3">
              <div className="flex-1 h-[1px] bg-gray-100" />
              <div className="text-xs text-gray-400">or</div>
              <div className="flex-1 h-[1px] bg-gray-100" />
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3">
              <button
                onClick={() => toast.info("Social sign-in not configured")}
                className="flex items-center justify-center gap-2 py-2 rounded-lg border border-gray-100 hover:shadow transition"
              >
                <FaGoogle className="text-red-500" /> <span className="text-xs">Google</span>
              </button>
              <button
                onClick={() => toast.info("Social sign-in not configured")}
                className="flex items-center justify-center gap-2 py-2 rounded-lg border border-gray-100 hover:shadow transition"
              >
                <FaFacebookF className="text-blue-600" /> <span className="text-xs">Facebook</span>
              </button>
              <button
                onClick={() => toast.info("Social sign-in not configured")}
                className="flex items-center justify-center gap-2 py-2 rounded-lg border border-gray-100 hover:shadow transition bg-black text-white"
              >
                <FaApple /> <span className="text-xs">Apple</span>
              </button>
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
