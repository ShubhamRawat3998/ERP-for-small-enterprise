import React, { useState, useEffect } from "react";
import "./accounts.css";

const INVOICE_API = "http://localhost:5000/api/invoices";
const EXPENSE_API = "http://localhost:5000/api/expense";

export default function Accounts() {
  const [invoices, setInvoices] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [cashInHand, setCashInHand] = useState(10000);

  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);

  const [expenseData, setExpenseData] = useState({
    category: "",
    amount: "",
  });

  const [invoiceData, setInvoiceData] = useState({
    customer: "",
    amount: "",
    status: "Unpaid",
  });

  /* ================= FETCH DATA ================= */

  useEffect(() => {
    fetchInvoices();
    fetchExpenses();
  }, []);

  const fetchInvoices = async () => {
    const res = await fetch(INVOICE_API);
    const data = await res.json();
    setInvoices(data);
  };

  const fetchExpenses = async () => {
    const res = await fetch(EXPENSE_API);
    const data = await res.json();
    setExpenses(data);
  };

  /* ================= CALCULATIONS ================= */

  const totalRevenue = invoices
    .filter((i) => i.status === "Paid")
    .reduce((sum, i) => sum + i.amount, 0);

  const pendingReceivables = invoices
    .filter((i) => i.status === "Unpaid")
    .reduce((sum, i) => sum + i.amount, 0);

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

  const netProfit = totalRevenue - totalExpenses;

  /* ================= ACTIONS ================= */

  const addExpense = async () => {
    if (!expenseData.category || !expenseData.amount) return;

    const res = await fetch(EXPENSE_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        category: expenseData.category,
        amount: Number(expenseData.amount),
      }),
    });

    const saved = await res.json();
    setExpenses((prev)=>[saved, ...expenses]);
    setExpenseData({ category: "", amount: "" });
    setShowExpenseForm(false);
  };

  const addInvoice = async () => {
    if (!invoiceData.customer || !invoiceData.amount) return;

    const res = await fetch(INVOICE_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customer: invoiceData.customer,
        amount: Number(invoiceData.amount),
        status: invoiceData.status,
      }),
    });

    const saved = await res.json();
    setInvoices([saved, ...invoices]);
    setInvoiceData({ customer: "", amount: "", status: "Unpaid" });
    setShowInvoiceForm(false);
  };

  const toggleInvoiceStatus = async (id) => {
    const res = await fetch(`${INVOICE_API}/${id}/toggle`, {
      method: "PUT",
    });

    const updated = await res.json();
    setInvoices(
      invoices.map((inv) => (inv._id === updated._id ? updated : inv))
    );
  };

  /* ================= UI ================= */

  return (
    <div className="accounts-container">
      <h2 className="section-title">Accounts & Finance Dashboard</h2>

      {/* DASHBOARD */}
      <div className="dashboard-grid">
        <div className="card"><h3>Total Revenue</h3><p>₹ {totalRevenue}</p></div>
        <div className="card"><h3>Total Expenses</h3><p>₹ {totalExpenses}</p></div>
        <div className="card"><h3>Net Profit</h3><p>₹ {netProfit}</p></div>
        <div className="card"><h3>Pending Receivables</h3><p>₹ {pendingReceivables}</p></div>
        <div className="card"><h3>Cash in Hand</h3><p>₹ {cashInHand}</p></div>
      </div>

      {/* INVOICES */}
      <h2 className="section-title">
        Customer Invoices
        <button onClick={() => setShowInvoiceForm(true)} className="add-btn">
          + Add
        </button>
      </h2>

      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Customer</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((inv, idx) => (
            <tr key={inv._id}>
              <td>{idx + 1}</td>
              <td>{inv.customer}</td>
              <td>₹ {inv.amount}</td>
              <td
                className={inv.status === "Paid" ? "paid" : "unpaid"}
                onClick={() => toggleInvoiceStatus(inv._id)}
                style={{ cursor: "pointer" }}
              >
                {inv.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* EXPENSES */}
      <h2 className="section-title">
        Expenses
        <button onClick={() => setShowExpenseForm(true)} className="add-btn">
          + Add
        </button>
      </h2>

      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Category</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((exp, idx) => (
            <tr key={exp._id}>
              <td>{idx + 1}</td>
              <td>{exp.category}</td>
              <td>₹ {exp.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ADD EXPENSE MODAL */}
      {showExpenseForm && (
        <div className="modal">
          <div className="modal-content">
            <h3>Add Expense</h3>
            <input
              placeholder="Category"
              value={expenseData.category}
              onChange={(e) =>
                setExpenseData({ ...expenseData, category: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Amount"
              value={expenseData.amount}
              onChange={(e) =>
                setExpenseData({ ...expenseData, amount: e.target.value })
              }
            />
            <button onClick={addExpense}>Save</button>
            <button onClick={() => setShowExpenseForm(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* ADD INVOICE MODAL */}
      {showInvoiceForm && (
        <div className="modal">
          <div className="modal-content">
            <h3>Add Invoice</h3>
            <input
              placeholder="Customer"
              value={invoiceData.customer}
              onChange={(e) =>
                setInvoiceData({ ...invoiceData, customer: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Amount"
              value={invoiceData.amount}
              onChange={(e) =>
                setInvoiceData({ ...invoiceData, amount: e.target.value })
              }
            />
            <select
              value={invoiceData.status}
              onChange={(e) =>
                setInvoiceData({ ...invoiceData, status: e.target.value })
              }
            >
              <option>Unpaid</option>
              <option>Paid</option>
            </select>
            <button onClick={addInvoice}>Save</button>
            <button onClick={() => setShowInvoiceForm(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
