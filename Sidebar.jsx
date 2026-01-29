import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

function Sidebar({ isOpen, toggleSidebar }) {
  const location = useLocation();

  // optional: highlight active link
  const isActive = (path) => location.pathname === path;

  return (
    <>
      <button className="toggle-btn" onClick={toggleSidebar}>
        {isOpen ? '☰' : '→'}
      </button>

      <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <h2>{isOpen ? 'Menu' : 'M'}</h2>
        </div>

        <nav className="sidebar-nav">
          <ul>
            <li>
              <Link
                to="/app/dashboard"
                className={`nav-link ${isActive('/app/dashboard') ? 'active' : ''}`}
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/app/inventory"
                className={`nav-link ${isActive('/app/inventory') ? 'active' : ''}`}
              >
                Inventory
              </Link>
            </li>
            <li>
              <Link
                to="/app/salesbilling"
                className={`nav-link ${isActive('/app/salesbilling') ? 'active' : ''}`}
              >
                Sales & Billing
              </Link>
            </li>
            <li>
              <Link
                to="/app/purchaseorder"
                className={`nav-link ${isActive('/app/purchaseorder') ? 'active' : ''}`}
              >
                Purchase Orders
              </Link>
            </li>
            <li>
              <Link
                to="/app/staffmanagement"
                className={`nav-link ${isActive('/app/staffmanagement') ? 'active' : ''}`}
              >
                Staff & Attendance
              </Link>
            </li>
            <li>
              <Link
                to="/app/customers"
                className={`nav-link ${isActive('/app/customers') ? 'active' : ''}`}
              >
                Customers
              </Link>
            </li>
            <li>
              <Link
                to="/app/suppliers"
                className={`nav-link ${isActive('/app/suppliers') ? 'active' : ''}`}
              >
                Suppliers
              </Link>
            </li>
          </ul>
        </nav>
      </aside>
    </>
  );
}
export default Sidebar;
