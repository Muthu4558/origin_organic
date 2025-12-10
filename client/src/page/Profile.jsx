// src/pages/Profile.jsx
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaUserCircle,
  FaEdit,
  FaSave,
  FaTimes,
  FaPhoneAlt,
  FaEnvelope,
} from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BRAND = "#57b957"; // updated to your requested color

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({ name: "", number: "", email: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", number: "", email: "" });

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_APP_BASE_URL}/api/auth/profile`, {
        withCredentials: true,
      });
      setProfile(res.data || { name: "", number: "", email: "" });
      setFormData(res.data || { name: "", number: "", email: "" });
    } catch (err) {
      console.error(err);
      navigate("/login");
    }
  };

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_APP_BASE_URL}/api/auth/logout`,
        {},
        { withCredentials: true }
      );
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
      toast.error("Logout failed");
    } finally {
       localStorage.removeItem("token");
    localStorage.removeItem("isAdmin");
    navigate("/login");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_APP_BASE_URL}/api/auth/profile`,
        formData,
        { withCredentials: true }
      );
      setProfile(res.data);
      setIsModalOpen(false);
      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error("Profile update failed", err);
      toast.error("Profile update failed!");
    }
  };

  return (
    <>
      <Navbar />
      <ToastContainer />

      <div className="min-h-screen py-16 px-4 mt-14">
        <div className="max-w-4xl mx-auto">
          {/* Title */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
              My <span className="text-[#57b957]">Profile</span>
            </h1>
            <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
              Keep your account information up-to-date so we can give you the best experience.
            </p>
          </div>

          {/* Main card */}
          <div className="bg-white shadow-lg rounded-2xl overflow-hidden border border-[#57b957]">
            <div className="md:flex">
              {/* Left: avatar & actions */}
              <div className="md:w-1/3 bg-[linear-gradient(180deg,#f6fbf6,#ffffff)] p-6 flex flex-col items-center gap-4">
                <div className="w-28 h-28 rounded-full bg-white flex items-center justify-center border border-gray-100 shadow-sm">
                  <FaUserCircle className="text-6xl" style={{ color: BRAND }} />
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900">{profile.name || "—"}</div>
                  <div className="text-sm text-gray-500 mt-1">{profile.email || "—"}</div>
                </div>

                <div className="w-full mt-3">
                  <button
                    onClick={() => { setFormData(profile); setIsModalOpen(true); }}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-white font-medium shadow bg-[#57b957]"
                  >
                    <FaEdit /> Edit Profile
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full mt-3 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-red-600 text-red-600 bg-white hover:bg-red-50"
                  >
                    Logout
                  </button>
                </div>
              </div>

              {/* Right: details */}
              <div className="md:w-2/3 p-6">
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-800">Account Information</h2>
                    <span className="text-sm text-gray-500">Member</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg border border-gray-100 bg-white">
                      <div className="text-xs text-gray-500">Full name</div>
                      <div className="mt-1 text-gray-800 font-medium">{profile.name || "—"}</div>
                    </div>

                    <div className="p-4 rounded-lg border border-gray-100 bg-white">
                      <div className="text-xs text-gray-500">Phone number</div>
                      <div className="mt-1 text-gray-800 font-medium">{profile.number || "—"}</div>
                    </div>

                    <div className="p-4 rounded-lg border border-gray-100 bg-white col-span-1 sm:col-span-2">
                      <div className="text-xs text-gray-500">Email</div>
                      <div className="mt-1 text-gray-800 font-medium">{profile.email || "—"}</div>
                    </div>

                    {/* small helpful content */}
                    <div className="p-4 rounded-lg border border-gray-100 bg-white col-span-1 sm:col-span-2">
                      <div className="text-xs text-gray-500">Pro tip</div>
                      <div className="mt-1 text-gray-700">
                        Keep your phone number current — we use it for order updates and faster support.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* small footer note under card (optional) */}
          {/* <div className="mt-6 text-center text-sm text-gray-500">
            Last updated: <span className="font-medium">{profile.updatedAt ? new Date(profile.updatedAt).toLocaleDateString() : "—"}</span>
          </div> */}
        </div>
      </div>

      {/* Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setIsModalOpen(false)} />

          <div className="relative w-full max-w-md bg-white rounded-xl shadow-lg border border-gray-100 p-6 z-10">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
              aria-label="Close"
            >
              <FaTimes />
            </button>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Edit <span className="text-[#57b957]">Profile</span></h3>
            <p className="text-sm text-gray-500 mb-4">Update your account information. Changes will be saved to your profile.</p>

            <label className="text-sm text-gray-600 block mb-1">Full name</label>
            <input
              type="text"
              name="name"
              value={formData.name || ""}
              onChange={handleInputChange}
              className="w-full px-3 py-2 mb-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#dfeee0]"
            />

            <label className="text-sm text-gray-600 block mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email || ""}
              onChange={handleInputChange}
              className="w-full px-3 py-2 mb-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#dfeee0]"
            />

            <label className="text-sm text-gray-600 block mb-1">Phone number</label>
            <input
              type="tel"
              name="number"
              value={formData.number || ""}
              onChange={handleInputChange}
              className="w-full px-3 py-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#dfeee0]"
            />

            <div className="flex items-center gap-3 justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-md border border-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-white bg-[#57b957]"
              >
                <FaSave /> Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default Profile;