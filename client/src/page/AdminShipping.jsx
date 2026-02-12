import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import statesData from "../data/indiaStates.json";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MdArrowRightAlt, MdDelete } from "react-icons/md";
import { FaSearch } from "react-icons/fa";
import Sidebar from "../components/Sidebar";

const BRAND = "#57b957";

// Delete Confirmation Modal
const ConfirmDeleteModal = ({ open, shippingName, onCancel, onConfirm }) => {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={onCancel}
            />
            <motion.div
                initial={{ scale: 0.96, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="relative bg-white rounded-2xl shadow-xl w-[90%] max-w-md p-6 z-10"
            >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Remove Shipping</h3>
                <p className="text-gray-600 mb-6">
                    Are you sure you want to remove{" "}
                    <span className="font-semibold" style={{ color: BRAND }}>
                        {shippingName}
                    </span>{" "}
                    from shipping list?
                </p>
                <div className="flex gap-3 justify-end flex-wrap">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 rounded-lg text-white cursor-pointer"
                        style={{ background: BRAND }}
                    >
                        Yes, remove
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

const AdminShipping = () => {
    const [activePage, setActivePage] = useState("shipping");

    const [stateName, setStateName] = useState("");
    const [district, setDistrict] = useState("");
    const [halfKg, setHalfKg] = useState("");
    const [oneKg, setOneKg] = useState("");
    const [list, setList] = useState([]);
    const [search, setSearch] = useState("");

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmId, setConfirmId] = useState(null);
    const [confirmName, setConfirmName] = useState("");

    // Fetch shipping data
    const fetchShipping = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_APP_BASE_URL}/api/shipping`);
            setList(res.data);
        } catch {
            toast.error("Failed to load shipping data");
        }
    };

    useEffect(() => {
        fetchShipping();
    }, []);

    // Submit new shipping
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stateName || !halfKg || !oneKg) {
            toast.error("Please fill all required fields");
            return;
        }

        try {
            await axios.post(`${import.meta.env.VITE_APP_BASE_URL}/api/shipping`, {
                state: stateName,
                district,
                halfKg,
                oneKg,
            });
            toast.success("Shipping saved successfully");
            setStateName("");
            setDistrict("");
            setHalfKg("");
            setOneKg("");
            fetchShipping();
        } catch {
            toast.error("Error saving shipping");
        }
    };

    // Delete confirmation
    const askDelete = (id, name) => {
        setConfirmId(id);
        setConfirmName(name);
        setConfirmOpen(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await axios.delete(`${import.meta.env.VITE_APP_BASE_URL}/api/shipping/${confirmId}`);
            toast.success(`${confirmName} deleted`);
            setConfirmOpen(false);
            setConfirmId(null);
            setConfirmName("");
            fetchShipping();
        } catch {
            toast.error("Failed to delete");
        }
    };

    const handleCancelDelete = () => {
        toast.info("Deletion cancelled");
        setConfirmOpen(false);
        setConfirmId(null);
        setConfirmName("");
    };

    const handleLogout = async () => {
        try {
            await axios.post(`${import.meta.env.VITE_APP_BASE_URL}/api/auth/logout`, {}, { withCredentials: true });
            localStorage.removeItem("token");
            toast.success("Logged out");
            window.location.href = "/login";
        } catch {
            toast.error("Logout failed");
        }
    };

    const states = Object.keys(statesData);
    const districts = stateName ? statesData[stateName] : [];

    const filteredList = list.filter(
        (item) =>
            item.state.toLowerCase().includes(search.toLowerCase()) ||
            (item.district && item.district.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
            {/* Sidebar */}
            <Sidebar activePage={activePage} setActivePage={setActivePage} handleLogout={handleLogout} />

            {/* Main content */}
            <main className="flex-1 md:ml-64 p-4 sm:p-6 lg:p-8 overflow-x-auto">
                <ConfirmDeleteModal
                    open={confirmOpen}
                    shippingName={confirmName}
                    onCancel={handleCancelDelete}
                    onConfirm={handleConfirmDelete}
                />

                {/* HEADER */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                        Shipping <span className="text-[#57b957]">Amount</span>
                    </h1>
                </div>

                {/* BREADCRUMB */}
                <div className="mb-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full shadow-sm flex-wrap">
                        <Link
                            to="/admin"
                            className="text-sm font-medium text-gray-600 hover:text-[#57b957] transition"
                        >
                            Home
                        </Link>
                        <MdArrowRightAlt className="text-gray-400 text-lg" />
                        <Link
                            to="/admin/shipping"
                            className="text-sm font-semibold text-[#57b957]"
                        >
                            Shipping Amount
                        </Link>
                    </div>
                </div>

                {/* ADD SHIPPING FORM */}
                <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6"
                >
                    <select
                        value={stateName}
                        onChange={(e) => {
                            setStateName(e.target.value);
                            setDistrict("");
                        }}
                        required
                        className="border px-3 py-2 rounded w-full"
                    >
                        <option value="">Select State</option>
                        {states.map((s) => (
                            <option key={s} value={s}>
                                {s}
                            </option>
                        ))}
                    </select>

                    {/* <select
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        className="border px-3 py-2 rounded w-full"
                    >
                        <option value="">Select District (optional)</option>
                        {districts.map((d) => (
                            <option key={d} value={d}>
                                {d}
                            </option>
                        ))}
                    </select> */}

                    <input
                        type="number"
                        placeholder="500g price"
                        value={halfKg}
                        onChange={(e) => setHalfKg(e.target.value)}
                        required
                        className="border px-3 py-2 rounded w-full"
                    />

                    <input
                        type="number"
                        placeholder="1kg price"
                        value={oneKg}
                        onChange={(e) => setOneKg(e.target.value)}
                        required
                        className="border px-3 py-2 rounded w-full"
                    />

                    <button
                        type="submit"
                        className="bg-green-600 text-white rounded px-4 py-2 hover:bg-green-700 transition w-full md:w-auto"
                    >
                        Save
                    </button>
                </form>

                {/* SEARCH BAR */}
                <div className="mb-4 flex justify-end">
                    <div className="flex items-center gap-2 w-full max-w-xs px-3 py-2 border rounded-full shadow-sm">
                        <FaSearch className="text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by state or district..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full outline-none text-sm text-gray-700 placeholder-gray-400 bg-transparent"
                        />
                    </div>
                </div>

                {/* SHIPPING LIST TABLE */}
                <div className="bg-white shadow rounded overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-green-100">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                                    State
                                </th>
                                {/* <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                                    District
                                </th> */}
                                <th className="px-4 py-3 text-center text-sm font-medium text-gray-700 uppercase tracking-wider">
                                    500g Price (₹)
                                </th>
                                <th className="px-4 py-3 text-center text-sm font-medium text-gray-700 uppercase tracking-wider">
                                    1kg Price (₹)
                                </th>
                                <th className="px-4 py-3 text-center text-sm font-medium text-gray-700 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredList.map((item, idx) => (
                                <tr
                                    key={item._id}
                                    className={idx % 2 === 0 ? "bg-gray-50 hover:bg-gray-100" : "hover:bg-gray-100"}
                                >
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">
                                        {item.state}
                                    </td>
                                    {/* <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                                        {item.district || "-"}
                                    </td> */}
                                    <td className="px-4 py-3 text-center whitespace-nowrap text-sm text-gray-700">
                                        ₹{item.halfKg}
                                    </td>
                                    <td className="px-4 py-3 text-center whitespace-nowrap text-sm text-gray-700">
                                        ₹{item.oneKg}
                                    </td>
                                    <td className="px-4 py-3 text-center whitespace-nowrap text-sm">
                                        <button
                                            onClick={() =>
                                                askDelete(
                                                    item._id,
                                                    `${item.state}${item.district ? ` - ${item.district}` : ""}`
                                                )
                                            }
                                            className="text-red-600 hover:text-red-800 font-medium cursor-pointer"
                                        >
                                            <MdDelete size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredList.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-4 py-3 text-center text-gray-500">
                                        No shipping found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
};

export default AdminShipping;