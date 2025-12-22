// src/pages/ProductDetail.jsx
import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FaStar, FaShoppingCart, FaBolt, FaHeart, FaShareAlt } from "react-icons/fa";
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
  const [activeTab, setActiveTab] = useState("specs");
  const [isAdding, setIsAdding] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [localLoading, setLocalLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const [canReview, setCanReview] = useState(false);

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
    if (searchParams.get("review") === "true") {
      setActiveTab("reviews");
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
      <div className="bg-[#f8fff9] p-4 rounded-lg">
        <h3 className="font-semibold mb-2">Write a Review</h3>

        <select
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          className="border p-2 rounded mb-2"
        >
          {[5, 4, 3, 2, 1].map(r => (
            <option key={r} value={r}>{r} Star</option>
          ))}
        </select>

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write your review..."
          className="w-full border rounded p-2 mb-2"
        />

        <button
          onClick={submitReview}
          className="bg-[#57b957] text-white px-4 py-2 rounded"
        >
          Submit Review
        </button>
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
          {/* <nav className="text-sm text-gray-500 mb-4" aria-label="Breadcrumb">
            <ol className="flex gap-2 items-center">
              <li><a href="/" className="hover:underline">Home</a></li>
              <li> / </li>
              <li><a href="/products/all-products" className="hover:underline">Products</a></li>
              <li> / </li>
              <li className="text-gray-700">{product.name?.slice(0, 40)}</li>
            </ol>
          </nav> */}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Gallery */}
            <section className="lg:col-span-6">
              <div className="bg-white rounded-2xl p-4 shadow-sm">
                <div className="flex flex-col lg:flex-row gap-4">
                  {/* thumbnails (desktop) */}
                  <div className="hidden lg:flex lg:flex-col gap-3 w-28">
                    {images.length ? images.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setGalleryIndex(i)}
                        onKeyDown={(e) => onThumbKey(e, i)}
                        aria-label={`Select image ${i + 1}`}
                        className={`w-24 h-24 rounded-lg overflow-hidden border transition-shadow focus:outline-none ${galleryIndex === i ? "border-[#57b957] shadow" : "border-gray-200"}`}
                      >
                        <img src={`${import.meta.env.VITE_APP_BASE_URL}/uploads/${img}`} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" loading="lazy" />
                      </button>
                    )) : (
                      <div className="w-24 h-24 rounded-lg bg-gray-100" />
                    )}
                  </div>

                  <div className="flex-1 bg-gray-50 rounded-xl flex items-center justify-center p-4">
                    {images.length > 0 ? (
                      <AnimatePresence mode="wait">
                        <motion.img
                          key={images[galleryIndex]}
                          initial={{ opacity: 0, scale: 0.98 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.98 }}
                          transition={{ duration: 0.2 }}
                          src={`${import.meta.env.VITE_APP_BASE_URL}/uploads/${images[galleryIndex]}`}
                          alt={product.name}
                          className="w-full max-h-[560px] object-contain rounded-lg"
                          loading="lazy"
                        />
                      </AnimatePresence>
                    ) : (
                      <div className="text-gray-400">No image available</div>
                    )}
                  </div>
                </div>

                {/* mobile strip */}
                <div className="mt-4 lg:hidden">
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {images.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setGalleryIndex(i)}
                        className={`min-w-[88px] h-20 rounded-lg overflow-hidden border ${galleryIndex === i ? "border-[#57b957]" : "border-gray-200"}`}
                      >
                        <img src={`${import.meta.env.VITE_APP_BASE_URL}/uploads/${img}`} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" loading="lazy" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Info */}
            <section className="lg:col-span-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col gap-4">
                <div className="flex justify-end gap-3">
                  <button
                    title="Add to wishlist"
                    aria-label="Add to wishlist"
                    className="p-3 rounded-lg border border-gray-200 text-[#57b957] inline-flex items-center justify-center"
                  >
                    <FaHeart />
                  </button>
                  <button
                    title="Share product"
                    aria-label="Share product"
                    className="bg-[#57b957] p-3 rounded-md text-white cursor-pointer"
                    onClick={() => navigator.share ? navigator.share({ title: product.name, text: product.description, url: window.location.href }).catch(() => { }) : null}
                  >
                    <FaShareAlt />
                  </button>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">{product.name}</h1>
                    <p className="text-sm text-gray-500 mt-1">{product.brand ?? "Brand"}</p>
                  </div>

                  <div className="flex-shrink-0 text-right">
                    {offerPrice ? (
                      <>
                        {/* OFFER PRICE */}
                        <div className="text-2xl sm:text-3xl font-bold text-[#57b957]">
                          ₹{offerPrice.toLocaleString()}
                          <span className="text-sm text-gray-500"> / {unit}</span>
                        </div>

                        {/* ORIGINAL PRICE */}
                        <div className="text-sm text-gray-400 line-through">
                          ₹{price.toLocaleString()}
                          <span className="text-xs text-gray-400"> / {unit}</span>
                        </div>

                        <div className="mt-2 inline-flex items-center gap-2 bg-[#eaf6ee] text-[#0f7a39] px-3 py-1 rounded-full text-xs font-semibold">
                          {discountPercent}% OFF
                        </div>
                      </>
                    ) : (
                      <div className="text-2xl sm:text-3xl font-bold text-[#57b957]">₹{price.toLocaleString()}</div>
                    )}
                  </div>
                </div>

                {/* rating + small meta */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex items-center gap-3">
                    <Stars value={rating} />
                    <div className="text-sm text-gray-700 font-medium">{rating.toFixed(1)}</div>
                    <div className="text-sm text-gray-500">• {product.reviews?.length ?? 0} reviews</div>
                  </div>

                  <div className="ml-auto flex gap-2">
                    <div className="px-2 py-1 rounded-lg bg-[#f2f7f2] text-[#2f5b37] text-xs font-semibold">Verified</div>
                    {product.featured && <div className="px-2 py-1 rounded-lg bg-[#fff7ed] text-[#a65b00] text-xs font-semibold">Featured</div>}
                  </div>
                </div>

                <p className="text-gray-700 leading-relaxed">{product.description ?? "No description available."}</p>

                {/* specs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600 mt-2">
                  <div className="bg-[#fbfdfb] p-3 rounded-md">
                    <div className="text-xs text-gray-500">Category</div>
                    <div className="font-medium text-gray-800">{product.category ?? "-"}</div>
                  </div>
                  <div className="bg-[#fbfdfb] p-3 rounded-md">
                    <div className="text-xs text-gray-500">Stock</div>
                    <div className="font-medium text-gray-800">{product.stock ?? "N/A"}</div>
                  </div>
                  <div className="bg-[#fbfdfb] p-3 rounded-md">
                    <div className="text-xs text-gray-500">Brand</div>
                    <div className="font-medium text-gray-800">{product.brand ?? "-"}</div>
                  </div>
                </div>

                {/* quantity + actions */}
                <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex items-center gap-2">
                    <label htmlFor="qty" className="text-sm text-gray-600 mr-2">Qty</label>
                    <div className="inline-flex items-center border rounded-lg overflow-hidden">
                      <button
                        onClick={() => setQuantitySafe(quantity - 1)}
                        aria-label="Decrease quantity"
                        className="px-3 py-2 text-gray-700 hover:bg-gray-50"
                        disabled={isAdding || quantity <= 1}
                      >-</button>
                      <input
                        id="qty"
                        aria-label="Quantity"
                        className="w-16 py-2 text-center text-sm outline-none"
                        value={quantity}
                        onChange={(e) => setQuantitySafe(e.target.value)}
                        disabled={isAdding}
                      />
                      <button
                        onClick={() => setQuantitySafe(quantity + 1)}
                        aria-label="Increase quantity"
                        className="px-3 py-2 text-gray-700 hover:bg-gray-50"
                        disabled={isAdding}
                      >+</button>
                    </div>
                  </div>

                  <div className="flex-1 sm:flex-none sm:ml-auto flex gap-3">
                    <button
                      onClick={handleAddToCart}
                      disabled={isAdding}
                      className={`rounded-full px-5 py-3 flex items-center gap-3 justify-center text-white font-semibold shadow ${isAdding ? "opacity-80 cursor-wait" : ""}`}
                      style={{ background: BRAND }}
                      aria-label="Add to cart"
                    >
                      <FaShoppingCart />
                      <span>{isAdding ? "Adding…" : "Add to cart"}</span>
                    </button>

                    <button
                      onClick={handleBuyNow}
                      disabled={isAdding}
                      className={`rounded-full px-4 py-3 border border-gray-200 font-semibold ${isAdding ? "opacity-80 cursor-wait" : ""}`}
                      aria-label="Buy now"
                    >
                      <FaBolt className="text-yellow-500 mr-2 inline-block" />
                      <span>{isAdding ? "Processing…" : "Buy now"}</span>
                    </button>

                  </div>
                </div>

                {/* tabs */}
                <div className="mt-6">
                  <div className="flex gap-4 border-b border-gray-100 overflow-x-auto">
                    <button onClick={() => setActiveTab("specs")} className={`py-3 px-3 -mb-px text-sm font-semibold ${activeTab === "specs" ? "text-gray-900" : "text-gray-600"}`}>Specifications</button>
                    <button onClick={() => setActiveTab("reviews")} className={`py-3 px-3 -mb-px text-sm font-semibold ${activeTab === "reviews" ? "text-gray-900" : "text-gray-600"}`}>Reviews</button>
                    <button onClick={() => setActiveTab("shipping")} className={`py-3 px-3 -mb-px text-sm font-semibold ${activeTab === "shipping" ? "text-gray-900" : "text-gray-600"}`}>Shipping</button>
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
                            {/* <div>
                              <h4 className="font-semibold mb-2">Details</h4>
                              <ul className="list-disc list-inside space-y-1">
                                <li>SKU: {String(product._id ?? "").slice(-8).toUpperCase()}</li>
                                <li>Weight: {product.weight ?? "N/A"}</li>
                                <li>Dimensions: {product.dimensions ?? "N/A"}</li>
                              </ul>
                            </div> */}
                          </div>
                        </motion.div>
                      )}

                      {activeTab === "reviews" && (
  <motion.div>
    {/* ✅ REVIEW FORM ONLY FOR DELIVERED USERS */}
    {canReview && <ReviewForm productId={product._id} />}

    {!canReview && (
      <p className="text-sm text-gray-500 mb-4">
        Only users who purchased and received this product can write a review.
      </p>
    )}

    {/* ✅ ALL USERS CAN SEE REVIEWS */}
    <div className="space-y-4 mt-4">
      {product.reviews?.length > 0 ? (
        product.reviews.map((r, i) => <Review key={i} {...r} />)
      ) : (
        <p className="text-sm text-gray-600">No reviews yet</p>
      )}
    </div>
  </motion.div>
)}



                      {activeTab === "shipping" && (
                        <motion.div key="shipping" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
                          <div className="text-sm text-gray-700">
                            <p className="mb-2">Standard shipping: 3–7 business days.</p>
                            {/* <p className="mb-2">Express shipping: 1–2 business days (where available).</p>
                            <p className="mb-0">Free returns within 15 days of delivery.</p> */}
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
    <div className="bg-white rounded-lg p-4 shadow-sm">
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