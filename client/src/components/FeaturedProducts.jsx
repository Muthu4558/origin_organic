import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import "swiper/css";
import ProductCard from "./ProductCard";

const getSlidesPerView = () => {
  const w = window.innerWidth;
  if (w >= 1024) return 3;
  if (w >= 640) return 2;
  return 1;
};

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [slidesPerView, setSlidesPerView] = useState(getSlidesPerView());

  const swipers = useRef({});
  const prevRefs = useRef({});
  const nextRefs = useRef({});

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_APP_BASE_URL}/api/products/featured/all`)
      .then((res) => setProducts(res.data || []))
      .catch(() => setProducts([]));
  }, []);

  /** Update slidesPerView on resize */
  useEffect(() => {
    const onResize = () => setSlidesPerView(getSlidesPerView());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const groupedProducts = products.reduce((acc, p) => {
    const cat = p.category || "Others";
    acc[cat] = acc[cat] || [];
    acc[cat].push(p);
    return acc;
  }, {});

  /** Attach navigation safely */
  const initNavigation = (key) => {
    const swiper = swipers.current[key];
    const prevEl = prevRefs.current[key];
    const nextEl = nextRefs.current[key];

    if (!swiper || !prevEl || !nextEl) return;

    swiper.params.navigation.prevEl = prevEl;
    swiper.params.navigation.nextEl = nextEl;

    swiper.navigation.destroy();
    swiper.navigation.init();
    swiper.navigation.update();
  };

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-6">

        {Object.entries(groupedProducts).map(([category, items], idx) => {
          const key = `swiper-${idx}`;

          /** ✅ RESPONSIVE RULE */
          const showNav = items.length > slidesPerView;

          return (
            <div key={category} className="mb-24 relative">
              <h2 className="text-2xl font-semibold mb-6 text-gray-800">
                <span className="px-1 py-0 bg-[#57b957] mr-2 rounded-full"></span>
                {category}
              </h2>

              <Swiper
                modules={[Navigation, Autoplay]}
                spaceBetween={20}
                slidesPerView={slidesPerView}
                autoplay={{
                  delay: 3500,
                  disableOnInteraction: false,
                }}
                onSwiper={(swiper) => {
                  swipers.current[key] = swiper;
                  setTimeout(() => initNavigation(key));
                }}
                className="pb-14"
              >
                {items.map((product) => (
                  <SwiperSlide key={product._id}>
                    <ProductCard product={product} />
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* ✅ Responsive navigation */}
              {showNav && (
                <div className="absolute right-4 -bottom-15 z-20 flex gap-3">
                  <button
                    ref={(el) => {
                      prevRefs.current[key] = el;
                      initNavigation(key);
                    }}
                    aria-label="Previous"
                    className="p-3 rounded-full bg-white shadow hover:shadow-md cursor-pointer"
                  >
                    <IoIosArrowBack size={18} />
                  </button>

                  <button
                    ref={(el) => {
                      nextRefs.current[key] = el;
                      initNavigation(key);
                    }}
                    aria-label="Next"
                    className="p-3 rounded-full bg-white shadow hover:shadow-md cursor-pointer"
                  >
                    <IoIosArrowForward size={18} />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default FeaturedProducts;
