"use client";
import React, { useState } from "react";
import "@/app/page.css";

// Mock users
const initialUsers = [
  { id: 1, name: "John Doe", email: "john@example.com", phone: "741852963" },
  { id: 2, name: "Sarah Smith", email: "sarah@example.com", phone: "74152954" },
];

// Mock events
const mockEvents = [
  { id: 1, title: "React Workshop" },
  { id: 2, title: "Next.js Seminar" },
  { id: 3, title: "AI Conference" },
];

// Mock registrations: userId -> eventId
const mockRegistrations = [
  { userId: 1, eventId: 1 },
  { userId: 1, eventId: 3 },
  { userId: 2, eventId: 2 },
];

export default function UsersPage() {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const [selectedUserEvents, setSelectedUserEvents] = useState<number[]>([]);
  const [showEventsForUser, setShowEventsForUser] = useState<number | null>(
    null,
  );

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this user?")) {
      setUsers(users.filter((user) => user.id !== id));
      alert("User deleted successfully (Mock)");
      if (showEventsForUser === id) {
        setShowEventsForUser(null);
        setSelectedUserEvents([]);
      }
    }
  };

  const handleViewEvents = (userId: number) => {
    if (showEventsForUser === userId) {
      // If clicking the same user again, hide events
      setShowEventsForUser(null);
      setSelectedUserEvents([]);
      return;
    }

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
