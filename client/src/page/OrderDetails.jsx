import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FaBoxOpen, FaTruck, FaCheckCircle } from "react-icons/fa";
import { MdArrowRightAlt, MdDashboard } from "react-icons/md";

const OrderDetails = () => {
    const { id } = useParams();

    const [order, setOrder] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [deliveryDate, setDeliveryDate] = useState("");

    const fetchOrder = async () => {
        const res = await axios.get(
            `${import.meta.env.VITE_APP_BASE_URL}/api/orders/${id}`,
            { withCredentials: true }
        );
        setOrder(res.data);
    };

    const checkAdmin = async () => {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_APP_BASE_URL}/api/auth/verify`,
                { withCredentials: true }
            );
            setIsAdmin(res.data.isAdmin === true);
        } catch {
            setIsAdmin(false);
        }
    };

    const updateStatus = async (status) => {
        await axios.put(
            `${import.meta.env.VITE_APP_BASE_URL}/api/orders/admin/update-status/${id}`,
            {
                status,
                expectedDeliveryDate: deliveryDate || null,
            },
            { withCredentials: true }
        );
        fetchOrder();
    };

    useEffect(() => {
        fetchOrder();
        checkAdmin();
    }, []);

    if (!order) return null;

    const timeline = order.statusTimeline;

    const steps = [
        { key: "preparing", title: "Preparing for Dispatch", icon: <FaBoxOpen /> },
        { key: "dispatched", title: "Order Dispatched", icon: <FaTruck /> },
        { key: "delivered", title: "Order Delivered", icon: <FaCheckCircle /> },
    ];

    const deliveryDateToShow =
        order.expectedDeliveryDate || order.estimatedDeliveryDate;

    return (
        <>
            {!isAdmin && <Navbar />}

            <div className="min-h-screen px-3 sm:px-4 pt-28 pb-12">
                {/* ADMIN HEADER */}
                {isAdmin && (
                    <>
                        <div className="max-w-4xl mx-auto text-2xl sm:text-4xl font-bold flex items-center gap-3 mb-4">
                            <MdDashboard />
                            Admin <span className="text-[#57b957]">Dashboard</span>
                        </div>

                        <div className="max-w-4xl mx-auto mb-6">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full shadow-sm">

                                <Link
                                    to="/admin"
                                    className="text-sm font-medium text-gray-600 hover:text-[#57b957] transition"
                                >
                                    Home
                                </Link>

                                <MdArrowRightAlt className="text-gray-400 text-lg" />

                                <Link
                                    to="/admin/orders"
                                    className="text-sm font-semibold text-gray-600 hover:text-[#57b957] transition"
                                >
                                    Orders
                                </Link>

                                <MdArrowRightAlt className="text-gray-400 text-lg" />

                                <Link
                                    to="/order/{order._id}"
                                    className="text-sm font-semibold text-[#57b957]"
                                >
                                    Order Details
                                </Link>
                            </div>
                        </div>
                    </>
                )}

                {/* CONTENT */}
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-2xl sm:text-3xl font-bold mb-8 text-gray-800">
                        Order Tracking
                    </h1>

                    {/* TIMELINE CARD */}
                    <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 md:p-10 border border-green-200">
                        <div className="relative">
                            {/* LINE */}
                            <div className="absolute left-5 top-0 h-full w-0.5 bg-gray-200" />

                            {/* STEPS */}
                            <div className="space-y-8 sm:space-y-10">
                                {steps.map((step) => {
                                    const active = timeline?.[step.key]?.status;

                                    return (
                                        <div key={step.key} className="flex gap-4 sm:gap-6 relative">
                                            <div
                                                className={`z-10 w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full text-white text-sm sm:text-lg
                        ${active ? "bg-[#57b957]" : "bg-gray-300"}`}
                                            >
                                                {step.icon}
                                            </div>

                                            <div className="flex-1">
                                                <p
                                                    className={`font-semibold text-base sm:text-lg ${active ? "text-[#57b957]" : "text-gray-500"
                                                        }`}
                                                >
                                                    {step.title}
                                                </p>

                                                {timeline?.[step.key]?.date ? (
                                                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                                                        {new Date(
                                                            timeline[step.key].date
                                                        ).toLocaleString("en-GB")}
                                                    </p>
                                                ) : (
                                                    <p className="text-xs sm:text-sm text-gray-400 mt-1">
                                                        Pending
                                                    </p>
                                                )}

                                                {step.key === "delivered" && (
                                                    <p className="text-xs sm:text-sm text-gray-600 mt-2">
                                                        Expected Delivery:{" "}
                                                        <span className="font-semibold">
                                                            {new Date(deliveryDateToShow).toLocaleDateString(
                                                                "en-GB"
                                                            )}
                                                        </span>
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* ADMIN ACTIONS */}
                        {isAdmin && (
                            <div className="mt-8 pt-6 border-t space-y-4">
                                {!timeline.dispatched.status && (
                                    <div className="flex flex-col sm:flex-row sm:items-end gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Select Delivery Date
                                            </label>
                                            <input
                                                type="date"
                                                value={deliveryDate}
                                                onChange={(e) => setDeliveryDate(e.target.value)}
                                                className="border rounded px-3 py-2 w-full max-w-xs"
                                            />
                                        </div>

                                        <button
                                            onClick={() => updateStatus("DISPATCHED")}
                                            className="px-6 py-2 rounded-lg bg-[#57b957] text-white font-semibold w-full sm:w-auto"
                                        >
                                            Mark as Dispatched
                                        </button>
                                    </div>
                                )}

                                {timeline.dispatched.status &&
                                    !timeline.delivered.status && (
                                        <button
                                            onClick={() => updateStatus("DELIVERED")}
                                            className="px-6 py-2 rounded-lg bg-[#57b957] text-white font-semibold w-full sm:w-auto"
                                        >
                                            Mark as Delivered
                                        </button>
                                    )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {!isAdmin && <Footer />}
        </>
    );
};

export default OrderDetails;