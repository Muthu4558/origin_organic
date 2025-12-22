// src/pages/Cart.jsx
import React, { useState, useMemo, useEffect } from "react";
import { FaTrash, FaShoppingCart, FaMinus, FaPlus } from "react-icons/fa";
import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import Footer from "../components/Footer";
import { useLocation } from "react-router-dom";

const BRAND = "#57b957";

const ConfirmDeleteModal = ({ open, productName, onCancel, onConfirm }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <motion.div
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative bg-white rounded-2xl shadow-xl w-[94%] max-w-md p-6 z-10"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Remove item</h3>
        <p className="text-gray-600 mb-6">
          Are you sure you want to remove <span className="font-semibold text-[#3f6c4b]">{productName}</span> from your cart?
        </p>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg text-white cursor-pointer"
            style={{ background: BRAND }}
          >
            Yes, remove
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const EmptyState = () => (
  <div className="text-center py-20">
    <div className="mx-auto w-48">
      {/* <img
        src="https://cdni.iconscout.com/illustration/premium/thumb/empty-cart-4085814-3371650.png"
        alt="Empty cart"
        className="w-full"
      /> */}
    </div>
    <h3 className="mt-6 text-2xl font-semibold text-gray-700">Your cart is empty</h3>
    <p className="mt-2 text-gray-500">Browse products and add your favourites to the cart.</p>
    <a href="/products/all-products" className="mt-4 inline-block px-4 py-2 bg-[#57b957] text-white rounded-lg">
      Continue Shopping
    </a>
  </div>
);

const Cart = () => {
  const location = useLocation();
  const { cartItems, removeFromCart, updateQuantity, checkoutCart, fetchCart } = useCart();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmProductId, setConfirmProductId] = useState(null);
  const [confirmProductName, setConfirmProductName] = useState("");

  // Ensure page starts at top on mount / route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" }); // change to instant jump if you prefer: window.scrollTo(0,0)
  }, [location.pathname]);

  // Refresh cart when this page mounts or when route changes.
  // This ensures data is fetched after redirect from login.
  useEffect(() => {
    fetchCart({ showLoader: true });
    // eslint-disable-next-line
  }, []);


  const total = useMemo(
    () =>
      cartItems.reduce(
        (acc, item) => acc + (item.product.offerPrice || item.product.price) * item.quantity,
        0
      ),
    [cartItems]
  );

  const askDelete = (productId, productName) => {
    setConfirmProductId(productId);
    setConfirmProductName(productName);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    removeFromCart(confirmProductId);
    toast.success(`${confirmProductName} removed from cart`);
    setConfirmOpen(false);
    setConfirmProductId(null);
    setConfirmProductName("");
  };

  const handleCancelDelete = () => {
    toast.info("Item removal cancelled");
    setConfirmOpen(false);
    setConfirmProductId(null);
    setConfirmProductName("");
  };

  const handleDecrease = (id, qty) => {
    if (qty > 1) updateQuantity(id, qty - 1);
  };

  const handleIncrease = (id, qty) => {
    updateQuantity(id, qty + 1);
  };

  return (
    <>
      <Navbar />
      {/* <ToastContainer position="top-right" /> */}

      <ConfirmDeleteModal
        open={confirmOpen}
        productName={confirmProductName}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />

      <div className="min-h-screen py-35 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main column */}
          <div className="lg:col-span-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-lg bg-white shadow flex items-center justify-center border" style={{ borderColor: "#e8efe6" }}>
                  <FaShoppingCart className="text-2xl" style={{ color: BRAND }} />
                </div>
                <div>
                  <h1 className="text-3xl font-extrabold text-gray-900">Your <span className="text-[#57b957]">Cart</span></h1>
                  <p className="text-sm text-gray-500">Review items, update quantities, or proceed to checkout.</p>
                </div>
              </div>

              <div className="hidden md:flex items-center gap-3">
                <div className="text-sm text-gray-600">Secure checkout</div>
                <div className="h-8 w-[1px] bg-gray-200" />
                <div className="text-sm font-semibold" style={{ color: BRAND }}>
                  {cartItems.length} items
                </div>
              </div>
            </div>

            {cartItems.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="space-y-5">
                {cartItems.map((item) => {
                  const price = item.product.offerPrice ?? item.product.price;
                  return (
                    <motion.div
                      key={item.product._id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-2xl p-4 shadow-sm border border-[#57b957] flex flex-col md:flex-row items-center gap-4"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-28 h-28 flex items-center justify-center rounded-xl overflow-hidden bg-gray-50 border">
                          <img
                            src={`${import.meta.env.VITE_APP_BASE_URL}/uploads/${item.product.image}`}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 truncate">{item.product.name}</h3>
                          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{item.product.shortDescription ?? ""}</p>

                          <div className="mt-3 flex items-center gap-3">
                            {item.product.offerPrice ? (
                              <>
                                <div className="text-sm text-gray-400 line-through">₹{item.product.price}</div>
                                <div className="text-lg font-bold" style={{ color: BRAND }}>₹{item.product.offerPrice}</div>
                              </>
                            ) : (
                              <div className="text-lg font-bold" style={{ color: BRAND }}>₹{item.product.price}</div>
                            )}
                          </div>

                          <div className="mt-2 text-sm text-gray-600">Subtotal: ₹{price * item.quantity}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 justify-between w-full md:w-auto">
                        {/* Quantity controls */}
                        <div className="flex items-center bg-white border border-green-50 rounded-full px-2 shadow-sm">
                          <button
                            onClick={() => handleDecrease(item.product._id, item.quantity)}
                            disabled={item.quantity === 1}
                            className="p-2 rounded-full hover:bg-gray-100 transition text-gray-600"
                            aria-label="Decrease quantity"
                          >
                            <FaMinus />
                          </button>
                          <div className="px-4 text-sm font-medium">{item.quantity}</div>
                          <button
                            onClick={() => handleIncrease(item.product._id, item.quantity)}
                            className="p-2 rounded-full hover:bg-gray-100 transition text-gray-600"
                            aria-label="Increase quantity"
                          >
                            <FaPlus />
                          </button>
                        </div>

                        {/* Remove */}
                        <button
                          className="p-2 rounded-lg bg-white border hover:bg-red-50 text-red-600 cursor-pointer"
                          title="Remove"
                          onClick={() => askDelete(item.product._id, item.product.name)}
                          aria-label="Remove item"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Checkout panel */}
          <aside className="lg:col-span-4">
            <div className="sticky top-20">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-[#57b957]">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-sm text-gray-500">Order summary</div>
                    <div className="text-2xl font-bold mt-1" style={{ color: BRAND }}>₹{total}</div>
                  </div>
                  <div className="text-sm text-gray-400">incl. taxes</div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Items</span>
                    <span>{cartItems.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Estimated delivery</span>
                    <span>5–7 days</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (cartItems.length === 0) {
                      toast.info("Your cart is empty");
                      return;
                    }
                    checkoutCart();
                  }}
                  className="w-full inline-flex items-center justify-center gap-3 px-4 py-3 rounded-xl text-white font-semibold cursor-pointer"
                  style={{ background: BRAND }}
                >
                  <FaShoppingCart /> Proceed to Checkout
                </button>

                <div className="mt-4 text-xs text-gray-500">
                  Secure payments • Easy returns • 24/7 support
                </div>
              </div>

              {/* Mobile sticky checkout bottom */}
              <div className="fixed left-0 right-0 bottom-0 z-40 px-4 pb-4 sm:hidden">
                <div className="bg-white rounded-2xl p-3 shadow-xl border border-[#57b957] flex items-center justify-between">
                  <div>
                    <div className="text-xs text-gray-500">Total</div>
                    <div className="text-lg font-bold" style={{ color: BRAND }}>₹{total}</div>
                  </div>
                  <button
                    onClick={() => {
                      if (cartItems.length === 0) {
                        toast.info("Your cart is empty");
                        return;
                      }
                      checkoutCart();
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white"
                    style={{ background: BRAND }}
                  >
                    Checkout
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Cart;