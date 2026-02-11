import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Loader from "../components/Loader";
import { FaBoxOpen, FaTruck, FaCheckCircle } from "react-icons/fa";
import { MdArrowRightAlt, MdDashboard, MdRateReview } from "react-icons/md";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Sidebar from "../components/Sidebar";

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState("orders");

  const [order, setOrder] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_APP_BASE_URL}/api/orders/${id}`,
        { withCredentials: true }
      );
      setOrder(res.data);
    } catch (err) {
      toast.error("❌ Failed to load order details");
    } finally {
      setLoading(false);
    }
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
    try {
      const toastId = toast.loading("Updating order status...");

      await axios.put(
        `${import.meta.env.VITE_APP_BASE_URL}/api/orders/admin/update-status/${id}`,
        {
          status,
          expectedDeliveryDate: deliveryDate || null,
        },
        { withCredentials: true }
      );

      toast.update(toastId, {
        render:
          status === "DISPATCHED"
            ? "🚚 Order marked as Dispatched!"
            : "✅ Order marked as Delivered!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });

      fetchOrder();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "❌ Failed to update order status"
      );
    }
  };

  useEffect(() => {
    fetchOrder();
    checkAdmin();
  }, []);

  if (loading) return <Loader />;

  if (!order) return null;

  const timeline = order.statusTimeline;

  const steps = [
    { key: "preparing", title: "Preparing for Dispatch", icon: <FaBoxOpen /> },
    { key: "dispatched", title: "Order Dispatched", icon: <FaTruck /> },
    { key: "delivered", title: "Order Delivered", icon: <FaCheckCircle /> },
  ];

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
  }

  const deliveryDateToShow =
    order.expectedDeliveryDate || order.estimatedDeliveryDate;

  return (
    <>
      {!isAdmin && <Navbar />}

      <div className="min-h-screen px-4 sm:px-72 pt-28 pb-12">
        {isAdmin && <Sidebar activePage={activePage} setActivePage={setActivePage} handleLogout={handleLogout} />}
        {/* ADMIN HEADER */}
        {isAdmin && (
          <div className="max-w-5xl mx-auto mb-6">
            <div className="text-3xl font-bold flex items-center gap-3 mb-4 text-gray-800">
              Order <span className="text-[#57b957]">Tracking</span>
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full shadow-sm">
              <Link to="/admin" className="text-sm text-gray-600 hover:text-[#57b957]">
                Home
              </Link>
              <MdArrowRightAlt />
              <Link to="/admin/orders" className="text-sm font-semibold text-gray-600 hover:text-[#57b957]">
                Orders
              </Link>
              <MdArrowRightAlt />
              <span className="text-sm font-semibold text-[#57b957]">
                Order Tracking
              </span>
            </div>
          </div>
        )}

        {/* CONTENT */}
        <div className="max-w-5xl mx-auto">
          {!isAdmin && (
            <h1 className="text-3xl sm:text-4xl font-bold mb-10 text-gray-800 text-center">
              Order <span className="text-[#57b957]">Tracking</span>
            </h1>)}

          <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-10 border border-green-200 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-72 h-72 bg-gradient-to-r from-[#57b957]/30 to-[#57b957]/10 rounded-full blur-3xl" />

            <div className="relative">
              <div className="absolute left-5 top-0 h-full w-1 bg-gray-200 rounded" />

              <div className="space-y-12 sm:space-y-14">
                {steps.map((step, idx) => {
                  const active = timeline?.[step.key]?.status;
                  return (
                    <motion.div
                      key={step.key}
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.2 }}
                      className="flex gap-6 sm:gap-8 relative"
                    >
                      <div
                        className={`z-10 w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full text-white text-xl sm:text-2xl shadow-md ${active ? "bg-[#57b957]" : "bg-gray-300"
                          }`}
                      >
                        {step.icon}
                      </div>

                      <div className="flex-1">
                        <p
                          className={`font-semibold text-lg sm:text-xl mb-1 ${active ? "text-[#57b957]" : "text-gray-500"
                            }`}
                        >
                          {step.title}
                        </p>

                        {timeline?.[step.key]?.date ? (
                          <p className="text-sm sm:text-base text-gray-500">
                            {new Date(
                              timeline[step.key].date
                            ).toLocaleString("en-GB")}
                          </p>
                        ) : (
                          <p className="text-sm sm:text-base text-gray-400">
                            Pending
                          </p>
                        )}

                        {step.key === "delivered" && (
                          <p className="text-sm sm:text-base text-gray-600 mt-2">
                            Expected Delivery:{" "}
                            <span className="font-semibold text-gray-800">
                              {new Date(
                                deliveryDateToShow
                              ).toLocaleDateString("en-GB")}
                            </span>
                          </p>
                        )}

                        {step.key === "delivered" &&
                          timeline.delivered.status &&
                          !isAdmin && (
                            <div className="mt-4 grid sm:grid-cols-2 gap-4">
                              {order.items.map((item) => (
                                <Link
                                  key={item.product._id}
                                  to={`/products/${item.product._id}?review=true`}
                                  className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition bg-green-50"
                                >
                                  <MdRateReview className="text-[#57b957] text-lg" />
                                  <span className="font-semibold text-gray-700">
                                    Review {item.product.name}
                                  </span>
                                </Link>
                              ))}
                            </div>
                          )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* ADMIN ACTIONS */}
            {isAdmin && (
              <div className="mt-10 pt-6 border-t border-gray-200 space-y-6">
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
                        className="border rounded-lg px-4 py-2 w-full max-w-xs shadow-sm focus:ring-2 focus:ring-green-300"
                      />
                    </div>

                    <button
                      onClick={() => updateStatus("DISPATCHED")}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#57b957] to-green-400 text-white font-semibold shadow hover:shadow-lg transition w-full sm:w-auto"
                    >
                      Mark as Dispatched
                    </button>
                  </div>
                )}

                {timeline.dispatched.status &&
                  !timeline.delivered.status && (
                    <button
                      onClick={() => updateStatus("DELIVERED")}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#57b957] to-green-400 text-white font-semibold shadow hover:shadow-lg transition w-full sm:w-auto"
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