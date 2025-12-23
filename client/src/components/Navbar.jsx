import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { HiMenuAlt3, HiX, HiChevronDown } from "react-icons/hi";
import { FaCartPlus } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import Logo from "../assets/logo.png";
import { useCart } from "../context/CartContext";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const lastScrollY = useRef(0);
  const [desktopDropdown, setDesktopDropdown] = useState(false);
  const [mobileDropdown, setMobileDropdown] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { pathname } = location;

  const { cartItems } = useCart();
  const cartCount = cartItems?.length || 0;

  const isActive = (path) => pathname === path;
  const isProducts = pathname.startsWith("/products");

  const activeClass = "text-[#57b957] font-bold";
  const inactiveClass = "font-semibold hover:text-[#57b957] transition";

  useEffect(() => {
    setMenuOpen(false);
    setDesktopDropdown(false);
    setMobileDropdown(false);
  }, [location]);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY < 50) setShowNavbar(true);
      else if (currentY > lastScrollY.current) setShowNavbar(false);
      else setShowNavbar(true);
      lastScrollY.current = currentY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const dropdownRef = useRef(null);
  useEffect(() => {
    const onDocClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDesktopDropdown(false);
      }
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axios.get(
          `${import.meta.env.VITE_APP_BASE_URL}/api/auth/verify`,
          { withCredentials: true }
        );
        setIsAuthed(true);
      } catch {
        setIsAuthed(false);
      }
    };

    checkAuth();
  }, [location.pathname]);


  const handleLogout = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_APP_BASE_URL}/api/auth/logout`,
        {},
        { withCredentials: true }
      );
    } catch { }
    finally {
      setIsAuthed(false);
      toast.success("Logged out successfully");
      navigate("/login", { replace: true });
    }
  };

  return (
    <nav
      className={`fixed left-0 right-0 top-4 z-50 transition-transform duration-300 px-4 ${showNavbar ? "translate-y-0" : "-translate-y-28"
        }`}
    >
      <div className="max-w-7xl mx-auto">
        <div className="backdrop-blur-sm bg-white/60 border border-[#57b957] rounded-2xl shadow-lg flex items-center justify-between gap-4 px-4 py-3">

          {/* LOGO */}
          <Link to="/" className="flex items-center gap-3">
            <img src={Logo} alt="logo" width={110} />
          </Link>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className={isActive("/") ? activeClass : inactiveClass}>
              Home
            </Link>

            <Link to="/about" className={isActive("/about") ? activeClass : inactiveClass}>
              About
            </Link>

            {/* PRODUCTS DROPDOWN */}
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setDesktopDropdown((s) => !s)}
                className={`flex items-center gap-2 px-3 py-2 rounded-md ${isProducts ? activeClass : inactiveClass
                  }`}
              >
                Products
                <HiChevronDown className={`transition ${desktopDropdown ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {desktopDropdown && (
                  <motion.ul
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="absolute left-0 mt-2 w-44 bg-white rounded-xl shadow-lg border overflow-hidden z-30"
                  >
                    {[["All Products", "/products/all-products"],
                    ["Masala Items", "/products/masala"],
                    ["Milk Products", "/products/milk"],
                    ["Nuts", "/products/nuts"],
                    ["Oils", "/products/oils"],
                    ["Diabetics Mix", "/products/diabetics-mix"]].map(([label, path]) => (
                      <li key={path}>
                        <Link
                          to={path}
                          className={`block px-4 py-2 hover:bg-green-200 ${isActive(path) ? "bg-green-100 font-semibold" : ""
                            }`}
                        >
                          {label}
                        </Link>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>

            <Link to="/profile" className={isActive("/profile") ? activeClass : inactiveClass}>
              Profile
            </Link>

            <Link to="/order" className={isActive("/order") ? activeClass : inactiveClass}>
              My Order
            </Link>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-3">
            {/* CART BUTTON WITH BADGE */}
            <Link
              to="/cart"
              className="relative flex items-center gap-2 px-3 py-2 rounded-lg bg-[#57b957] text-white"
            >
              <FaCartPlus size={16} /> Cart
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-lg">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* DESKTOP LOGIN / LOGOUT */}
            {isAuthed ? (
              <button
                onClick={handleLogout}
                className="hidden lg:inline-block px-4 py-2 rounded-md bg-white border text-gray-800 hover:bg-gray-100 transition cursor-pointer"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="hidden lg:inline-block px-4 py-2 border rounded-md hover:bg-green-50 transition"
              >
                Login
              </Link>
            )}

            {/* MOBILE MENU TOGGLE */}
            <button
              onClick={() => setMenuOpen((s) => !s)}
              className="md:hidden p-2 rounded-md bg-white"
            >
              {menuOpen ? <HiX size={22} /> : <HiMenuAlt3 size={22} />}
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mt-3 md:hidden rounded-xl bg-white shadow-lg border border-gray-100 overflow-hidden"
            >
              <div className="px-4 py-3 space-y-3">
                <Link
                  to="/"
                  className={`block font-medium ${isActive("/") ? "text-[#57b957]" : ""}`}
                  onClick={() => setMenuOpen(false)}
                >
                  Home
                </Link>

                <Link
                  to="/about"
                  className={`block font-medium ${isActive("/about") ? "text-[#57b957]" : ""}`}
                  onClick={() => setMenuOpen(false)}
                >
                  About
                </Link>

                {/* MOBILE PRODUCTS DROPDOWN */}
                <div>
                  <button
                    onClick={() => setMobileDropdown((s) => !s)}
                    className={`w-full flex items-center justify-between font-medium ${isProducts ? "text-[#57b957]" : ""
                      }`}
                  >
                    Products
                    <HiChevronDown className={`${mobileDropdown ? "rotate-180" : ""} transition`} />
                  </button>

                  <AnimatePresence>
                    {mobileDropdown && (
                      <motion.ul
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="pl-4 mt-2 space-y-2"
                      >
                        {[["All Products", "/products/all-products"],
                        ["Masala Items", "/products/masala"],
                        ["Milk Products", "/products/milk"],
                        ["Nuts", "/products/nuts"],
                        ["Oils", "/products/oils"],
                        ["Diabetics Mix", "/products/diabetics-mix"]].map(([label, path]) => (
                          <li key={path}>
                            <Link
                              to={path}
                              className={isActive(path) ? "text-[#57b957] font-semibold" : ""}
                              onClick={() => setMenuOpen(false)}
                            >
                              {label}
                            </Link>
                          </li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </div>

                <Link
                  to="/profile"
                  className={`block font-medium ${isActive("/profile") ? "text-[#57b957]" : ""}`}
                  onClick={() => setMenuOpen(false)}
                >
                  Profile
                </Link>

                <Link
                  to="/order"
                  className={`block font-medium ${isActive("/order") ? "text-[#57b957]" : ""}`}
                  onClick={() => setMenuOpen(false)}
                >
                  My Order
                </Link>

                {/* MOBILE LOGIN / LOGOUT */}
                {isAuthed ? (
                  <button
                    onClick={handleLogout}
                    className="block w-full px-4 py-2 rounded-md bg-gray-100 text-gray-800 text-center"
                  >
                    Logout
                  </button>
                ) : (
                  <Link
                    to="/login"
                    className="block w-full px-4 py-2 rounded-md border text-center hover:bg-green-50"
                    onClick={() => setMenuOpen(false)}
                  >
                    Login
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;