// src/components/About.jsx
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { motion } from "framer-motion";
import {
  FiShoppingCart,
  FiHeart,
  FiShield,
  FiPackage,
  FiClock,
  FiFeather,
  FiTrendingUp,
  FiCheckCircle,
  FiClock as FiClockAlt,
} from "react-icons/fi";
import {
  FaCartPlus,
  FaHeart,
  FaLeaf,
  FaShieldAlt,
  FaSeedling,
  FaWeight,
  FaRegSmile,
  FaBrain,
} from "react-icons/fa";
import { useLoading } from "../context/LoadingContext";
import Hero from "../assets/about.jpg"

export default function About() {
  const location = useLocation();
  const { loading, startLoading, stopLoading } = useLoading();

  useEffect(() => {
    startLoading();
    window.scrollTo({ top: 0, behavior: "smooth" });
    stopLoading();
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col text-gray-900">
      <Navbar />

      {/* HERO */}
      <header className="relative overflow-hidden mt-14">
        <div className="absolute inset-0 bg-[url('/assets/hero-organic.jpg')] bg-cover bg-center opacity-40 -z-10"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left (text) */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="order-2 lg:order-1"
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight">
                Rediscover food the{" "}
                <span className="text-[#57b957]">Origin</span> way
              </h1>

              <p className="mt-4 sm:mt-6 text-base sm:text-lg text-gray-700 max-w-xl">
                Origin Organic delivers 100% pure, nutrient-dense foods — no
                additives, no preservatives, just authentic taste and honest
                nutrition inspired by ancestral eating and modern quality
                standards.
              </p>

              <div className="mt-6 sm:mt-8 flex flex-wrap gap-3">
                <a
                  href="/products/all-products"
                  className="inline-flex items-center gap-3 px-5 py-2.5 sm:px-6 sm:py-3 rounded-full bg-[#57b957] text-white font-medium shadow hover:scale-[1.02] transform transition"
                >
                  <FiShoppingCart /> Shop now
                </a>

                <a
                  href="#mission"
                  className="inline-flex items-center gap-3 px-5 py-2.5 sm:px-6 sm:py-3 rounded-full border border-gray-200 bg-white shadow-sm hover:shadow-md transition"
                >
                  Learn more
                </a>
              </div>

              <div className="mt-6 grid grid-cols-2 sm:grid-cols-2 gap-3 max-w-sm">
                <Stat icon={<FaLeaf />} value="100%" label="Organic" />
                <Stat icon={<FaShieldAlt />} value="ISO" label="Quality" />
                <Stat icon={<FaHeart />} value="Wellness" label="Wellbeing" />
                <Stat icon={<FaCartPlus />} value="100+" label="Products" />
              </div>
            </motion.div>

            {/* Right (visual card) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.99 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="order-1 lg:order-2 flex justify-center lg:justify-end"
            >
              <div className="w-full max-w-md bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-xl border border-[#57b957]">
                <div className="rounded-xl overflow-hidden">
                  <img
                    src={Hero}
                    alt="origin organic collage"
                    className="w-full h-44 sm:h-56 object-cover"
                    draggable={false}
                  />
                </div>

                <div className="mt-3 sm:mt-4">
                  <h4 className="font-semibold text-sm sm:text-base">Handpicked. Honest. Fresh.</h4>
                  <p className="mt-2 text-xs sm:text-sm text-gray-700">
                    We source produce from trusted growers and pack them with care
                    to keep nutrients and natural flavours intact.
                  </p>

                  <div className="mt-3 flex gap-3 text-xs sm:text-sm">
                    <a href="/products/all-products" className="font-medium text-[#57b957]">Browse products →</a>
                    <a href="/contact" className="text-gray-500">Get in touch</a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 space-y-10 sm:space-y-12">
          {/* Mission & Vision */}
          <section id="mission" className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              className="bg-white rounded-2xl p-5 sm:p-8 shadow-md border border-[#57b957] flex gap-4 sm:gap-6 items-start"
              initial={{ y: 8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.45 }}
            >
              <div className="p-2 sm:p-3 rounded-lg bg-gradient-to-br from-[#ecfdf5] to-white text-[#57b957] inline-flex items-center border">
                <FiFeather size={20} />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-semibold">Our Mission</h3>
                <p className="mt-3 text-sm sm:text-base text-gray-700 leading-relaxed">
                  To replenish the world with healthful products — rich in flavour, nourishing by nature and guaranteed organic.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <SmallPill icon={<FiCheckCircle />} text="Third-party tested" />
                  <SmallPill icon={<FiClockAlt />} text="Freshly packed weekly" />
                </div>
              </div>
            </motion.div>

            <motion.div
              className="bg-gradient-to-tr from-white to-green-50 rounded-2xl p-5 sm:p-8 shadow-md border border-[#57b957] flex gap-4 sm:gap-6 items-start"
              initial={{ y: 8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.55 }}
            >
              <div className="p-2 sm:p-3 rounded-lg bg-gradient-to-br from-[#fff7ed] to-white text-[#57b957] inline-flex items-center border">
                <FaSeedling size={18} />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-semibold">Our Vision</h3>
                <p className="mt-3 text-sm sm:text-base text-gray-700 leading-relaxed">
                  To be the global provider of organic, nutritious food — helping generations eat better, live healthier and stay vibrant.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <SmallPill icon={<FiTrendingUp />} text="Scale responsibly" />
                  <SmallPill icon={<FiPackage />} text="Sustainable packaging" />
                </div>
              </div>
            </motion.div>
          </section>

          {/* Problem & Solution */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            <div>
              <h3 className="text-xl sm:text-2xl font-semibold">Why it <span className="text-[#57b957]">matters</span></h3>
              <p className="mt-3 text-sm sm:text-base text-gray-700 leading-relaxed max-w-2xl">
                Modern processed diets are linked to chronic diseases — excessive sugar, trans-fats and preservatives are common culprits.
              </p>

              <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FeatureRow icon={<FaSeedling />} text="Helps balance blood sugar and energy" />
                <FeatureRow icon={<FaWeight />} text="Supports weight management" />
                <FeatureRow icon={<FaRegSmile />} text="Improves skin, sleep and immunity" />
                <FeatureRow icon={<FaBrain />} text="Reduces inflammation and mental fog" />
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-md border border-[#57b957]">
              <h4 className="font-semibold flex items-center gap-3 text-sm sm:text-base">
                <span className="p-2 rounded-lg text-[#57b957] inline-flex bg-[#f0fff3] border">
                  <FiPackage />
                </span>
                What we offer
              </h4>
              <p className="mt-2 text-sm sm:text-base text-gray-700">
                Carefully curated nuts, seeds, oils, dairy alternatives and pantry staples — packed for freshness.
              </p>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <CardFeature icon={<FiCheckCircle />} title="Pure Ingredients" desc="No additives or preservatives" />
                <CardFeature icon={<FiHeart />} title="Ethical Sourcing" desc="Partnered with trusted growers" />
                <CardFeature icon={<FiShield />} title="Lab Tested" desc="Meets safety & quality standards" />
                <CardFeature icon={<FiPackage />} title="Sustainable" desc="Earth-friendly packaging options" />
              </div>
            </div>
          </section>

          {/* Benefits */}
          <section>
            <h3 className="text-xl sm:text-2xl font-semibold mb-4">Benefits of an <span className="text-[#57b957]">Origin Organic</span> diet</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[
                { title: "Balances blood sugar", desc: "Steady energy throughout the day.", icon: <FiClock /> },
                { title: "Weight management", desc: "Supports healthy body composition.", icon: <FaWeight /> },
                { title: "Boosts immunity", desc: "More resilience to common illnesses.", icon: <FaRegSmile /> },
                { title: "Better sleep", desc: "Calmer mind and restorative rest.", icon: <FaRegSmile /> },
                { title: "Glowing skin", desc: "Nutrients that show on the surface.", icon: <FaHeart /> },
                { title: "Improved focus", desc: "Sharper cognition and mood.", icon: <FaBrain /> },
              ].map((b) => (
                <motion.article
                  key={b.title}
                  className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100 hover:shadow-lg transform transition"
                  whileHover={{ y: -6 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-md bg-[#f0fff3] text-[#57b957] inline-flex">
                      {b.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm sm:text-base">{b.title}</h4>
                      <p className="mt-1 text-xs sm:text-sm text-gray-600">{b.desc}</p>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="rounded-2xl p-4 sm:p-6 bg-gradient-to-r from-[#f0fff3] to-white border border-[#57b957] flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="w-full md:w-2/3">
              <h3 className="text-lg sm:text-2xl font-semibold">Ready to try a <span className="text-[#57b957]">cleaner plate?</span></h3>
              <p className="mt-2 text-sm sm:text-base text-gray-700">Start with a single swap — the effects surprise you quickly.</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <SmallPill icon={<FiCheckCircle />} text="Free shipping over ₹999" />
                <SmallPill icon={<FiShield />} text="Secure checkout" />
              </div>
            </div>

            <div className="w-full md:w-auto flex gap-3">
              <a href="/products/all-products" className="w-full md:w-auto text-center px-5 py-2.5 rounded-full bg-[#57b957] text-white font-medium shadow">Shop products</a>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

/* Small helper components used inside the file */
function Stat({ icon, value, label }) {
  return (
    <div className="bg-white/70 rounded-lg p-2 sm:p-3 shadow-inner border border-white/60 flex items-center gap-3">
      <div className="text-xl sm:text-2xl text-[#57b957]">{icon}</div>
      <div>
        <div className="text-sm sm:text-lg font-semibold">{value}</div>
        <div className="text-[10px] sm:text-xs text-gray-600">{label}</div>
      </div>
    </div>
  );
}

function SmallPill({ icon, text }) {
  return (
    <span className="inline-flex items-center gap-2 text-sm px-3 py-1 bg-white rounded-full border border-gray-100 shadow-sm">
      <span className="text-[#57b957]">{icon}</span>
      <span className="text-gray-700 text-xs sm:text-sm">{text}</span>
    </span>
  );
}

function FeatureRow({ icon, text }) {
  return (
    <li className="flex gap-3 items-start bg-white/70 rounded-lg p-2 sm:p-3 border border-white/60 shadow-sm">
      <div className="mt-1 text-[#57b957] inline-flex p-2 rounded-md bg-[#f0fff3]">
        {icon}
      </div>
      <div className="text-xs sm:text-sm text-gray-700">{text}</div>
    </li>
  );
}

function CardFeature({ icon, title, desc }) {
  return (
    <div className="bg-white/90 rounded-lg p-3 sm:p-4 border border-gray-100 flex gap-3 items-start shadow-sm hover:scale-[1.01] transform transition">
      <div className="text-xl sm:text-2xl text-[#57b957]">{icon}</div>
      <div>
        <h5 className="font-semibold text-sm sm:text-base">{title}</h5>
        <p className="mt-1 text-xs sm:text-sm text-gray-600">{desc}</p>
      </div>
    </div>
  );
}
