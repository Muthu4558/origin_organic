import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdDashboard, MdMenu, MdClose } from "react-icons/md";
import { FaShippingFast, FaFirstOrder, FaSignOutAlt } from "react-icons/fa";
import Logo from "../assets/logo.png";

const BRAND = "#57b957";

const Sidebar = ({ activePage, setActivePage, handleLogout }) => {
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);

    const menuItems = [
        { label: "Home", icon: <MdDashboard />, page: "home", path: "/admin" },
        { label: "Shipping Amount", icon: <FaShippingFast />, page: "shipping", path: "/admin/shipping" },
        { label: "Customer Orders", icon: <FaFirstOrder />, page: "orders", path: "/admin/orders" },
        // Add more pages here
    ];

    const handleNavigate = (item) => {
        setActivePage(item.page);
        navigate(item.path);
        setMobileOpen(false);
    };

    return (
        <>
            {/* Mobile toggle button */}
            <button
                className="fixed top-4 right-4 z-50 md:hidden p-2 bg-white rounded-md shadow-md"
                onClick={() => setMobileOpen(!mobileOpen)}
            >
                {mobileOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
            </button>

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 h-full w-64 bg-white shadow-md flex flex-col justify-between z-40 transform transition-transform duration-300
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
            >
                {/* Top: Logo & Menu */}
                <div className="flex flex-col h-full">
                    <div className="flex items-center px-12 py-1">
                        <img width={140} src={Logo} alt="logo" />
                    </div>
                    <div className="h-16 flex items-center justify-center font-bold text-xl text-[#57b957] border-b border-gray-200">
                        Admin Panel
                    </div>

                    {/* Menu items */}
                    <nav className="flex-1 px-4 py-6 space-y-2 overflow-auto">
                        {menuItems.map((item) => (
                            <button
                                key={item.page}
                                onClick={() => handleNavigate(item)}
                                className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg text-gray-700 hover:bg-[#57b957] hover:text-white transition cursor-pointer
                  ${activePage === item.page ? "bg-[#57b957] text-white" : ""}`}
                            >
                                {item.icon} {item.label}
                            </button>
                        ))}
                    </nav>

                    {/* Logout at bottom */}
                    <div className="px-4 py-6 border-t border-gray-200">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2 px-4 py-2 rounded-lg text-red-600 border border-red-600 hover:bg-red-600 hover:text-white transition cursor-pointer"
                        >
                            <FaSignOutAlt /> Logout
                        </button>
                    </div>
                </div>
            </aside>

            {/* Backdrop for mobile */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 bg-black opacity-20 z-30 md:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}
        </>
    );
};

export default Sidebar;
