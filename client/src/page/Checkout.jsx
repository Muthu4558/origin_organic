import React, { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaPlus } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import { motion } from "framer-motion";
import indiaStates from "../data/indiaStates.json";

/* ---------- Razorpay Loader ---------- */
const loadRazorpay = () =>
  new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

const emptyAddress = {
  street: "",
  landmark: "",
  city: "",
  district: "",
  state: "",
  pincode: "",
};

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, fetchCart } = useCart();

  const [profile, setProfile] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const [showNewAddress, setShowNewAddress] = useState(false);
  const [newAddress, setNewAddress] = useState(emptyAddress);

  const [editingAddressId, setEditingAddressId] = useState(null);
  const [editAddressForm, setEditAddressForm] = useState(emptyAddress);

  const [loading, setLoading] = useState(false); // <-- Loading state

  useEffect(() => {
    fetchCart();
    axios
      .get(`${import.meta.env.VITE_APP_BASE_URL}/api/auth/profile`, {
        withCredentials: true,
      })
      .then((res) => {
        setProfile(res.data);
        setAddresses(res.data.addresses || []);
      })
      .catch(() => navigate("/login"));
  }, []);

  const total = useMemo(
    () =>
      cartItems.reduce(
        (sum, item) =>
          sum + (item.product.offerPrice ?? item.product.price) * item.quantity,
        0
      ),
    [cartItems]
  );

  const estimatedDeliveryDate = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }, []);

  /* ---------- ADDRESS APIs ---------- */
  const saveNewAddress = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_APP_BASE_URL}/api/auth/address`,
        newAddress,
        { withCredentials: true }
      );
      setAddresses(res.data);
      setSelectedAddress(res.data.at(-1));
      setShowNewAddress(false);
      setNewAddress(emptyAddress);
      toast.success("Address added");
    } catch {
      toast.error("Failed to add address");
    }
  };

  const updateAddress = async () => {
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_APP_BASE_URL}/api/auth/address/${editingAddressId}`,
        editAddressForm,
        { withCredentials: true }
      );
      setAddresses(res.data);
      setEditingAddressId(null);
      setEditAddressForm(emptyAddress);
      toast.success("Address updated");
    } catch {
      toast.error("Failed to update address");
    }
  };

  /* ---------- PAYMENT ---------- */
  const placeOrder = async () => {
    if (!selectedAddress) return toast.error("Select address");
    if (!cartItems.length) return toast.error("Cart empty");

    try {
      setLoading(true); // Start loading

      const loaded = await loadRazorpay();
      if (!loaded) {
        setLoading(false);
        return toast.error("Razorpay SDK failed");
      }

      const orderRes = await axios.post(
        `${import.meta.env.VITE_APP_BASE_URL}/api/payment/create-order`,
        { amount: total },
        { withCredentials: true }
      );

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderRes.data.amount,
        currency: "INR",
        name: "Origin Organic",
        order_id: orderRes.data.id,
        handler: async (response) => {
          try {
            await axios.post(
              `${import.meta.env.VITE_APP_BASE_URL}/api/orders/place`,
              {
                address: selectedAddress,
                paymentMethod: "ONLINE",
                paymentId: response.razorpay_payment_id,
              },
              { withCredentials: true }
            );
            toast.success("Payment successful");
            navigate("/thankyou");
          } catch {
            toast.error("Order placement failed");
          } finally {
            setLoading(false); // Stop loading after payment
          }
        },
        prefill: {
          name: profile?.name,
          email: profile?.email,
          contact: profile?.number,
        },
        theme: { color: "#57b957" },
      };

      new window.Razorpay(options).open();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-30 pb-12 px-4">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-6">
          {/* LEFT */}
          <div className="lg:col-span-2 space-y-6">
            {/* PROFILE */}
            {profile && (
              <div className="bg-white rounded-xl shadow p-5 border border-[#57b957]">
                <h2 className="font-semibold mb-2">Customer Details</h2>
                <p>
                  {profile.name} | {profile.email} | {profile.number}
                </p>
              </div>
            )}

            {/* ADDRESS LIST */}
            <div className="bg-white rounded-xl shadow p-5 border border-[#57b957]">
              <div className="flex justify-between mb-4">
                <h2 className="font-semibold text-lg">Delivery Address</h2>
                <button
                  onClick={() => {
                    setShowNewAddress(true);
                    setEditingAddressId(null);
                  }}
                  className="flex items-center gap-2 text-[#57b957] cursor-pointer"
                >
                  <FaPlus /> Add Address
                </button>
              </div>

              <div className="space-y-3">
                {addresses.map((a) => (
                  <label
                    key={a._id}
                    className={`flex gap-3 p-4 border rounded-lg cursor-pointer ${
                      selectedAddress?._id === a._id
                        ? "bg-green-50 border-[#57b957]"
                        : "hover:border-[#57b957]"
                    }`}
                    onClick={() => setSelectedAddress(a)}
                  >
                    <input type="radio" checked={selectedAddress?._id === a._id} readOnly />
                    <div className="flex-1">
                      <p>
                        {a.street}, {a.city}
                      </p>
                      <p className="text-sm text-gray-600">
                        {a.district}, {a.state} - {a.pincode}
                      </p>
                    </div>
                    <FaEdit
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingAddressId(a._id);
                        setEditAddressForm(a);
                      }}
                    />
                  </label>
                ))}
              </div>

              {/* ADD NEW ADDRESS */}
              {showNewAddress && (
                <div className="mt-6 bg-gray-50 border rounded-xl p-5">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-gray-800">Add New Address</h3>
                    <button
                      onClick={() => {
                        setShowNewAddress(false);
                        setNewAddress(emptyAddress);
                      }}
                      className="text-gray-500 hover:text-red-500 cursor-pointer"
                    >
                      <MdClose size={22} />
                    </button>
                  </div>

                  {/* Address Form */}
                  <div className="grid sm:grid-cols-4 gap-4">
                    <input
                      placeholder="Street"
                      value={newAddress.street}
                      onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                      className="border rounded-lg px-3 py-2 sm:col-span-2"
                    />
                    <input
                      placeholder="Landmark"
                      value={newAddress.landmark}
                      onChange={(e) => setNewAddress({ ...newAddress, landmark: e.target.value })}
                      className="border rounded-lg px-3 py-2 sm:col-span-2"
                    />
                  </div>

                  <div className="grid sm:grid-cols-4 gap-4 mt-2">
                    <input
                      placeholder="City"
                      value={newAddress.city}
                      onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                      className="border rounded-lg px-3 py-2 sm:col-span-2"
                    />
                    <select
                      value={newAddress.state}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, state: e.target.value, district: "" })
                      }
                      className="border rounded-lg px-3 py-2 sm:col-span-2"
                    >
                      <option value="">Select State</option>
                      {Object.keys(indiaStates).map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid sm:grid-cols-4 gap-4 mt-2">
                    <select
                      value={newAddress.district}
                      onChange={(e) => setNewAddress({ ...newAddress, district: e.target.value })}
                      disabled={!newAddress.state}
                      className="border rounded-lg px-3 py-2 sm:col-span-2"
                    >
                      <option value="">Select District</option>
                      {newAddress.state &&
                        indiaStates[newAddress.state]?.map((district) => (
                          <option key={district} value={district}>
                            {district}
                          </option>
                        ))}
                    </select>

                    <input
                      placeholder="Pincode"
                      value={newAddress.pincode}
                      onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                      className="border rounded-lg px-3 py-2 sm:col-span-2"
                    />
                  </div>

                  <button
                    onClick={saveNewAddress}
                    className="mt-5 w-full bg-[#57b957] text-white py-2 rounded-lg font-semibold cursor-pointer"
                  >
                    Save Address
                  </button>
                </div>
              )}

              {/* EDIT ADDRESS */}
              {editingAddressId && (
                <div className="mt-6 bg-gray-50 border rounded-xl p-5">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-gray-800">Edit Address</h3>
                    <button
                      onClick={() => {
                        setEditingAddressId(null);
                        setEditAddressForm(emptyAddress);
                      }}
                      className="text-gray-500 hover:text-red-500"
                    >
                      <MdClose size={22} />
                    </button>
                  </div>

                  {/* Edit Form */}
                  <div className="grid sm:grid-cols-4 gap-4">
                    <input
                      placeholder="Street"
                      value={editAddressForm.street}
                      onChange={(e) =>
                        setEditAddressForm({ ...editAddressForm, street: e.target.value })
                      }
                      className="border rounded-lg px-3 py-2 sm:col-span-2"
                    />
                    <input
                      placeholder="Landmark"
                      value={editAddressForm.landmark}
                      onChange={(e) =>
                        setEditAddressForm({ ...editAddressForm, landmark: e.target.value })
                      }
                      className="border rounded-lg px-3 py-2 sm:col-span-2"
                    />
                  </div>

                  <div className="grid sm:grid-cols-4 gap-4 mt-2">
                    <input
                      placeholder="City"
                      value={editAddressForm.city}
                      onChange={(e) =>
                        setEditAddressForm({ ...editAddressForm, city: e.target.value })
                      }
                      className="border rounded-lg px-3 py-2 sm:col-span-2"
                    />
                    <select
                      value={editAddressForm.state}
                      onChange={(e) =>
                        setEditAddressForm({ ...editAddressForm, state: e.target.value, district: "" })
                      }
                      className="border rounded-lg px-3 py-2 sm:col-span-2"
                    >
                      <option value="">Select State</option>
                      {Object.keys(indiaStates).map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid sm:grid-cols-4 gap-4 mt-2">
                    <select
                      value={editAddressForm.district}
                      onChange={(e) =>
                        setEditAddressForm({ ...editAddressForm, district: e.target.value })
                      }
                      disabled={!editAddressForm.state}
                      className="border rounded-lg px-3 py-2 sm:col-span-2"
                    >
                      <option value="">Select District</option>
                      {editAddressForm.state &&
                        indiaStates[editAddressForm.state]?.map((district) => (
                          <option key={district} value={district}>
                            {district}
                          </option>
                        ))}
                    </select>

                    <input
                      placeholder="Pincode"
                      value={editAddressForm.pincode}
                      onChange={(e) =>
                        setEditAddressForm({ ...editAddressForm, pincode: e.target.value })
                      }
                      className="border rounded-lg px-3 py-2 sm:col-span-2"
                    />
                  </div>

                  <button
                    onClick={updateAddress}
                    className="mt-5 w-full bg-[#57b957] text-white py-2 rounded-lg font-semibold"
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT */}
          <div className="bg-white rounded-xl shadow p-5 h-fit border border-[#57b957]">
            <h2 className="font-semibold mb-4">Order Summary</h2>
            {cartItems.map((item) => (
              <div key={item.product._id} className="flex justify-between text-sm">
                <span>
                  {item.product.name} × {item.quantity}
                </span>
                <span>₹{(item.product.offerPrice ?? item.product.price) * item.quantity}</span>
              </div>
            ))}

            <div className="border-t mt-4 pt-4 flex justify-between font-semibold">
              <span>Total</span>
              <span className="text-[#57b957]">₹{total}</span>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-600 mt-4">
              <span>Estimated delivery</span>
              <span className="font-medium text-gray-800">{estimatedDeliveryDate}</span>
            </div>

            <button
              onClick={placeOrder}
              disabled={loading}
              className={`mt-5 w-full py-3 rounded-lg font-semibold text-white flex justify-center items-center gap-2 ${
                loading ? "bg-green-400 cursor-not-allowed" : "bg-[#57b957] cursor-pointer"
              }`}
            >
              {loading && (
                <motion.div
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
                />
              )}
              {loading ? "Processing..." : "Pay & Place Order"}
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Checkout;
