import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { MdArrowRightAlt } from "react-icons/md";

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activePage, setActivePage] = useState("orders");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAllOrders = async () => {
            try {
                const res = await axios.get(
                    `${import.meta.env.VITE_APP_BASE_URL}/api/orders/admin/all`,
                    { withCredentials: true }
                );
                setOrders(res.data || []);
            } catch {
                navigate("/login");
            } finally {
                setLoading(false);
            }
        };
        fetchAllOrders();
    }, []);

    const handleLogout = async () => {
        try {
            await axios.post(
                `${import.meta.env.VITE_APP_BASE_URL}/api/auth/logout`,
                {},
                { withCredentials: true }
            );
            navigate("/login");
        }
        catch (err) {
            console.error("Logout failed:", err);
        }
    };

    const getCurrentStatus = (order) => {
        if (order.currentStatus) return order.currentStatus;
        if (order.statusTimeline?.delivered?.status) return "DELIVERED";
        if (order.statusTimeline?.dispatched?.status) return "DISPATCHED";
        return "PREPARING";
    };

    const statusColor = {
        PREPARING: "bg-yellow-100 text-yellow-700",
        DISPATCHED: "bg-blue-100 text-blue-700",
        DELIVERED: "bg-green-100 text-green-700",
    };

    const fallbackImage = "https://via.placeholder.com/150?text=No+Image";

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <Sidebar activePage={activePage} setActivePage={setActivePage} handleLogout={handleLogout} />

            {/* Main content */}
            <main className="flex-1 md:ml-64 p-4 sm:p-6 lg:p-8">
                {/* HEADER */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Customer <span className="text-[#57b957]">Orders</span>
                    </h1>
                </div>

                {/* BREADCRUMB */}
                <div className="mb-6">
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
                            className="text-sm font-semibold text-[#57b957]"
                        >
                            Orders
                        </Link>
                    </div>
                </div>

                <div className="space-y-6 sm:space-y-8">
                    {loading && <p className="text-center text-gray-500">Loading orders...</p>}
                    {!loading && orders.length === 0 && (
                        <p className="text-center text-gray-500">No orders found.</p>
                    )}

                    {orders.map((order) => {
                        const currentStatus = getCurrentStatus(order);
                        const address = order.address || {};

                        return (
                            <div key={order._id} className="relative">
                                {/* STATUS BADGE */}
                                <div className="absolute -top-3 right-3 sm:right-4 z-10">
                                    <span
                                        className={`px-3 py-1 text-xs font-semibold rounded-full shadow ${statusColor[currentStatus]}`}
                                    >
                                        {currentStatus}
                                    </span>
                                </div>

                                {/* CARD */}
                                <div
                                    className="bg-white rounded-xl shadow border border-[#57b957] p-4 sm:p-5 hover:shadow-lg transition"
                                >
                                    {/* CUSTOMER DETAILS */}
                                    <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                        <div>
                                            <h3 className="font-semibold text-gray-800 mb-1">
                                                Customer Details
                                            </h3>
                                            <p className="text-sm text-gray-700 break-words">
                                                <strong>Name:</strong> {order.user?.name ?? "-"}
                                            </p>
                                            <p className="text-sm text-gray-700 break-words">
                                                <strong>Email:</strong> {order.user?.email ?? "-"}
                                            </p>
                                            <p className="text-sm text-gray-700">
                                                <strong>Phone:</strong> {order.user?.number ?? "-"}
                                            </p>
                                            <p className="text-xs sm:text-sm text-gray-500 mt-1">
                                                Ordered on:{" "}
                                                {order.createdAt
                                                    ? new Date(order.createdAt).toLocaleDateString("en-GB")
                                                    : "-"}
                                            </p>
                                        </div>
                                        <div>
                                            <a href="#"
                                            onClick={() => navigate(`/order/${order._id}`)}
                                            className="p-2 bg-[#57b957] text-white rounded-lg text-sm">Change Status</a>
                                        </div>
                                    </div>

                                    {/* ADDRESS */}
                                    <div className="mb-4 bg-gray-50 p-3 rounded-lg border text-sm">
                                        <h4 className="font-semibold mb-1">Delivery Address</h4>
                                        <p className="text-gray-700 break-words">{address.street ?? "-"}, {address.area ?? "-"}</p>
                                        <p className="text-gray-700 break-words">{address.city ?? "-"}, {address.district ?? "-"}</p>
                                        <p className="text-gray-700">{address.state ?? "-"} - {address.pincode ?? "-"}</p>
                                        {address.landmark && (
                                            <p className="text-gray-500">Landmark: {address.landmark}</p>
                                        )}
                                    </div>

                                    {/* ITEMS */}
                                    <div className="divide-y">
                                        {order.items.map((item, idx) => {
                                            const product = item.product || {};
                                            return (
                                                <div
                                                    key={idx}
                                                    className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 py-3"
                                                >
                                                    <img
                                                        src={
                                                            product.image
                                                                ? `${import.meta.env.VITE_APP_BASE_URL}/uploads/${product.image}`
                                                                : fallbackImage
                                                        }
                                                        alt={product.name ?? "No Name"}
                                                        className="w-12 h-12 sm:w-14 sm:h-14 object-cover rounded border flex-shrink-0"
                                                    />
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-medium text-sm sm:text-base truncate">
                                                            {product.name ?? "Deleted Product"}
                                                        </p>
                                                        <p className="text-xs sm:text-sm text-gray-500">
                                                            Qty: {item.quantity ?? 0}
                                                        </p>
                                                    </div>
                                                    <p className="font-semibold text-sm sm:text-base flex-shrink-0">
                                                        ₹{(item.price ?? 0) * (item.quantity ?? 0)}
                                                    </p>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* FOOTER */}
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-t pt-4 mt-4 gap-2">
                                        <p className="text-sm">
                                            Payment:{" "}
                                            <span className="font-medium">
                                                {order.paymentMethod === "COD"
                                                    ? "Cash on Delivery"
                                                    : "Online Payment"}
                                            </span>
                                        </p>
                                        <p className="font-semibold text-[#57b957] text-sm sm:text-base">
                                            Total: ₹{order.totalAmount ?? 0}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </main>
        </div>
    );
};

export default AdminOrders;