// src/components/FeaturedProducts.jsx
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import "swiper/css";
import "swiper/css/navigation";
import ProductCard from "./ProductCard";

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const navPrevRefs = useRef({});
  const navNextRefs = useRef({});

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_APP_BASE_URL}/api/products/featured/all`)
      .then((res) => setProducts(res.data || []))
      .catch((err) => console.error("Error fetching featured products:", err));
  }, []);

  const groupedProducts = products.reduce((acc, product) => {
    const category = product.category || "Others";
    if (!acc[category]) acc[category] = [];
    acc[category].push(product);
    return acc;
  }, {});

  return (
    <section
      id="featured"
      className="py-20 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 text-center mb-16">
          Our <span className="text-[#57b957]">Featured Products</span>
        </h1>

        {Object.entries(groupedProducts).length === 0 && (
          <p className="text-center text-gray-500">
            No featured products available.
          </p>
        )}

        {Object.entries(groupedProducts).map(([category, items], idx) => {
          const prevKey = `prev-${idx}`;
          const nextKey = `next-${idx}`;

          return (
            <div key={category} className="mb-24 relative">
              <h2 className="text-2xl font-semibold mb-6 text-gray-800 flex items-center gap-3">
                <span
                  className="w-2 h-8 rounded-full bg-[#57b957]"
                  aria-hidden="true"
                />
                {category}
              </h2>

              <div className="relative">
                <Swiper
                  spaceBetween={20}
                  slidesPerView={1.15}
                  breakpoints={{
                    640: { slidesPerView: 2 },
                    1024: { slidesPerView: 3 },
                  }}
                  modules={[Navigation]}
                  navigation={{
                    prevEl: navPrevRefs.current[prevKey],
                    nextEl: navNextRefs.current[nextKey],
                  }}
                  onBeforeInit={(swiper) => {
                    swiper.params.navigation.prevEl =
                      navPrevRefs.current[prevKey];
                    swiper.params.navigation.nextEl =
                      navNextRefs.current[nextKey];
                  }}
                >
                  {items.map((product, i) => (
                    <SwiperSlide key={product._id || i} className="px-1 sm:px-2 py-6">
                      <div className="rounded-2xl overflow-hidden shadow-md transition-transform duration-300 hover:scale-[1.02] bg-white">
                        <ProductCard product={product} />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>

                {/* Attractive Bottom-Right Buttons */}
                <div className="absolute -bottom-10 right-4 flex gap-4 z-10">
                  <button
                    ref={(el) => (navPrevRefs.current[prevKey] = el)}
                    className="p-3 rounded-full bg-gradient-to-r from-[#4aa649] to-[#71ce6e] text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
                    aria-label="Previous"
                  >
                    <IoIosArrowBack size={22} />
                  </button>
                  <button
                    ref={(el) => (navNextRefs.current[nextKey] = el)}
                    className="p-3 rounded-full bg-gradient-to-r from-[#4aa649] to-[#71ce6e] text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
                    aria-label="Next"
                  >
                    <IoIosArrowForward size={22} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default FeaturedProducts;