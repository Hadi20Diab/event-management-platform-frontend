"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaTachometerAlt,
  FaCalendarAlt,
  FaUsers,
  FaChartBar,
  FaUserShield,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import "./AdminSidebar.css";

export default function AdminSidebar({ user, onLogout }) {
  const pathname = usePathname();
  const { isSuperAdmin } = useAuth();

  // Default sidebar items
  const items = [
    { href: '/admin-dashboard/dashboard', label: 'Dashboard', icon: <FaTachometerAlt /> },
    { href: '/admin-dashboard/manage-events', label: 'Manage Events', icon: <FaCalendarAlt /> },
    { href: '/admin-dashboard/users', label: 'Users', icon: <FaUsers /> },
    { href: '/admin-dashboard/reports', label: 'Reports', icon: <FaChartBar /> },
  ];

  // If superAdmin, add Manage Admins link
  if (isSuperAdmin()) {
    items.splice(3, 0, {
      // insert before Reports
      href: "/admin-dashboard/admins",
      label: "Manage Admins",
      icon: <FaUserShield />,
    });
  }

  return (
    <aside className="sidebar admin-sidebar">
      <nav className="sidebar-nav">
        <div className="sidebar-brand">Admin Panel</div>
        {items.map((it) => (
          <Link
            key={it.href + it.label}
            href={it.href}
            className={`sidebar-link ${pathname === it.href ? "active" : ""}`}
          >
            <span className="sidebar-icon">{it.icon}</span>
            <span className="sidebar-link-text">{it.label}</span>
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">
        {user ? (
          <div className="user-row">
            <div className="avatar">
              {user.name ? user.name.charAt(0).toUpperCase() : "A"}
            </div>
            <div className="user-info">
              <div className="user-name">{user.name}</div>
              <div className="user-role">
                {isSuperAdmin() ? "Super Admin" : "Admin"}
              </div>
            </div>
            <button
              className="btn btn-ghost logout-btn"
              onClick={() => onLogout && onLogout()}
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="user-row">
            <Link href="/admin-login" className="sidebar-link">
              Admin Login
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
}
