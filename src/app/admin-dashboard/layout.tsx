"use client";
import React, { useEffect } from "react";
import AdminSidebar from "../../components/Layout/AdminSidebar";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect non-admins to login
    if (!user || !isAdmin()) {
      router.push("/admin-login");
    }
  }, [user, router, isAdmin]);

  // Show nothing while checking user
  if (!user || !isAdmin()) return null;

  return (
    <div className="admin-dashboard-container">
      <div className="admin-dashboard">
        <AdminSidebar user={user} onLogout={logout} />
        <main className="admin-main-content">{children}</main>
      </div>
    </div>
  );
}
