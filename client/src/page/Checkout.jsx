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

  /* ---------- TOTAL ---------- */
  const total = useMemo(
    () =>
      cartItems.reduce(
        (sum, item) =>
          sum +
          (item.product.offerPrice ?? item.product.price) *
            item.quantity,
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

  /* ---------- CCAvenue PAYMENT ---------- */
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

      /* 🔐 Create secure CCAvenue form */
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
    } catch (err) {
      console.error(err);
      toast.error("Payment initiation failed");
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
              <div className="bg-white rounded-xl shadow p-4 border border-[#57b957]">
                <h2 className="font-semibold mb-2">
                  Customer Details
                </h2>
                <p className="text-sm">
                  {profile.name} | {profile.email} |{" "}
                  {profile.number}
                </p>
              </div>
            )}

            {/* ADDRESS */}
            <div className="bg-white rounded-xl shadow p-4 border border-[#57b957]">
              <div className="flex justify-between mb-4">
                <h2 className="font-semibold text-lg">
                  Delivery Address
                </h2>
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
                      checked={
                        selectedAddress?._id === a._id
                      }
                      readOnly
                      className="mt-1"
                    />
                    <div className="flex-1 text-sm">
                      <p className="font-medium">
                        {a.street}, {a.city}
                      </p>
                      <p className="text-gray-600">
                        {a.district}, {a.state} –{" "}
                        {a.pincode}
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

              {(showNewAddress || editingAddressId) && (
                <div className="mt-6 bg-gray-50 border rounded-xl p-4">
                  <div className="flex justify-between mb-4">
                    <h3 className="font-semibold">
                      {showNewAddress
                        ? "Add New Address"
                        : "Edit Address"}
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

                  <input
                    placeholder="Street"
                    value={
                      showNewAddress
                        ? newAddress.street
                        : editAddressForm.street
                    }
                    onChange={(e) =>
                      showNewAddress
                        ? setNewAddress({
                            ...newAddress,
                            street: e.target.value,
                          })
                        : setEditAddressForm({
                            ...editAddressForm,
                            street: e.target.value,
                          })
                    }
                    className="border rounded-lg px-3 py-2 w-full mb-3"
                  />

                  <button
                    onClick={
                      showNewAddress
                        ? saveNewAddress
                        : updateAddress
                    }
                    className="mt-2 w-full bg-[#57b957] text-white py-2 rounded-lg font-semibold"
                  >
                    Save Address
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT */}
          <div className="bg-white rounded-xl shadow p-4 border border-[#57b957] h-fit">
            <h2 className="font-semibold mb-4">
              Order Summary
            </h2>

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
                  {(item.product.offerPrice ??
                    item.product.price) *
                    item.quantity}
                </span>
              </div>
            ))}

            <div className="border-t mt-4 pt-4 flex justify-between font-semibold">
              <span>Total</span>
              <span className="text-[#57b957]">
                ₹{total}
              </span>
            </div>

            <div className="flex justify-between text-sm text-gray-600 mt-3">
              <span>Estimated delivery</span>
              <span className="font-medium">
                {estimatedDeliveryDate}
              </span>
            </div>

            <button
              onClick={placeOrder}
              disabled={loading}
              className="mt-5 w-full py-3 rounded-lg font-semibold text-white bg-[#57b957]"
            >
              {loading
                ? "Redirecting to payment..."
                : "Pay & Place Order"}
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Checkout;
