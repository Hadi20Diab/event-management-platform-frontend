"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import './AdminSidebar.css';

export default function AdminSidebar({ user, onLogout }) {
  const pathname = usePathname();

  const items = [
    { href: '/admin-dashboard', label: 'Dashboard' },
    { href: '/admin-dashboard', label: 'Manage Events' },
    { href: '/admin-dashboard', label: 'Users' },
    { href: '/admin-dashboard', label: 'Reports' },
  ];

  return (
    <aside className="sidebar admin-sidebar">
      <div className="sidebar-brand">Admin</div>
      <nav className="sidebar-nav">
        {items.map((it) => (
          <Link key={it.href + it.label} href={it.href} className={`sidebar-link ${pathname === it.href ? 'active' : ''}`}>
            <span className="sidebar-link-text">{it.label}</span>
          </Link>
        ))}
      </nav>
      <div className="sidebar-user">
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
      <div className="sidebar-footer">Admin tools</div>
    </aside>
  );
}
