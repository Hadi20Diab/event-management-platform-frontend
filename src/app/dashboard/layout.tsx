"use client";
import React from 'react';
import Navbar from '../../components/Layout/Navbar';
import Sidebar from '../../components/Layout/Sidebar';
import { useAuth } from '../../context/AuthContext';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  // const { isAdmin } = useAuth().isAdmin();
  const isAdmin = false;
  return (
    <div className="dashboard-container">
      <Navbar />
      <div className="dashboard">
        <Sidebar isAdmin={isAdmin} />
        <main className="main-content">{children}</main>
      </div>
    </div>
  );
}
