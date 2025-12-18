import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAllOrders = async () => {
            try {
                const res = await axios.get(
                    `${import.meta.env.VITE_APP_BASE_URL}/api/orders/admin/all`,
                    { withCredentials: true }
                );
                setOrders(res.data || []);
                setLoading(false);
            } catch (err) {
                setLoading(false);
                navigate("/login");
            }
        };

        fetchAllOrders();
    }, []);

    return (
        <>
            <Navbar />

            <div className="min-h-screen pt-28 pb-12 px-4">
                <div className="max-w-6xl mx-auto">

                    <h1 className="text-3xl font-bold mb-6">
                        Customer Orders
                    </h1>

                    {loading && (
                        <p className="text-center text-gray-500">
                            Loading orders...
                        </p>
                    )}

                    {!loading && orders.length === 0 && (
                        <p className="text-center text-gray-500">
                            No orders found.
                        </p>
                    )}

                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div
                                key={order._id}
                                className="bg-white rounded-xl shadow border border-[#57b957] p-5"
                            >
                                {/* HEADER */}
                                <div className="flex flex-wrap justify-between gap-3 mb-4">
                                    <div>
                                        <p className="font-semibold">
                                            {order.user?.name}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {order.user?.email}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {new Date(order.createdAt).toLocaleDateString("en-GB")}
                                        </p>
                                    </div>

                                    <span className="px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-700">
                                        {order.status}
                                    </span>
                                </div>

                                {/* ITEMS */}
                                <div className="divide-y">
                                    {order.items.map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-4 py-3">
                                            <img
                                                src={`${import.meta.env.VITE_APP_BASE_URL}/uploads/${item.product.image}`}
                                                alt={item.product.name}
                                                className="w-14 h-14 object-cover rounded border"
                                            />

                                            <div className="flex-1">
                                                <p className="font-medium">
                                                    {item.product.name}
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
                                <div className="flex flex-wrap justify-between items-center border-t pt-4 mt-4 gap-3">
                                    <p className="text-sm">
                                        Payment:{" "}
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
        </>
    );
};

export default AdminOrders;