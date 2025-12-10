import { Routes, Route } from "react-router-dom";
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

const AppContent = () => {
    const { loading } = useLoading();

    return (
        <>
            {loading && <Loader />}

            <Routes key={location.pathname}>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Signup />} />
                {/* protected routes */}
                <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
                <Route path="/cart" element={<PrivateRoute><Cart /></PrivateRoute>} />
                {/* product routes */}
                <Route path="/products/all-products" element={<AllProduct />} />
                <Route path="/products/milk" element={<Milk />} />
                <Route path="/products/masala" element={<Masala />} />
                <Route path="/products/nuts" element={<Nuts />} />
                <Route path="/products/oils" element={<Oils />} />
                <Route path="/products/:id" element={<ProductDetail />} />
                <Route path="/thankyou" element={<ThankYou />} />
                {/* admin */}
                <Route path="/admin" element={<PrivateRoute adminOnly={true}><Admin /></PrivateRoute>} />
            </Routes>
        </>
    );
};

export default AppContent;