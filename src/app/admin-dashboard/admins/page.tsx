"use client";
import React, { useState, useEffect } from "react";
import { apiRequest } from "../../../api/api";
import "@/app/page.css";

interface Admin {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role?: string;
  createdAt?: string;
}

export default function ManageAdminsPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const response = await apiRequest("/admins");
      const data = response?.admins || response || [];
      setAdmins(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err?.message || "Failed to fetch admins");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (adminId: string) => {
    if (!confirm("Are you sure you want to delete this admin?")) return;
    try {
      await apiRequest(`/admins/${adminId}`, "DELETE");
      setAdmins((prev) => prev.filter((a) => a._id !== adminId));
      alert("Admin deleted successfully");
    } catch (err: any) {
      alert("Error deleting admin: " + (err?.message || err));
    }
  };

  const filteredAdmins = admins.filter((admin) => {
    const q = search.trim().toLowerCase();
    const matchesName = q ? admin.name.toLowerCase().includes(q) : true;
    const matchesRole = roleFilter ? admin.role === roleFilter : true;
    return matchesName && matchesRole;
  });

  if (loading) return <div>Loading admins...</div>;
  if (error) return <div style={{ color: "red" }}>Error: {error}</div>;

  return (
    <section className="admin-dashboard-container">
      <div className="admin-header">
        <div>
          <h1>Manage Admins</h1>
          <p>View and manage platform administrators</p>
        </div>
      </div>

      <div className="admin-actions" style={{ marginBottom: 20 }}>
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
        {filteredAdmins.length === 0 ? (
          <div className="event-card" style={{ gridColumn: "1 / -1" }}>
            <div className="event-body">
              <p style={{ textAlign: "center" }}>No admins found</p>
            </div>
          </div>
        ) : (
          filteredAdmins.map((admin) => (
            <div key={admin._id} className="event-card">
              <div className="event-header">
                <h3 className="event-title">{admin.name}</h3>
              </div>

              <div className="event-body">
                <p>Email: {admin.email}</p>
                {admin.phone && <p>Phone: {admin.phone}</p>}
                {admin.role && <p>Role: {admin.role}</p>}
                {admin.createdAt && (
                  <p>Joined: {new Date(admin.createdAt).toLocaleDateString()}</p>
                )}
              </div>

              <div className="event-footer">
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(admin._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
