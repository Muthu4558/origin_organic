import React, { createContext, useContext, useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useLoading } from "./LoadingContext";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

const safeJson = async (res) => {
  try {
    return await res.json();
  } catch {
    return null;
  }
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const { startLoading, stopLoading } = useLoading();
  const navigate = useNavigate();
  const controllerRef = useRef(null);

  // ✅ Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cartItems");
    if (savedCart) setCartItems(JSON.parse(savedCart));
    else fetchCart({ showLoader: false }); // fetch from API if nothing in localStorage
  }, []);

  // ✅ Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const fetchCart = async (opts = { showLoader: false }) => {
    if (controllerRef.current) controllerRef.current.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    if (opts.showLoader) startLoading();

    try {
      const res = await fetch(`${import.meta.env.VITE_APP_BASE_URL}/api/cart`, {
        credentials: "include",
        signal: controller.signal,
      });

      if (res.status === 401) {
        setCartItems([]);
        return;
      }

      if (!res.ok) throw new Error();

      const data = await res.json();
      setCartItems(data.items || []);
    } catch (err) {
      if (err.name !== "AbortError") toast.error("Failed to load cart");
    } finally {
      if (opts.showLoader) stopLoading();
    }
  };

  const addToCart = async (product, quantity = 1) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_APP_BASE_URL}/api/cart/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ productId: product._id, quantity }),
      });

      if (res.status === 401) {
        toast.error("Please login to add products to cart");
        navigate("/login");
        return;
      }

      if (!res.ok) {
        const err = await safeJson(res);
        throw new Error(err?.message || "Add failed");
      }

      toast.success(`${product.name} added to cart`);
      fetchCart();
    } catch (err) {
      toast.error(err.message || "Failed to add product");
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_APP_BASE_URL}/api/cart/remove/${productId}`,
        { method: "DELETE", credentials: "include" }
      );

      if (!res.ok) throw new Error();

      // toast.success("Item removed");
      fetchCart();
    } catch {
      toast.error("Failed to remove item");
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_APP_BASE_URL}/api/cart/update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ productId, quantity }),
      });

      if (!res.ok) throw new Error();

      fetchCart();
    } catch {
      toast.error("Failed to update quantity");
    }
  };

  const checkoutCart = () => {
    navigate("/checkout");
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        fetchCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        checkoutCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};