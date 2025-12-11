import React, { createContext, useState, useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useLoading } from "./LoadingContext";

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

/**
 * Utilities
 */
const safeJson = async (res) => {
  try {
    return await res.json();
  } catch {
    return null;
  }
};

const WAIT_MS = (ms) => new Promise((r) => setTimeout(r, ms));

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const { startLoading, stopLoading } = useLoading(); // only used for initial load
  const navigate = useNavigate();

  // track inflight fetch for cancellation and debounce
  const fetchControllerRef = useRef(null);
  const lastFetchAtRef = useRef(0);
  const debouncedFetchTimeout = useRef(null);

  // LOCAL helper to set items immmediately (optimistic)
  const setItemsOptimistic = (updater) => {
    setCartItems((cur) => {
      const next = typeof updater === "function" ? updater(cur) : updater;
      return next ?? [];
    });
  };

  function handleAuthError(status, showAlert = false) {
    if (status === 401) {
      if (showAlert) toast.error("Please log in to add products.", { autoClose: 1500, pauseOnHover: false, pauseOnFocusLoss: false });
      navigate("/login");
    }
  }

  /**
   * fetchCart - with debounce and cancellation
   * If called repeatedly within 500ms, it will coalesce into a single request.
   */
  const fetchCart = async (options = { force: false }) => {
    const now = Date.now();
    const minInterval = 500; // ms - don't fetch more often than this

    // if recently fetched and not forced, skip or debounce
    if (!options.force && now - lastFetchAtRef.current < minInterval) {
      clearTimeout(debouncedFetchTimeout.current);
      return new Promise((resolve) => {
        debouncedFetchTimeout.current = setTimeout(() => fetchCart({ force: true }).then(resolve), minInterval);
      });
    }

    lastFetchAtRef.current = now;

    // cancel previous fetch
    if (fetchControllerRef.current) {
      fetchControllerRef.current.abort();
      fetchControllerRef.current = null;
    }
    const controller = new AbortController();
    fetchControllerRef.current = controller;

    // Use global loader only for the initial or explicit force fetch
    if (options.showLoader) startLoading();

    try {
      const res = await fetch(`${import.meta.env.VITE_APP_BASE_URL}/api/cart`, {
        credentials: "include",
        signal: controller.signal,
      });

      if (res.status === 401) {
        setCartItems([]);
        handleAuthError(401);
        return;
      }
      if (!res.ok) {
        throw new Error("Failed to fetch cart");
      }
      const data = await res.json();
      setCartItems(data.items || []);
    } catch (err) {
      if (err.name === "AbortError") {
        // aborted - ignore silently
      } else {
        // keep existing cart but notify
        toast.error("Failed to fetch cart items.", { autoClose: 1500, pauseOnHover: false, pauseOnFocusLoss: false });
      }
    } finally {
      if (options.showLoader) stopLoading();
      fetchControllerRef.current = null;
    }
  };

  // INITIAL load once on mount (show loader)
  useEffect(() => {
    fetchCart({ showLoader: true });
    return () => {
      if (fetchControllerRef.current) {
        fetchControllerRef.current.abort();
        fetchControllerRef.current = null;
      }
      clearTimeout(debouncedFetchTimeout.current);
    };
    // eslint-disable-next-line
  }, []);

  /**
   * Optimistic addToCart
   */
  const addToCart = async (product, opts = { quantity: 1 }) => {
    const quantity = opts.quantity ?? 1;

    // optimistic update: try find item and increment or add new
    let rolledBack = false;
    setItemsOptimistic((cur) => {
      const idx = cur.findIndex((i) => i.productId === product._id || i._id === product._id);
      if (idx >= 0) {
        const next = [...cur];
        next[idx] = { ...next[idx], quantity: (next[idx].quantity || 0) + quantity };
        return next;
      }
      // push a lightweight item so UI shows immediately
      return [{ productId: product._id, _id: product._id, name: product.name, price: product.price, quantity }, ...cur];
    });

    // show toast immediately
    toast.success(`${product.name} added to cart!`, { autoClose: 1500, pauseOnHover: false, pauseOnFocusLoss: false });

    // background request
    try {
      const res = await fetch(`${import.meta.env.VITE_APP_BASE_URL}/api/cart/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ productId: product._id, quantity }),
      });

      if (res.status === 401) {
        handleAuthError(401, true);
        // rollback: remove the optimistic change
        rolledBack = true;
        setItemsOptimistic((cur) => {
          const idx = cur.findIndex((i) => i.productId === product._id || i._id === product._id);
          if (idx === -1) return cur;
          const next = [...cur];
          if ((next[idx].quantity || 0) > quantity) next[idx].quantity -= quantity;
          else next.splice(idx, 1);
          return next;
        });
        return;
      }

      if (!res.ok) {
        const errData = await safeJson(res);
        throw new Error(errData?.message || "Add failed");
      }

      // optionally update with server response (if server returns cart)
      const data = await safeJson(res);
      if (data?.items) setCartItems(data.items);
      else {
        // schedule a non-blocking refresh (debounced)
        fetchCart();
      }
    } catch (err) {
      // rollback and show error
      if (!rolledBack) {
        setItemsOptimistic((cur) => {
          const idx = cur.findIndex((i) => i.productId === product._id || i._id === product._id);
          if (idx === -1) return cur;
          const next = [...cur];
          if ((next[idx].quantity || 0) > quantity) next[idx].quantity -= quantity;
          else next.splice(idx, 1);
          return next;
        });
      }
      toast.error(err?.message || "Failed to add to cart.", { autoClose: 1500, pauseOnHover: false, pauseOnFocusLoss: false });
    }
  };

  /**
   * Optimistic removeFromCart
   */
  const removeFromCart = async (productId) => {
    // capture current state for rollback
    const prev = cartItems;
    setItemsOptimistic((cur) => cur.filter((i) => !(i.productId === productId || i._id === productId)));

    toast.info("Removing item...", { autoClose: 1500, pauseOnHover: false, pauseOnFocusLoss: false });

    try {
      const res = await fetch(`${import.meta.env.VITE_APP_BASE_URL}/api/cart/remove/${productId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.status === 401) {
        handleAuthError(401);
        setCartItems(prev);
        return;
      }
      if (!res.ok) throw new Error("Delete failed");
      // success: refresh in background lightly
      fetchCart();
    } catch (err) {
      setCartItems(prev);
      toast.error("Failed to remove item.", { autoClose: 1500, pauseOnHover: false, pauseOnFocusLoss: false });
    }
  };

  /**
   * Optimistic update quantity
   */
  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) return;
    const prev = cartItems;
    setItemsOptimistic((cur) =>
      cur.map((i) => (i.productId === productId || i._id === productId ? { ...i, quantity } : i))
    );

    // UI shows immediately
    toast.success("Cart updated.", { autoClose: 1200, pauseOnHover: false, pauseOnFocusLoss: false });

    try {
      const res = await fetch(`${import.meta.env.VITE_APP_BASE_URL}/api/cart/update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ productId, quantity }),
      });

      if (res.status === 401) {
        handleAuthError(401);
        setCartItems(prev);
        return;
      }
      if (!res.ok) throw new Error("Update failed");
      fetchCart();
    } catch (err) {
      setCartItems(prev);
      toast.error("Failed to update cart.", { autoClose: 1500, pauseOnHover: false, pauseOnFocusLoss: false });
    }
  };

  /**
   * Clear cart (optimistic)
   */
  const clearCart = async () => {
    const prev = cartItems;
    setItemsOptimistic([]);
    toast.info("Clearing cart...", { autoClose: 1200, pauseOnHover: false, pauseOnFocusLoss: false });

    try {
      const res = await fetch(`${import.meta.env.VITE_APP_BASE_URL}/api/cart/clear`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.status === 401) {
        handleAuthError(401);
        setCartItems(prev);
        return;
      }
      if (!res.ok) throw new Error("Clear failed");
      fetchCart();
    } catch (err) {
      setCartItems(prev);
      toast.error("Failed to clear cart.", { autoClose: 1500, pauseOnHover: false, pauseOnFocusLoss: false });
    }
  };

  /**
   * Checkout (no optimistic navigation)
   */
  const checkoutCart = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_APP_BASE_URL}/api/cart/checkout`, {
        method: "POST",
        credentials: "include",
      });

      if (res.status === 401) {
        handleAuthError(401);
        return;
      }
      if (!res.ok) throw new Error("Checkout failed");

      toast.success("Checkout successful!", { autoClose: 1500, pauseOnHover: false, pauseOnFocusLoss: false });

      // refresh and navigate
      await fetchCart();
      navigate("/thankyou");
    } catch (err) {
      toast.error("Checkout failed.", { autoClose: 1500, pauseOnHover: false, pauseOnFocusLoss: false });
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        checkoutCart,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
