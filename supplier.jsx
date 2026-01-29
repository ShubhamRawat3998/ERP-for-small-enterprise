import React, { useState, useEffect } from "react";
import "./supplier.css";

export default function Supplier() {
  const [suppliers, setSuppliers] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    phone: "",
    email: "",
    category: "",
    rating: 3,
    status: "Active",
  });

  // ================= FETCH SUPPLIERS =================
  useEffect(() => {
    fetch("http://localhost:5000/api/supplier")
      .then((res) => res.json())
      .then((data) => setSuppliers(data))
      .catch((err) => console.error(err));
  }, []);

  // ================= FORM HANDLERS =================
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const setRating = (rating) => {
    setFormData({ ...formData, rating });
  };

  // ================= ADD / UPDATE =================
  const addSupplier = async () => {
    if (!formData.name || !formData.contact || !formData.phone) {
      alert("Please fill required fields");
      return;
    }

    if (editingId) {
      // UPDATE
      const res = await fetch(
        `http://localhost:5000/api/supplier/${editingId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );
      const updated = await res.json();
      setSuppliers(
        suppliers.map((s) => (s._id === editingId ? updated : s))
      );
    } else {
      // CREATE
      const res = await fetch("http://localhost:5000/api/supplier", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const saved = await res.json();
      setSuppliers([...suppliers, saved]);
    }

    resetForm();
  };

  // ================= DELETE =================
  const deleteSupplier = async (id) => {
    await fetch(`http://localhost:5000/api/supplier/${id}`, {
      method: "DELETE",
    });
    setSuppliers(suppliers.filter((s) => s._id !== id));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      contact: "",
      phone: "",
      email: "",
      category: "",
      rating: 3,
      status: "Active",
    });
    setEditingId(null);
    setShowForm(false);
  };

  // ================= DASHBOARD =================
  const totalSuppliers = suppliers.length;
  const activeSuppliers = suppliers.filter(
    (s) => s.status === "Active"
  ).length;
  const blacklisted = suppliers.filter(
    (s) => s.status === "Blocked"
  ).length;
  const newThisMonth = 2;

  return (
    <div className="supplier-container">
      {/* DASHBOARD */}
      <div className="dashboard-cards">
        <div className="card">
          <h3>{totalSuppliers}</h3>
          <p>Total Suppliers</p>
        </div>
        <div className="card">
          <h3>{activeSuppliers}</h3>
          <p>Active</p>
        </div>
        <div className="card">
          <h3>{newThisMonth}</h3>
          <p>New This Month</p>
        </div>
        <div className="card">
          <h3>{blacklisted}</h3>
          <p>Blacklisted</p>
        </div>
      </div>

      {/* HEADER */}
      <div className="supplier-header">
        <h2>Suppliers</h2>
        <button className="add-btn" onClick={() => setShowForm(true)}>
          + Add Supplier
        </button>
      </div>

      {/* SEARCH */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search supplier..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* TABLE */}
      <table className="supplier-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Supplier Name</th>
            <th>Contact</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Category</th>
            <th>Rating</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {suppliers
            .filter((s) =>
              s.name.toLowerCase().includes(search.toLowerCase())
            )
            .map((supplier) => (
              <tr key={supplier._id}>
                <td>{supplier._id.slice(-4)}</td>
                <td>{supplier.name}</td>
                <td>{supplier.contact}</td>
                <td>{supplier.phone}</td>
                <td>{supplier.email}</td>
                <td>{supplier.category}</td>
                <td>
                  {"★".repeat(supplier.rating)}
                  {"☆".repeat(5 - supplier.rating)}
                </td>
                <td>
                  <button
                    className="edit-btn"
                    onClick={() => {
                      setEditingId(supplier._id);
                      setFormData(supplier);
                      setShowForm(true);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => deleteSupplier(supplier._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {/* MODAL */}
      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <h3>{editingId ? "Edit Supplier" : "Add Supplier"}</h3>

            <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} />
            <input name="contact" placeholder="Contact Person" value={formData.contact} onChange={handleChange} />
            <input name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} />
            <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
            <input name="category" placeholder="Category" value={formData.category} onChange={handleChange} />

            <div className="rating-stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={star <= formData.rating ? "star active" : "star"}
                  onClick={() => setRating(star)}
                >
                  ★
                </span>
              ))}
            </div>

            <div className="modal-buttons">
              <button className="save-btn" onClick={addSupplier}>
                Save
              </button>
              <button className="cancel-btn" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
