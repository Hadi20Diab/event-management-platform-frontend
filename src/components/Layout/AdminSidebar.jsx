"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaTachometerAlt, FaCalendarAlt, FaUsers, FaChartBar } from 'react-icons/fa';
import './AdminSidebar.css';

export default function AdminSidebar({ user, onLogout }) {
  const pathname = usePathname();

  const items = [
    { href: '/admin-dashboard/Dashboard', label: 'Dashboard', icon: <FaTachometerAlt /> },
    { href: '/admin-dashboard/Manage-Events', label: 'Manage Events', icon: <FaCalendarAlt /> },
    { href: '/admin-dashboard/Users', label: 'Users', icon: <FaUsers /> },
    { href: '/admin-dashboard/Reports', label: 'Reports', icon: <FaChartBar /> },
  ];

  return (
    <aside className="sidebar admin-sidebar">
      <nav className="sidebar-nav">
        <div className="sidebar-brand">Admin Panel</div>
        {items.map((it) => (
          <Link key={it.href + it.label} href={it.href} className={`sidebar-link ${pathname === it.href ? 'active' : ''}`}>
            <span className="sidebar-icon">{it.icon}</span>
            <span className="sidebar-link-text">{it.label}</span>
          </Link>
        ))}
      </nav>
      <div className="sidebar-footer">
        {user ? (
          <div className="user-row">
            <div className="avatar">{user.name ? user.name.charAt(0).toUpperCase() : 'A'}</div>
            <div className="user-info">
              <div className="user-name">{user.name}</div>
              <div className="user-role">Admin</div>
            </div>
            <button className="btn btn-ghost logout-btn" onClick={() => onLogout && onLogout()}>
              Logout
            </button>
          </div>
        ) : (
          <div className="user-row">
            <Link href="/admin-login" className="sidebar-link">Admin Login</Link>
          </div>
        )}
      </div>
    </aside>
  );
}
