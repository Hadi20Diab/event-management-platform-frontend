import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaHome, FaCalendarAlt, FaList, FaUsersCog } from 'react-icons/fa';

const Sidebar = () => {
  const { isAdmin } = useAuth();

  const userLinks = [
    { to: '/dashboard', icon: <FaHome />, label: 'Dashboard' },
    { to: '/events', icon: <FaCalendarAlt />, label: 'All Events' },
    { to: '/my-events', icon: <FaList />, label: 'My Events' },
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
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => 
              `sidebar-link ${isActive ? 'active' : ''}`
            }
          >
            {link.icon}
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;