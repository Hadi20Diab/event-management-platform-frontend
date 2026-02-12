"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAdmin, isSuperAdmin } = useAuth();
  const pathname = usePathname();

  const handleLogout = () => logout();

  // Determine the role label for display
  const getRoleLabel = () => {
    if (isSuperAdmin()) return "Super Admin";
    if (isAdmin()) return "Admin";
    return "User";
  };

  return (
    <nav className="navbar">
      <div className="container navbar-content">
        <Link href="/dashboard" className="nav-logo">
          Event Manager
        </Link>

        <div className="nav-links">
          {user ? (
            <>
              <div className="user-info">
                <span>Welcome, {user.name}</span>
                <span className="user-role">{getRoleLabel()}</span>
              </div>
              <button onClick={handleLogout} className="btn btn-danger">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className={`nav-link ${pathname === '/login' ? 'active' : ''}`}
              >
                Login
              </Link>
              <Link
                href="/register"
                className={`nav-link ${pathname === '/register' ? 'active' : ''}`}
              >
                Register
              </Link>
              <Link
                href="/admin-login"
                className={`nav-link ${pathname === '/admin-login' ? 'active' : ''}`}
              >
                Admin
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
