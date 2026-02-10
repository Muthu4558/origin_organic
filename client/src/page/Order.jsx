import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Loader from "../components/Loader";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const statusColor = {
    PREPARING: "bg-yellow-100 text-yellow-700",
    PLACED: "bg-yellow-100 text-yellow-700",
    DISPATCHED: "bg-blue-100 text-blue-700",
    DELIVERED: "bg-green-100 text-green-700",
};

const Order = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                const res = await axios.get(
                    `${import.meta.env.VITE_APP_BASE_URL}/api/orders/my`,
                    { withCredentials: true }
                );
                setOrders(res.data || []);
            } catch (err) {
                if (err.response?.status === 401) {
                    navigate("/login", { replace: true, state: { from: location.pathname } });
                }
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const getCurrentStatus = (order) => {
        if (order.currentStatus) return order.currentStatus;
        if (order.statusTimeline?.delivered?.status) return "DELIVERED";
        if (order.statusTimeline?.dispatched?.status) return "DISPATCHED";
        return "PLACED";
    };

    if (loading) return <Loader />; // ✅ Show Loader while fetching

    return (
        <>
            <Navbar />

            <div className="min-h-screen pt-28 pb-12 px-4">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-3xl sm:text-4xl font-extrabold mb-8 text-center">
                        My <span className="text-[#57b957]">Orders</span>
                    </h1>

                    {orders.length === 0 ? (
                        <div className="text-center mt-16">
                            <p className="text-gray-500 text-lg mb-4">No orders placed yet.</p>
                            <a
                                href="/products/all-products"
                                className="inline-block px-6 py-3 bg-[#57b957] text-white rounded-full shadow-lg hover:bg-[#46a846] transition"
                            >
                                Browse Products
                            </a>
                        </div>
                    ) : (
                        <div className="grid gap-8">
                            {orders.map((order) => {
                                const currentStatus = getCurrentStatus(order);

                                return (
                                    <div
                                        key={order._id}
                                        className="relative bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl transition overflow-visible"
                                    >
                                        {/* Status Badge */}
                                        <div className="absolute -top-3 left-4 z-20">
                                            <span
                                                className={`px-4 py-1 text-sm font-semibold rounded-full shadow ${statusColor[currentStatus]}`}
                                            >
                                                {currentStatus}
                                            </span>
                                        </div>

                                        {/* Header */}
                                        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                                            <p className="text-sm text-gray-500">
                                                Order Date: {new Date(order.createdAt).toLocaleDateString("en-GB")}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                Payment:{" "}
                                                <span className="font-medium">
                                                    {order.paymentMethod === "COD" ? "Cash on Delivery" : "Online Payment"}
                                                </span>
                                            </p>
                                            <p className="text-lg font-bold text-[#57b957]">
                                                Total: ₹{order.totalAmount.toLocaleString()}
                                            </p>
                                        </div>

                                        {/* Items */}
                                        <div className="divide-y">
                                            {order.items.map((item, index) => {
                                                const product = item.product;
                                                if (!product) return null; // skip if product is null

                                                return (
                                                    <div key={index} className="flex items-center gap-4 p-6 hover:bg-gray-50 transition">
                                                        <img
                                                            src={`${import.meta.env.VITE_APP_BASE_URL}/uploads/${product.image || "default.png"}`}
                                                            alt={product.name || "Product"}
                                                            className="w-20 h-20 object-cover rounded-xl border"
                                                        />
                                                        <div className="flex-1">
                                                            <p className="font-semibold text-gray-800">{product.name || "Deleted Product"}</p>
                                                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                                            <p className="text-sm text-gray-500">Price: ₹{item.price}</p>
                                                        </div>
                                                        <p className="font-semibold text-gray-800">₹{item.price * item.quantity}</p>
                                                    </div>
                                                );
                                            })}

                                        </div>

                                        {/* Footer */}
                                        <div className="p-6 border-t border-gray-100 flex justify-between items-center">
                                            <p className="text-sm text-gray-500">
                                                Order Status: <span className="font-medium">{currentStatus}</span>
                                            </p>
                                            <button
                                                onClick={() => navigate(`/order/${order._id}`)}
                                                className="px-4 py-2 rounded-full bg-[#57b957] text-white shadow hover:bg-[#46a846] transition text-sm cursor-pointer"
                                            >
                                                View Details
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </>
    );
};

export default Order;