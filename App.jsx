import React,{useState} from  "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";

// Pages
import Dashboard from "./pages/Dashboard.jsx";
import Inventory from "./pages/inventory.jsx";
import Salesbilling from "./pages/Salesbilling.jsx";
import PurchaseOder from "./pages/purchaseorder.jsx";
import Staffmanagement from "./pages/staffmanagement.jsx";
import Customer from "./pages/customer.jsx";
import Supplier from "./pages/supplier.jsx";
import Account from "./pages/accounts.jsx";
// Auth
import Login from "./authlayout/Login.jsx";
import Signup from "./authlayout/Signup.jsx";
import ForgotPassword from "./authlayout/ForgotPassword.jsx";
import ProtectedRoute from "./authlayout/ProtectedRoute.jsx";
import ResetPassword from "./authlayout/ResetPassword.jsx";
// Layout wrapper for protected pages
const Layout = () => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div className={`layout ${isOpen ? '' : 'sidebar-collapsed'}`}>
      <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
      <main className="main-content" style={{ marginLeft: isOpen ? 230 : 60 }}>
        <Routes>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="salesbilling" element={<Salesbilling />} />
          <Route path="purchaseorder" element={<PurchaseOder />} />
          <Route path="staffmanagement" element={<Staffmanagement />} />
          <Route path="customers" element={<Customer />} />
          <Route path="suppliers" element={<Supplier />} />
          <Route path="accounts" element={<Account />} />
          <Route path="*" element={<Navigate to="dashboard" />} />
        </Routes>
      </main>
    </div>
  );
};
function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        {/* Protected routes under /app */}
        <Route
          path="/app/*"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        />

        {/* Redirect unknown routes to login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
