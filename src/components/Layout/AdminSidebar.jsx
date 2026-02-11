"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import './AdminSidebar.css';

export default function AdminSidebar() {
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
      <div className="sidebar-footer">Admin tools</div>
    </aside>
  );
}
