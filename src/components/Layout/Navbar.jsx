import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="navbar">
      <div className="container navbar-content">
        <Link to="/dashboard" className="nav-logo">
          Event Manager
        </Link>

        <div className="nav-links">
          <div className="user-info">
            <span>Welcome, {user.name}</span>
            <span className="user-role">
              {isAdmin() ? 'Admin' : 'User'}
            </span>
          </div>

          <button onClick={handleLogout} className="btn btn-danger">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;