import React, { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Loader from "../components/Loader";
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

  const [loading, setLoading] = useState(false);

  /* ---------- INIT ---------- */
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
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toLocaleDateString("en-IN", {
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
      setLoading(true);

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
            setLoading(false);
          }
        },
        prefill: {
          name: profile?.name,
          email: profile?.email,
          contact: profile?.number,
        },
        theme: { color: "#57b957" },
        modal: { ondismiss: () => setLoading(false) },
      };

      new window.Razorpay(options).open();
    } catch {
      toast.error("Something went wrong");
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      {loading && <Loader />}

      <div className="min-h-screen pt-28 pb-12 px-3 sm:px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT */}
          <div className="lg:col-span-2 space-y-6">

            {profile && (
              <div className="bg-white rounded-xl shadow p-4 sm:p-5 border border-[#57b957]">
                <h2 className="font-semibold mb-2">Customer Details</h2>
                <p className="break-words text-sm sm:text-base">
                  {profile.name} | {profile.email} | {profile.number}
                </p>
              </div>
            )}

            {/* ADDRESS */}
            <div className="bg-white rounded-xl shadow p-4 sm:p-5 border border-[#57b957]">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold text-lg">Delivery Address</h2>
                <button
                  onClick={() => {
                    setShowNewAddress(true);
                    setEditingAddressId(null);
                  }}
                  className="flex items-center gap-2 text-[#57b957]"
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
                    <input
                      type="radio"
                      checked={selectedAddress?._id === a._id}
                      readOnly
                      className="mt-1"
                    />
                    <div className="flex-1 text-sm">
                      <p className="font-medium">
                        {a.street}, {a.city}
                      </p>
                      <p className="text-gray-600">
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

              {/* ADD / EDIT FORM */}
              {(showNewAddress || editingAddressId) && (
                <div className="mt-6 bg-gray-50 border rounded-xl p-4 sm:p-5">
                  <div className="flex justify-between mb-4">
                    <h3 className="font-semibold">
                      {showNewAddress ? "Add New Address" : "Edit Address"}
                    </h3>
                    <button
                      onClick={() => {
                        setShowNewAddress(false);
                        setEditingAddressId(null);
                      }}
                    >
                      <MdClose size={22} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      placeholder="Street"
                      value={(showNewAddress ? newAddress : editAddressForm).street}
                      onChange={(e) =>
                        showNewAddress
                          ? setNewAddress({ ...newAddress, street: e.target.value })
                          : setEditAddressForm({ ...editAddressForm, street: e.target.value })
                      }
                      className="border rounded-lg px-3 py-2"
                    />
                    <input
                      placeholder="Landmark"
                      value={(showNewAddress ? newAddress : editAddressForm).landmark}
                      onChange={(e) =>
                        showNewAddress
                          ? setNewAddress({ ...newAddress, landmark: e.target.value })
                          : setEditAddressForm({ ...editAddressForm, landmark: e.target.value })
                      }
                      className="border rounded-lg px-3 py-2"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                    <input
                      placeholder="City"
                      value={(showNewAddress ? newAddress : editAddressForm).city}
                      onChange={(e) =>
                        showNewAddress
                          ? setNewAddress({ ...newAddress, city: e.target.value })
                          : setEditAddressForm({ ...editAddressForm, city: e.target.value })
                      }
                      className="border rounded-lg px-3 py-2"
                    />
                    <input
                      placeholder="Pincode"
                      value={(showNewAddress ? newAddress : editAddressForm).pincode}
                      onChange={(e) =>
                        showNewAddress
                          ? setNewAddress({ ...newAddress, pincode: e.target.value })
                          : setEditAddressForm({ ...editAddressForm, pincode: e.target.value })
                      }
                      className="border rounded-lg px-3 py-2"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                    <select
                      value={(showNewAddress ? newAddress : editAddressForm).state}
                      onChange={(e) =>
                        showNewAddress
                          ? setNewAddress({ ...newAddress, state: e.target.value, district: "" })
                          : setEditAddressForm({
                              ...editAddressForm,
                              state: e.target.value,
                              district: "",
                            })
                      }
                      className="border rounded-lg px-3 py-2"
                    >
                      <option value="">Select State</option>
                      {Object.keys(indiaStates).map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>

                    <select
                      value={(showNewAddress ? newAddress : editAddressForm).district}
                      disabled={
                        !(showNewAddress ? newAddress.state : editAddressForm.state)
                      }
                      onChange={(e) =>
                        showNewAddress
                          ? setNewAddress({ ...newAddress, district: e.target.value })
                          : setEditAddressForm({
                              ...editAddressForm,
                              district: e.target.value,
                            })
                      }
                      className="border rounded-lg px-3 py-2"
                    >
                      <option value="">Select District</option>
                      {(showNewAddress ? newAddress.state : editAddressForm.state) &&
                        indiaStates[
                          showNewAddress ? newAddress.state : editAddressForm.state
                        ]?.map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                    </select>
                  </div>

                  <button
                    onClick={showNewAddress ? saveNewAddress : updateAddress}
                    className="mt-4 w-full bg-[#57b957] text-white py-2 rounded-lg font-semibold"
                  >
                    Save Address
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT */}
          <div className="bg-white rounded-xl shadow p-4 sm:p-5 border border-[#57b957] h-fit">
            <h2 className="font-semibold mb-4">Order Summary</h2>

            {cartItems.map((item) => (
              <div key={item.product._id} className="flex justify-between text-sm mb-1">
                <span>
                  {item.product.name} × {item.quantity}
                </span>
                <span>
                  ₹{(item.product.offerPrice ?? item.product.price) * item.quantity}
                </span>
              </div>
            ))}

            <div className="border-t mt-4 pt-4 flex justify-between font-semibold">
              <span>Total</span>
              <span className="text-[#57b957]">₹{total}</span>
            </div>

            <div className="flex justify-between text-sm text-gray-600 mt-3">
              <span>Estimated delivery</span>
              <span className="font-medium">{estimatedDeliveryDate}</span>
            </div>

            <button
              onClick={placeOrder}
              disabled={loading}
              className="mt-5 w-full py-3 rounded-lg font-semibold text-white bg-[#57b957]"
            >
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
