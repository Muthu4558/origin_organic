// src/pages/AllProduct.jsx
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import { motion } from "framer-motion";
import { FiSearch, FiRefreshCw } from "react-icons/fi";
import { useLoading } from "../context/LoadingContext";

const BRAND = "#57b957";

const AllProduct = () => {
  const location = useLocation();

  // ensure page starts at top whenever this component is mounted / route changes
  useEffect(() => {
    // instant jump to top; change behavior to 'smooth' if you prefer smooth scrolling
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [sortOrder, setSortOrder] = useState("");
  const [offerOnly, setOfferOnly] = useState(false);
  const [featuredOnly, setFeaturedOnly] = useState(false);

  const [categories, setCategories] = useState([]);
  const { loading, setLoading, startLoading, stopLoading } = useLoading();

  useEffect(() => {
    startLoading();
    axios
      .get(`${import.meta.env.VITE_APP_BASE_URL}/api/products`)
      .then((res) => {
        setProducts(res.data || []);
        setFiltered(res.data || []);
        const uniqueCategories = [
          ...new Set(res.data?.map((item) => item.category) ?? []),
        ];
        setCategories(uniqueCategories);
      })
      .catch(() => {
        setProducts([]);
        setFiltered([]);
      })
      .finally(() => stopLoading());
  }, []);

  useEffect(() => {
    let data = [...products];
    const term = searchTerm.toLowerCase();

    if (searchTerm.trim()) {
      data = data.filter(
        (p) =>
          p?.name?.toLowerCase().includes(term) ||
          p?.shortDescription?.toLowerCase().includes(term)
      );
    }
    if (category !== "all") data = data.filter((p) => p.category === category);
    if (priceRange !== "all") {
      const [min, max] = priceRange.split("-").map(Number);
      data = data.filter((p) => {
        const price = p.offerPrice ?? p.price;
        return price >= min && price <= max;
      });
    }
    if (offerOnly)
      data = data.filter((p) => p.offerPrice && p.offerPrice < p.price);
    if (featuredOnly) data = data.filter((p) => p.featured === true);

    if (sortOrder === "lowToHigh")
      data.sort((a, b) => (a.offerPrice ?? a.price) - (b.offerPrice ?? b.price));
    if (sortOrder === "highToLow")
      data.sort((a, b) => (b.offerPrice ?? b.price) - (a.offerPrice ?? a.price));

    setFiltered(data);
  }, [searchTerm, category, priceRange, sortOrder, offerOnly, featuredOnly, products]);

  const clearFilters = () => {
    setSearchTerm("");
    setCategory("all");
    setPriceRange("all");
    setSortOrder("");
    setOfferOnly(false);
    setFeaturedOnly(false);
  };

  return (
    <>
      <Navbar />

      <header className="py-20 mt-10 text-center px-4">
        <h1 className="text-4xl md:text-5xl font-extrabold">
          Explore <span style={{ color: BRAND }}>All Products</span>
        </h1>
        <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
          Browse our entire catalog — oils, nuts, spices, dairy, snacks and more.
        </p>
      </header>

      {/* FILTER PANEL */}
      <main className="max-w-7xl mx-auto px-4 mb-16 -mt-8">
        <section className="bg-white/80 backdrop-blur-md p-5 rounded-xl shadow-md border border-[#57b957] space-y-4">

          {/* Row 1 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200"
              />
            </div>

            {/* Category */}
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-4 py-2 rounded-full border border-gray-200 bg-white"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            {/* Price */}
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="px-4 py-2 rounded-full border border-gray-200 bg-white"
            >
              <option value="all">All Prices</option>
              <option value="0-250">₹0 - ₹250</option>
              <option value="250-500">₹250 - ₹500</option>
              <option value="500-1000">₹500 - ₹1000</option>
              <option value="1000-999999">₹1000+</option>
            </select>

            {/* Sort */}
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="px-4 py-2 rounded-full border border-gray-200 bg-white"
            >
              <option value="">Sort</option>
              <option value="lowToHigh">Low → High</option>
              <option value="highToLow">High → Low</option>
            </select>
          </div>

          {/* Row 2 */}
          <div className="flex flex-wrap gap-4 items-center">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={offerOnly}
                onChange={(e) => setOfferOnly(e.target.checked)}
                className="h-5 w-5"
                style={{ accentColor: BRAND }}
              />
              Offer Only
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={featuredOnly}
                onChange={(e) => setFeaturedOnly(e.target.checked)}
                className="h-5 w-5"
                style={{ accentColor: BRAND }}
              />
              Featured
            </label>

            <button
              onClick={clearFilters}
              className="ml-auto flex items-center gap-2 px-5 py-2 rounded-full bg-white border border-gray-200 shadow hover:shadow-md"
            >
              <FiRefreshCw /> Clear
            </button>
          </div>
        </section>

        {/* PRODUCT GRID */}
        <section className="mt-10">
          {loading ? (
            <div className="py-24 grid place-items-center">
              <div className="animate-pulse space-y-3 w-full px-4">
                <div className="h-6 w-48 rounded bg-gray-200 mx-auto"></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-80 bg-gray-100 rounded-2xl"></div>
                  ))}
                </div>
              </div>
            </div>
          ) : filtered.length > 0 ? (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8"
            >
              {filtered.map((product) => (
                <motion.div
                  key={product._id}
                  variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="py-20 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="text-4xl" style={{ color: BRAND }}>😕</div>
                <h3 className="text-2xl font-semibold">No products found</h3>
                <p className="text-gray-600 max-w-xl">Try adjusting your filters.</p>
                <button onClick={clearFilters} className="mt-4 px-6 py-2 bg-[#57b957] text-white rounded-full shadow">
                  Reset Filters
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

export default AllProduct;