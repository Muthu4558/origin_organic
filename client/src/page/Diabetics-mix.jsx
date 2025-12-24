// src/pages/Oils.jsx
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import ProductCard from "../components/ProductCard";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FiSearch, FiFilter, FiChevronDown, FiRefreshCw } from "react-icons/fi";
import { useLoading } from "../context/LoadingContext";

const BRAND = "#57b957";
const BRAND_DARK = "#3e772f";

const DiabeticsMix = () => {
  const location = useLocation();

  // ensure page starts at top whenever this component is mounted / route changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" }); // change to window.scrollTo(0, 0) for instant
  }, [location.pathname]);

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState("all");
  const [sortOrder, setSortOrder] = useState("");
  const [offerOnly, setOfferOnly] = useState(false);
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const { loading, startLoading, stopLoading } = useLoading();


  // Fetch diabetics Products
  useEffect(() => {
    startLoading();
    axios
      .get(`${import.meta.env.VITE_APP_BASE_URL}/api/products/Diabetics Mix`)
      .then((res) => {
        setProducts(res.data || []);
        setFilteredProducts(res.data || []);
      })
      .catch((err) => {
        console.error("Error loading Diabetics Mix:", err);
        setProducts([]);
        setFilteredProducts([]);
      })
      .finally(() => stopLoading());
  }, []);

  // Filters & Sorting
  useEffect(() => {
    let filtered = [...products];

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p?.name?.toLowerCase().includes(term) ||
          p?.shortDescription?.toLowerCase().includes(term)
      );
    }

    if (priceRange !== "all") {
      const [min, max] = priceRange.split("-").map(Number);
      filtered = filtered.filter((product) => {
        const price = product.offerPrice ?? product.price ?? 0;
        return price >= min && price <= max;
      });
    }

    if (offerOnly) {
      filtered = filtered.filter((p) => p.offerPrice && p.offerPrice < p.price);
    }

    if (featuredOnly) {
      filtered = filtered.filter((p) => p.featured === true);
    }

    if (sortOrder === "lowToHigh") {
      filtered.sort(
        (a, b) => (a.offerPrice ?? a.price ?? 0) - (b.offerPrice ?? b.price ?? 0)
      );
    } else if (sortOrder === "highToLow") {
      filtered.sort(
        (a, b) => (b.offerPrice ?? b.price ?? 0) - (a.offerPrice ?? a.price ?? 0)
      );
    }

    setFilteredProducts(filtered);
  }, [searchTerm, priceRange, sortOrder, offerOnly, featuredOnly, products]);

  const clearFilters = () => {
    setSearchTerm("");
    setPriceRange("all");
    setSortOrder("");
    setOfferOnly(false);
    setFeaturedOnly(false);
  };

  return (
    <>
      <Navbar />

      {/* HERO SECTION */}
      <header className="relative py-20">
        <div className="max-w-7xl mx-auto px-6 py-12 lg:py-20">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            {/* LEFT */}
            <div className="w-full lg:w-2/3 text-center lg:text-left">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight text-gray-900">
                Explore <span style={{ color: BRAND }}>Diabetics Mix</span>
              </h1>

              <p className="mt-4 text-gray-600 max-w-2xl mx-auto lg:mx-0">
                Discover our curated selection of Diabetics Mix products, specially
                crafted to support your health and wellness journey. Enjoy natural,
                wholesome ingredients designed to help manage blood sugar levels
                effectively.
              </p>

              {/* Search + Filter Button */}
              <div className="mt-6 flex flex-wrap justify-center lg:justify-start gap-3">
                <div className="flex items-center gap-2 bg-white/90 border border-gray-100 px-4 py-2 rounded-full shadow-sm w-full sm:w-auto">
                  <FiSearch className="text-gray-400 shrink-0" />
                  <input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search Diabetics Mix, types or brands..."
                    className="outline-none text-sm placeholder-gray-400 bg-transparent w-full sm:w-72"
                    aria-label="Search Diabetics Mix products"
                  />
                </div>

                <button
                  onClick={() =>
                    document
                      .getElementById("filters")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="inline-flex items-center justify-center gap-2 bg-white border border-gray-100 px-4 py-2 rounded-full shadow-sm hover:shadow-md transition w-full sm:w-auto"
                >
                  <FiFilter className="text-gray-600" />
                  <span className="text-sm text-gray-700">Filters</span>
                </button>
              </div>
            </div>


            {/* RIGHT IMAGE */}
            <div className="lg:w-1/3 flex justify-center lg:justify-end">
              <div className="w-56 h-44 rounded-2xl bg-gradient-to-tr from-[#eef7ee] to-white border border-gray-100 shadow-md flex items-center justify-center">
                <img
                  src="/assets/oil.svg"
                  alt="diabetics mix products"
                  className="w-40 h-32 object-contain"
                  draggable={false}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Background decorative blob */}
        <svg
          className="absolute -left-32 -top-10 w-64 opacity-20 hidden lg:block"
          viewBox="0 0 600 600"
        >
          <defs>
            <radialGradient id="g" cx="50%" cy="50%">
              <stop offset="0%" stopColor={BRAND} stopOpacity="0.14" />
              <stop offset="100%" stopColor={BRAND} stopOpacity="0.02" />
            </radialGradient>
          </defs>
          <circle cx="300" cy="300" r="250" fill="url(#g)" />
        </svg>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 mb-15">
        {/* FILTER BOX */}
        <section
          id="filters"
          className="bg-white/70 backdrop-blur-md rounded-xl p-4 sm:p-6 shadow-md border border-[#57b957]"
        >
          <div className="flex flex-col lg:flex-row gap-4 lg:items-center">
            {/* SEARCH + DESKTOP SELECTS */}
            <div className="w-full lg:w-1/2 flex flex-col sm:flex-row gap-3">
              {/* SEARCH */}
              <div className="relative flex-1">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search Diabetics Mix..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:ring-2 focus:ring-[#cfe3d0] focus:outline-none"
                />
              </div>

              {/* DESKTOP PRICE + SORT */}
              <div className="hidden sm:flex gap-3">
                <select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="px-4 py-2 rounded-full border border-gray-200 bg-white"
                >
                  <option value="all">All prices</option>
                  <option value="0-250">₹0 - ₹250</option>
                  <option value="250-500">₹250 - ₹500</option>
                  <option value="500-1000">₹500 - ₹1000</option>
                  <option value="1000-999999">₹1000+</option>
                </select>

                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="px-4 py-2 rounded-full border border-gray-200 bg-white"
                >
                  <option value="">Sort</option>
                  <option value="lowToHigh">Price: Low → High</option>
                  <option value="highToLow">Price: High → Low</option>
                </select>
              </div>
            </div>

            {/* TOGGLES + CLEAR */}
            <div className="w-full lg:w-auto flex flex-wrap items-center gap-3 lg:ml-auto">
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={offerOnly}
                  onChange={(e) => setOfferOnly(e.target.checked)}
                  className="form-checkbox h-5 w-5"
                  style={{ accentColor: BRAND }}
                />
                <span className="text-sm text-gray-700">Offer only</span>
              </label>

              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={featuredOnly}
                  onChange={(e) => setFeaturedOnly(e.target.checked)}
                  className="form-checkbox h-5 w-5"
                  style={{ accentColor: BRAND }}
                />
                <span className="text-sm text-gray-700">Featured</span>
              </label>

              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-full border border-gray-200 bg-white shadow-sm hover:shadow-md transition"
              >
                <FiRefreshCw className="text-gray-600" /> Clear
              </button>
            </div>
          </div>

          {/* MOBILE SELECTS */}
          <div className="mt-4 flex flex-col sm:hidden gap-3">
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="w-full px-4 py-2 rounded-full border border-gray-200 bg-white"
            >
              <option value="all">All prices</option>
              <option value="0-250">₹0 - ₹250</option>
              <option value="250-500">₹250 - ₹500</option>
              <option value="500-1000">₹500 - ₹1000</option>
              <option value="1000-999999">₹1000+</option>
            </select>

            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="w-full px-4 py-2 rounded-full border border-gray-200 bg-white"
            >
              <option value="">Sort</option>
              <option value="lowToHigh">Price: Low → High</option>
              <option value="highToLow">Price: High → Low</option>
            </select>
          </div>
        </section>


        {/* PRODUCT GRID */}
        <section className="mt-8">
          {loading ? (
            <div className="py-24 grid place-items-center">
              <div className="animate-pulse space-y-3">
                <div className="h-6 w-48 bg-gray-200 rounded" />
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-80 bg-white/70 rounded-2xl" />
                  ))}
                </div>
              </div>
            </div>
          ) : filteredProducts.length > 0 ? (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.06 } },
              }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8"
            >
              {filteredProducts.map((product) => (
                <motion.div
                  key={product._id}
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { opacity: 1, y: 0 },
                  }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="py-20 text-center">
              <div className="inline-flex flex-col items-center gap-4">
                <div className="text-4xl" style={{ color: BRAND }}>😕</div>
                <h3 className="text-2xl font-semibold">No products found</h3>
                <p className="text-gray-600 max-w-xl mx-auto">
                  No Diabetics Mix products match your filters. Try adjusting filters or browse other categories.
                </p>
                <button
                  onClick={clearFilters}
                  className="mt-4 px-5 py-2 rounded-full text-white shadow transition"
                  style={{ backgroundColor: BRAND }}
                >
                  Reset filters
                </button>
              </div>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
};

export default DiabeticsMix;