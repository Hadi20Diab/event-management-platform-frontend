"use client";
import React from 'react';
import Navbar from '@/components/Layout/Navbar';
import Sidebar from '@/components/Layout/Sidebar';
import { useAuth } from '@/context/AuthContext';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAdmin } = useAuth();
  const adminFlag = typeof isAdmin === 'function' ? isAdmin() : false;

  return (
    <div className="dashboard-container">
      <Navbar />
      <div className="dashboard">
        <Sidebar isAdmin={adminFlag} />
        <main className="main-content">{children}</main>
      </div>
    </div>
  );
}
