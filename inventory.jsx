import React, { useState, useEffect } from 'react';
import './inventory.css';

function Inventory() {
  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    sku: "",
    name: "",
    stock: "",
    category: ""
  });

  // Fetch inventory
  const fetchInventory = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/inventory');
      const data = await res.json();
      setItems(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addItem = async () => {
    if (!formData.sku || !formData.name || !formData.stock || !formData.category) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, stock: Number(formData.stock) })
      });

      const newItem = await res.json();
      setItems([...items, newItem]);
      setFormData({ sku: "", name: "", stock: "", category: "" });
      setShowForm(false);
    } catch (err) {
      console.error(err);
    }
  };

  const exportCSV = () => {
    const header = ["SKU", "Product", "Stock", "Category"];
    const rows = items.map(i => [i.sku, i.name, i.stock, i.category]);

    const csv =
      header.join(",") + "\n" +
      rows.map(r => r.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "inventory.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="inventory-container">

      <div className="inventory-header">
        <h1>Inventory</h1>
        <div className="inventory-actions">
          <button onClick={() => setShowForm(true)}>Add Item</button>
          <button onClick={exportCSV}>Export CSV</button>
        </div>
      </div>

      <table className="inventory-table">
        <thead>
          <tr>
            <th>SKU</th>
            <th>Product</th>
            <th>Stock</th>
            <th>Category</th>
          </tr>
        </thead>
        <tbody>
          {items.map(it => (
            <tr key={it._id}>
              <td>{it.sku}</td>
              <td>{it.name}</td>
              <td className={it.stock <= 3 ? 'stock-low' : ''}>
                {it.stock}
              </td>
              <td>{it.category}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {showForm && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h2>Add New Item</h2>

            <input
              name="sku"
              placeholder="SKU"
              value={formData.sku}
              onChange={handleChange}
            />
            <input
              name="name"
              placeholder="Product Name"
              value={formData.name}
              onChange={handleChange}
            />
            <input
              type="number"
              name="stock"
              placeholder="Stock"
              value={formData.stock}
              onChange={handleChange}
            />
            <input
              name="category"
              placeholder="Category"
              value={formData.category}
              onChange={handleChange}
            />

            <div className="cust-btn">
              <button className="add-btn" onClick={addItem}>Add</button>
              <button className="cancel-btn" onClick={() => setShowForm(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Inventory;
