"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { FaHome, FaCalendarAlt, FaList, FaUsersCog } from 'react-icons/fa';

const Sidebar = () => {
  const { isAdmin } = useAuth();

  const pathname = usePathname();

  const userLinks = [
    { to: '/dashboard', icon: <FaHome />, label: 'Dashboard' },
    { to: '/dashboard/events', icon: <FaCalendarAlt />, label: 'All Events' },
    { to: '/dashboard/my-events', icon: <FaList />, label: 'My Events' },
  ];

  const adminLinks = [
    ...userLinks,
    { to: '/admin/events', icon: <FaUsersCog />, label: 'Manage Events' },
  ];

  const links = isAdmin() ? adminLinks : userLinks;

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        {links.map((link) => (
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
    </aside>
  );
};

export default Sidebar;