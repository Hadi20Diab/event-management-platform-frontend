"use client";
import React from 'react';
import Sidebar from '@/components/Layout/Sidebar';
import { useAuth } from '@/context/AuthContext';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();

  return (
    <div className="dashboard-container">
      <div className="dashboard">
        <Sidebar user={user} onLogout={logout} />
        <main className="main-content">{children}</main>
      </div>
    </div>
  );
}
