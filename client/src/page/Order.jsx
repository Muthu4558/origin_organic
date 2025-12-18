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

    return (
        <>
            <Navbar />

            <div className="min-h-screen pt-24 pb-12 px-4 mt-8">
                <div className="max-w-5xl mx-auto">

                    <h1 className="text-2xl font-semibold mb-6">My Orders</h1>

                    {loading && (
                        <p className="text-center text-gray-500">
                            Loading your orders...
                        </p>
                    )}

                    {!loading && orders.length === 0 && (
                        <p className="text-center text-gray-500">
                            No orders placed yet.
                        </p>
                    )}

                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div
                                key={order._id}
                                className="bg-white rounded-xl shadow border border-[#57b957] p-5"
                            >
                                {/* HEADER */}
                                <div className="flex justify-between flex-wrap gap-2 mb-4">
                                    <div>
                                        {/* <p className="text-sm text-gray-500">
                                            Order ID: {order._id}
                                        </p> */}
                                        <p className="text-sm text-gray-500">
                                            Date:{" "}
                                            {new Date(order.createdAt).toLocaleDateString("en-GB")}
                                        </p>

                                    </div>

                                    <span className="text-sm font-semibold text-[#57b957]">
                                        {order.status}
                                    </span>
                                </div>

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
                        ))}
                    </div>

                </div>
            </div>

            <Footer />
        </>
    );
};

export default Order;