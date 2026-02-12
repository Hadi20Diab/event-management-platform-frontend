"use client";
import React, { useState } from "react";
import "@/app/page.css";

const initialUsers = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    role: "admin",
    status: "active",
  },
  {
    id: 2,
    name: "Sarah Smith",
    email: "sarah@example.com",
    role: "user",
    status: "inactive",
  },
];

export default function UsersPage() {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this user?")) {
      setUsers(users.filter((user) => user.id !== id));
      alert("User deleted successfully (Mock)");
    }
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase())
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
            style={{ width: "100%" }}
          />
        </div>

        <select className="form-group" style={{ width: "200px" }}>
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>
      </div>

      <div className="events-grid">
        {filteredUsers.map((user) => (
          <div key={user.id} className="event-card">
            <div className="event-header">
              <h3 className="event-title">{user.name}</h3>
              <span
                style={{
                  float: "right",
                  background:
                    user.status === "active"
                      ? "var(--success-color)"
                      : "var(--danger-color)",
                  color: "white",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  fontSize: "12px",
                }}
              >
                {user.status}
              </span>
            </div>

            <div className="event-body">
              <p>Email: {user.email}</p>
              <p>Role: {user.role}</p>
            </div>

            <div className="event-footer">
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
