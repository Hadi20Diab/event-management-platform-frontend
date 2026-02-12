"use client";
import React from "react";
import "@/app/page.css";

export default function ReportsPage() {
  const reportData = {
    totalRevenue: "12,430",
    totalTicketsSold: 4285,
    totalEvents: 12,
    activeUsers: 248,
  };

  const topEvents = [
    { id: 1, title: "Summer Music Festival", revenue: 7500 },
    { id: 2, title: "React Masterclass", revenue: 4930 },
  ];

  return (
    <section className="admin-dashboard-container">
      <div className="admin-header">
        <div>
          <h1>Reports & Analytics</h1>
          <p>Overview of system performance</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="events-grid">
        <div className="event-card">
          <div className="event-body">
            <h3>Total Revenue</h3>
            <h2>${reportData.totalRevenue}</h2>
          </div>
        </div>

        <div className="event-card">
          <div className="event-body">
            <h3>Tickets Sold</h3>
            <h2>{reportData.totalTicketsSold}</h2>
          </div>
        </div>

        <div className="event-card">
          <div className="event-body">
            <h3>Total Events</h3>
            <h2>{reportData.totalEvents}</h2>
          </div>
        </div>

        <div className="event-card">
          <div className="event-body">
            <h3>Active Users</h3>
            <h2>{reportData.activeUsers}</h2>
          </div>
        </div>
      </div>

      {/* Top Events */}
      <div style={{ marginTop: "40px" }}>
        <h2 style={{ marginBottom: "20px" }}>Top Performing Events</h2>

        <div className="events-grid">
          {topEvents.map((event) => (
            <div key={event.id} className="event-card">
              <div className="event-body">
                <h3>{event.title}</h3>
                <p>Revenue Generated</p>
                <h2>${event.revenue}</h2>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
