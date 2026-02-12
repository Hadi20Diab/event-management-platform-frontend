"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const pathname = usePathname();

  const handleLogout = () => logout();

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
                <span className="user-role">{isAdmin ? (isAdmin() ? 'Admin' : 'User') : 'User'}</span>
              </div>
              <button onClick={handleLogout} className="btn btn-danger">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className={`nav-link ${pathname === '/login' ? 'active' : ''}`}>Login</Link>
              <Link href="/register" className={`nav-link ${pathname === '/register' ? 'active' : ''}`}>Register</Link>
              <Link href="/admin-login" className={`nav-link ${pathname === '/admin-login' ? 'active' : ''}`}>Admin</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;