"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { apiRequest } from "../../api/api";
import "@/app/page.css";

interface DashboardStats {
  totals: {
    users: number;
    events: number;
    activeEvents: number;
    revenue: number;
  };
  recentActivity: {
    events: any[];
    users: any[];
    registrations: any[];
  };
}

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await apiRequest("/dashboard/stats");
        setStats(response.data);
      } catch (error: any) {
        setError(error.message || "Failed to load dashboard statistics");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchStats();
    }
  }, [user]);

  if (loading) return <div>Loading dashboard...</div>;
  if (error) return <div style={{ color: "red" }}>Error: {error}</div>;

  const displayStats = stats ? [
    { title: "Total Events", value: stats.totals.events },
    { title: "Total Users", value: stats.totals.users },
    { title: "Active Events", value: stats.totals.activeEvents },
    { title: "Total Revenue", value: `$${stats.totals.revenue.toLocaleString()}` },
  ] : [];

  return (
    <section className="admin-dashboard-container">
      <div className="admin-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>Welcome back, {user?.name || "Admin"}</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="events-grid">
        {displayStats.map((stat, index) => (
          <div key={index} className="event-card">
            <div className="event-header">
              <h3 className="event-title">{stat.title}</h3>
            </div>

            <div className="event-body">
              <h2 style={{ fontSize: "28px", fontWeight: "bold" }}>
                {stat.value}
              </h2>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      {stats?.recentActivity && (
        <div style={{ marginTop: "40px" }}>
          <h2 style={{ marginBottom: "20px" }}>Recent Activity</h2>
          
          <div className="events-grid">
            <div className="event-card">
              <div className="event-header">
                <h3 className="event-title">Recent Events</h3>
              </div>
              <div className="event-body">
                {stats.recentActivity.events.slice(0, 3).map((event: any, index: number) => (
                  <div key={index} style={{ marginBottom: "8px" }}>
                    <strong>{event.title}</strong> - {event.status}
                  </div>
                ))}
              </div>
            </div>

            <div className="event-card">
              <div className="event-header">
                <h3 className="event-title">Recent Registrations</h3>
              </div>
              <div className="event-body">
                {stats.recentActivity.registrations.slice(0, 3).map((reg: any, index: number) => (
                  <div key={index} style={{ marginBottom: "8px" }}>
                    {reg.user?.name} → {reg.event?.title}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div style={{ marginTop: "40px" }}>
        <h2 style={{ marginBottom: "20px" }}>Quick Actions</h2>

        <div className="events-grid">
          <div className="event-card">
            <div className="event-body">
              <p style={{ marginBottom: "15px" }}>
                Create and manage events easily.
              </p>
              <button
                className="btn btn-primary"
                onClick={() => (window.location.href = "/admin-dashboard/manage-events")}
              >
                Manage Events
              </button>
            </div>
          </div>

          <div className="event-card">
            <div className="event-body">
              <p style={{ marginBottom: "15px" }}>
                View and manage platform users.
              </p>
              <button
                className="btn btn-secondary"
                onClick={() => (window.location.href = "/admin-dashboard/users")}
              >
                Manage Users
              </button>
            </div>
          </div>

          <div className="event-card">
            <div className="event-body">
              <p style={{ marginBottom: "15px" }}>
                Check reports and analytics.
              </p>
              <button
                className="btn btn-primary"
                onClick={() => (window.location.href = "/admin-dashboard/reports")}
              >
                View Reports
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
