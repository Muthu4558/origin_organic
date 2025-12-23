// src/components/Hero.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaInstagram, FaYoutube } from "react-icons/fa";

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";

// Swiper styles
import "swiper/css";
import "swiper/css/pagination";

// Images
import heroImg1 from "../assets/hero.png";
import heroImg2 from "../assets/hero.png";
import heroImg3 from "../assets/hero.png";

const slides = [
  { image: heroImg1, discount: "30% OFF" },
  { image: heroImg2, discount: "25% OFF" },
  { image: heroImg3, discount: "40% OFF" },
];

const HeroExact = () => {
  const [activeDiscount, setActiveDiscount] = useState(slides[0].discount);

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

      <div className="relative z-20 max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 py-12 lg:py-20">

          {/* LEFT */}
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="w-full lg:w-1/2 text-center lg:text-left"
          >
            <h1 className="text-[44px] md:text-[56px] lg:text-[64px] font-extrabold text-[#2f5f2f]">
              Consume Organic
            </h1>

            <p className="mt-2 font-semibold tracking-wider text-[#3b7b3b]">
              FOR HEALTHY LIFE
            </p>

            <p className="mt-6 max-w-lg mx-auto lg:mx-0 text-[#3b7b3b]">
              100% natural, chemical-free products from trusted farms. Eat pure. Live healthy. Choose Origin Organic.
            </p>

            <div className="mt-8 flex gap-4 justify-center lg:justify-start">
              <a
                href="/products/all-products"
                className="px-6 py-3 rounded-full text-lg font-semibold bg-[#57b957] text-white shadow-lg"
              >
                Shop Organic Now
              </a>

              <a
                href="/about"
                className="px-6 py-3 rounded-full text-lg font-semibold border-2 text-[#2f5f2f]"
                style={{ borderColor: "#57b957" }}
              >
                About
              </a>
            </div>

            <div className="mt-10 flex gap-4 justify-center lg:justify-start">
              <FaInstagram className="text-[#2f5f2f]" />
              <FaYoutube className="text-[#2f5f2f]" />
              <span className="ml-3 text-sm font-medium text-[#2f5f2f]">
                www.originorganic.in
              </span>
            </div>
          </motion.div>

          {/* RIGHT IMAGE */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.12 }}
            className="w-full lg:w-1/2 flex justify-center lg:justify-end relative"
          >
            {/* Dynamic Discount Badge */}
            <motion.div
              key={activeDiscount}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="absolute top-16 left-8 z-30 px-5 py-3 rounded-full shadow-lg font-extrabold bg-[#57b957] text-white"
            >
              {activeDiscount}
            </motion.div>

            {/* Swiper */}
            <div className="relative overflow-hidden rounded-2xl w-[300px] h-[220px] md:w-[420px] md:h-[300px] lg:w-[520px] lg:h-[360px]">
              <Swiper
                modules={[Pagination, Autoplay]}
                pagination={{ clickable: true }}
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                loop
                onSlideChange={(swiper) =>
                  setActiveDiscount(slides[swiper.realIndex].discount)
                }
                className="hero-swiper w-full h-full"
              >
                {slides.map((slide, index) => (
                  <SwiperSlide key={index}>
                    <img
                      src={slide.image}
                      alt="Organic products"
                      className="w-full h-full object-cover"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Pagination Styling */}
      <style>
        {`
          .hero-swiper .swiper-pagination-bullet {
            background: #57b957;
            opacity: 0.4;
          }
          .hero-swiper .swiper-pagination-bullet-active {
            opacity: 1;
          }
        `}
      </style>
    </section>
  );
};

export default HeroExact;
