"use client";
import React, { useEffect, useState } from "react";
import { apiRequest } from "../../../api/api";
import "@/app/page.css";

export default function ReportsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const res = await apiRequest("/reports");
        const payload = res?.data || res;
        setData(payload);
      } catch (err: any) {
        setError(err.message || "Failed to load reports");
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  if (loading) return <div>Loading reports...</div>;
  if (error) return <div style={{ color: "red" }}>Error: {error}</div>;

  const reportData = data || {};
  const topEvents = reportData.topEvents || [];

  return (
    <section className="admin-dashboard-container">
      <div className="admin-header">
        <div>
          <h1>Reports & Analytics</h1>
          <p>Overview of system performance</p>
        </div>
      </div>

      <div className="events-grid">
        <div className="event-card">
          <div className="event-body">
            <h3>Total Revenue</h3>
            <h2>${reportData.totalRevenue ?? "0"}</h2>
          </div>
        </div>

        <div className="event-card">
          <div className="event-body">
            <h3>Tickets Sold</h3>
            <h2>{reportData.totalTicketsSold ?? 0}</h2>
          </div>
        </div>

        <div className="event-card">
          <div className="event-body">
            <h3>Total Events</h3>
            <h2>{reportData.totalEvents ?? 0}</h2>
          </div>
        </div>

        <div className="event-card">
          <div className="event-body">
            <h3>Active Users</h3>
            <h2>{reportData.activeUsers ?? 0}</h2>
          </div>
        </div>
      </div>

      <div style={{ marginTop: "40px" }}>
        <h2 style={{ marginBottom: "20px" }}>Top Performing Events</h2>

        <div className="events-grid">
          {topEvents.length === 0 ? (
            <div className="event-card">
              <div className="event-body">
                <p style={{ textAlign: "center" }}>No top events yet</p>
              </div>
            </div>
          ) : (
            topEvents.map((ev: any) => (
              <div key={ev.eventId || ev._id || ev.title} className="event-card">
                <div className="event-body">
                  <h3>{ev.title || ev.event?.title}</h3>
                  <p>Tickets: {ev.tickets}</p>
                  <h2>${ev.revenue ?? 0}</h2>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
