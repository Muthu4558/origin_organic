import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { LoadingProvider } from "./context/LoadingContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AppContent from "./AppContent"; // your Routes + useLoading usage

const App = () => {
  return (
    <Router>
      <LoadingProvider>
        <CartProvider>
          {/* Single ToastContainer placed at root */}
          <ToastContainer
            position="top-right"
            autoClose={1500}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss={false}   // ensures losing focus doesn't pause the timer
            draggable
            pauseOnHover={false}       // ensures hover doesn't pause the timer
            limit={3}
          />

          <AppContent />
        </CartProvider>
      </LoadingProvider>
    </Router>
  );
};

export default App;