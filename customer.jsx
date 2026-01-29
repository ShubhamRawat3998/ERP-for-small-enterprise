import React, { useState, useEffect } from "react";
import "./customer.css";

function Customer() {
  const [customers, setCustomers] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [darkMode, setDarkMode] = useState(false);
  const [editData, setEditData] = useState(null);

  const API_URL = "http://localhost:5000/api/customer";

  // Fetch customers from backend
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();
        setCustomers(data);
      } catch (err) {
        console.error("Failed to fetch customers:", err);
      }
    };
    fetchCustomers();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddCustomer = async () => {
    if (!formData.name || !formData.email || !formData.phone) return;
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const newCustomer = await res.json();
      setCustomers([...customers, newCustomer]);
      setFormData({ name: "", email: "", phone: "", address: "" });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      setCustomers(customers.filter((c) => c._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (customer) => {
    setEditData({ ...customer });
  };

  const handleUpdateCustomer = async () => {
    try {
      const res = await fetch(`${API_URL}/${editData._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });
      const updated = await res.json();
      setCustomers(customers.map((c) => (c._id === updated._id ? updated : c)));
      setEditData(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={darkMode ? "customer-container dark-mode" : "customer-container"}>
      <button className="dark-toggle" onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? "Light Mode" : "Dark Mode"}
      </button>

      <h2 className="title">Customer Management</h2>

      {/* Add Customer Form */}
      <div className="form-grid">
        <input
          type="text"
          name="name"
          placeholder="Customer Name"
          value={formData.name}
          onChange={handleChange}
          className="input-box"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="input-box"
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          className="input-box"
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          className="input-box"
        />
      </div>
      <button onClick={handleAddCustomer} className="add-btn">
        Add Customer
      </button>

      {/* Customer Table */}
      <div className="table-wrapper">
        <table className="customer-table">
          <thead>
            <tr className="table-header">
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((cust) => (
              <tr key={cust._id} className="table-row">
                <td>{cust.name}</td>
                <td>{cust.email}</td>
                <td>{cust.phone}</td>
                <td>{cust.address}</td>
                <td>
                  <button onClick={() => handleEdit(cust)} className="edit-btn">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(cust._id)} className="delete-btn">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editData && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Edit Customer</h3>
            <input
              type="text"
              name="name"
              value={editData.name}
              onChange={(e) => setEditData({ ...editData, name: e.target.value })}
              className="input-box"
            />
            <input
              type="email"
              name="email"
              value={editData.email}
              onChange={(e) => setEditData({ ...editData, email: e.target.value })}
              className="input-box"
            />
            <input
              type="text"
              name="phone"
              value={editData.phone}
              onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
              className="input-box"
            />
            <input
              type="text"
              name="address"
              value={editData.address}
              onChange={(e) => setEditData({ ...editData, address: e.target.value })}
              className="input-box"
            />
            <button className="update-btn" onClick={handleUpdateCustomer}>
              Update
            </button>
            <button className="close-btn" onClick={() => setEditData(null)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
export default Customer;
