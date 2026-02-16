"use client";
import React, { useState, useEffect } from "react";
import { apiRequest } from "../../../api/api";
import "@/app/page.css";

interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  registeredEvents?: string[];
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
  registeredAt: string;
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
      setUsers(response);
    } catch (error: any) {
      setError(error.message || "Failed to fetch users");
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await apiRequest("/events");
      setEvents(response.events || response);
    } catch (error: any) {
      console.error("Failed to fetch events:", error);
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      await apiRequest(`/users/${userId}`, "DELETE");
      setUsers(users.filter((user) => user._id !== userId));
      
      if (showEventsForUser === userId) {
        setShowEventsForUser(null);
        setSelectedUserEvents([]);
      }
      
      alert("User deleted successfully");
    } catch (error: any) {
      alert("Error deleting user: " + error.message);
    }
  };

  const handleViewEvents = async (userId: string) => {
    if (showEventsForUser === userId) {
      // If clicking the same user again, hide events
      setShowEventsForUser(null);
      setSelectedUserEvents([]);
      return;
    }

    try {
      setLoadingUserEvents(true);
      setShowEventsForUser(userId);
      
      const response = await apiRequest(`/register/user/${userId}`);
      setSelectedUserEvents(response.registrations || response);
    } catch (error: any) {
      console.error("Failed to fetch user events:", error);
      setSelectedUserEvents([]);
      alert("Error loading user events: " + error.message);
    } finally {
      setLoadingUserEvents(false);
    }
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase())
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
          style={{
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ddd",
            flex: 1,
          }}
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
              <p style={{ textAlign: "center" }}>
                {search ? "No users match your search criteria" : "No users found"}
              </p>
            </div>
          </div>
        ) : (
          filteredUsers.map((user) => (
            <div key={user._id} className="event-card">
              <div className="event-header">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <h3 className="event-title">{user.name}</h3>
                    <p style={{ margin: 0, color: "#666" }}>{user.email}</p>
                  </div>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button
                      className="btn btn-secondary"
                      onClick={() => handleViewEvents(user._id)}
                      style={{ fontSize: "14px", padding: "5px 10px" }}
                    >
                      {showEventsForUser === user._id ? "Hide" : "View"} Events
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(user._id)}
                      style={{ fontSize: "14px", padding: "5px 10px" }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>

              <div className="event-body">
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "15px" }}>
                  <div>
                    <strong>Phone:</strong>
                    <p style={{ margin: "5px 0" }}>{user.phone || "N/A"}</p>
                  </div>
                  {user.createdAt && (
                    <div>
                      <strong>Joined:</strong>
                      <p style={{ margin: "5px 0" }}>
                        {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>

                {/* User Events Section */}
                {showEventsForUser === user._id && (
                  <div style={{ marginTop: "20px", borderTop: "1px solid #eee", paddingTop: "15px" }}>
                    <h4>Registered Events:</h4>
                    {loadingUserEvents ? (
                      <p>Loading events...</p>
                    ) : selectedUserEvents.length === 0 ? (
                      <p style={{ color: "#666" }}>This user hasn't registered for any events.</p>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        {selectedUserEvents.map((registration) => (
                          <div
                            key={registration._id}
                            style={{
                              padding: "8px 12px",
                              backgroundColor: "#f8f9fa",
                              borderRadius: "6px",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <div>
                              <strong>{registration.event.title}</strong>
                              <br />
                              <small style={{ color: "#666" }}>
                                {new Date(registration.event.date).toLocaleDateString()}
                              </small>
                            </div>
                            <span
                              style={{
                                padding: "2px 8px",
                                backgroundColor: "#007bff",
                                color: "white",
                                borderRadius: "12px",
                                fontSize: "12px",
                              }}
                            >
                              {registration.event.category}
                            </span>
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

    // Get eventIds the user is registered in
    const registeredEventIds = mockRegistrations
      .filter((r) => r.userId === userId)
      .map((r) => r.eventId);

    setSelectedUserEvents(registeredEventIds);
    setShowEventsForUser(userId);
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <section className="admin-dashboard-container">
      <div className="admin-header">
        <div>
          <h1>Manage Users</h1>
          <p>View, edit and manage system users</p>
        </div>
      </div>

      <div className="admin-actions">
        <div className="form-group" style={{ flex: 1 }}>
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: "50%" }}
          />
        </div>
      </div>

      <div className="events-grid">
        {filteredUsers.map((user) => (
          <div key={user.id} className="event-card">
            <div className="event-header">
              <h3 className="event-title">{user.name}</h3>
            </div>

            <div className="event-body">
              <p>Email: {user.email}</p>
              <p>Phone Number: {user.phone}</p>

              {/* Show events if this user is selected */}
              {showEventsForUser === user.id &&
                selectedUserEvents.length > 0 && (
                  <div className="registered-events">
                    <strong>Registered Events:</strong>
                    <ul>
                      {selectedUserEvents.map((eventId) => {
                        const event = mockEvents.find((e) => e.id === eventId);
                        return <li key={eventId}>{event?.title}</li>;
                      })}
                    </ul>
                  </div>
                )}

              {showEventsForUser === user.id &&
                selectedUserEvents.length === 0 && (
                  <p>This user is not registered in any events.</p>
                )}
            </div>

            <div className="event-footer">
              <button
                className="btn btn-view"
                onClick={() => handleViewEvents(user.id)}
              >
                {showEventsForUser === user.id
                  ? "Hide Events"
                  : "View Registered Events"}
              </button>

              <button
                className="btn btn-danger"
                onClick={() => handleDelete(user.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className="empty-state">
          <h3>No users found</h3>
        </div>
      )}
    </section>
  );
}
