import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaShoppingCart, FaEye, FaStar } from "react-icons/fa";
import { useCart } from "../context/CartContext";

/* unit resolver */
const resolveUnit = (product) => {
  if (product?.unit) return product.unit;
  if (["Masala Items", "Nuts", "Diabetics Mix"].includes(product?.category))
    return "kg";
  return "litre";
};

/* ✅ NEW – pack size formatter */
const formatPackSize = (product) => {
  const unit = resolveUnit(product);
  const size = product?.packSize;

  // for old products where packSize not available
  if (!size) return unit;

  if (unit === "kg") {
    return size === "0.5" ? "500 g" : "1 kg";
  }

  if (unit === "litre") {
    return size === "0.5" ? "500 ml" : "1 l";
  }

  return unit;
};

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const imageUrl = product?.image
    ? `${import.meta.env.VITE_APP_BASE_URL}/uploads/${product.image}`
    : "/placeholder-product.png";

  const msrp = product?.price ?? 0;
  const price = product?.offerPrice ?? product?.price ?? 0;
  const rating = Math.max(0, Math.min(5, product?.rating ?? 4));

  const unit = resolveUnit(product);
  const displaySize = formatPackSize(product); // ✅ use this

  const discount =
    msrp && msrp > price
      ? Math.round(((msrp - price) / msrp) * 100)
      : 0;

  const stock = product?.stock ?? 0;
  const isOutOfStock = stock <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 900);
  };

  return (
    <motion.article
      transition={{ duration: 0.3 }}
      className="w-full max-w-[340px] mx-auto"
    >
      <div className="relative rounded-3xl overflow-hidden bg-black group">

        {/* IMAGE */}
        <img
          src={imageUrl}
          alt={product?.name}
          className="w-full h-[420px] object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* DARK GRADIENT */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* TOP ACTIONS */}
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={() => navigate(`/products/${product?._id}`)}
            className="w-10 h-10 rounded-full bg-[#57b957] text-white flex items-center justify-center cursor-pointer"
          >
            <FaEye />
          </button>
        </div>

        {/* DISCOUNT */}
        {discount > 0 && !isOutOfStock && (
          <span className="absolute top-4 left-4 bg-[#57b957] text-white text-xs font-bold px-3 py-1 rounded-full">
            {discount}% OFF
          </span>
        )}

        {/* OUT OF STOCK */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
            <span className="text-red-600 font-bold text-xl">
              Out of Stock
            </span>
          </div>
        )}

        {/* CONTENT OVER IMAGE */}
        <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
          
          {/* NAME */}
          <h3 className="text-xl font-bold leading-tight truncate">
            {product?.name}
          </h3>

          {/* RATING */}
          <div className="flex items-center gap-1 mt-1 text-yellow-400 text-sm">
            {Array.from({ length: 5 }).map((_, i) => (
              <FaStar
                key={i}
                className={i < rating ? "opacity-100" : "opacity-30"}
              />
            ))}
          </div>

          {/* PRICE + CTA */}
          <div className="mt-4 flex items-center justify-between gap-3">
            <div>
              {msrp > price && (
                <span className="text-xs line-through text-[#57b957]">
                  ₹{msrp}
                </span>
              )}
              <div className="text-2xl font-extrabold">
                ₹{price}
                <span className="text-sm font-medium text-[#57b957]">
                  {" "} / {displaySize}
                </span>
              </div>
            </div>

            <motion.button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              whileTap={{ scale: 0.92 }}
              className={`relative flex items-center gap-2 px-5 py-3 rounded-full text-sm font-bold
                ${
                  isOutOfStock
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-[#57b957] text-white cursor-pointer hover:bg-green-600 transition"
                }`}
            >
              <FaShoppingCart />
              Add

              {justAdded && (
                <span className="absolute -top-2 -right-2 bg-black text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  +1
                </span>
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.article>
  );
};

export default ProductCard;
