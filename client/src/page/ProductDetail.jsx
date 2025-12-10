// src/pages/ProductDetail.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FaStar, FaShoppingCart, FaBolt, FaHeart } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../context/CartContext";

const BRAND = "#57b957";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("specs");
  const [galleryIndex, setGalleryIndex] = useState(0);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    axios
      .get(`${import.meta.env.VITE_APP_BASE_URL}/api/products/id/${id}`)
      .then((res) => {
        if (!mounted) return;
        const p = res.data || {};
        // normalize images
        if (p.image && !p.images) p.images = [p.image];
        setProduct(p);
      })
      .catch(() => {
        if (!mounted) return;
        setProduct(null);
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-[#57b957] text-2xl font-semibold">
        Loading…
      </div>
    );

  if (!product)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 text-xl">
        Product not found
      </div>
    );

  const price = Number(product.price ?? 0);
  const offerPrice = product.offerPrice ? Number(product.offerPrice) : null;
  const discountPercent = offerPrice ? Math.round(((price - offerPrice) / price) * 100) : 0;
  const rating = Math.max(0, Math.min(5, Number(product.rating ?? 4.3)));
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const images = Array.isArray(product.images) && product.images.length > 0 ? product.images : product.image ? [product.image] : [];

  const onAddCart = () => {
    addToCart(product);
  };

  const onBuyNow = () => {
    addToCart(product);
    navigate("/cart");
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen pb-32 mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Gallery */}
            <section className="lg:col-span-6">
              <div className="bg-white rounded-2xl p-4 shadow-sm">
                <div className="flex flex-col lg:flex-row gap-4">
                  {/* vertical thumbnails on lg, horizontal hidden on mobile (we show a mobile strip later) */}
                  <div className="hidden lg:flex lg:flex-col gap-3 w-24">
                    {images.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setGalleryIndex(i)}
                        className={`w-20 h-20 rounded-lg overflow-hidden border transition-shadow duration-150 ${galleryIndex === i ? "border-[#57b957] shadow" : "border-gray-200"
                          } focus:outline-none`}
                        aria-label={`Select image ${i + 1}`}>
                        <img
                          src={`${import.meta.env.VITE_APP_BASE_URL}/uploads/${img}`}
                          alt={`${product.name} thumbnail ${i + 1}`}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </button>
                    ))}
                  </div>

                  {/* main image */}
                  <div className="flex-1 bg-gray-50 rounded-xl flex items-center justify-center p-4">
                    {images.length > 0 ? (
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={images[galleryIndex]}
                          initial={{ opacity: 0, scale: 0.98 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.98 }}
                          transition={{ duration: 0.22 }}
                          className="w-full flex items-center justify-center"
                        >
                          <motion.img
                            src={`${import.meta.env.VITE_APP_BASE_URL}/uploads/${images[galleryIndex]}`}
                            alt={product.name}
                            className="w-full max-h-[520px] object-contain rounded-lg"
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.25 }}
                            loading="lazy"
                          />
                        </motion.div>
                      </AnimatePresence>
                    ) : (
                      <div className="text-gray-400">No image available</div>
                    )}
                  </div>
                </div>

                {/* mobile thumbnail strip */}
                <div className="mt-4 lg:hidden">
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {images.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setGalleryIndex(i)}
                        className={`min-w-[84px] h-20 rounded-lg overflow-hidden border ${galleryIndex === i ? "border-[#57b957]" : "border-gray-200"
                          } focus:outline-none`}
                      >
                        <img
                          src={`${import.meta.env.VITE_APP_BASE_URL}/uploads/${img}`}
                          alt={`${product.name} thumb ${i + 1}`}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Info */}
            <section className="lg:col-span-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col gap-4">
                <header className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight">{product.name}</h1>
                    <p className="text-sm text-gray-500 mt-1">{product.brand ?? "Brand"}</p>
                  </div>

                  <div className="flex-shrink-0 text-right">
                    {offerPrice ? (
                      <>
                        <div>
                          <span className="block text-2xl sm:text-3xl font-bold text-[#57b957]">₹{offerPrice}</span>
                          <span className="text-sm text-gray-400 line-through">₹{price}</span>
                        </div>
                        <div className="mt-2 inline-flex items-center gap-2 bg-[#eaf6ee] text-[#0f7a39] px-3 py-1 rounded-full text-xs font-semibold">
                          {discountPercent}% OFF
                        </div>
                      </>
                    ) : (
                      <div>
                        <span className="block text-2xl sm:text-3xl font-bold text-[#57b957]">₹{price}</span>
                      </div>
                    )}
                  </div>
                </header>

                {/* rating + badges (responsive) */}
                <div className="w-full">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <div className="flex items-center gap-1">
                        {[...Array(fullStars)].map((_, i) => (
                          <FaStar key={`full-${i}`} className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" aria-hidden="true" />
                        ))}
                        {halfStar && <FaStar key="half" className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 opacity-60" aria-hidden="true" />}
                        {[...Array(5 - fullStars - (halfStar ? 1 : 0))].map((_, i) => (
                          <FaStar key={`empty-${i}`} className="w-4 h-4 sm:w-5 sm:h-5 text-gray-200" aria-hidden="true" />
                        ))}
                      </div>

                      <div className="ml-2 text-sm sm:text-base text-gray-700 font-medium truncate">{rating.toFixed(1)}</div>
                      <div className="ml-2 text-sm text-gray-500">• {product.reviews?.length ?? 0} reviews</div>
                    </div>

                    <div className="mt-2 sm:mt-0 sm:ml-auto flex gap-2 justify-start sm:justify-end">
                      <div className="px-2 py-1 rounded-lg bg-[#f2f7f2] text-[#2f5b37] text-xs sm:text-sm font-semibold">Verified</div>
                      {product.featured && <div className="px-2 py-1 rounded-lg bg-[#fff7ed] text-[#a65b00] text-xs sm:text-sm font-semibold">Featured</div>}
                    </div>
                  </div>
                </div>

                {/* short description */}
                <p className="text-gray-700 leading-relaxed">{product.description ?? "No description available."}</p>

                {/* specs grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600">
                  <div className="bg-[#fbfdfb] p-3 rounded-md">Category<div className="font-medium text-gray-800">{product.category ?? "-"}</div></div>
                  <div className="bg-[#fbfdfb] p-3 rounded-md">Stock<div className="font-medium text-gray-800">{product.stock ?? "N/A"}</div></div>
                  <div className="bg-[#fbfdfb] p-3 rounded-md">Brand<div className="font-medium text-gray-800">{product.brand ?? "-"}</div></div>
                  <div className="bg-[#fbfdfb] p-3 rounded-md">SKU<div className="font-medium text-gray-800">{product._id?.slice(-6).toUpperCase()}</div></div>
                </div>

                {/* actions: responsive */}
                <div className="mt-4 w-full">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    {/* Primary */}
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={onAddCart}
                      className="w-full sm:flex-1 inline-flex items-center justify-center gap-3 px-4 py-3 rounded-full text-white font-semibold shadow"
                      style={{ background: BRAND }}
                      aria-label="Add to cart"
                    >
                      <FaShoppingCart className="w-4 h-4" aria-hidden="true" />
                      <span className="hidden sm:inline">Add to Cart</span>
                      <span className="sm:hidden">Add</span>
                    </motion.button>

                    {/* Secondary */}
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={onBuyNow}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full border border-gray-200 font-semibold text-gray-800"
                      aria-label="Buy now"
                    >
                      <FaBolt className="w-4 h-4 text-yellow-500" />
                      <span>Buy Now</span>
                    </motion.button>

                    {/* wishlist pinned on larger screens */}
                    <div className="flex justify-center sm:justify-start sm:ml-2">
                      <button
                        title="Add to wishlist"
                        aria-label="Add to wishlist"
                        className="p-3 rounded-lg border border-gray-200 text-[#57b957] inline-flex items-center justify-center"
                      >
                        <FaHeart className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* tabs */}
                <div className="mt-6">
                  <div className="flex gap-4 border-b border-gray-100 overflow-x-auto lg:overflow-visible">
                    <TabBtn label="Specifications" id="specs" activeTab={activeTab} setActiveTab={setActiveTab} activeColor="#2b8f6a" />
                    <TabBtn label="Customer Reviews" id="reviews" activeTab={activeTab} setActiveTab={setActiveTab} activeColor="#3b82f6" />
                    <TabBtn label="Shipping" id="shipping" activeTab={activeTab} setActiveTab={setActiveTab} activeColor="#6c845d" />
                  </div>

                  <div className="mt-4">
                    <AnimatePresence mode="wait">
                      {activeTab === "specs" && (
                        <motion.div key="specs" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
                            <div>
                              <h4 className="font-semibold mb-2">General</h4>
                              <ul className="list-disc list-inside space-y-1">
                                <li>Category: {product.category}</li>
                                <li>Stock: {product.stock ?? "N/A"}</li>
                                <li>Brand: {product.brand ?? "N/A"}</li>
                              </ul>
                            </div>
                            <div>
                              <h4 className="font-semibold mb-2">Details</h4>
                              <ul className="list-disc list-inside space-y-1">
                                <li>SKU: {product._id?.slice(-8).toUpperCase()}</li>
                                <li>Weight: {product.weight ?? "N/A"}</li>
                                <li>Dimensions: {product.dimensions ?? "N/A"}</li>
                              </ul>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {activeTab === "reviews" && (
                        <motion.div key="reviews" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
                          <div className="space-y-4">
                            {product.reviews && product.reviews.length > 0 ? (
                              product.reviews.map((r, i) => (
                                <Review key={i} author={r.author ?? "Anonymous"} rating={r.rating ?? 4} comment={r.comment ?? ""} />
                              ))
                            ) : (
                              <>
                                <div className="text-sm text-gray-600">No reviews yet. Be the first to review this product.</div>
                                <Review author="Jane Doe" rating={4.5} comment="Great product! Highly recommend." />
                                <Review author="John Smith" rating={4} comment="Good value for money. Packaging was nice." />
                              </>
                            )}
                          </div>
                        </motion.div>
                      )}

                      {activeTab === "shipping" && (
                        <motion.div key="shipping" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
                          <div className="text-sm text-gray-700">
                            <p className="mb-2">Standard shipping: 3–7 business days.</p>
                            <p className="mb-2">Express shipping: 1–2 business days (where available).</p>
                            <p className="mb-0">Free returns within 15 days of delivery.</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* sticky mobile bar */}
        <div className="fixed left-0 right-0 bottom-0 block md:hidden bg-white border-t border-gray-200 p-3 z-40">
          <div className="max-w-7xl mx-auto px-4 flex gap-3">
            <button
              onClick={onAddCart}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full text-white font-semibold"
              style={{ background: `linear-gradient(90deg, ${BRAND}, #8aa277)` }}
              aria-label="Add to cart"
            >
              <FaShoppingCart />
              <span className="ml-1">Add</span>
            </button>
            <button
              onClick={onBuyNow}
              className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full border border-gray-200 font-semibold"
              aria-label="Buy now"
            >
              <FaBolt />
              <span className="ml-1">Buy</span>
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

const TabBtn = ({ label, id, activeTab, setActiveTab, activeColor = "#6c845d" }) => {
  const isActive = activeTab === id;
  return (
    <button
      onClick={() => setActiveTab(id)}
      className={`py-3 px-3 -mb-px text-sm font-semibold ${isActive ? "text-gray-900" : "text-gray-600"} relative`}
      aria-pressed={isActive}
    >
      <span className="inline-block">{label}</span>
      <span
        className={`absolute left-0 right-0 -bottom-3 mx-auto h-0.5 transition-all ${isActive ? "opacity-100" : "opacity-0"}`}
        style={{ background: isActive ? activeColor : "transparent", width: isActive ? 48 : 0 }}
      />
    </button>
  );
};

const Review = ({ author, rating, comment }) => {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-[#eaf6ea] text-[#57b957] flex items-center justify-center font-bold">
          {author?.[0] ?? "A"}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex text-yellow-400">
                {[...Array(full)].map((_, i) => (
                  <FaStar key={i} className="w-4 h-4" />
                ))}
                {half && <FaStar className="w-4 h-4 opacity-50" />}
              </div>
              <div className="text-sm font-semibold text-gray-800">{author}</div>
            </div>
            <div className="text-xs text-gray-500">{rating.toFixed(1)}</div>
          </div>
          <p className="text-sm text-gray-600 mt-2">{comment}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;