// src/components/FeaturedProducts.jsx
import { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import "swiper/css";
import "swiper/css/navigation";
import ProductCard from "./ProductCard";

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [slidesToShow, setSlidesToShow] = useState(1);
  const prevRefs = useRef({});
  const nextRefs = useRef({});

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_APP_BASE_URL}/api/products/featured/all`)
      .then((res) => setProducts(res.data || []))
      .catch((err) => {
        console.error("Error fetching featured products:", err);
        setProducts([]);
      });
  }, []);

  // group by category
  const groupedProducts = products.reduce((acc, product) => {
    const category = product.category || "Others";
    if (!acc[category]) acc[category] = [];
    acc[category].push(product);
    return acc;
  }, {});

  // compute slides visible according to viewport
  const computeSlides = useCallback(() => {
    const w = window.innerWidth;
    if (w >= 1024) return 3;
    if (w >= 640) return 2;
    return 1;
  }, []);

  useEffect(() => {
    const setCount = () => setSlidesToShow(computeSlides());
    setCount();
    window.addEventListener("resize", setCount);
    return () => window.removeEventListener("resize", setCount);
  }, [computeSlides]);

  return (
    <section id="featured" className="py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 text-center mb-16">
          Our <span className="text-[#57b957]">Featured Products</span>
        </h1>

        {Object.keys(groupedProducts).length === 0 && (
          <p className="text-center text-gray-500">No featured products available.</p>
        )}

        {/* Ensure Swiper default nav is invisible (safety) */}
        <style>{`.swiper-button-prev, .swiper-button-next { display: none !important; }`}</style>

        {Object.entries(groupedProducts).map(([category, items], idx) => {
          const prevKey = `prev-${idx}`;
          const nextKey = `next-${idx}`;

          // show nav only when more items than visible slides
          const showNav = items.length > slidesToShow;

          return (
            <div key={category} className="mb-24 relative">
              <h2 className="text-2xl font-semibold mb-6 text-gray-800 flex items-center gap-3">
                <span className="w-2 h-8 rounded-full bg-[#57b957]" aria-hidden="true" />
                {category}
              </h2>

              <div className="relative">
                {/* add bottom padding so buttons don't overlap cards */}
                <Swiper
                  spaceBetween={20}
                  modules={[Navigation, Autoplay]}
                  breakpoints={{
                    0: { slidesPerView: 1 },
                    640: { slidesPerView: 2 },
                    1024: { slidesPerView: 3 },
                  }}
                  navigation={{
                    prevEl: prevRefs.current[prevKey],
                    nextEl: nextRefs.current[nextKey],
                  }}
                  autoplay={{
                    delay: 3500,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                  }}
                  onBeforeInit={(swiper) => {
                    // attach custom DOM nodes to swiper
                    swiper.params.navigation.prevEl = prevRefs.current[prevKey];
                    swiper.params.navigation.nextEl = nextRefs.current[nextKey];
                  }}
                  loop={false}
                  className="pb-12" // reserve space at bottom for buttons
                >
                  {items.map((product, i) => (
                    <SwiperSlide key={product._id || i} className="px-1 sm:px-2 py-6">
                      <div className="rounded-2xl overflow-hidden shadow-md transition-transform duration-300 hover:scale-[1.02] bg-white">
                        <ProductCard product={product} />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>

                {/* bottom-right nav container (under cards) */}
                {showNav && (
                  <div className="absolute right-4 z-20 flex gap-3">
                    <button
                      ref={(el) => (prevRefs.current[prevKey] = el)}
                      aria-label={`Previous ${category}`}
                      className="flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-white shadow-md border border-gray-100 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#cfe3d0]"
                    >
                      <IoIosArrowBack size={18} />
                    </button>

                    <button
                      ref={(el) => (nextRefs.current[nextKey] = el)}
                      aria-label={`Next ${category}`}
                      className="flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-white shadow-md border border-gray-100 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#cfe3d0]"
                    >
                      <IoIosArrowForward size={18} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default FeaturedProducts;
