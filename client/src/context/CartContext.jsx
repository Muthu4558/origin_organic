import React, { createContext, useState, useContext, useRef } from "react";
import { toast } from "react-toastify";
import { useLoading } from "./LoadingContext";

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

const safeJson = async (res) => {
  try {
    return await res.json();
  } catch {
    return null;
  }
};

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const { startLoading, stopLoading } = useLoading();

  const fetchControllerRef = useRef(null);
  const lastFetchAtRef = useRef(0);

  const setItemsOptimistic = (updater) => {
    setCartItems((cur) => (typeof updater === "function" ? updater(cur) : updater) ?? []);
  };

  /**
   * Fetch cart ONLY when explicitly called
   */
  const fetchCart = async (options = { showLoader: false }) => {
    const now = Date.now();
    if (now - lastFetchAtRef.current < 300) return;
    lastFetchAtRef.current = now;

    if (fetchControllerRef.current) fetchControllerRef.current.abort();
    const controller = new AbortController();
    fetchControllerRef.current = controller;

    if (options.showLoader) startLoading();

    try {
      const res = await fetch(`${import.meta.env.VITE_APP_BASE_URL}/api/cart`, {
        credentials: "include",
        signal: controller.signal,
      });

      if (res.status === 401) {
        setCartItems([]);
        return;
      }

      if (!res.ok) throw new Error("Fetch failed");

      const data = await res.json();
      setCartItems(data.items || []);
    } catch (err) {
      if (err.name !== "AbortError") {
        toast.error("Failed to fetch cart");
      }
    } finally {
      if (options.showLoader) stopLoading();
    }
  };

  /**
   * Add to cart
   */
  const addToCart = async (product, quantity = 1) => {
    setItemsOptimistic((cur) => [
      ...cur,
      { product, quantity },
    ]);

    try {
      const res = await fetch(`${import.meta.env.VITE_APP_BASE_URL}/api/cart/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ productId: product._id, quantity }),
      });

      if (res.status === 401) return;
      if (!res.ok) throw new Error();

      fetchCart();
    } catch {
      toast.error("Failed to add item");
      fetchCart();
    }
  };

  const removeFromCart = async (productId) => {
    setItemsOptimistic((cur) => cur.filter((i) => i.product._id !== productId));

    try {
      const res = await fetch(`${import.meta.env.VITE_APP_BASE_URL}/api/cart/remove/${productId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) throw new Error();
      fetchCart();
    } catch {
      toast.error("Failed to remove item");
      fetchCart();
    }
  };

  const updateQuantity = async (productId, quantity) => {
    setItemsOptimistic((cur) =>
      cur.map((i) =>
        i.product._id === productId ? { ...i, quantity } : i
      )
    );

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
      toast.error("Update failed");
      fetchCart();
    }
  };

  const checkoutCart = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_APP_BASE_URL}/api/cart/checkout`, {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) throw new Error();
      toast.success("Order placed");
      setCartItems([]);
    } catch {
      toast.error("Checkout failed");
    }
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
}
