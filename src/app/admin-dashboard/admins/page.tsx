"use client";
import React, { useState } from "react";
import "@/app/page.css";

const initialAdmins = [
  {
    id: 1,
    name: "Alice Johnson",
    email: "alice@admin.com",
    phone: "11111111",
    role: "superAdmin",
  },
  {
    id: 2,
    name: "Bob Smith",
    email: "bob@admin.com",
    phone: "222222222",
    role: "admin",
  },
  {
    id: 3,
    name: "Charlie Brown",
    email: "charlie@admin.com",
    phone: "33333333",
    role: "admin",
  },
];

export default function ManageAdminsPage() {
  const [admins, setAdmins] = useState(initialAdmins);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this admin?")) {
      setAdmins(admins.filter((admin) => admin.id !== id));
      alert("Admin deleted successfully (Mock)");
    }
  };

  const filteredAdmins = admins.filter((admin) => {
    const matchesName = admin.name.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter ? admin.role === roleFilter : true;
    return matchesName && matchesRole;
  });

  return (
    <section className="admin-dashboard-container">
      <div className="admin-header">
        <div>
          <h1>Manage Admins</h1>
          <p>View, edit and manage system administrators</p>
        </div>
      </div>

      <div className="admin-actions">
        <div className="form-group" style={{ flex: 1 }}>
          <input
            type="text"
            placeholder="Search admins..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: "100%" }}
          />
        </div>

        <select
          className="form-group"
          style={{ width: "200px" }}
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="superAdmin">Super Admin</option>
        </select>
      </div>

      <div className="events-grid">
        {filteredAdmins.map((admin) => (
          <div key={admin.id} className="event-card">
            <div className="event-header">
              <h3 className="event-title">{admin.name}</h3>
            </div>

            <div className="event-body">
              <p>Email: {admin.email}</p>
              <p>Phone Number: {admin.phone}</p>
              <p>Role: {admin.role}</p>
            </div>

            <div className="event-footer">
              <button
                className="btn btn-danger"
                onClick={() => handleDelete(admin.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredAdmins.length === 0 && (
        <div className="empty-state">
          <h3>No admins found</h3>
        </div>
      )}
    </section>
  );
}
