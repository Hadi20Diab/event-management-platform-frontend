"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaHome, FaCalendarAlt, FaList, FaUsersCog } from 'react-icons/fa';

const Sidebar = ({ user, onLogout }) => {
  const pathname = usePathname();

  const userLinks = [
    { to: '/dashboard', icon: <FaHome />, label: 'Dashboard' },
    { to: '/dashboard/events', icon: <FaCalendarAlt />, label: 'All Events' },
    { to: '/dashboard/my-events', icon: <FaList />, label: 'My Events' },
  ];

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        {userLinks.map((link) => (
          <Link
            key={link.to}
            href={link.to}
            className={`sidebar-link ${pathname === link.to ? 'active' : ''}`}
          >
            {link.icon}
            <span>{link.label}</span>
          </Link>
        ))}
      </nav>

      <div className="sidebar-user">
        {user ? (
          <div className="user-row">
            <div className="avatar">{user.name ? user.name.charAt(0).toUpperCase() : 'U'}</div>
            <div className="user-info">
              <div className="user-name">{user.name}</div>
            </div>
            <button className="btn btn-ghost logout-btn" onClick={() => onLogout && onLogout()}>
              Logout
            </button>
          </div>
        ) : (
          <div className="user-row">
            <Link href="/login" className="sidebar-link">Login</Link>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;