"use client";
import React, { useEffect } from "react";
import Sidebar from "@/components/Layout/Sidebar";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    if (isAdmin()) {
      router.push("/admin-dashboard");
    }
  }, [user, isAdmin, router]);

  if (!user || isAdmin()) return null;

  return (
    <div className="dashboard-container">
      <div className="dashboard">
        <Sidebar user={user} onLogout={logout} />
        <main className="main-content">{children}</main>
      </div>
    </div>
  );
}
