import React, { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTimes } from "react-icons/fa";

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

  // 🔹 ADD NEW ADDRESS
  const [showNewAddress, setShowNewAddress] = useState(false);
  const [newAddress, setNewAddress] = useState(emptyAddress);

  // 🔹 EDIT ADDRESS
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [editAddressForm, setEditAddressForm] = useState(emptyAddress);

  // ================= LOAD DATA =================
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

  // ================= TOTAL =================
  const total = useMemo(() => {
    return cartItems.reduce((sum, item) => {
      const price =
        item.product.offerPrice ?? item.product.price;
      return sum + price * item.quantity;
    }, 0);
  }, [cartItems]);

  // ================= SAVE NEW ADDRESS =================
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

  // ================= UPDATE EXISTING ADDRESS =================
  const updateAddress = async () => {
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_APP_BASE_URL}/api/auth/address/${editingAddressId}`,
        editAddressForm,
        { withCredentials: true }
      );

      setAddresses(res.data);
      setSelectedAddress(
        res.data.find((a) => a._id === editingAddressId)
      );

      setEditingAddressId(null);
      setEditAddressForm(emptyAddress);
      toast.success("Address updated");
    } catch {
      toast.error("Failed to update address");
    }
  };

  // ================= PLACE ORDER =================
  const placeOrder = async () => {
    if (!selectedAddress) {
      return toast.error("Please select address");
    }
    if (cartItems.length === 0) {
      return toast.error("Cart is empty");
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_APP_BASE_URL}/api/orders/place`,
        { address: selectedAddress },
        { withCredentials: true }
      );

      toast.success("Order placed");
      navigate("/thankyou");
    } catch {
      toast.error("Order failed");
    }
  };

  return (
    <>
      <Navbar />

      <div className="max-w-5xl mx-auto mt-24 px-4">
        <h1 className="text-2xl font-bold mb-6">Checkout</h1>

        {/* USER DETAILS */}
        {profile && (
          <div className="border p-4 mb-6">
            <p><b>Name:</b> {profile.name}</p>
            <p><b>Email:</b> {profile.email}</p>
            <p><b>Phone:</b> {profile.number}</p>
          </div>
        )}

        {/* CART */}
        <div className="border p-4 mb-6">
          {cartItems.map((item) => (
            <div key={item.product._id} className="flex justify-between mb-2">
              <span>{item.product.name} × {item.quantity}</span>
              <span>
                ₹{(item.product.offerPrice ?? item.product.price) * item.quantity}
              </span>
            </div>
          ))}
          <div className="border-t mt-2 pt-2 font-bold">
            Total: ₹{total}
          </div>
        </div>

        {/* ADDRESS SECTION */}
        <div className="border p-4 mb-6">
          <h2 className="font-semibold mb-3">Delivery Address</h2>

          {addresses.map((a) => (
            <div key={a._id} className="border rounded p-3 mb-2 relative">
              <label className="cursor-pointer">
                <input
                  type="radio"
                  name="address"
                  className="mr-2"
                  checked={selectedAddress?._id === a._id}
                  onChange={() => {
                    setSelectedAddress(a);
                    setEditingAddressId(null);
                    setShowNewAddress(false);
                  }}
                />
                {a.street}, {a.city}, {a.state} - {a.pincode}
              </label>

              <button
                onClick={() => {
                  setEditingAddressId(a._id);
                  setEditAddressForm(a);
                }}
                className="absolute top-2 right-2 text-gray-600"
              >
                <FaEdit />
              </button>
            </div>
          ))}

          {/* EDIT ADDRESS FORM */}
          {editingAddressId && (
            <div className="mt-4 border p-3 rounded">
              <div className="flex justify-between mb-2">
                <h3 className="font-semibold">Edit Address</h3>
                <button onClick={() => setEditingAddressId(null)}>
                  <FaTimes />
                </button>
              </div>

              {Object.keys(editAddressForm).map((f) => (
                <input
                  key={f}
                  value={editAddressForm[f]}
                  onChange={(e) =>
                    setEditAddressForm({
                      ...editAddressForm,
                      [f]: e.target.value,
                    })
                  }
                  className="w-full border p-2 mb-2"
                  placeholder={f}
                />
              ))}

              <button
                onClick={updateAddress}
                className="bg-[#57b957] text-white px-4 py-2 rounded"
              >
                Save Changes
              </button>
            </div>
          )}

          {/* ADD NEW ADDRESS */}
          <button
            onClick={() => {
              setShowNewAddress(true);
              setEditingAddressId(null);
            }}
            className="text-[#57b957] font-semibold mt-3"
          >
            + Add New Address
          </button>

          {showNewAddress && (
            <div className="mt-3">
              {Object.keys(newAddress).map((f) => (
                <input
                  key={f}
                  value={newAddress[f]}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, [f]: e.target.value })
                  }
                  className="w-full border p-2 mb-2"
                  placeholder={f}
                />
              ))}
              <button
                onClick={saveNewAddress}
                className="bg-[#57b957] text-white px-4 py-2 rounded"
              >
                Save Address
              </button>
            </div>
          )}
        </div>

        <button
          onClick={placeOrder}
          className="w-full bg-[#57b957] text-white py-3 rounded font-semibold"
        >
          Place Order
        </button>
      </div>

      <Footer />
    </>
  );
};

export default Checkout;
