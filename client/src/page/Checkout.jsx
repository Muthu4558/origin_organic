import React, { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaPlus } from "react-icons/fa";
import { MdClose } from "react-icons/md";

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

    const loaded = await loadRazorpay();
    if (!loaded) return toast.error("Razorpay SDK failed");

    const orderRes = await axios.post(
      `${import.meta.env.VITE_APP_BASE_URL}/api/payment/create-order`,
      { amount: total },
      { withCredentials: true }
    );

    new window.Razorpay({
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: orderRes.data.amount,
      currency: "INR",
      name: "Origin Organic",
      order_id: orderRes.data.id,
      handler: async (response) => {
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
      },
      prefill: {
        name: profile?.name,
        email: profile?.email,
        contact: profile?.number,
      },
      theme: { color: "#57b957" },
    }).open();
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
                <p>{profile.name} | {profile.email} | {profile.number}</p>
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
                {addresses.map(a => (
                  <label
                    key={a._id}
                    className={`flex gap-3 p-4 border rounded-lg cursor-pointer
                      ${selectedAddress?._id === a._id
                        ? "bg-green-50 border-[#57b957]"
                        : "hover:border-[#57b957]"}`}
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

              {/* ADD ADDRESS */}
              {showNewAddress && (
                <div className="mt-6 bg-gray-50 border rounded-xl p-5">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-gray-800">Add New Address</h3>
                    <button
                      onClick={() => {
                        setShowNewAddress(false);
                        setNewAddress(emptyAddress);
                      }}
                      className="text-gray-500 hover:text-red-500"
                    >
                      <MdClose size={22} />
                    </button>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    {Object.keys(newAddress).map((f) => (
                      <input
                        key={f}
                        className={`border rounded-lg px-3 py-2 ${f === "pincode" ? "sm:col-span-2" : ""}`}
                        placeholder={f.charAt(0).toUpperCase() + f.slice(1)}
                        value={newAddress[f]}
                        onChange={(e) =>
                          setNewAddress({ ...newAddress, [f]: e.target.value })
                        }
                      />
                    ))}
                  </div>

                  <button
                    onClick={saveNewAddress}
                    className="mt-5 w-full bg-[#57b957] text-white py-2 rounded-lg font-semibold"
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

                  <div className="grid sm:grid-cols-2 gap-4">
                    {Object.keys(editAddressForm).map((f) => (
                      <input
                        key={f}
                        className={`border rounded-lg px-3 py-2 ${f === "pincode" ? "sm:col-span-2" : ""}`}
                        placeholder={f.charAt(0).toUpperCase() + f.slice(1)}
                        value={editAddressForm[f]}
                        onChange={(e) =>
                          setEditAddressForm({ ...editAddressForm, [f]: e.target.value })
                        }
                      />
                    ))}
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

            <div className="flex items-center justify-between text-sm text-gray-600 mt-4">
              <span>Estimated delivery</span>
              <span className="font-medium text-gray-800">
                {estimatedDeliveryDate}
              </span>
            </div>

            <button
              onClick={placeOrder}
              className="mt-5 w-full bg-[#57b957] text-white py-3 rounded-lg font-semibold cursor-pointer"
            >
              Pay & Place Order
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Checkout;