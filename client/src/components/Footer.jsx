import {
  FaFacebookF,
  FaInstagram,
  FaLinkedin,
  FaGlobe,
  FaPhoneAlt,
} from "react-icons/fa";
import { FiMail } from "react-icons/fi";
import Logo from "../assets/logo.png";

const Footer = () => {
  return (
    <footer className="bg-[#111111] text-white pt-12 pb-8 px-6">
      <div className="max-w-7xl mx-auto">
        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">

          {/* BRAND */}
          <div className="flex flex-col items-center md:items-start">
            <img
              src={Logo}
              alt="Origin Organic"
              className="w-28 mb-4 object-contain bg-white rounded-2xl p-2"
            />
            <p className="text-gray-400 leading-relaxed max-w-xs text-center md:text-left">
              100% natural, chemical-free products sourced directly from trusted farms.
              Eat pure. Live healthy. Choose{" "}
              <span className="text-[#57b957] font-semibold">Origin Organic</span>.
            </p>
          </div>

          {/* SHOP CATEGORIES */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-lg font-semibold mb-3 text-[#57b957]">Shop</h3>
            <ul className="space-y-2 text-gray-400 text-center md:text-left">
              <li><a href="/products/diabetics-mix" className="hover:text-[#57b957] transition">Diabetics Mix</a></li>
              <li><a href="/products/oils" className="hover:text-[#57b957] transition">Oils</a></li>
              <li><a href="/products/masala" className="hover:text-[#57b957] transition">Masala & Spices</a></li>
              <li><a href="/products/nuts" className="hover:text-[#57b957] transition">Nuts & Dry Fruits</a></li>
              <li><a href="/products/milk" className="hover:text-[#57b957] transition">Milk Products</a></li>
              <li><a href="/products/all-products" className="hover:text-[#57b957] transition">All Products</a></li>
            </ul>
          </div>

          {/* CUSTOMER SUPPORT */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-lg font-semibold mb-3 text-[#57b957]">Customer Support</h3>
            <ul className="space-y-2 text-gray-400 text-center md:text-left">
              <li><a href="/profile" className="hover:text-[#57b957] transition">My Account</a></li>
              <li><a href="/cart" className="hover:text-[#57b957] transition">Cart</a></li>
              <li><a href="/order" className="hover:text-[#57b957] transition">Orders</a></li>
              <li><a href="/shipping" className="hover:text-[#57b957] transition">Shipping Policy</a></li>
              <li><a href="/privacy" className="hover:text-[#57b957] transition">Privacy Policy</a></li>
              <li><a href="/terms" className="hover:text-[#57b957] transition">Terms & Conditions</a></li>
            </ul>
          </div>

          {/* CONTACT */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-lg font-semibold mb-3 text-[#57b957]">
              Contact Us
            </h3>

            <p className="text-gray-400">
              <span>MAM Nagar,</span>
              <br />
              <span>Trichy - Chennai Trunk Road,</span>
              <br />
              <span>Siruganur, Trichy - 600 018,</span>
            </p>
            <p className="text-gray-400 mt-2 mb-2 flex items-center gap-2">
              <FaPhoneAlt className="text-[#57b957]" />
              <a
                href="tel:+917305092313"
                className="hover:text-[#57b957] transition"
                aria-label="Call Originorganic"
              >
                +91 73050 92313
              </a>
            </p>

            <p className="text-gray-400 mb-2 flex items-center gap-2">
              <FaGlobe className="text-[#57b957]" />
              <a
                href="https://www.originorganic.in"
                className="hover:text-[#57b957] transition"
                target="_blank"
              >
                www.originorganic.in
              </a>
            </p>

            <p className="text-gray-400 mb-4 flex items-center gap-2">
              <FiMail className="text-[#57b957]" />
              <a
                href="mailto:originorganic1@gmail.com"
                className="hover:text-[#57b957] transition"
              >
                originorganic1@gmail.com
              </a>
            </p>

            {/* SOCIAL ICONS */}
            <div className="flex gap-3">
              <a
                href="#"
                className="p-2 rounded-full border border-[#57b957] text-[#57b957] hover:bg-[#57b957] hover:text-white transition transform hover:scale-110"
              >
                <FaInstagram />
              </a>

              <a
                href="#"
                className="p-2 rounded-full border border-[#57b957] text-[#57b957] hover:bg-[#57b957] hover:text-white transition transform hover:scale-110"
              >
                <FaFacebookF />
              </a>

              <a
                href="#"
                className="p-2 rounded-full border border-[#57b957] text-[#57b957] hover:bg-[#57b957] hover:text-white transition transform hover:scale-110"
              >
                <FaLinkedin />
              </a>
            </div>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="mt-10 border-t border-gray-800 pt-6 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()}{" "}
          <span className="text-[#57b957] font-medium">Origin Organic</span>.
          All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
