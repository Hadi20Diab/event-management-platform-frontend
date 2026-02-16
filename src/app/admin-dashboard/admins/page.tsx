"use client";
import React, { useState, useEffect } from "react";
import { apiRequest } from "../../../api/api";
import "@/app/page.css";

interface Admin {
  _id: string;
  id?: string; // For backwards compatibility
  name: string;
  email: string;
  phone: string;
  role: string;
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
      setAdmins(response.admins || response);
    } catch (error: any) {
      setError(error.message || "Failed to fetch admins");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (adminId: string) => {
    if (!confirm("Are you sure you want to delete this admin?")) return;

    try {
      await apiRequest(`/admins/${adminId}`, "DELETE");
      setAdmins(admins.filter((admin) => admin._id !== adminId));
      alert("Admin deleted successfully");
    } catch (error: any) {
      alert("Error deleting admin: " + error.message);
    }
  };

  const filteredAdmins = admins.filter((admin) => {
    const matchesName = admin.name.toLowerCase().includes(search.toLowerCase());
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

      {/* Search and Filter Controls */}
      <div
        style={{
          display: "flex",
          gap: "20px",
          marginBottom: "30px",
          alignItems: "center",
        }}
          )}
                      Delete
                    </button>
                  </div>
                </div>
              </div>

              <div className="event-body">
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "15px" }}>
                  <div>
                    <strong>Email:</strong>
                    <p style={{ margin: "5px 0" }}>{admin.email}</p>
                  </div>
                  <div>
                    <strong>Phone:</strong>
                    <p style={{ margin: "5px 0" }}>{admin.phone}</p>
                  </div>
                  {admin.createdAt && (
                    <div>
                      <strong>Joined:</strong>
                      <p style={{ margin: "5px 0" }}>
                        {new Date(admin.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
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
