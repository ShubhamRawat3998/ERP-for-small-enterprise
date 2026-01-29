import { useState } from "react";
import axios from "axios";
import "./purchaseorder.css";

function PurchaseOrder() {
  // Supplier details
  const [supplierName, setSupplierName] = useState("");
  const [supplierContact, setSupplierContact] = useState("");

  // Items
  const [items, setItems] = useState([
    { name: "", quantity: "", price: "" }
  ]);

  // Add new item row
  const addItem = () => {
    setItems([...items, { name: "", quantity: "", price: "" }]);
  };

  // Update item
  const updateItem = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;
    setItems(updatedItems);
  };

  // Delete item
  const deleteItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  // Calculate total
  const grandTotal = items.reduce(
    (sum, item) =>
      sum + Number(item.quantity || 0) * Number(item.price || 0),
    0
  );

  // Submit purchase order
const submitPurchaseOrder = async () => {
  try {
    const token = sessionStorage.getItem("token");
    if (!token) return alert("Please login first");

    if (!supplierName || !supplierContact) return alert("Fill supplier details");
    if (items.length === 0) return alert("Add at least one item");

    const formattedItems = items.map(item => ({
      name: item.name,
      quantity: Number(item.quantity),
      price: Number(item.price)
    }));

    console.log("Submitting purchase order:", { supplierName, supplierContact, items: formattedItems });

    const res = await axios.post(
      "http://localhost:5000/api/purchase-orders",
      { supplierName, supplierContact, items: formattedItems },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    console.log("Response:", res.data);
    alert("Purchase order submitted successfully!");

    // Reset form
    setSupplierName("");
    setSupplierContact("");
    setItems([{ name: "", quantity: "", price: "" }]);

  } catch (err) {
    console.error("Submission error:", err.response?.data || err.message);
    alert("Error submitting purchase order");
  }
};
  return (
    <div className="po-container">
      <h2 className="po-header">Purchase Order</h2>

      {/* Supplier Section */}
      <div className="po-section">
        <h3>Supplier Details</h3>
        <div className="po-row">
          <input
            type="text"
            placeholder="Supplier Name"
            value={supplierName}
            onChange={(e) => setSupplierName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Supplier Contact"
            value={supplierContact}
            onChange={(e) => setSupplierContact(e.target.value)}
          />
        </div>
      </div>

      {/* Items Section */}
      <div className="po-section">
        <h3>Items</h3>
        <table className="po-table">
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Total</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index}>
                <td>
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) =>
                      updateItem(index, "name", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      updateItem(index, "quantity", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={item.price}
                    onChange={(e) =>
                      updateItem(index, "price", e.target.value)
                    }
                  />
                </td>
                <td>
                  {Number(item.quantity || 0) * Number(item.price || 0)}
                </td>
                <td>
                  <button
                    className="btn delete-btn"
                    onClick={() => deleteItem(index)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button className="btn add-btn" onClick={addItem}>
          + Add Item
        </button>
      </div>

      {/* Total */}
      <h3 style={{ textAlign: "right" }}>
        Grand Total: ₹{grandTotal}
      </h3>

      {/* Submit */}
      <button className="btn submit-btn" onClick={submitPurchaseOrder}>
        Submit Purchase Order
      </button>
    </div>
  );
}

export default PurchaseOrder;
