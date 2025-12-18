import React, { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTimes, FaPlus } from "react-icons/fa";

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
  area: "",
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

  /* ✅ NEW */
  const [paymentMethod, setPaymentMethod] = useState("ONLINE"); // ONLINE | COD

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

  const total = useMemo(() => {
    return cartItems.reduce((sum, item) => {
      const price = item.product.offerPrice ?? item.product.price;
      return sum + price * item.quantity;
    }, 0);
  }, [cartItems]);

  /* ---------- ADDRESS ---------- */
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
      setSelectedAddress(res.data.find(a => a._id === editingAddressId));
      setEditingAddressId(null);
      toast.success("Address updated");
    } catch {
      toast.error("Failed to update address");
    }
  };

  /* ---------- COD ---------- */
  const placeCodOrder = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_APP_BASE_URL}/api/orders/place`,
        {
          address: selectedAddress,
          paymentMethod: "COD",
        },
        { withCredentials: true }
      );
      toast.success("Order placed (COD)");
      navigate("/thankyou");
    } catch {
      toast.error("COD order failed");
    }
  };

  /* ---------- ONLINE ---------- */
  const placeOnlineOrder = async () => {
    const loaded = await loadRazorpay();
    if (!loaded) return toast.error("Razorpay SDK failed");

    try {
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
              `${import.meta.env.VITE_APP_BASE_URL}/api/payment/verify`,
              response,
              { withCredentials: true }
            );

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
            toast.error("Payment verification failed");
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
    } catch {
      toast.error("Payment initiation failed");
    }
  };

  const placeOrder = () => {
    if (!selectedAddress) return toast.error("Select address");
    if (!cartItems.length) return toast.error("Cart empty");

    paymentMethod === "COD" ? placeCodOrder() : placeOnlineOrder();
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen pt-24 pb-12 px-4 mt-15">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-6">

          {/* LEFT */}
          <div className="lg:col-span-2 space-y-6">

            {/* PROFILE */}
            {profile && (
              <div className="bg-white rounded-xl shadow p-5 border border-[#57b957]">
                <h2 className="font-semibold mb-2">Customer Details</h2>
                <p>{profile.name} | {profile.email} | {profile.number}</p>
              </div>
            )}

            {/* PAYMENT METHOD */}
            <div className="bg-white rounded-xl shadow p-5 border border-[#57b957]">
              <h2 className="font-semibold mb-3">Payment Method</h2>

              <label className="flex items-center gap-2 mb-2">
                <input
                  type="radio"
                  checked={paymentMethod === "ONLINE"}
                  onChange={() => setPaymentMethod("ONLINE")}
                />
                Online Payment
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={paymentMethod === "COD"}
                  onChange={() => setPaymentMethod("COD")}
                />
                Cash on Delivery
              </label>
            </div>

            {/* ✅ ADDRESS SECTION — SAME AS YOUR OLD CODE */}
            <div className="bg-white rounded-xl shadow p-5 border border-[#57b957]">
              <div className="flex justify-between mb-4">
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
                {addresses.map(a => (
                  <label
                    key={a._id}
                    className={`flex gap-3 p-4 border rounded cursor-pointer
                    ${selectedAddress?._id === a._id ? "bg-green-50 border-[#57b957]" : ""}`}
                    onClick={() => setSelectedAddress(a)}
                  >
                    <input type="radio" checked={selectedAddress?._id === a._id} readOnly />
                    <div className="flex-1">
                      <p>{a.street}, {a.area}, {a.city}</p>
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

              {editingAddressId && (
                <div className="mt-4 bg-gray-50 p-4 rounded">
                  <div className="grid sm:grid-cols-2 gap-3">
                    {Object.keys(editAddressForm).map(f => (
                      <input
                        key={f}
                        value={editAddressForm[f]}
                        onChange={e =>
                          setEditAddressForm({ ...editAddressForm, [f]: e.target.value })
                        }
                        className="border p-2 rounded"
                        placeholder={f}
                      />
                    ))}
                  </div>
                  <button
                    onClick={updateAddress}
                    className="mt-3 bg-[#57b957] text-white px-4 py-2 rounded"
                  >
                    Save Changes
                  </button>
                </div>
              )}

              {showNewAddress && (
                <div className="mt-4 grid sm:grid-cols-2 gap-3">
                  {Object.keys(newAddress).map(f => (
                    <input
                      key={f}
                      value={newAddress[f]}
                      onChange={e =>
                        setNewAddress({ ...newAddress, [f]: e.target.value })
                      }
                      className="border p-2 rounded"
                      placeholder={f}
                    />
                  ))}
                  <button
                    onClick={saveNewAddress}
                    className="sm:col-span-2 bg-[#57b957] text-white py-2 rounded"
                  >
                    Save Address
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT */}
          <div className="bg-white rounded-xl shadow p-5 h-fit border border-[#57b957]">
            <h2 className="font-semibold mb-4">Order Summary</h2>

            {cartItems.map(item => (
              <div key={item.product._id} className="flex justify-between text-sm">
                <span>{item.product.name} × {item.quantity}</span>
                <span>₹{(item.product.offerPrice ?? item.product.price) * item.quantity}</span>
              </div>
            ))}

            <div className="border-t mt-4 pt-4 flex justify-between font-semibold">
              <span>Total</span>
              <span className="text-[#57b957]">₹{total}</span>
            </div>

            <button
              onClick={placeOrder}
              className="mt-5 w-full bg-[#57b957] text-white py-3 rounded-lg font-semibold"
            >
              {paymentMethod === "COD" ? "Place Order (COD)" : "Pay & Place Order"}
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Checkout;