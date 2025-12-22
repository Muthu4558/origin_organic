// src/pages/ProductDetail.jsx
import React, { useEffect, useState, useMemo, useRef } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FaStar, FaShoppingCart, FaBolt, FaShareAlt } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../context/CartContext";
import { useLoading } from "../context/LoadingContext";
import { useSearchParams } from "react-router-dom";

const BRAND = "#57b957";

const resolveUnit = (product) => {
  if (product?.unit) return product.unit;

  if (["Masala Items", "Nuts", "Diabetics Mix"].includes(product?.category)) {
    return "kg";
  }

  return "litre";
};

const Skeleton = () => (
  <div className="animate-pulse">
    <div className="h-72 bg-gray-200 rounded-lg" />
    <div className="mt-4 space-y-2">
      <div className="h-6 bg-gray-200 rounded w-3/4" />
      <div className="h-4 bg-gray-200 rounded w-1/2" />
      <div className="h-3 bg-gray-200 rounded w-1/4" />
    </div>
  </div>
);

const Stars = ({ value = 4.2, size = "h-4 w-4" }) => {
  const rating = Math.max(0, Math.min(5, Number(value)));
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return (
    <div className="flex items-center gap-1" aria-hidden>
      {[...Array(full)].map((_, i) => <FaStar key={`f-${i}`} className={`${size} text-yellow-400`} />)}
      {half && <FaStar key="half" className={`${size} text-yellow-400 opacity-60`} />}
      {[...Array(empty)].map((_, i) => <FaStar key={`e-${i}`} className={`${size} text-gray-200`} />)}
    </div>
  );
};

const ProductDetail = () => {
  const location = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { loading: globalLoading, startLoading, stopLoading } = useLoading();

  const [product, setProduct] = useState(null);
  const [galleryIndex, setGalleryIndex] = useState(0);
  // activeTab now controls right-side tabs (specs / shipping)
  const [activeTab, setActiveTab] = useState("specs");
  const [isAdding, setIsAdding] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [localLoading, setLocalLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const [canReview, setCanReview] = useState(false);
  // show review FORM panel (hidden by default)
  const [showReviews, setShowReviews] = useState(false);
  const reviewsRef = useRef(null);

  useEffect(() => {
    if (!product) return;

    axios
      .get(
        `${import.meta.env.VITE_APP_BASE_URL}/api/products/${product._id}/can-review`,
        { withCredentials: true }
      )
      .then(res => setCanReview(res.data.canReview))
      .catch(() => setCanReview(false));
  }, [product]);


  useEffect(() => {
    // if URL contains review=true open the review form and scroll to it
    if (searchParams.get("review") === "true") {
      setShowReviews(true);
      // small timeout to allow layout to render before scrolling
      setTimeout(() => reviewsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 300);
    }
  }, []);

  const ReviewForm = ({ productId }) => {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");

    const submitReview = async () => {
      try {
        await axios.post(
          `${import.meta.env.VITE_APP_BASE_URL}/api/products/${productId}/review`,
          { rating, comment },
          { withCredentials: true }
        );
        window.location.reload();
      } catch (err) {
        alert(err.response?.data?.message || "Review failed");
      }
    };


    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#57b957] to-[#7bd389] px-5 py-3">
          <h3 className="text-white font-semibold text-lg">
            Write a Review
          </h3>
          <p className="text-white/80 text-sm">
            Share your experience with this product
          </p>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {/* Star Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your Rating
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="focus:outline-none"
                >
                  <FaStar
                    className={`w-7 h-7 transition ${star <= rating ? "text-yellow-400" : "text-gray-300"
                      }`}
                  />
                </button>
              ))}
              <span className="text-sm text-gray-600 ml-2">
                {rating} / 5
              </span>
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your Review
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What did you like or dislike? Would you recommend it?"
              className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#57b957] focus:border-[#57b957] min-h-[100px]"
            />
          </div>

          {/* Action */}
          <div className="flex justify-end pt-2">
            <button
              onClick={submitReview}
              className="inline-flex items-center gap-2 bg-[#57b957] hover:bg-[#4da84d] text-white px-6 py-2.5 rounded-full font-semibold shadow-md transition cursor-pointer"
            >
              Submit Review
            </button>
          </div>
        </div>
      </div>

    );
  };


  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" }); // change to window.scrollTo(0, 0) for instant
  }, [location.pathname]);


  // fetch product
  useEffect(() => {
    let mounted = true;
    setLocalLoading(true);
    startLoading?.();
    axios.get(`${import.meta.env.VITE_APP_BASE_URL}/api/products/id/${id}`)
      .then(res => {
        if (!mounted) return;
        const p = res.data || {};
        if (p.image && !p.images) p.images = [p.image];
        setProduct(p);
        setGalleryIndex(0);
      })
      .catch(() => {
        if (!mounted) return;
        setProduct(null);
      })
      .finally(() => {
        if (!mounted) return;
        setLocalLoading(false);
        stopLoading?.();
      });

    return () => { mounted = false; };
  }, [id]);

  const images = useMemo(() => {
    if (!product) return [];
    if (Array.isArray(product.images) && product.images.length > 0) return product.images;
    if (product.image) return [product.image];
    return [];
  }, [product]);

  // ensure quantity >= 1 and not huge
  const setQuantitySafe = (q) => {
    const n = Number(q) || 1;
    setQuantity(Math.max(1, Math.min(99, Math.floor(n))));
  };

  // Add to cart (await addToCart)
  const handleAddToCart = async () => {
    if (isAdding || !product) return;
    setIsAdding(true);
    try {
      await addToCart(product, quantity); // ✅ FIX
    } finally {
      setIsAdding(false);
    }
  };

  const handleBuyNow = async () => {
    if (isAdding || !product) return;
    setIsAdding(true);
    try {
      await addToCart(product, quantity); // ✅ FIX
      navigate("/cart");
    } finally {
      setIsAdding(false);
    }
  };


  // quick keyboard-friendly thumbnail navigation
  const onThumbKey = (e, idx) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setGalleryIndex(idx);
    }
  };

  // Render
  if (localLoading || globalLoading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 py-8">
            <section className="lg:col-span-6">
              <Skeleton />
            </section>
            <section className="lg:col-span-6">
              <Skeleton />
            </section>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen mt-24 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-700">Product not found</h2>
            <p className="mt-2 text-sm text-gray-500">We couldn't find this product. It might have been removed.</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const price = Number(product.price ?? 0);
  const offerPrice = product.offerPrice ? Number(product.offerPrice) : null;
  const discountPercent = offerPrice ? Math.round(((price - offerPrice) / price) * 100) : 0;
  const rating = Math.max(0, Math.min(5, Number(product.rating ?? 4.3)));
  const unit = resolveUnit(product);

  return (
    <>
      <Navbar />

      <main className="min-h-screen pb-32 mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          {/* Grid: Image (left), Info (right), Reviews (mobile after info, desktop under image) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* 1) IMAGE SECTION (DOM first) */}
            <section className="order-1 lg:col-start-1 lg:col-span-7 lg:row-start-1">
              <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-100">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Thumbs */}
                  <div className="hidden lg:flex lg:flex-col gap-3 w-28 sticky top-28 self-start">
                    {images.length ? images.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setGalleryIndex(i)}
                        onKeyDown={(e) => onThumbKey(e, i)}
                        aria-label={`Select image ${i + 1}`}
                        className={`w-24 h-24 rounded-lg overflow-hidden border transition-transform transform hover:scale-105 focus:outline-none ${galleryIndex === i ? "border-[#57b957] shadow-lg" : "border-gray-200"}`}
                      >
                        <img src={`${import.meta.env.VITE_APP_BASE_URL}/uploads/${img}`} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" loading="lazy" />
                      </button>
                    )) : (
                      <div className="w-24 h-24 rounded-lg bg-gray-100" />
                    )}
                  </div>

                  {/* Main image */}
                  <div className="flex-1 flex flex-col gap-3">
                    <div className="relative bg-gray-50 rounded-xl p-4 flex items-center justify-center" style={{ minHeight: 360 }}>
                      <AnimatePresence mode="wait">
                        {images.length > 0 ? (
                          <motion.img
                            key={images[galleryIndex]}
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            transition={{ duration: 0.22 }}
                            src={`${import.meta.env.VITE_APP_BASE_URL}/uploads/${images[galleryIndex]}`}
                            alt={product.name}
                            className="w-full max-h-[520px] object-contain rounded-lg"
                            loading="lazy"
                          />
                        ) : (
                          <motion.div key="noimg" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <div className="text-gray-400">No image available</div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {product.featured && (
                        <div className="absolute left-4 top-4 bg-gradient-to-r from-yellow-300 to-red-300 text-xs font-semibold text-gray-900 px-3 py-1 rounded-full shadow">
                          Featured
                        </div>
                      )}

                      {offerPrice && (
                        <div className="absolute right-4 top-4 bg-white/90 px-3 py-1 rounded-full text-xs font-semibold shadow border">
                          {discountPercent}% OFF
                        </div>
                      )}
                    </div>

                    {/* Mobile strip */}
                    <div className="mt-3 lg:hidden">
                      <div className="flex gap-3 overflow-x-auto pb-2">
                        {images.map((img, i) => (
                          <button
                            key={i}
                            onClick={() => setGalleryIndex(i)}
                            className={`min-w-[88px] h-20 rounded-lg overflow-hidden border ${galleryIndex === i ? "border-[#57b957]" : "border-gray-200"} transform hover:scale-105`}
                          >
                            <img src={`${import.meta.env.VITE_APP_BASE_URL}/uploads/${img}`} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" loading="lazy" />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Image meta */}
                    <div className="flex items-center justify-between gap-4 mt-2">
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Stars value={rating} />
                          <span className="font-semibold">{rating.toFixed(1)}</span>
                          <span className="text-gray-400">• {product.reviews?.length ?? 0} reviews</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          title="Share product"
                          aria-label="Share product"
                          className="bg-[#57b957] p-2 rounded-md text-white cursor-pointer"
                          onClick={() => navigator.share ? navigator.share({ title: product.name, text: product.description, url: window.location.href }).catch(() => { }) : null}
                        >
                          <FaShareAlt />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* REVIEWS – ATTACHED TO IMAGE (NO GRID GAP POSSIBLE) */}
              <div ref={reviewsRef} className="mt-4">
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">
                      Reviews ({product.reviews?.length || 0})
                    </h3>

                    {canReview && (
                      <button
                        onClick={() => setShowReviews(true)}
                        className="text-sm bg-[#57b957] text-white px-4 py-1.5 rounded-full font-semibold hover:brightness-95"
                      >
                        Add Review
                      </button>
                    )}
                  </div>

                  {/* Review list */}
                  <div className="space-y-3 mt-3">
                    {product.reviews?.length > 0 ? (
                      product.reviews.map((r, i) => <Review key={i} {...r} />)
                    ) : (
                      <p className="text-sm text-gray-600">No reviews yet</p>
                    )}
                  </div>

                  {/* Review form */}
                  {showReviews && (
                    <div className="mt-4 border-t pt-4">
                      {canReview ? (
                        <ReviewForm productId={product._id} />
                      ) : (
                        <p className="text-sm text-gray-500">
                          Only users who purchased and received this product can write a review.
                        </p>
                      )}
                    </div>
                  )}

                  <p className="mt-4 text-sm text-gray-400">After Buying the product, you can add a review.</p>
                </div>
              </div>

            </section>

            {/* 2) INFO SECTION (DOM second) */}
            <section className="order-2 lg:col-start-8 lg:col-span-5 lg:row-start-1">
              <div className="sticky top-28 space-y-4">
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <h1 className="text-2xl font-extrabold text-gray-900">{product.name}</h1>
                      <p className="text-sm text-gray-500 mt-1">{product.brand ?? "Brand"}</p>

                      <div className="mt-3 flex items-center gap-3">
                        {offerPrice ? (
                          <>
                            <div className="text-sm text-gray-400 line-through">₹{price.toLocaleString()} </div>
                            <div className="text-3xl font-extrabold text-[#57b957]">₹{offerPrice.toLocaleString()} <span className="text-sm text-gray-500">/ {unit}</span></div>
                          </>
                        ) : (
                          <div className="text-3xl font-extrabold text-[#57b957]">₹{price.toLocaleString()} <span>/ {unit}</span></div>
                        )}
                      </div>

                      <p className="text-gray-700 mt-3">{product.description ?? "No description available."}</p>

                      <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                        <div className="bg-[#fbfdfb] p-3 rounded-md">
                          <div className="text-xs text-gray-500">Category</div>
                          <div className="font-medium text-gray-800">{product.category ?? "-"}</div>
                        </div>
                        <div className="bg-[#fbfdfb] p-3 rounded-md">
                          <div className="text-xs text-gray-500">Stock</div>
                          <div className="font-medium text-gray-800">{product.stock ?? "N/A"}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quantity + action row */}
                  <div className="mt-6 border-t border-gray-100 pt-4">
                    <div className="flex items-center gap-3">
                      <label htmlFor="qty" className="text-sm text-gray-600">Qty</label>
                      <div className="inline-flex items-center border rounded-lg overflow-hidden">
                        <button
                          onClick={() => setQuantitySafe(quantity - 1)}
                          aria-label="Decrease quantity"
                          className="px-3 py-2 text-gray-700 hover:bg-gray-50 cursor-pointer"
                          disabled={isAdding || quantity <= 1}
                        >-</button>
                        <input
                          id="qty"
                          aria-label="Quantity"
                          className="w-20 py-2 text-center text-sm outline-none"
                          value={quantity}
                          onChange={(e) => setQuantitySafe(e.target.value)}
                          disabled={isAdding}
                        />
                        <button
                          onClick={() => setQuantitySafe(quantity + 1)}
                          aria-label="Increase quantity"
                          className="px-3 py-2 text-gray-700 hover:bg-gray-50 cursor-pointer"
                          disabled={isAdding}
                        >+</button>
                      </div>
                    </div>

                    <div className="mt-4 flex gap-3">
                      <button
                        onClick={handleAddToCart}
                        disabled={isAdding}
                        className={`flex-1 rounded-full px-5 py-3 flex items-center gap-3 justify-center text-white font-semibold shadow ${isAdding ? "opacity-80 cursor-wait" : ""} cursor-pointer`}
                        style={{ background: BRAND }}
                        aria-label="Add to cart"
                      >
                        <FaShoppingCart />
                        <span>{isAdding ? "Adding…" : "Add to cart"}</span>
                      </button>

                      <button
                        onClick={handleBuyNow}
                        disabled={isAdding}
                        className={`rounded-full px-4 py-3 border border-gray-200 font-semibold flex items-center gap-2 ${isAdding ? "opacity-80 cursor-wait" : ""} cursor-pointer`}
                        aria-label="Buy now"
                      >
                        <FaBolt className="text-yellow-500" />
                        <span>{isAdding ? "Processing…" : "Buy now"}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* SPECS + SHIPPING tabs on right side as requested */}
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <button onClick={() => setActiveTab('specs')} className={`py-2 px-3 rounded ${activeTab === 'specs' ? 'bg-[#f0fcf4] text-[#057a3b] font-semibold' : 'text-gray-600'} cursor-pointer`}>
                        Specifications
                      </button>
                      <button onClick={() => setActiveTab('shipping')} className={`py-2 px-3 rounded ${activeTab === 'shipping' ? 'bg-[#fff7ed] text-[#a65b00] font-semibold' : 'text-gray-600'} cursor-pointer`}>
                        Shipping
                      </button>
                    </div>
                    <div className="text-xs text-gray-500">Info</div>
                  </div>

                  <div className="mt-4">
                    <AnimatePresence mode="wait">
                      {activeTab === 'specs' && (
                        <motion.div key="specs-right" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
                          <div className="text-sm text-gray-700">
                            <h4 className="font-semibold mb-2">General</h4>
                            <ul className="list-disc list-inside space-y-1">
                              <li>Category: {product.category}</li>
                              <li>Stock: {product.stock ?? "N/A"}</li>
                              <li>Brand: {product.brand ?? "N/A"}</li>
                            </ul>
                          </div>
                        </motion.div>
                      )}

                      {activeTab === 'shipping' && (
                        <motion.div key="shipping-right" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
                          <div className="text-sm text-gray-700">
                            <p className="mb-2">Standard shipping: 3–7 business days.</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* small seller CTA */}
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 text-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#eaf6ea] text-[#57b957] flex items-center justify-center font-bold">O</div>
                    <div>
                      <div className="font-semibold text-gray-800">Origin Organic</div>
                      <div className="text-gray-500 text-xs">Trusted seller • 99% positive feedback</div>
                    </div>
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
              onClick={handleAddToCart}
              disabled={isAdding}
              className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full text-white font-semibold`}
              style={{ background: BRAND, opacity: isAdding ? 0.85 : 1 }}
              aria-label="Add to cart"
            >
              <FaShoppingCart />
              <span>{isAdding ? "Adding…" : "Add"}</span>
            </button>
            <button
              onClick={handleBuyNow}
              disabled={isAdding}
              className={`inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full border border-gray-200 font-semibold`}
              aria-label="Buy now"
            >
              <FaBolt />
              <span>{isAdding ? "Processing…" : "Buy"}</span>
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

const Review = ({ author = "Anonymous", rating = 4, comment = "" }) => {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-[#eaf6ea] text-[#57b957] flex items-center justify-center font-bold">
          {author?.[0] ?? "A"}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex text-yellow-400">
                {[...Array(full)].map((_, i) => <FaStar key={i} className="w-4 h-4" />)}
                {half && <FaStar className="w-4 h-4 opacity-60" />}
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