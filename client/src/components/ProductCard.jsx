// src/components/ProductCard.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaShoppingCart, FaHeart, FaEye, FaStar } from "react-icons/fa";
import { useCart } from "../context/CartContext";

const BRAND = "#6c845d";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [liked, setLiked] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const imageUrl = product?.image
    ? `${import.meta.env.VITE_APP_BASE_URL}/uploads/${product.image}`
    : "/placeholder-product.png";

  const msrp = product?.price ?? null;
  const price = product?.offerPrice ?? product?.price ?? 0;
  const discount = msrp && msrp > price ? Math.round(((msrp - price) / msrp) * 100) : 0;
  const rating = Math.max(0, Math.min(5, product?.rating ?? 4));

  const handleAddToCart = () => {
    addToCart(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  return (
    <motion.article
      className="w-full max-w-[360px] mx-auto"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ translateY: -1 }}
      transition={{ duration: 0.28 }}
      aria-label={product?.name ?? "Product"}
    >
      {/* Card */}
      <div className="relative rounded-2xl bg-white overflow-hidden p-1">
        {/* Top: image */}
        <div className="relative">
          <motion.img
            src={imageUrl}
            alt={product?.name ?? "Product image"}
            loading="lazy"
            draggable={false}
            className="w-full h-64 object-cover rounded-2xl"
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.6 }}
          />

          {/* Badge group */}
          <div className="absolute top-3 left-3 flex items-center gap-2">
            {discount > 0 && (
              <div
                className="text-xs font-semibold px-3 py-1 rounded-full text-white shadow bg-gradient-to-r from-[#4aa649] to-[#71ce6e]"
              >
                {discount}% OFF
              </div>
            )}

            {product?.isNew && (
              <div className="text-xs font-semibold px-2 py-1 rounded-full bg-white/90 text-[#0f5132]">
                NEW
              </div>
            )}
          </div>

          {/* Right-top action icons (compact) */}
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            {/* <button
              onClick={() => setLiked((v) => !v)}
              aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
              className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm shadow transition transform ${liked ? "bg-[#ffeef0] text-[#c02626]" : "bg-white/90 text-gray-700"} hover:scale-105`}
              title={liked ? "Wishlisted" : "Add to wishlist"}
            >
              <FaHeart />
            </button> */}

            <button
              onClick={() => navigate(`/products/${product?._id}`)}
              aria-label="Quick view"
              className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/90 text-gray-700 shadow hover:scale-105 transition"
            >
              <FaEye />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-5">
          <h3
            className="text-lg font-semibold text-gray-900 truncate"
            title={product?.name}
          >
            {product?.name ?? "Untitled Product"}
          </h3>

          <div className="mt-2 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {/* Rating */}
              <div className="flex items-center gap-1 text-yellow-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <FaStar key={i} className={i < rating ? "opacity-100" : "opacity-30"} />
                ))}
              </div>
              <span className="text-sm text-gray-500">({product?.reviewsCount ?? 0})</span>
            </div>

            {/* Tags (small) */}
            <div className="hidden sm:flex items-center gap-2">
              {product?.tags?.slice(0, 2).map((t, i) => (
                <span
                  key={i}
                  className="text-xs px-2 py-1 rounded-full bg-[#f2f7f2] text-[#2f5b36] font-medium"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          <p className="mt-3 text-sm text-gray-600 line-clamp-2">
            {product?.shortDescription ?? "Premium product crafted with quality materials."}
          </p>

          <div className="mt-4 flex items-center justify-between gap-3">
            {/* Price block */}
            <div>
              {msrp && msrp > price ? (
                <div className="flex items-baseline gap-3">
                  <span className="text-sm text-gray-400 line-through">₹{msrp}</span>
                  <span className="text-xl font-bold text-gray-900">₹{price}</span>
                </div>
              ) : (
                <span className="text-xl font-bold text-gray-900">₹{price}</span>
              )}
              {product?.stock === 0 && <div className="text-xs text-red-500 mt-1">Out of stock</div>}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <motion.button
                onClick={handleAddToCart}
                whileTap={{ scale: 0.96 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-semibold shadow bg-gradient-to-r from-[#4aa649] to-[#71ce6e] cursor-pointer"
                aria-label={`Add ${product?.name} to cart`}
              >
                <FaShoppingCart />
                <span className="hidden sm:inline cursor-pointer">Add</span>

                {/* +1 micro-badge */}
                <motion.span
                  key={justAdded ? "active" : "idle"}
                  initial={{ opacity: 0, y: 6, scale: 0.6 }}
                  animate={justAdded ? { opacity: 1, y: -18, scale: 1 } : { opacity: 0 }}
                  transition={{ duration: 0.9 }}
                  className="absolute -top-3 right-3 text-xs font-bold bg-white text-gray-800 rounded-full px-2 py-0.5 shadow"
                >
                  +1
                </motion.span>
              </motion.button>

              <button
                onClick={() => navigate(`/products/${product?._id}`)}
                className="px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 bg-white hover:bg-gray-50 transition cursor-pointer"
                aria-label={`View ${product?.name} details`}
              >
                Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
};

export default ProductCard;
