"use client";
import React from 'react';
import Navbar from '../../components/Layout/Navbar';
import Sidebar from '../../components/Layout/Sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="dashboard-container">
      <Navbar />
      <div className="dashboard">
        <Sidebar />
        <main className="main-content">{children}</main>
      </div>
    </div>
  );
}
