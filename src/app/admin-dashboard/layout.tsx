"use client";
import React from 'react';
import AdminSidebar from '../../components/Layout/AdminSidebar';
import { useAuth } from '../../context/AuthContext';

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();

  return (
    <div className="admin-dashboard-container">
      <div className="admin-dashboard">
        <AdminSidebar user={user} onLogout={logout} />
        <main className="admin-main-content">{children}</main>
      </div>
    </div>
  );
}
