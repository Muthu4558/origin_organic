// src/components/Testimonials.jsx
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Keyboard, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const BRAND = "#57b957";

const testimonials = [
  {
    id: 1,
    nameTamil: "Muthu",
    location: "Chennai",
    text:
      "Origin Organic products super-a iruku! Masala fresh-ah, flavour full-ah. Delivery fast-ahum packaging neat-ahum.",
    rating: 5,
  },
  {
    id: 2,
    nameTamil: "Shanthi",
    location: "Coimbatore",
    text:
      "Nuts and dry fruits quality romba nalla. Almonds crunchy, price-value match pannuthu. Repeat purchase panniren.",
    rating: 5,
  },
  {
    id: 3,
    nameTamil: "Kumar",
    location: "Madurai",
    text:
      "Ghee taste-u traditional madhiri thaan. Home-cooked flavor varuthu. Family ellarukum pidichiruchu.",
    rating: 5,
  },
  {
    id: 4,
    nameTamil: "Ravi",
    location: "Salem",
    text:
      "Oils pure-a feel aagudhu — cooking-la flavour retain aagudhu. Packaging leak-free. Service nice.",
    rating: 4,
  },
  {
    id: 5,
    nameTamil: "Sathya",
    location: "Tirunelveli",
    text:
      "Masala blends aroma super! Idly satham-um different feel aayiduchu. Shop-ah recommend panren.",
    rating: 5,
  },
];

const Stars = ({ rating }) => (
  <div className="flex items-center gap-1">
    {Array.from({ length: 5 }).map((_, i) => (
      <svg
        key={i}
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill={i < rating ? BRAND : "none"}
        stroke={BRAND}
        strokeWidth="1.1"
      >
        <path d="M12 .587l3.09 6.26L22 9.748l-5 4.873L18.18 22 12 18.897 5.82 22 7 14.62 2 9.748l6.91-1.901L12 .587z" />
      </svg>
    ))}
  </div>
);

const Testimonials = () => {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-6">

        <h2 className="text-center text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
          What Our <span className="text-[#57b957]">Customers Say</span>
        </h2>
        <p className="text-center text-gray-600 mb-10">
          Real reviews from Tamil customers — written in Thanglish for a local vibe.
        </p>

        <Swiper
          modules={[Pagination, Keyboard, Autoplay]}
          spaceBetween={20}
          slidesPerView={1}
          loop={true}
          autoplay={{ delay: 4000 }}
          keyboard={{ enabled: true }}
          pagination={{
            clickable: true,
            bulletClass: "swiper-pagination-bullet custom-bullet",
            bulletActiveClass: "swiper-pagination-bullet-active custom-bullet-active",
          }}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="pb-14"  // creates space for bullets outside cards
        >
          {testimonials.map((t) => (
            <SwiperSlide key={t.id}>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 h-full relative">
                <div
                  className="absolute left-0 top-0 h-full w-1 rounded-r-lg"
                  style={{ backgroundColor: BRAND }}
                />

                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-full flex justify-center items-center text-white font-semibold text-lg"
                    style={{
                      background: "linear-gradient(135deg,#57b957 0%,#3e772f 100%)",
                    }}
                  >
                    {t.nameTamil.charAt(0)}
                  </div>

                  <div>
                    <div className="font-semibold text-gray-900">{t.nameTamil}</div>
                    <div className="text-xs text-gray-500">{t.location}</div>
                  </div>

                  <div className="ml-auto">
                    <Stars rating={t.rating} />
                  </div>
                </div>

                <p className="mt-4 text-gray-700 text-sm leading-relaxed">
                  “{t.text}”
                </p>

                <div className="mt-5 text-xs flex justify-between text-gray-400">
                  <span>Verified Purchase</span>
                  <span>2 weeks ago</span>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="mt-10 text-center">
          <p className="text-gray-700 mb-8">
            Want to share your experience?
          </p>
          <a
            href="#"
            className="px-6 py-3 bg-[#57b957] text-white rounded-full shadow hover:bg-[#3e772f] transition"
          >
            Write a Review
          </a>
        </div>
      </div>

      {/* CUSTOM BULLET STYLES */}
      <style>{`
        .custom-bullet {
          width: 10px;
          height: 10px;
          margin: 0 6px !important;
          border-radius: 50%;
          background-color: #c2eac7 !important; /* light version of brand */
          opacity: 1 !important;
        }
        .custom-bullet-active {
          background-color: ${BRAND} !important;
          transform: scale(1.3);
        }
        .swiper-pagination {
          bottom: 0 !important; /* pushes bullets OUTSIDE card */
        }
      `}</style>

    </section>
  );
};

export default Testimonials;