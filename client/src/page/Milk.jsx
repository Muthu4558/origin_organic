// src/pages/Milk.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import ProductCard from "../components/ProductCard";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  FiSearch,
  FiFilter,
  FiChevronDown,
  FiRefreshCw,
  FiX,
} from "react-icons/fi";
import { useLoading } from "../context/LoadingContext";

const BRAND = "#57b957";

const Milk = () => {
  const location = useLocation();

  // scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState("all");
  const [sortOrder, setSortOrder] = useState("");
  const [offerOnly, setOfferOnly] = useState(false);
  const [featuredOnly, setFeaturedOnly] = useState(false);

  // <-- IMPORTANT: include `loading` here (was missing)
  const { loading, startLoading, stopLoading } = useLoading();

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    // cancel token to avoid updating state after unmount
    const controller = new AbortController();
    const signal = controller.signal;

    // start loader
    startLoading();

    axios
      .get(`${import.meta.env.VITE_APP_BASE_URL}/api/products/Milk Products`, {
        signal,
      })
      .then((res) => {
        setProducts(res.data || []);
        setFilteredProducts(res.data || []);
      })
      .catch((err) => {
        if (axios.isCancel(err) || err.name === "CanceledError") {
          // request was cancelled, ignore
          return;
        }
        console.error("Error loading milk products:", err);
        setProducts([]);
        setFilteredProducts([]);
      })
      .finally(() => {
        stopLoading();
      });

    return () => {
      // cancel request on unmount
      controller.abort();
    };
    // include startLoading/stopLoading so effect sees latest refs
  }, [startLoading, stopLoading]);

  // filtering logic (unchanged)
  useEffect(() => {
    let filtered = [...products];

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          (p.name || "").toLowerCase().includes(term) ||
          (p.shortDescription || "").toLowerCase().includes(term)
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
      <header className="relative py-14 sm:py-20 mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
          <div className="flex flex-col lg:flex-row items-center gap-10">
            <div className="lg:w-2/3 text-center lg:text-left">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold" style={{ color: "#111827" }}>
                Explore <span style={{ color: BRAND }}>Milk & Dairy</span>
              </h1>
              <p className="mt-4 text-gray-600 max-w-2xl mx-auto lg:mx-0">
                Fresh dairy & milk products sourced from trusted farms — paneer, ghee,
                milk powders, yogurts and more.
              </p>

              {/* SEARCH & FILTER BUTTON */}
              <div className="mt-6 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 w-full">
                <div className="flex items-center gap-2 bg-white/90 border border-gray-200 px-4 py-2 rounded-full shadow-sm w-full sm:w-auto">
                  <FiSearch className="text-gray-400" />
                  <input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search milks, dairies or brands..."
                    className="outline-none text-sm bg-transparent w-full"
                    aria-label="Search milk products"
                  />
                </div>

                <button
                  onClick={() => setMobileFiltersOpen(true)}
                  className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-full shadow-sm hover:shadow-md transition"
                  aria-label="Open filters"
                >
                  <FiFilter className="text-gray-600" />
                  Filters
                </button>
              </div>
            </div>

            {/* HERO IMAGE */}
            <div className="lg:w-1/3 flex justify-center lg:justify-end">
              <div className="w-48 h-40 sm:w-56 sm:h-44 rounded-2xl bg-gradient-to-tr from-[#eef7ee] to-white border border-gray-100 shadow-md flex items-center justify-center">
                <img src="/assets/milk.svg" alt="milk products" className="w-32 sm:w-40 object-contain" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 sm:mt-8 mb-12">
        {/* FILTER PANEL */}
        <section className="bg-white/70 backdrop-blur-md rounded-xl p-4 sm:p-6 shadow-md border border-[#57b957]">
          <div className="flex flex-col lg:flex-row gap-4 lg:items-center">
            {/* SEARCH BAR */}
            <div className="w-full lg:w-1/2 flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:ring-2 focus:ring-[#cfe3d0]"
                  aria-label="Search milk products"
                />
              </div>

              {/* DESKTOP SELECTS */}
              <div className="hidden md:flex items-center gap-3">
                <select value={priceRange} onChange={(e) => setPriceRange(e.target.value)} className="px-4 py-2 rounded-full border border-gray-200 bg-white">
                  <option value="all">All prices</option>
                  <option value="0-100">₹0 - ₹100</option>
                  <option value="100-500">₹100 - ₹500</option>
                  <option value="500-1000">₹500 - ₹1000</option>
                  <option value="1000-999999">₹1000+</option>
                </select>

                <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="px-4 py-2 rounded-full border border-gray-200 bg-white">
                  <option value="">Sort</option>
                  <option value="lowToHigh">Low → High</option>
                  <option value="highToLow">High → Low</option>
                </select>
              </div>
            </div>

            {/* CHECKBOXES */}
            <div className="flex items-center gap-4 flex-wrap">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={offerOnly} onChange={(e) => setOfferOnly(e.target.checked)} className="h-5 w-5" style={{ accentColor: BRAND }} />
                Offer only
              </label>

              <label className="flex items-center gap-2">
                <input type="checkbox" checked={featuredOnly} onChange={(e) => setFeaturedOnly(e.target.checked)} className="h-5 w-5" style={{ accentColor: BRAND }} />
                Featured
              </label>

              <button onClick={clearFilters} className="flex items-center gap-2 text-sm px-4 py-2 rounded-full border border-gray-200 bg-white shadow-sm hover:shadow-md" aria-label="Clear filters">
                <FiRefreshCw /> Clear
              </button>
            </div>
          </div>

          {/* MOBILE SELECTS */}
          <div className="mt-4 md:hidden flex flex-col sm:flex-row gap-3">
            <select value={priceRange} onChange={(e) => setPriceRange(e.target.value)} className="flex-1 px-3 py-2 rounded-full border border-gray-200 bg-white">
              <option value="all">All prices</option>
              <option value="0-100">₹0 - ₹100</option>
              <option value="100-500">₹100 - ₹500</option>
              <option value="500-1000">₹500 - ₹1000</option>
              <option value="1000-999999">₹1000+</option>
            </select>

            <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="px-3 py-2 rounded-full border border-gray-200 bg-white">
              <option value="">Sort</option>
              <option value="lowToHigh">Low → High</option>
              <option value="highToLow">High → Low</option>
            </select>
          </div>
        </section>

        {/* PRODUCTS GRID */}
        <section className="mt-8">
          {loading ? (
            <div className="py-20 grid place-items-center">
              <div className="animate-pulse space-y-3 w-full">
                <div className="h-6 w-40 bg-gray-200 rounded mx-auto" />
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-72 bg-gray-100 rounded-2xl" />
                  ))}
                </div>
              </div>
            </div>
          ) : filteredProducts.length ? (
            <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.06 } } }} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
              {filteredProducts.map((product) => (
                <motion.div key={product._id} variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="py-20 text-center">
              <h3 className="text-2xl font-semibold">No products found</h3>
              <p className="text-gray-600 mt-2">Try adjusting your filters or search term.</p>
              <button onClick={clearFilters} className="mt-4 px-5 py-2 bg-[#57b957] text-white rounded-full">Reset filters</button>
            </div>
          )}
        </section>
      </main>

      <Footer />

      {/* MOBILE FILTER DRAWER */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileFiltersOpen(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-4 shadow-lg max-h-[75vh] overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Filters</h3>
              <button className="p-2 rounded-full bg-gray-100" onClick={() => setMobileFiltersOpen(false)} aria-label="Close filters">
                <FiX />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                <select value={priceRange} onChange={(e) => setPriceRange(e.target.value)} className="w-full px-3 py-2 border rounded-full">
                  <option value="all">All prices</option>
                  <option value="0-100">₹0 - ₹100</option>
                  <option value="100-500">₹100 - ₹500</option>
                  <option value="500-1000">₹500 - ₹1000</option>
                  <option value="1000-999999">₹1000+</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort</label>
                <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="w-full px-3 py-2 border rounded-full">
                  <option value="">Sort</option>
                  <option value="lowToHigh">Low → High</option>
                  <option value="highToLow">High → Low</option>
                </select>
              </div>

              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={offerOnly} onChange={(e) => setOfferOnly(e.target.checked)} className="h-5 w-5" />
                  Offer only
                </label>

                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={featuredOnly} onChange={(e) => setFeaturedOnly(e.target.checked)} className="h-5 w-5" />
                  Featured
                </label>
              </div>

              <div className="flex items-center gap-3">
                <button onClick={() => { clearFilters(); setMobileFiltersOpen(false); }} className="flex-1 px-4 py-2 bg-[#57b957] text-white rounded-full">Apply & Close</button>
                <button onClick={() => { setMobileFiltersOpen(false); }} className="px-4 py-2 border rounded-full">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Milk;
