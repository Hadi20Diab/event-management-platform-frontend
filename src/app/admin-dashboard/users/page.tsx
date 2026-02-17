"use client";
import React, { useState, useEffect } from "react";
import { apiRequest } from "../../../api/api";
import "@/app/page.css";

interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  createdAt?: string;
}

interface Event {
  _id: string;
  title: string;
  date: string;
  category: string;
}

interface Registration {
  _id: string;
  event: Event;
  user: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedUserEvents, setSelectedUserEvents] = useState<Registration[]>([]);
  const [showEventsForUser, setShowEventsForUser] = useState<string | null>(null);
  const [loadingUserEvents, setLoadingUserEvents] = useState(false);

  useEffect(() => {
    fetchUsers();
    fetchEvents();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await apiRequest("/users");
      setUsers(response.users || response);
    } catch (err: any) {
      setError(err.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await apiRequest("/events");
      const eventsData = response?.data || response?.events || response || [];
      setEvents(Array.isArray(eventsData) ? eventsData : []);
    } catch (err) {
      console.error("Failed to fetch events:", err);
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await apiRequest(`/users/${userId}`, "DELETE");
      setUsers((prev) => prev.filter((u) => u._id !== userId));
      if (showEventsForUser === userId) {
        setShowEventsForUser(null);
        setSelectedUserEvents([]);
      }
      alert("User deleted successfully");
    } catch (err: any) {
      alert("Error deleting user: " + err.message);
    }
  };

  const handleViewEvents = async (userId: string) => {
    if (showEventsForUser === userId) {
      setShowEventsForUser(null);
      setSelectedUserEvents([]);
      return;
    }

    try {
      setLoadingUserEvents(true);
      setShowEventsForUser(userId);
      const response = await apiRequest(`/register/user/${userId}`);
      const regs = response?.data || response?.registrations || response || [];
      setSelectedUserEvents(Array.isArray(regs) ? regs : []);
    } catch (err: any) {
      console.error(err);
      setSelectedUserEvents([]);
      alert("Error loading user events: " + err.message);
    } finally {
      setLoadingUserEvents(false);
    }
  };

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div>Loading users...</div>;
  if (error) return <div style={{ color: "red" }}>Error: {error}</div>;

  return (
    <section className="admin-dashboard-container">
      <div className="admin-header">
        <div>
          <h1>Manage Users</h1>
          <p>View and manage platform users and their event registrations</p>
        </div>
      </div>

      {/* Search Controls */}
      <div style={{ display: "flex", gap: "20px", marginBottom: "30px", alignItems: "center" }}>
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: "10px", borderRadius: "8px", border: "1px solid #ddd", flex: 1 }}
        />
        <button className="btn btn-primary" onClick={fetchUsers}>
          Refresh
        </button>
      </div>

      {/* Users List */}
      <div className="events-grid" style={{ gridTemplateColumns: "1fr" }}>
        {filteredUsers.length === 0 ? (
          <div className="event-card">
            <div className="event-body">
              <p style={{ textAlign: "center" }}>{search ? "No users match your search criteria" : "No users found"}</p>
            </div>
          </div>
        ) : (
          filteredUsers.map((u) => (
            <div key={u._id} className="event-card">
              <div className="event-header">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <h3 className="event-title">{u.name}</h3>
                    <p style={{ margin: 0, color: "#666" }}>{u.email}</p>
                  </div>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button className="btn btn-secondary" onClick={() => handleViewEvents(u._id)} style={{ fontSize: "14px", padding: "5px 10px" }}>
                      {showEventsForUser === u._id ? "Hide" : "View"} Events
                    </button>
                    <button className="btn btn-danger" onClick={() => handleDelete(u._id)} style={{ fontSize: "14px", padding: "5px 10px" }}>
                      Delete
                    </button>
                  </div>
                </div>
              </div>

              <div className="event-body">
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "15px" }}>
                  <div>
                    <strong>Phone:</strong>
                    <p style={{ margin: "5px 0" }}>{u.phone || "N/A"}</p>
                  </div>
                  {u.createdAt && (
                    <div>
                      <strong>Joined:</strong>
                      <p style={{ margin: "5px 0" }}>{new Date(u.createdAt).toLocaleDateString()}</p>
                    </div>
                  )}
                </div>

                {showEventsForUser === u._id && (
                  <div style={{ marginTop: "20px", borderTop: "1px solid #eee", paddingTop: "15px" }}>
                    <h4>Registered Events:</h4>
                    {loadingUserEvents ? (
                      <p>Loading events...</p>
                    ) : selectedUserEvents.length === 0 ? (
                      <p style={{ color: "#666" }}>This user hasn't registered for any events.</p>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        {selectedUserEvents.map((registration) => (
                          <div key={registration._id} style={{ padding: "8px 12px", backgroundColor: "#f8f9fa", borderRadius: "6px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div>
                              <strong>{registration.event.title}</strong>
                              <br />
                              <small style={{ color: "#666" }}>{new Date(registration.event.date).toLocaleDateString()}</small>
                            </div>
                            <span style={{ padding: "2px 8px", backgroundColor: "#007bff", color: "white", borderRadius: "12px", fontSize: "12px" }}>{registration.event.category}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
