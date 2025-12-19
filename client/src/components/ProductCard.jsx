import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaShoppingCart, FaEye, FaStar } from "react-icons/fa";
import { useCart } from "../context/CartContext";

/* ✅ SAFE unit resolver (keeps old products working) */
const resolveUnit = (product) => {
  if (product?.unit) return product.unit;

  if (["Masala Items", "Nuts", "Diabetics Mix"].includes(product?.category)) {
    return "kg";
  }

  return "litre";
};

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  /* ----------------- BASIC DATA ----------------- */
  const imageUrl = product?.image
    ? `${import.meta.env.VITE_APP_BASE_URL}/uploads/${product.image}`
    : "/placeholder-product.png";

  const msrp = product?.price ?? 0;
  const price = product?.offerPrice ?? product?.price ?? 0;
  const rating = Math.max(0, Math.min(5, product?.rating ?? 4));
  const unit = resolveUnit(product);

  const discount =
    msrp && msrp > price
      ? Math.round(((msrp - price) / msrp) * 100)
      : 0;

  /* ----------------- STOCK LOGIC ----------------- */
  const stock = product?.stock ?? 0;
  const isOutOfStock = stock <= 0;

  /* ----------------- HANDLERS ----------------- */
  const handleAddToCart = () => {
    if (isOutOfStock) return;

    addToCart(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  return (
    <motion.article
      className="w-full max-w-[360px] mx-auto h-full"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ translateY: -2 }}
      transition={{ duration: 0.25 }}
    >
      {/* CARD */}
      <div className="relative h-full rounded-2xl bg-white overflow-hidden p-1 flex flex-col transition">
        {/* IMAGE */}
        <div className="relative">
          <motion.img
            src={imageUrl}
            alt={product?.name}
            loading="lazy"
            className="w-full h-64 object-cover rounded-2xl"
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.5 }}
          />

          {/* DISCOUNT BADGE */}
          {discount > 0 && !isOutOfStock && (
            <span className="absolute top-3 left-3 text-xs font-semibold px-3 py-1 rounded-full text-white bg-gradient-to-r from-[#4aa649] to-[#71ce6e] shadow">
              {discount}% OFF
            </span>
          )}

          {/* OUT OF STOCK OVERLAY */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-2xl">
              <span className="text-red-600 font-bold text-lg">
                Out of Stock
              </span>
            </div>
          )}

          {/* VIEW BUTTON */}
          <button
            onClick={() => navigate(`/products/${product?._id}`)}
            className="absolute top-3 right-3 w-10 h-10 rounded-xl bg-white/90 shadow flex items-center justify-center hover:scale-105 transition"
          >
            <FaEye />
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-4 flex flex-col flex-1">
          {/* NAME */}
          <h3
            className="text-lg font-semibold truncate"
            title={product?.name}
          >
            {product?.name}
          </h3>

          {/* RATING */}
          <div className="mt-2 flex items-center gap-1 text-yellow-400">
            {Array.from({ length: 5 }).map((_, i) => (
              <FaStar
                key={i}
                className={i < rating ? "opacity-100" : "opacity-30"}
              />
            ))}
          </div>

          {/* DESCRIPTION */}
          <p className="mt-3 text-sm text-gray-600 line-clamp-2">
            {product?.description}
          </p>

          {/* STOCK INFO */}
          <div className="mt-2 text-sm">
            {isOutOfStock ? (
              <span className="text-red-600 font-semibold">
                Out of Stock
              </span>
            ) : (
              <span className="text-green-600">
                Available: {stock}
              </span>
            )}
          </div>

          {/* PRICE + ACTIONS */}
          <div className="mt-auto pt-4 flex items-center justify-between gap-3">
            {/* PRICE */}
            <div>
              {msrp > price ? (
                <div className="flex items-baseline gap-2">
                  <span className="text-sm text-gray-400 line-through">
                    ₹{msrp}
                  </span>
                  <span className="text-xl font-bold text-gray-900">
                    ₹{price}
                    <span className="text-sm font-medium text-gray-500">
                      {" "} / {unit}
                    </span>
                  </span>
                </div>
              ) : (
                <span className="text-xl font-bold text-gray-900">
                  ₹{price}
                  <span className="text-sm font-medium text-gray-500">
                    {" "} / {unit}
                  </span>
                </span>
              )}
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex items-center gap-2">
              <motion.button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                whileTap={{ scale: isOutOfStock ? 1 : 0.96 }}
                className={`relative inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-semibold shadow
                  ${isOutOfStock
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-[#4aa649] to-[#71ce6e]"
                  }`}
              >
                <FaShoppingCart />
                <span className="hidden sm:inline">
                  {isOutOfStock ? "Unavailable" : "Add"}
                </span>

                {justAdded && (
                  <motion.span
                    initial={{ opacity: 0, y: 6, scale: 0.6 }}
                    animate={{ opacity: 1, y: -16, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="absolute -top-3 right-2 text-xs font-bold bg-white text-gray-800 rounded-full px-2 py-0.5 shadow"
                  >
                    +1
                  </motion.span>
                )}
              </motion.button>

              <button
                onClick={() => navigate(`/products/${product?._id}`)}
                className="px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 bg-white hover:bg-gray-50 transition"
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