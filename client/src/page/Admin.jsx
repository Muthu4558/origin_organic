// src/pages/Admin.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import {
  MdAddPhotoAlternate,
  MdDelete,
  MdEdit,
  MdSearch,
  MdFilterList,
} from "react-icons/md";
import {
  FaPlus,
  FaSignOutAlt,
  FaCloudUploadAlt,
  //   FaCloudUpload,
  FaCloud,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";

const BRAND = "#57b957";

const Admin = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    offerPrice: "",
    description: "",
    stock: "",
    brand: "",
    category: "",
    image: null,
    featured: false,
  });

  const [preview, setPreview] = useState(null);
  const [products, setProducts] = useState([]);
  const [editingProductId, setEditingProductId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  // toolbar state
  const [q, setQ] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_APP_BASE_URL}/api/products`);
      setProducts(res.data || []);
    } catch (err) {
      toast.error("❌ Failed to load products");
    }
  };

  const handleChange = (e) => {
    const { name, value, files, type, checked } = e.target;
    if (name === "image" && files && files[0]) {
      const file = files[0];
      setFormData((prev) => ({ ...prev, image: file }));
      setPreview(URL.createObjectURL(file));
    } else if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.price) {
      toast.error("Please provide name and price");
      return;
    }

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "featured") data.append(key, value ? "true" : "false");
      else if (value !== null && value !== undefined) data.append(key, value);
    });

    try {
      if (editingProductId) {
        await axios.put(
          `${import.meta.env.VITE_APP_BASE_URL}/api/products/update/${editingProductId}`,
          data,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        toast.success("✅ Product updated successfully");
      } else {
        await axios.post(`${import.meta.env.VITE_APP_BASE_URL}/api/products/add`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("🎉 Product added successfully");
      }
      resetForm();
      fetchProducts();
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to submit");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      price: "",
      offerPrice: "",
      description: "",
      stock: "",
      brand: "",
      category: "",
      image: null,
      featured: false,
    });
    setPreview(null);
    setEditingProductId(null);
    setShowModal(false);
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name || "",
      price: product.price || "",
      offerPrice: product.offerPrice || "",
      description: product.description || "",
      stock: product.stock ?? "",
      brand: product.brand || "",
      category: product.category || "",
      image: product.image || null,
      featured: !!product.featured,
    });
    setEditingProductId(product._id);
    setPreview(`${import.meta.env.VITE_APP_BASE_URL}/uploads/${product.image}`);
    setShowModal(true);
    // keep page stable on open
    setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 80);
  };

  const handleDelete = (id) => {
    setProductToDelete(id);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`${import.meta.env.VITE_APP_BASE_URL}/api/products/delete/${productToDelete}`);
      toast.success("🗑️ Product deleted");
      fetchProducts();
    } catch (err) {
      toast.error("❌ Delete failed");
    } finally {
      setProductToDelete(null);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_APP_BASE_URL}/api/auth/logout`, {}, { withCredentials: true });
      localStorage.removeItem("token");
      toast.success("Logged out");
      setTimeout(() => {
        navigate("/login");
      }, 800);
    } catch (err) {
      toast.error("Logout failed");
    }
  };

  // derived filtered list
  const filtered = products
    .filter((p) => (filterCategory === "All" ? true : p.category === filterCategory))
    .filter((p) => (showFeaturedOnly ? p.featured : true))
    .filter((p) => {
      if (!q) return true;
      const s = q.toLowerCase();
      return (
        (p.name || "").toLowerCase().includes(s) ||
        (p.brand || "").toLowerCase().includes(s) ||
        (p.category || "").toLowerCase().includes(s)
      );
    });

  const categories = ["All", "Masala Items", "Milk", "Nuts", 'Oils'];

  return (
    <>
      <Navbar />
      <ToastContainer />
      <div className="min-h-screen py-33 px-4">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900">
                Product <span className="text-[#57b957]">Inventory</span>
              </h1>
              <p className="text-sm text-gray-600 mt-1">Manage products — add, edit or remove items quickly.</p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
              <button
                onClick={() => setShowModal(true)}
                className="inline-flex items-center gap-2 justify-center bg-[#57b957] text-white px-4 py-2 rounded-lg shadow hover:scale-[1.02] transition w-full sm:w-auto"
              >
                <FaPlus /> Add Product
              </button>

              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 justify-center border border-red-600 text-red-600 px-3 py-2 rounded-lg hover:bg-gray-50 transition w-full sm:w-auto"
              >
                <FaSignOutAlt /> Logout
              </button>
            </div>
          </div>

          {/* Toolbar */}
          <div className="bg-white rounded-xl p-4 shadow-sm mb-6 flex flex-col md:flex-row md:items-center gap-3 justify-between">
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 flex-1">
              <div className="relative flex items-center w-full md:w-auto">
                <MdSearch className="absolute left-3 text-gray-400" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search by name, brand or category"
                  className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 w-full md:w-[320px] focus:outline-none focus:ring-2 focus:ring-[#e6f2e6]"
                />
              </div>

              <div className="flex items-center gap-2">
                <MdFilterList className="text-gray-500" />
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-gray-200 focus:outline-none"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3 justify-between md:justify-end w-full md:w-auto">
              <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={showFeaturedOnly}
                  onChange={(e) => setShowFeaturedOnly(e.target.checked)}
                  className="h-4 w-4"
                />
                <span className="text-sm text-gray-700">Show featured</span>
              </label>

              <div className="text-sm text-gray-500">{filtered.length} items</div>
            </div>
          </div>

          {/* Product grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((product) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl transition"
              >
                <div className="relative">
                  <img
                    src={`${import.meta.env.VITE_APP_BASE_URL}/uploads/${product.image}`}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-3 right-3 flex items-center gap-2">
                    {product.featured ? (
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold">Featured</span>
                    ) : null}
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">{product.name}</h3>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">{product.description || "No description"}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-400 line-through">{product.price ? `₹${product.price}` : "-"}</div>
                      <div className="text-lg font-bold text-[#6c845d]">{product.offerPrice ? `₹${product.offerPrice}` : product.price ? `₹${product.price}` : "-"}</div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-3">
                    <div className="text-sm text-gray-500">{product.brand || "-"}</div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(product)}
                        title="Edit"
                        className="p-2 rounded-lg bg-yellow-50 hover:bg-yellow-100 text-yellow-600 transition"
                      >
                        <MdEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        title="Delete"
                        className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition"
                      >
                        <MdDelete />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Empty state */}
          {filtered.length === 0 && (
            <div className="mt-8 bg-white rounded-xl p-8 shadow text-center">
              <FaCloud className="mx-auto text-4xl text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-800">No products found</h3>
              <p className="text-sm text-gray-500 mt-2">Try changing filters or add a new product.</p>
            </div>
          )}
        </div>

        {/* Modal Add / Edit */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm p-4">
            <motion.div
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-auto shadow-2xl p-4 sm:p-8 relative"
            >
              {/* close */}
              <button
                onClick={resetForm}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
                aria-label="Close"
              >
                ×
              </button>

              <div className="mb-4 text-center">
                <h2 className="text-2xl font-extrabold text-gray-900">
                  {editingProductId ? "Update Product" : "Add New Product"}
                </h2>
                <p className="text-sm text-gray-500 mt-1">Fill details below. Images supported (jpg, png).</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Product name"
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#eaf6ea]"
                  />
                  <input
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    placeholder="Brand"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#eaf6ea]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="Price (₹)"
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#eaf6ea]"
                  />
                  <input
                    name="offerPrice"
                    type="number"
                    value={formData.offerPrice}
                    onChange={handleChange}
                    placeholder="Offer price (₹)"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#eaf6ea]"
                  />
                </div>

                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#eaf6ea]"
                >
                  <option>Select</option>
                  <option>Masala Items</option>
                  <option>Milk Products</option>
                  <option>Nuts</option>
                  <option>Oils</option>
                </select>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Short description"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#eaf6ea] min-h-[100px]"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                  <div className="flex items-center gap-3">
                    <label className="flex items-center justify-center w-32 h-32 bg-gray-50 hover:bg-gray-100 text-gray-500 border border-dashed border-gray-200 rounded-2xl cursor-pointer">
                      <div className="flex flex-col items-center gap-1">
                        <MdAddPhotoAlternate size={28} />
                        <span className="text-xs">Upload</span>
                        <input type="file" name="image" accept="image/*" onChange={handleChange} className="hidden" />
                      </div>
                    </label>

                    {preview ? (
                      <img src={preview} alt="Preview" className="w-32 h-32 object-cover rounded-2xl border" />
                    ) : (
                      editingProductId && formData.image && (
                        <img
                          src={`${import.meta.env.VITE_APP_BASE_URL}/uploads/${formData.image}`}
                          alt="Existing"
                          className="w-32 h-32 object-cover rounded-2xl border"
                        />
                      )
                    )}
                  </div>

                  <div className="flex flex-col gap-3">
                    <input
                      name="stock"
                      type="number"
                      min="0"
                      value={formData.stock}
                      onChange={handleChange}
                      placeholder="Stock count"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#eaf6ea]"
                    />

                    <label className="inline-flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="featured"
                        checked={!!formData.featured}
                        onChange={handleChange}
                        className="h-4 w-4"
                      />
                      <span className="text-sm text-gray-700">Show on Home (Featured)</span>
                    </label>
                  </div>
                </div>

                {/* footer actions: sticky on larger screens, visible on mobile below form */}
                <div className="mt-2">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t border-gray-100">
                    <div className="text-sm text-gray-500">You can edit this later from the product list.</div>
                    <div className="flex gap-3 w-full sm:w-auto">
                      <button type="button" onClick={resetForm} className="px-4 py-2 rounded-lg border w-full sm:w-auto">
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="inline-flex items-center gap-2 bg-[#57b957] text-white px-4 py-2 rounded-lg w-full sm:w-auto justify-center"
                      >
                        <FaCloudUploadAlt /> {editingProductId ? "Update Product" : "Add Product"}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Delete Confirmation */}
        {productToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full text-center shadow-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Confirm delete</h3>
              <p className="text-sm text-gray-600 mb-6">This action cannot be undone. Are you sure?</p>
              <div className="flex items-center justify-center gap-4">
                <button onClick={() => setProductToDelete(null)} className="px-4 py-2 rounded-lg border">
                  Cancel
                </button>
                <button onClick={confirmDelete} className="px-4 py-2 rounded-lg bg-red-500 text-white">
                  Yes, delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Admin;