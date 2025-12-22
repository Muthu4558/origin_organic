import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const Order = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await axios.get(
                    `${import.meta.env.VITE_APP_BASE_URL}/api/orders/my`,
                    { withCredentials: true }
                );
                setOrders(res.data || []);
                setLoading(false);
            } catch (err) {
                if (err.response?.status === 401) {
                    navigate("/login", {
                        replace: true,
                        state: { from: location.pathname },
                    });
                } else {
                    setLoading(false);
                }
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

    const statusColor = {
        PREPARING: "bg-yellow-100 text-yellow-700",
        PLACED: "bg-yellow-100 text-yellow-700",
        DISPATCHED: "bg-blue-100 text-blue-700",
        DELIVERED: "bg-green-100 text-green-700",
    };

    return (
        <>
            <Navbar />

            <div className="min-h-screen pt-24 pb-12 px-4 mt-8">
                <div className="max-w-5xl mx-auto">
                    <h1 className="text-2xl font-semibold mb-6">My <span className="text-[#57b957]">Orders</span></h1>

                    {loading && (
                        <p className="text-center text-gray-500">
                            Loading your orders...
                        </p>
                    )}

                    {!loading && orders.length === 0 && (
                        <div>
                            <p className="text-center text-gray-500">
                                No orders placed yet.
                            </p>

                            <div className="text-center">
                                <a
                                    href="/products/all-products"
                                    className="p-2 bg-[#57b957] text-white rounded-md inline-block mt-4"
                                >
                                    View Products
                                </a>
                            </div>

                        </div>
                    )}

                    <div className="space-y-8">
                        {orders.map((order) => {
                            const currentStatus = getCurrentStatus(order);

                            return (
                                <div key={order._id} className="relative">
                                    {/* ✅ CURRENT STATUS ONLY */}
                                    <div className="absolute -top-3 right-4 z-10">
                                        <span
                                            className={`px-3 py-1 text-xs font-semibold rounded-full shadow ${statusColor[currentStatus]
                                                }`}
                                        >
                                            {currentStatus}
                                        </span>
                                    </div>

                                    {/* ORDER CARD */}
                                    <div
                                        onClick={() => navigate(`/order/${order._id}`)}
                                        className="bg-white rounded-xl shadow border border-[#57b957] p-5 cursor-pointer hover:shadow-lg transition"
                                    >
                                        {/* DATE */}
                                        <p className="text-sm text-gray-500 mb-4">
                                            Date:{" "}
                                            {new Date(order.createdAt).toLocaleDateString("en-GB")}
                                        </p>

                                        {/* ITEMS */}
                                        <div className="divide-y">
                                            {order.items.map((item, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center gap-4 py-4"
                                                >
                                                    <img
                                                        src={`${import.meta.env.VITE_APP_BASE_URL}/uploads/${item.product.image}`}
                                                        alt={item.product.name}
                                                        className="w-16 h-16 object-cover rounded border"
                                                    />

                                                    <div className="flex-1">
                                                        <p className="font-medium">
                                                            {item.product?.name}
                                                        </p>
                                                        <p className="text-sm text-gray-500">
                                                            Qty: {item.quantity}
                                                        </p>
                                                    </div>

                                                    <p className="font-semibold">
                                                        ₹{item.price * item.quantity}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>

                                        {/* FOOTER */}
                                        <div className="flex justify-between items-center border-t pt-4 mt-4">
                                            <p className="text-sm">
                                                Payment Method:{" "}
                                                <span className="font-medium">
                                                    {order.paymentMethod === "COD"
                                                        ? "Cash on Delivery"
                                                        : "Online Payment"}
                                                </span>
                                            </p>

                                            <p className="font-semibold text-[#57b957]">
                                                Total: ₹{order.totalAmount}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
};

export default Order;