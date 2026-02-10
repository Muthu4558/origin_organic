import {
  FaFacebookF,
  FaInstagram,
  FaLinkedin,
  FaGlobe,
  FaPhoneAlt,
} from "react-icons/fa";
import { FiMail } from "react-icons/fi";
import Logo from "../assets/logo.png";
import { MdLocationPin } from "react-icons/md";

const Footer = () => {
  return (
    <footer className="bg-[#111111] text-white pt-12 pb-8 px-6">
      <div className="max-w-7xl mx-auto">
        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-10">

          {/* BRAND */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <img
              src={Logo}
              alt="Origin Organic"
              className="w-24 mb-4 object-contain rounded-xl"
            />
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              100% natural, chemical-free products from trusted farms. Eat pure. Live healthy. Choose{" "}
              <span className="text-[#57b957] font-semibold">Origin Organic</span>.
            </p>
          </div>

          {/* SHOP CATEGORIES */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h3 className="text-[#57b957] font-semibold text-lg mb-3">Shop</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="/products/diabetics-mix" className="hover:text-[#57b957] transition">Diabetics Mix</a></li>
              <li><a href="/products/oils" className="hover:text-[#57b957] transition">Oils</a></li>
              <li><a href="/products/masala" className="hover:text-[#57b957] transition">Masala & Spices</a></li>
              <li><a href="/products/nuts" className="hover:text-[#57b957] transition">Nuts & Dry Fruits</a></li>
              <li><a href="/products/milk" className="hover:text-[#57b957] transition">Milk Products</a></li>
              <li><a href="/products/all-products" className="hover:text-[#57b957] transition">All Products</a></li>
            </ul>
          </div>

          {/* CUSTOMER SUPPORT */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h3 className="text-[#57b957] font-semibold text-lg mb-3">Support</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="/profile" className="hover:text-[#57b957] transition">My Account</a></li>
              <li><a href="/cart" className="hover:text-[#57b957] transition">Cart</a></li>
              <li><a href="/order" className="hover:text-[#57b957] transition">Orders</a></li>
              <li><a href="/shipping" className="hover:text-[#57b957] transition">Shipping Policy</a></li>
              <li><a href="/privacy" className="hover:text-[#57b957] transition">Privacy Policy</a></li>
              <li><a href="/terms" className="hover:text-[#57b957] transition">Terms & Conditions</a></li>
            </ul>
          </div>

          {/* CONTACT */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h3 className="text-[#57b957] font-semibold text-lg mb-3">Contact</h3>

            <p className="flex items-start gap-2 text-gray-400 text-sm mb-2">
              <MdLocationPin className="text-[#57b957] mt-1" />
              <span>
                MAM Nagar, Siruganur, Trichy, <br /> 600 018
              </span>
            </p>

            <p className="flex items-center gap-2 text-gray-400 text-sm mb-2">
              <FaPhoneAlt className="text-[#57b957]" />
              <a href="tel:+917305092313" className="hover:text-[#57b957] transition">
                +91 73050 92313
              </a>
            </p>

            {/* <p className="flex items-center gap-2 text-gray-400 text-sm mb-2">
              <FaGlobe className="text-[#57b957]" />
              <a href="https://www.originorganic.in" target="_blank" className="hover:text-[#57b957] transition">
                originorganic.in
              </a>
            </p> */}

            <p className="flex items-center gap-2 text-gray-400 text-sm mb-4">
              <FiMail className="text-[#57b957]" />
              <a href="mailto:originorganic1@gmail.com" className="hover:text-[#57b957] transition">
                originorganic1@gmail.com
              </a>
            </p>

            {/* SOCIAL ICONS */}
            <div className="flex gap-3 justify-center md:justify-start">
              {[FaInstagram, FaFacebookF, FaLinkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="p-2 rounded-full border border-[#57b957] text-[#57b957] hover:bg-[#57b957] hover:text-white transition transform hover:scale-110"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="mt-10 border-t border-gray-800 pt-6 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} <span className="text-[#57b957] font-medium">Origin Organic</span>. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
