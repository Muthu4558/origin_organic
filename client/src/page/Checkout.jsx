import React, { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Loader from "../components/Loader";
import { useCart } from "../context/CartContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaPlus } from "react-icons/fa";
import indiaStates from "../data/indiaStates.json";

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

  const [shippingRules, setShippingRules] = useState([]);

  const [loading, setLoading] = useState(false);

  /* ---------------- INIT ---------------- */
  useEffect(() => {
    fetchCart();

    axios
      .get(`${import.meta.env.VITE_APP_BASE_URL}/api/auth/profile`, {
        withCredentials: true,
      })
      .then((res) => {
        setProfile(res.data);
        setAddresses(res.data.addresses || []);

        if (res.data.addresses?.length) {
          setSelectedAddress(res.data.addresses[0]);
        }
      })
      .catch(() => navigate("/login"));

    // 🔥 fetch shipping rules
    axios
      .get(`${import.meta.env.VITE_APP_BASE_URL}/api/shipping`)
      .then((res) => setShippingRules(res.data))
      .catch(() => toast.error("Shipping load failed"));
  }, []);

  /* ---------------- PRODUCT TOTAL ---------------- */
  const productTotal = useMemo(() => {
    return cartItems.reduce(
      (sum, item) =>
        sum +
        (item.product.offerPrice ?? item.product.price) *
          item.quantity,
      0
    );
  }, [cartItems]);

// Determine if product is half or full for shipping
const getWeightType = (product) => {
  // Use packSize if present, else fallback to weight/size
  const packSize = product.packSize ?? "1"; // "0.5" or "1"
  const weightStr = product.weight ?? product.size ?? "1";

  // Normalize: check if 0.5 → half, else full
  if (packSize === "0.5" || packSize === 0 || packSize.toString() === "0.5") return "half";

  return "full";
};


  /* ---------------- SHIPPING TOTAL (FROM DB) ---------------- */
const shippingTotal = useMemo(() => {
  if (!selectedAddress || !shippingRules.length) return 0;

  const state = selectedAddress.state?.trim();
  const district = selectedAddress.district?.trim();

  return cartItems.reduce((sum, item) => {
    const weightType = getWeightType(item.product); // "half" or "full"
    const qty = item.quantity;

    // District-level shipping
    let rule = shippingRules.find(
      (r) => r.state === state && r.district && r.district === district
    );

    // Fallback to state-level
    if (!rule) {
      rule = shippingRules.find((r) => r.state === state && !r.district);
    }

    if (!rule) return sum;

    const charge = weightType === "half" ? rule.halfKg : rule.oneKg;
    return sum + charge * qty;
  }, 0);
}, [cartItems, selectedAddress, shippingRules]);


  const total = productTotal + shippingTotal;

  /* ---------------- DELIVERY DATE ---------------- */
  const estimatedDeliveryDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }, []);

  /* ---------------- ADD ADDRESS ---------------- */
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

  /* ---------------- EDIT ADDRESS ---------------- */
  const updateAddress = async () => {
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_APP_BASE_URL}/api/auth/address/${editingAddressId}`,
        editAddressForm,
        { withCredentials: true }
      );

      setAddresses(res.data);
      setEditingAddressId(null);
      toast.success("Address updated");
    } catch {
      toast.error("Failed to update address");
    }
  };

  /* ---------------- PAYMENT ---------------- */
  const placeOrder = async () => {
    if (!selectedAddress) return toast.error("Select address");
    if (!cartItems.length) return toast.error("Cart empty");

    try {
      setLoading(true);

      const orderId = `ORD_${Date.now()}`;

      const res = await axios.post(
        `${import.meta.env.VITE_APP_BASE_URL}/api/payment/ccavenue-order`,
        {
          orderId,
          amount: total,
          name: profile.name,
          email: profile.email,
          phone: profile.number,
        },
        { withCredentials: true }
      );

      const form = document.createElement("form");
      form.method = "POST";
      form.action =
        "https://secure.ccavenue.com/transaction/transaction.do?command=initiateTransaction";

      const encInput = document.createElement("input");
      encInput.type = "hidden";
      encInput.name = "encRequest";
      encInput.value = res.data.encRequest;

      const accessInput = document.createElement("input");
      accessInput.type = "hidden";
      accessInput.name = "access_code";
      accessInput.value = res.data.accessCode;

      form.appendChild(encInput);
      form.appendChild(accessInput);
      document.body.appendChild(form);
      form.submit();
    } catch {
      toast.error("Payment initiation failed");
      setLoading(false);
    }
  };

  /* ---------------- ADDRESS FORM ---------------- */
  const renderAddressForm = (data, setData, onSave) => (
    <div className="mt-4 bg-gray-50 border rounded-xl p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input
          placeholder="Street"
          value={data.street}
          onChange={(e) => setData({ ...data, street: e.target.value })}
          className="border rounded-lg px-3 py-2"
        />
        <input
          placeholder="Landmark"
          value={data.landmark}
          onChange={(e) => setData({ ...data, landmark: e.target.value })}
          className="border rounded-lg px-3 py-2"
        />
        <input
          placeholder="City"
          value={data.city}
          onChange={(e) => setData({ ...data, city: e.target.value })}
          className="border rounded-lg px-3 py-2"
        />
        <input
          placeholder="Pincode"
          value={data.pincode}
          onChange={(e) => setData({ ...data, pincode: e.target.value })}
          className="border rounded-lg px-3 py-2"
        />

        <select
          value={data.state}
          onChange={(e) =>
            setData({ ...data, state: e.target.value, district: "" })
          }
          className="border rounded-lg px-3 py-2"
        >
          <option value="">Select State</option>
          {Object.keys(indiaStates).map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>

        <select
          value={data.district}
          disabled={!data.state}
          onChange={(e) => setData({ ...data, district: e.target.value })}
          className="border rounded-lg px-3 py-2"
        >
          <option value="">Select District</option>
          {data.state &&
            indiaStates[data.state]?.map((d) => (
              <option key={d}>{d}</option>
            ))}
        </select>
      </div>

      <button
        onClick={onSave}
        className="mt-4 w-full bg-[#57b957] text-white py-2 rounded-lg font-semibold"
      >
        Save Address
      </button>
    </div>
  );

  return (
    <>
      <Navbar />
      {loading && <Loader />}

      <div className="min-h-screen pt-28 pb-12 px-3 sm:px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT */}
          <div className="lg:col-span-2 space-y-6">
            {profile && (
              <div className="bg-white rounded-xl shadow p-4 border border-[#57b957]">
                <h2 className="font-semibold mb-2">Customer Details</h2>
                <p className="text-sm">
                  {profile.name} | {profile.email} | {profile.number}
                </p>
              </div>
            )}

            {/* ADDRESS */}
            <div className="bg-white rounded-xl shadow p-4 border border-[#57b957]">
              <div className="flex justify-between mb-4">
                <h2 className="font-semibold">Delivery Address</h2>

                <button
                  onClick={() => {
                    setShowNewAddress(!showNewAddress);
                    setEditingAddressId(null);
                  }}
                  className="flex items-center gap-2 text-[#57b957]"
                >
                  <FaPlus /> Add Address
                </button>
              </div>

              {addresses.map((a) => (
                <label
                  key={a._id}
                  onClick={() => setSelectedAddress(a)}
                  className={`flex gap-3 p-4 border rounded-lg cursor-pointer mb-2 ${
                    selectedAddress?._id === a._id
                      ? "bg-green-50 border-[#57b957]"
                      : ""
                  }`}
                >
                  <input
                    type="radio"
                    checked={selectedAddress?._id === a._id}
                    readOnly
                  />
                  <div className="flex-1 text-sm">
                    {a.street}, {a.city}, {a.district}, {a.state} –{" "}
                    {a.pincode}
                  </div>

                  <FaEdit
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingAddressId(a._id);
                      setEditAddressForm(a);
                      setShowNewAddress(false);
                    }}
                  />
                </label>
              ))}

              {showNewAddress &&
                renderAddressForm(newAddress, setNewAddress, saveNewAddress)}

              {editingAddressId &&
                renderAddressForm(
                  editAddressForm,
                  setEditAddressForm,
                  updateAddress
                )}
            </div>
          </div>

          {/* RIGHT */}
          <div className="bg-white rounded-xl shadow p-4 border border-[#57b957] h-fit">
            <h2 className="font-semibold mb-4">Order Summary</h2>

            {cartItems.map((item) => (
              <div
                key={item.product._id}
                className="flex justify-between text-sm mb-1"
              >
                <span>
                  {item.product.name} × {item.quantity}
                </span>
                <span>
                  ₹
                  {(item.product.offerPrice ?? item.product.price) *
                    item.quantity}
                </span>
              </div>
            ))}

            <div className="flex justify-between text-sm mt-3">
              <span>Shipping</span>
              <span>₹{shippingTotal}</span>
            </div>

            <div className="border-t mt-4 pt-4 flex justify-between font-semibold">
              <span>Grand Total</span>
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
              {loading ? "Redirecting..." : "Pay & Place Order"}
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Checkout;
