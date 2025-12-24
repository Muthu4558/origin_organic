import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Loader from "../components/Loader";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUserCircle, FaEdit, FaSave, FaTimes, FaPlus, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLoading } from "../context/LoadingContext";
import indiaStates from "../data/indiaStates.json";

const BRAND = "#57b957";


const Profile = () => {
  const navigate = useNavigate();
  const { startLoading, stopLoading } = useLoading();

  const [profile, setProfile] = useState({ name: "", number: "", email: "" });
  const [addresses, setAddresses] = useState([]);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [addressForm, setAddressForm] = useState({
    street: "",
    landmark: "",
    city: "",
    district: "",
    state: "",
    pincode: "",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", number: "", email: "" });
  const [loading, setLoading] = useState(true);

  // ================= FETCH PROFILE =================
  const fetchProfile = async () => {
    try {
      setLoading(true);
      startLoading();
      const res = await axios.get(`${import.meta.env.VITE_APP_BASE_URL}/api/auth/profile`, { withCredentials: true });
      setProfile(res.data);
      setFormData(res.data);
      setAddresses(res.data.addresses || []);
    } catch (err) {
      navigate("/login");
    } finally {
      setLoading(false);
      stopLoading();
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // ================= PROFILE UPDATE =================
  const handleSave = async () => {
    try {
      const res = await axios.put(`${import.meta.env.VITE_APP_BASE_URL}/api/auth/profile`, formData, { withCredentials: true });
      setProfile((prev) => ({ ...prev, ...res.data }));
      setIsModalOpen(false);
      toast.success("Profile updated successfully");
    } catch (err) {
      console.error(err);
      toast.error("Profile update failed");
    }
  };

  // ================= LOGOUT =================
  const handleLogout = async () => {
    await axios.post(`${import.meta.env.VITE_APP_BASE_URL}/api/auth/logout`, {}, { withCredentials: true });
    navigate("/login");
  };

  // ================= ADDRESS ADD =================
  const handleAddAddress = async () => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_APP_BASE_URL}/api/auth/address`, addressForm, { withCredentials: true });
      setAddresses(res.data);
      setIsAddressModalOpen(false);
      setAddressForm({ street: "", landmark: "", city: "", district: "", state: "", pincode: "" });
      toast.success("Address added");
    } catch {
      toast.error("Failed to add address");
    }
  };

  // ================= ADDRESS DELETE =================
  const handleDeleteAddress = async (id) => {
    const res = await axios.delete(`${import.meta.env.VITE_APP_BASE_URL}/api/auth/address/${id}`, { withCredentials: true });
    setAddresses(res.data);
  };

  if (loading) return <Loader />;

  return (
    <>
      <Navbar />

      <div className="min-h-screen py-16 px-4 mt-14">
        <div className="max-w-4xl mx-auto">

          {/* TITLE */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-extrabold">
              My <span className="text-[#57b957]">Profile</span>
            </h1>
          </div>

          {/* MAIN CARD */}
          <div className="bg-white shadow-lg rounded-2xl border overflow-hidden">
            <div className="md:flex">

              {/* LEFT */}
              <div className="md:w-1/3 p-6 bg-[#f6fbf6] flex flex-col items-center">
                <FaUserCircle size={80} color={BRAND} />
                <h3 className="mt-3 font-semibold">{profile.name}</h3>
                <p className="text-sm text-gray-500">{profile.email}</p>

                <button onClick={() => setIsModalOpen(true)} className="mt-4 w-full bg-[#57b957] text-white py-2 rounded cursor-pointer">
                  <FaEdit className="inline mr-2" /> Edit Profile
                </button>

                <button onClick={handleLogout} className="mt-3 w-full border border-red-600 text-red-600 py-2 rounded cursor-pointer">
                  Logout
                </button>
              </div>

              {/* RIGHT */}
              <div className="md:w-2/3 p-6">
                <h2 className="font-semibold mb-4">Account Information</h2>
                <p><b>Name:</b> {profile.name}</p>
                <p><b>Phone:</b> {profile.number}</p>
                <p><b>Email:</b> {profile.email}</p>

                {/* ADDRESS SECTION */}
                <div className="mt-6">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold">Addresses</h3>
                    <button onClick={() => setIsAddressModalOpen(true)} className="px-3 py-1 bg-[#57b957] text-white rounded text-sm cursor-pointer">
                      <FaPlus className="inline mr-1" /> Add
                    </button>
                  </div>

                  {addresses.length === 0 && <p className="text-sm text-gray-500">No address added yet.</p>}

                  {addresses.map((a) => (
                    <div key={a._id} className="border rounded p-3 mb-2 relative">
                      <button onClick={() => handleDeleteAddress(a._id)} className="absolute top-2 right-2 text-red-600 cursor-pointer">
                        <FaTrash />
                      </button>
                      <p>{a.street}</p>
                      <p>{a.city}, {a.district}</p>
                      <p>{a.state} - {a.pincode}</p>
                      {a.landmark && <p>Landmark: {a.landmark}</p>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* EDIT PROFILE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40">
          <div className="bg-white p-6 rounded-lg w-full max-w-md relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-3 right-3"><FaTimes /></button>
            <h3 className="text-lg font-semibold mb-3">Edit Profile</h3>

            <input name="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full mb-2 px-3 py-2 border rounded" placeholder="Name" />
            <input name="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full mb-2 px-3 py-2 border rounded" placeholder="Email" />
            <input name="number" value={formData.number} onChange={(e) => setFormData({ ...formData, number: e.target.value })} className="w-full mb-3 px-3 py-2 border rounded" placeholder="Phone" />

            <button onClick={handleSave} className="w-full bg-[#57b957] text-white py-2 rounded cursor-pointer">
              <FaSave className="inline mr-2" /> Save
            </button>
          </div>
        </div>
      )}

      {/* ADD ADDRESS MODAL */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40">
          <div className="bg-white p-6 rounded-lg w-full max-w-md relative">
            <button onClick={() => setIsAddressModalOpen(false)} className="absolute top-3 right-3"><FaTimes /></button>
            <h3 className="font-semibold mb-3">Add Address</h3>

            <input placeholder="Street" value={addressForm.street} onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })} className="w-full mb-2 px-3 py-2 border rounded" />
            <input placeholder="Landmark" value={addressForm.landmark} onChange={(e) => setAddressForm({ ...addressForm, landmark: e.target.value })} className="w-full mb-2 px-3 py-2 border rounded" />
            <input placeholder="City" value={addressForm.city} onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })} className="w-full mb-2 px-3 py-2 border rounded" />

            {/* State Dropdown */}
            <select
  value={addressForm.state}
  onChange={(e) =>
    setAddressForm({ ...addressForm, state: e.target.value, district: "" })
  }
  className="w-full mb-2 px-3 py-2 border rounded"
>
  <option value="">Select State</option>
  {Object.keys(indiaStates).map((state) => (
    <option key={state} value={state}>
      {state}
    </option>
  ))}
</select>

            {/* District Dropdown */}
            <select
  value={addressForm.district}
  onChange={(e) => setAddressForm({ ...addressForm, district: e.target.value })}
  className="w-full mb-2 px-3 py-2 border rounded"
  disabled={!addressForm.state}
>
  <option value="">Select District</option>
  {addressForm.state &&
    indiaStates[addressForm.state].map((district) => (
      <option key={district} value={district}>
        {district}
      </option>
    ))}
</select>

            <input placeholder="Pincode" value={addressForm.pincode} onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })} className="w-full mb-2 px-3 py-2 border rounded" />

            <button onClick={handleAddAddress} className="w-full bg-[#57b957] text-white py-2 rounded cursor-pointer">Save Address</button>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default Profile;
