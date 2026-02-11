"use client";
import React from 'react';
import Navbar from '../../components/Layout/Navbar';
import AdminSidebar from '../../components/Layout/AdminSidebar';

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-dashboard-container">
      <Navbar />
      <div className="admin-dashboard">
        <AdminSidebar />
        <main className="admin-main-content">{children}</main>
      </div>
    </div>
  );
}
