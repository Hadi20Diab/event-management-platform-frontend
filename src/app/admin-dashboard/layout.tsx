"use client";
import React, { useEffect, useState } from "react";
import AdminSidebar from "../../components/Layout/AdminSidebar";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout, isAdmin, loading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!loading && mounted) {
      if (!user || !isAdmin()) {
        router.push("/admin-login");
      }
    }
  }, [user, isAdmin, loading, router, mounted]);

  // Show nothing while loading user or redirecting
  if (loading || !mounted || !user || !isAdmin()) return null;

  return (
    <div className="admin-dashboard-container">
      <div className="admin-dashboard">
        <AdminSidebar user={user} onLogout={logout} />
        <main className="admin-main-content">{children}</main>
      </div>
    </div>
  );
}
