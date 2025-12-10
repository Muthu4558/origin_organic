import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { LoadingProvider } from "./context/LoadingContext";
import AppContent from "./AppContent"; // your Routes + useLoading usage

const App = () => {
  return (
    <Router>
      <LoadingProvider>
        <CartProvider>

          <AppContent />
        </CartProvider>
      </LoadingProvider>
    </Router>
  );
};

export default App;