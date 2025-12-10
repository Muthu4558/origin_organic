// src/components/Hero.jsx
import React from "react";
import { motion } from "framer-motion";
import heroImg from "../assets/hero.png";
import { FaInstagram, FaYoutube } from "react-icons/fa";

const HeroExact = () => {
  return (
    <section
      id="home"
      className="relative min-h-[82vh] overflow-hidden py-12"
      style={{ backgroundColor: "#e9f7eb" }}
    >
      {/* Decorative Shapes */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute -left-10 -top-16 w-[520px] h-[260px] md:w-[760px] md:h-[360px] rounded-br-[160px]"
          style={{ backgroundColor: "#57b957", opacity: 0.9, transform: "rotate(-6deg)" }}
        />
        <div
          className="absolute -right-20 bottom-0 w-[640px] h-[420px] md:w-[920px] md:h-[520px] rounded-tl-[220px]"
          style={{ backgroundColor: "#8fdc90", opacity: 0.95, transform: "rotate(6deg)" }}
        />
      </div>

      {/* MAIN CONTENT */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 py-12 lg:py-20">

          {/* LEFT SIDE TEXT */}
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="w-full lg:w-1/2 text-center lg:text-left"
          >
            <h1
              className="text-[44px] md:text-[56px] lg:text-[64px] font-extrabold leading-tight"
              style={{ color: "#2f5f2f" }} // fixed heading color
            >
              Consume Organic
            </h1>

            <p
              className="mt-2 text-sm md:text-base font-semibold tracking-wider"
              style={{ color: "#3b7b3b" }} // subtitle
            >
              FOR HEALTHY LIFE
            </p>

            <p
              className="mt-6 max-w-lg text-sm md:text-base leading-relaxed mx-auto lg:mx-0"
              style={{ color: "#3b7b3b" }} // paragraph
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam nonummy nibh euismod
              tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam.
            </p>

            {/* CTA BUTTONS */}
            <div className="mt-8 flex items-center gap-4 justify-center lg:justify-start">
              <a
                href="/products/all-products"
                className="inline-block px-6 py-3 rounded-full text-lg font-semibold shadow-lg transition"
                style={{
                  backgroundColor: "#57b957",
                  color: "white"
                }}
              >
                Shop Organic Now
              </a>

              <a
                href="/about"
                className="inline-block border-2 px-6 py-3 rounded-full text-lg font-semibold transition"
                style={{
                  borderColor: "#57b957",
                  color: "#2f5f2f"
                }}
              >
                About
              </a>
            </div>

            {/* TRUST BADGES */}
            <div className="mt-8 flex flex-wrap gap-3 justify-center lg:justify-start">
              <span className="px-3 py-1 rounded-full text-sm font-semibold bg-[#57b957]/10" style={{ color: "#2f5f2f" }}>
                Farm-fresh
              </span>
              <span className="px-3 py-1 rounded-full text-sm font-semibold bg-[#57b957]/10" style={{ color: "#2f5f2f" }}>
                Certified Organic
              </span>
              <span className="px-3 py-1 rounded-full text-sm font-semibold bg-[#57b957]/10" style={{ color: "#2f5f2f" }}>
                No Preservatives
              </span>
            </div>

            {/* SOCIAL + WEBSITE */}
            <div className="mt-10 flex items-center gap-4 justify-center lg:justify-start">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#57b957]/20 flex items-center justify-center text-[#2f5f2f]"><a href="#"><FaInstagram/></a></div>
                <div className="w-8 h-8 rounded-full bg-[#57b957]/20 flex items-center justify-center text-[#2f5f2f]"><a href="#"><FaYoutube/></a></div>
                {/* <div className="w-8 h-8 rounded-full bg-[#57b957]/20 flex items-center justify-center text-[#2f5f2f]">yt</div> */}
              </div>

              <div className="ml-3 text-sm font-medium" style={{ color: "#2f5f2f" }}>
                www.originorganic.in
              </div>
            </div>
          </motion.div>

          {/* RIGHT IMAGE */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.12 }}
            className="w-full lg:w-1/2 flex justify-center lg:justify-end relative"
          >
            {/* Discount Badge */}
            <div className="absolute top-16 left-8 md:left-30 z-30">
              <div
                className="px-5 py-3 rounded-full shadow-lg text-sm md:text-lg font-extrabold"
                style={{ backgroundColor: "#57b957", color: "#fff" }}
              >
                30% OFF
              </div>
            </div>

            {/* IMAGE CARD */}
            <div className="relative overflow-hidden rounded-2xl w-[300px] h-[220px] md:w-[420px] md:h-[300px] lg:w-[520px] lg:h-[360px]">
              <img src={heroImg} alt="organic produce" className="w-full h-full object-cover" />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default HeroExact;