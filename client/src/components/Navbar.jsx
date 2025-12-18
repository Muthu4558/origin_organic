// src/components/Navbar.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { HiMenuAlt3, HiX, HiChevronDown } from "react-icons/hi";
import { FaCartPlus } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import Logo from "../assets/logo.png";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const lastScrollY = useRef(0);
  const [desktopDropdown, setDesktopDropdown] = useState(false);
  const [mobileDropdown, setMobileDropdown] = useState(false);
  const [isAuthed, setIsAuthed] = useState(Boolean(localStorage.getItem("token")));
  const location = useLocation();
  const navigate = useNavigate();

  // Close menus when route changes & update auth state
  useEffect(() => {
    setMenuOpen(false);
    setDesktopDropdown(false);
    setMobileDropdown(false);
    setIsAuthed(Boolean(localStorage.getItem("token")));
  }, [location]);

  // Sync auth state across tabs/windows
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "token" || e.key === "isAdmin") {
        setIsAuthed(Boolean(localStorage.getItem("token")));
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Hide/show navbar on scroll
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

  // Close desktop dropdown when clicking outside
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

  const handleLogout = async () => {
    try {
      // call backend logout if available
      await axios.post(
        `${import.meta.env.VITE_APP_BASE_URL}/api/auth/logout`,
        {},
        { withCredentials: true }
      );
    } catch (err) {
      // non-fatal; still clear client side
      // console.warn("Logout request failed", err);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("isAdmin");
      setIsAuthed(false);
      toast.success("Logged out successfully");
      navigate("/login", { replace: true });
    }
  };

  return (
    <nav
      className={`fixed left-0 right-0 top-4 z-50 transition-transform duration-300 px-4 ${
        showNavbar ? "translate-y-0" : "-translate-y-28"
      }`}
    >
      <div className="max-w-7xl mx-auto">
        <div className="backdrop-blur-sm bg-white/60 border border-[#57b957] rounded-2xl shadow-lg flex items-center justify-between gap-4 px-4 py-3">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img src={Logo} alt="musitechhub logo" width={110} className="select-none" />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-md font-semibold hover:text-[#57b957] transition">
              Home
            </Link>
            <Link to="/about" className="text-md font-semibold hover:text-[#57b957] transition">
              About
            </Link>

            {/* Desktop Products Dropdown */}
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setDesktopDropdown((s) => !s)}
                className="flex items-center gap-2 font-semibold px-3 py-2 rounded-md transition"
                aria-expanded={desktopDropdown}
                aria-haspopup="true"
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
                    transition={{ duration: 0.2 }}
                    className="absolute left-0 mt-2 w-44 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-30"
                    role="menu"
                  >
                    <li>
                      <Link to="/products/all-products" className="block px-4 py-2 hover:bg-green-200" role="menuitem">
                        All Products
                      </Link>
                    </li>
                    <li>
                      <Link to="/products/masala" className="block px-4 py-2 hover:bg-green-200" role="menuitem">
                        Masala Items
                      </Link>
                    </li>
                    <li>
                      <Link to="/products/milk" className="block px-4 py-2 hover:bg-green-200" role="menuitem">
                        Milk Products
                      </Link>
                    </li>
                    <li>
                      <Link to="/products/nuts" className="block px-4 py-2 hover:bg-green-200" role="menuitem">
                        Nuts
                      </Link>
                    </li>
                    <li>
                      <Link to="/products/oils" className="block px-4 py-2 hover:bg-green-200" role="menuitem">
                        Oils
                      </Link>
                    </li>
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>

            <Link to="/profile" className="text-md font-semibold hover:text-[#57b957] transition">
              Profile
            </Link>

            <Link to="/order" className="text-md font-semibold hover:text-[#57b957] transition">
              My Order
            </Link>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Cart */}
            <Link
              to="/cart"
              className="relative flex items-center gap-2 px-3 py-2 rounded-lg bg-[#57b957] text-white hover:bg-[#35c135] transition shadow"
            >
              <FaCartPlus size={16} />
              <span className="hidden sm:inline text-sm font-medium">Cart</span>
            </Link>

            {/* Desktop Login / Logout */}
            {isAuthed ? (
              <button
                onClick={handleLogout}
                className="hidden lg:inline-block px-4 py-2 rounded-md bg-white border border-gray-200 hover:shadow text-sm font-medium"
                aria-label="Logout"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="hidden lg:inline-block px-4 py-2 rounded-md bg-white border border-gray-200 hover:shadow text-sm font-medium"
              >
                Login
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMenuOpen((s) => !s)}
              className="md:hidden p-2 rounded-md bg-white/70 border border-gray-100 shadow-sm"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <HiX size={22} /> : <HiMenuAlt3 size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mt-3 md:hidden rounded-xl bg-white shadow-lg border border-gray-100 overflow-hidden"
            >
              <div className="px-4 py-3 space-y-3">
                <Link to="/" className="block font-medium" onClick={() => setMenuOpen(false)}>
                  Home
                </Link>
                <Link to="/about" className="block font-medium" onClick={() => setMenuOpen(false)}>
                  About
                </Link>

                {/* Mobile Products Accordion */}
                <div>
                  <button
                    onClick={() => setMobileDropdown((s) => !s)}
                    className="w-full flex items-center justify-between font-medium"
                    aria-expanded={mobileDropdown}
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
                        <li>
                          <Link to="/products/all-products" onClick={() => setMenuOpen(false)} className="block">
                            All Products
                          </Link>
                        </li>
                        <li>
                          <Link to="/products/masala" onClick={() => setMenuOpen(false)} className="block">
                            Masala Items
                          </Link>
                        </li>
                        <li>
                          <Link to="/products/milk" onClick={() => setMenuOpen(false)} className="block">
                            Milk Products
                          </Link>
                        </li>
                        <li>
                          <Link to="/products/nuts" onClick={() => setMenuOpen(false)} className="block">
                            Nuts
                          </Link>
                        </li>
                        <li>
                          <Link to="/products/oils" onClick={() => setMenuOpen(false)} className="block">
                            Oils
                          </Link>
                        </li>
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </div>

                <Link to="/profile" className="block font-medium" onClick={() => setMenuOpen(false)}>
                  Profile
                </Link>

                <Link to="/order" className="block font-medium" onClick={() => setMenuOpen(false)}>
                  My Order
                </Link>

                <div className="flex gap-3">
                  <Link
                    to="/cart"
                    className="flex-1 flex items-center justify-center gap-2 rounded-md bg-[#57b957] text-white px-3 py-2"
                    onClick={() => setMenuOpen(false)}
                  >
                    <FaCartPlus /> Cart
                  </Link>

                  {isAuthed ? (
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        handleLogout();
                      }}
                      className="flex-1 flex items-center justify-center gap-2 rounded-md border border-gray-200 px-3 py-2"
                    >
                      Logout
                    </button>
                  ) : (
                    <Link
                      to="/login"
                      className="flex-1 flex items-center justify-center gap-2 rounded-md border border-gray-200 px-3 py-2"
                      onClick={() => setMenuOpen(false)}
                    >
                      Login
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;