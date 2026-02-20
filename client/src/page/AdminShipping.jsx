import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import statesData from "../data/indiaStates.json";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MdArrowRightAlt, MdDelete, MdEdit } from "react-icons/md";
import { FaSearch } from "react-icons/fa";
import Sidebar from "../components/Sidebar";

const BRAND = "#57b957";

const AdminShipping = () => {
  const [activePage, setActivePage] = useState("shipping");

  const [stateName, setStateName] = useState("");
  const [district, setDistrict] = useState("");
  const [rate200g, setRate200g] = useState("");
  const [rate500g, setRate500g] = useState("");
  const [rate1kg, setRate1kg] = useState("");
  const [list, setList] = useState([]);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);

  const states = Object.keys(statesData);

  const fetchShipping = async () => {
    const res = await axios.get(`${import.meta.env.VITE_APP_BASE_URL}/api/shipping`);
    setList(res.data);
  };

  useEffect(() => {
    fetchShipping();
  }, []);

  const resetForm = () => {
    setStateName("");
    setDistrict("");
    setRate200g("");
    setRate500g("");
    setRate1kg("");
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stateName || !rate200g || !rate500g || !rate1kg) {
      toast.error("Please fill all fields");
      return;
    }

    const shippingRates = {
      "200g": Number(rate200g),
      "500g": Number(rate500g),
      "1kg": Number(rate1kg),
    };

    try {
      await axios.post(`${import.meta.env.VITE_APP_BASE_URL}/api/shipping`, {
        id: editingId,
        state: stateName,
        district,
        shippingRates,
      });

      toast.success(editingId ? "Updated successfully" : "Added successfully");
      resetForm();
      fetchShipping();
    } catch {
      toast.error("Error saving shipping");
    }
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setStateName(item.state);
    setDistrict(item.district || "");
    setRate200g(item.shippingRates?.get?.("200g") || item.shippingRates?.["200g"] || "");
    setRate500g(item.shippingRates?.get?.("500g") || item.shippingRates?.["500g"] || "");
    setRate1kg(item.shippingRates?.get?.("1kg") || item.shippingRates?.["1kg"] || "");
  };

  const handleDelete = async (id) => {
    await axios.delete(`${import.meta.env.VITE_APP_BASE_URL}/api/shipping/${id}`);
    toast.success("Deleted successfully");
    fetchShipping();
  };

  const filteredList = list.filter((item) =>
    item.state.toLowerCase().includes(search.toLowerCase())
  );

  const handleLogout = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_APP_BASE_URL}/api/auth/logout`, {}, { withCredentials: true });
      localStorage.removeItem("token");
      toast.success("Logged out");
      window.location.href = "/login";
    } catch (err) {
      toast.error("Logout failed");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar activePage={activePage} setActivePage={setActivePage} handleLogout={handleLogout} />

      <main className="flex-1 md:ml-64 p-6">
        <h1 className="text-3xl font-bold mb-6">Shipping Amount</h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-6">
          <select
            value={stateName}
            onChange={(e) => setStateName(e.target.value)}
            required
            className="border px-3 py-2 rounded"
          >
            <option value="">Select State</option>
            {states.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>

          <input
            type="number"
            placeholder="200g price"
            value={rate200g}
            onChange={(e) => setRate200g(e.target.value)}
            required
            className="border px-3 py-2 rounded"
          />

          <input
            type="number"
            placeholder="500g price"
            value={rate500g}
            onChange={(e) => setRate500g(e.target.value)}
            required
            className="border px-3 py-2 rounded"
          />

          <input
            type="number"
            placeholder="1kg price"
            value={rate1kg}
            onChange={(e) => setRate1kg(e.target.value)}
            required
            className="border px-3 py-2 rounded"
          />

          <button
            type="submit"
            className="bg-green-600 text-white rounded px-4 py-2"
          >
            {editingId ? "Update" : "Save"}
          </button>
        </form>

        <div className="mb-4 flex justify-end">
          <div className="flex items-center gap-2 px-3 py-2 border rounded-full shadow-sm">
            <FaSearch className="text-gray-400" />
            <input
              type="text"
              placeholder="Search state..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="outline-none text-sm"
            />
          </div>
        </div>

        <div className="bg-white shadow rounded overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-green-100">
              <tr>
                <th className="px-4 py-3 text-left text-sm">State</th>
                <th className="px-4 py-3 text-center text-sm">200g</th>
                <th className="px-4 py-3 text-center text-sm">500g</th>
                <th className="px-4 py-3 text-center text-sm">1kg</th>
                <th className="px-4 py-3 text-center text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredList.map((item) => (
                <tr key={item._id} className="border-t">
                  <td className="px-4 py-3">{item.state}</td>
                  <td className="px-4 py-3 text-center">₹{item.shippingRates?.["200g"]}</td>
                  <td className="px-4 py-3 text-center">₹{item.shippingRates?.["500g"]}</td>
                  <td className="px-4 py-3 text-center">₹{item.shippingRates?.["1kg"]}</td>
                  <td className="px-4 py-3 text-center flex gap-3 justify-center">
                    <button onClick={() => handleEdit(item)}>
                      <MdEdit size={20} />
                    </button>
                    <button onClick={() => handleDelete(item._id)}>
                      <MdDelete size={20} className="text-red-600" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredList.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-4">
                    No shipping data found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default AdminShipping;
