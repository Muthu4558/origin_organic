import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import { toast } from "react-toastify";
import { FiLogOut } from "react-icons/fi";

const AdminDashboard = () => {
    const [activePage, setActivePage] = useState("dashboard");
    const [stats, setStats] = useState({});
    const [orders, setOrders] = useState([]);
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    const BASE = import.meta.env.VITE_APP_BASE_URL;

    const fetchDashboard = async () => {
        try {
            const query =
                fromDate && toDate ? `?from=${fromDate}&to=${toDate}` : "";

            const statsRes = await axios.get(
                `${BASE}/api/admin/dashboard-stats${query}`
            );
            const ordersRes = await axios.get(
                `${BASE}/api/admin/orders-list${query}`
            );

            setStats(statsRes.data);
            setOrders(ordersRes.data);
        } catch {
            toast.error("Failed to load dashboard");
        }
    };

    useEffect(() => {
        fetchDashboard();
    }, []);

    const handleLogout = async () => {
        try {
            await axios.post(
                `${BASE}/api/auth/logout`,
                {},
                { withCredentials: true }
            );
            localStorage.removeItem("token");
            window.location.href = "/login";
        } catch {
            toast.error("Logout failed");
        }
    };

    const handleFilter = () => {
        if (!fromDate || !toDate) {
            toast.error("Select both dates");
            return;
        }
        fetchDashboard();
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar
                activePage={activePage}
                setActivePage={setActivePage}
                handleLogout={handleLogout}
            />

            <main className="flex-1 md:ml-64 p-4 md:p-8">

                {/* HEADER */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
                    <h1 className="text-2xl md:text-3xl font-bold">
                        Admin Dashboard
                    </h1>

                    {/* <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 transition"
                    >
                        <FiLogOut />
                        Logout
                    </button> */}
                </div>

                {/* FILTER */}
                <div className="bg-white p-5 rounded-xl shadow-md mb-8 flex flex-col md:flex-row gap-4 md:items-end">
                    <div className="flex flex-col w-full md:w-auto">
                        <label className="text-sm font-medium">From Date</label>
                        <input
                            type="date"
                            className="border px-3 py-2 rounded-lg"
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col w-full md:w-auto">
                        <label className="text-sm font-medium">To Date</label>
                        <input
                            type="date"
                            className="border px-3 py-2 rounded-lg"
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                        />
                    </div>

                    <button
                        onClick={handleFilter}
                        className="bg-green-600 text-white px-6 py-2 rounded-lg shadow hover:bg-green-700 transition"
                    >
                        Apply Filter
                    </button>
                </div>

                {/* STATS CARDS */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-5 mb-10">
                    <StatCard title="Total Orders" value={stats.totalOrders || 0} />
                    <StatCard title="Total Revenue" value={`₹${stats.totalRevenue || 0}`} />
                    <StatCard title="Preparing" value={stats.preparing || 0} />
                    <StatCard title="Dispatched" value={stats.dispatched || 0} />
                    <StatCard title="Delivered" value={stats.delivered || 0} />
                </div>

                {/* ORDERS TABLE */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-5 py-4 text-left font-semibold">Customer</th>
                                    <th className="px-5 py-4 text-left font-semibold">Email</th>
                                    <th className="px-5 py-4 text-left font-semibold">Transaction</th>
                                    {/* <th className="px-5 py-4 text-left font-semibold">Products</th> */}
                                    <th className="px-5 py-4 text-left font-semibold">Amount</th>
                                    <th className="px-5 py-4 text-left font-semibold">Status</th>
                                </tr>
                            </thead>

                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order._id} className="border-t hover:bg-gray-50 transition">
                                        <td className="px-5 py-4 font-medium">
                                            {order.user?.name || "Guest"}
                                        </td>
                                        <td className="px-5 py-4">
                                            {order.user?.email}
                                        </td>
                                        <td className="px-5 py-4">
                                            {order.paymentId || "-"}
                                        </td>
                                        {/* <td className="px-5 py-4">
                                            {order.items.map((item, i) => (
                                                <div key={i}>
                                                    {item.product?.name} × {item.quantity}
                                                </div>
                                            ))}
                                        </td> */}
                                        <td className="px-5 py-4 font-semibold">
                                            ₹{order.totalAmount}
                                        </td>
                                        <td className="px-5 py-4">
                                            <StatusBadge status={order.currentStatus} />
                                        </td>
                                    </tr>
                                ))}

                                {orders.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="text-center py-8 text-gray-500">
                                            No orders found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </main>
        </div>
    );
};

const StatCard = ({ title, value }) => (
    <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-5 rounded-xl shadow-md">
        <h3 className="text-sm opacity-90">{title}</h3>
        <p className="text-2xl md:text-3xl font-bold mt-2">{value}</p>
    </div>
);

const StatusBadge = ({ status }) => {
    const styles = {
        PREPARING: "bg-yellow-100 text-yellow-700",
        DISPATCHED: "bg-blue-100 text-blue-700",
        DELIVERED: "bg-green-100 text-green-700",
    };

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status] || "bg-gray-100 text-gray-700"}`}>
            {status}
        </span>
    );
};

export default AdminDashboard;
