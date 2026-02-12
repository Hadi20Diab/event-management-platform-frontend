"use client";
import React from "react";
import { useAuth } from "../../context/AuthContext";
import "@/app/page.css";

export default function AdminDashboardPage() {
  const { user } = useAuth();

  const stats = [
    { title: "Total Events", value: 12 },
    { title: "Total Users", value: 248 },
    { title: "Active Events", value: 8 },
    { title: "Total Revenue", value: "$12,430" },
  ];

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
        {stats.map((stat, index) => (
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

      {/* Quick Actions */}
      <div style={{ marginTop: "40px" }}>
        <h2 style={{ marginBottom: "20px" }}>Quick Actions</h2>

        <div className="events-grid">
          <div className="event-card">
            <div className="event-body">
              <p style={{ marginBottom: "15px" }}>
                Create and manage events easily.
              </p>
              <a href="/admin-dashboard/manage-events">
                <button className="btn btn-primary">Go to Events</button>
              </a>
            </div>
          </div>

          <div className="event-card">
            <div className="event-body">
              <p style={{ marginBottom: "15px" }}>
                View and manage system users.
              </p>
              <a href="/admin-dashboard/users">
                <button className="btn btn-primary">Manage Users</button>
              </a>
            </div>
          </div>

          <div className="event-card">
            <div className="event-body">
              <p style={{ marginBottom: "15px" }}>
                Check reports and analytics.
              </p>
              <a href="/admin-dashboard/reports">
                <button className="btn btn-primary">View Reports</button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
