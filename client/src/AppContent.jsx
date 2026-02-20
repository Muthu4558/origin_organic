import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Loader from "./components/Loader";
import { useLoading } from "./context/LoadingContext";

import Home from "./page/Home";
import Login from "./page/Login";
import Signup from "./page/Signup";
import Profile from "./page/Profile";
import Cart from "./page/Cart";
import Milk from "./page/Milk";
import Masala from "./page/Masala";
import Nuts from "./page/Nuts";
import Oils from "./page/Oils";
import AllProduct from "./page/AllProduct";
import Admin from "./page/Admin";
import PrivateRoute from "./components/PrivateRoute";
import ProductDetail from "./page/ProductDetail";
import ThankYou from "./page/thankyou";
import About from "./components/About";
import Checkout from "./page/Checkout";
import Order from "./page/Order";
import AdminOrders from "./page/AdminOrders";
import OrderDetails from "./page/OrderDetails";
import DiabeticsMix from "./page/Diabetics-mix";
import PrivacyPolicy from "./components/PrivacyPolicy";
import Shipping from "./components/Shipping";
import Terms from "./components/Terms";
import VerifyEmail from "./page/VerifyEmail";
import AdminShipping from "./page/AdminShipping";
import AppleCIder from "./page/AppleCIder";
import Pickle from "./page/Pickle";
import Seeds from "./page/Seeds";
import AdminDashboard from "./page/AdminDashboard";

const AppContent = () => {
    const { loading } = useLoading();
    const location = useLocation();

    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        const hasShown = localStorage.getItem("welcomePopupShown");

        if (!hasShown && location.pathname === "/") {
            const timer = setTimeout(() => {
                setShowPopup(true);
                localStorage.setItem("welcomePopupShown", "true");
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [location.pathname]);

    return (
        <>
            {loading && <Loader />}

            {/* 🎉 Welcome Popup */}
            {showPopup && (
                <div style={overlayStyle}>
                    <div style={popupStyle}>
                        <h2 style={{ marginBottom: "10px" }}>
                            🎉 Welcome!
                        </h2>
                        <p style={{ marginBottom: "20px" }}>
                            Origin Organic is now live with a brand-new website makeover.
                        </p>
                        <button
                            style={buttonStyle}
                            onClick={() => setShowPopup(false)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            <Routes key={location.pathname}>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Signup />} />
                <Route path="/verify-email/:token" element={<VerifyEmail />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/shipping" element={<Shipping />} />
                <Route path="/terms" element={<Terms />} />

                {/* Protected Routes */}
                <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
                <Route path="/cart" element={<PrivateRoute><Cart /></PrivateRoute>} />
                <Route path="/order" element={<PrivateRoute><Order /></PrivateRoute>} />

                {/* Product Routes */}
                <Route path="/products/all-products" element={<AllProduct />} />
                <Route path="/products/milk" element={<Milk />} />
                <Route path="/products/masala" element={<Masala />} />
                <Route path="/products/nuts" element={<Nuts />} />
                <Route path="/products/oils" element={<Oils />} />
                <Route path="/products/diabetics-mix" element={<DiabeticsMix />} />
                <Route path="/products/apple-cider" element={<AppleCIder />} />
                <Route path="/products/pickle" element={<Pickle />} />
                <Route path="/products/seeds" element={<Seeds />} />
                <Route path="/products/:id" element={<ProductDetail />} />

                <Route path="/checkout" element={<Checkout />} />
                <Route path="/order/:id" element={<OrderDetails />} />
                <Route path="/thankyou" element={<ThankYou />} />

                {/* Admin Routes */}
                <Route
                    path="/admin/dashboard"
                    element={<PrivateRoute adminOnly={true}><AdminDashboard /></PrivateRoute>}
                />
                <Route
                    path="/admin/product"
                    element={<PrivateRoute adminOnly={true}><Admin /></PrivateRoute>}
                />
                <Route
                    path="/admin/shipping"
                    element={<PrivateRoute adminOnly={true}><AdminShipping /></PrivateRoute>}
                />
                <Route
                    path="/admin/orders"
                    element={<PrivateRoute adminOnly={true}><AdminOrders /></PrivateRoute>}
                />
            </Routes>
        </>
    );
};

export default AppContent;


/* ------------------ STYLES ------------------ */

const overlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
};

const popupStyle = {
    background: "#ffffff",
    padding: "30px",
    borderRadius: "12px",
    textAlign: "center",
    width: "400px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
};

const buttonStyle = {
    padding: "10px 20px",
    backgroundColor: "#2e7d32",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
};