import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useLoading } from "./LoadingContext";

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const { loading, startLoading, stopLoading } = useLoading();
  const navigate = useNavigate();

  function handleAuthError(status, showAlert = false) {
    if (status === 401) {
      if (showAlert) toast.error("Please log in to add products.", { autoClose: 1500, pauseOnHover: false, pauseOnFocusLoss: false });
      navigate("/login");
    }
  }

  const fetchCart = async () => {
    startLoading();
    try {
      const res = await fetch(`${import.meta.env.VITE_APP_BASE_URL}/api/cart`, {
        credentials: "include",
      });
      if (res.status === 401) {
        setCartItems([]);
        stopLoading();
        return;
      }
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setCartItems(data.items || []);
    } catch (err) {
      setCartItems([]);
      toast.error("Failed to fetch cart items.", { autoClose: 1500, pauseOnHover: false, pauseOnFocusLoss: false });
    } finally {
      stopLoading();
    }
  };

  const addToCart = async (product) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_APP_BASE_URL}/api/cart/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ productId: product._id, quantity: 1 }),
      });

      if (res.status === 401) {
        handleAuthError(401, true);
        return;
      }

      if (!res.ok) {
        // read server message if provided
        let errMsg = "Failed to add to cart.";
        try {
          const errData = await res.json();
          if (errData?.message) errMsg = errData.message;
        } catch {}
        toast.error(errMsg, { autoClose: 1500, pauseOnHover: false, pauseOnFocusLoss: false });
        return;
      }

      // success: explicitly set options so they don't get paused
      toast.success(`${product.name} added to cart!`, { autoClose: 1500, pauseOnHover: false, pauseOnFocusLoss: false });

      // refresh cart state after add completes — await if server returns updated cart
      // if server returns updated cart payload, you could use it instead of calling fetchCart
      fetchCart();
    } catch (err) {
      toast.error("Failed to add to cart.", { autoClose: 1500, pauseOnHover: false, pauseOnFocusLoss: false });
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_APP_BASE_URL}/api/cart/remove/${productId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.status === 401) {
        handleAuthError(401);
        return;
      }
      if (!res.ok) throw new Error("Delete failed");

      toast.info("Item removed from cart.", { autoClose: 1500, pauseOnHover: false, pauseOnFocusLoss: false });
      fetchCart();
    } catch (err) {
      toast.error("Failed to remove item.", { autoClose: 1500, pauseOnHover: false, pauseOnFocusLoss: false });
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_APP_BASE_URL}/api/cart/update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ productId, quantity }),
      });
      if (res.status === 401) {
        handleAuthError(401);
        return;
      }
      if (!res.ok) throw new Error("Update failed");

      toast.success("Cart updated successfully.", { autoClose: 1500, pauseOnHover: false, pauseOnFocusLoss: false });
      fetchCart();
    } catch (err) {
      toast.error("Failed to update cart.", { autoClose: 1500, pauseOnHover: false, pauseOnFocusLoss: false });
    }
  };

  const clearCart = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_APP_BASE_URL}/api/cart/clear`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.status === 401) {
        handleAuthError(401);
        return;
      }
      if (!res.ok) throw new Error("Clear failed");

      toast.info("Cart cleared.", { autoClose: 1500, pauseOnHover: false, pauseOnFocusLoss: false });
      fetchCart();
    } catch (err) {
      toast.error("Failed to clear cart.", { autoClose: 1500, pauseOnHover: false, pauseOnFocusLoss: false });
    }
  };

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
      fetchCart();
      // navigate after doing the toast + state updates
      navigate("/thankyou");
    } catch (err) {
      toast.error("Checkout failed.", { autoClose: 1500, pauseOnHover: false, pauseOnFocusLoss: false });
    }
  };

  useEffect(() => {
    fetchCart();
    // eslint-disable-next-line
  }, []);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        checkoutCart,
        loading,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
