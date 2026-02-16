"use client";
import React, { useState, useEffect } from "react";
import EventForm from "../../../components/Events/EventForm";
import { useAuth } from "../../../context/AuthContext";
import { apiRequest } from "../../../api/api";
import "@/app/page.css";

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  category?: string;
  capacity?: number;
  registered?: number;
  status?: string;
  price?: number;
  organizer?: string;
}

export default function ManageEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [error, setError] = useState("");
  const { user } = useAuth() as any;

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
       const response = await apiRequest("/events");
       // Backend returns { meta, data }
       const eventsData = response?.data || response?.events || response || [];
      setEvents(Array.isArray(eventsData) ? eventsData : []);
    } catch (err: any) {
      setError(err?.message || "Failed to fetch events");
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (eventData: any) => {
    try {
      const payload = { ...eventData, organizer: user?.name || "Admin" };
      const response = await apiRequest("/events", "POST", payload);
      const created = response?.event || response;
      setEvents((prev) => [...prev, created]);
      setShowForm(false);
      setError("");
      alert("Event created successfully!");
    } catch (err: any) {
      alert("Error creating event: " + (err?.message || err));
    }
  };

  const handleUpdate = async (eventData: any) => {
    if (!editingEvent) return;
    try {
      const response = await apiRequest(`/events/${editingEvent._id}`, "PUT", eventData);
      const updated = response?.event || response;
      setEvents((prev) => prev.map((e) => (e._id === editingEvent._id ? { ...e, ...updated } : e)));
      setEditingEvent(null);
      setShowForm(false);
      setError("");
      alert("Event updated successfully!");
    } catch (err: any) {
      alert("Error updating event: " + (err?.message || err));
    }
  };

  const handleDelete = async (eventId: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    try {
      await apiRequest(`/events/${eventId}`, "DELETE");
      setEvents((prev) => prev.filter((e) => e._id !== eventId));
      alert("Event deleted successfully!");
    } catch (err: any) {
      alert("Error deleting event: " + (err?.message || err));
    }
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setShowForm(true);
  };

  const handleFormSubmit = (eventData: any) => {
    if (editingEvent) handleUpdate(eventData);
    else handleCreate(eventData);
  };

  const filteredEvents = events.filter((event) => {
    const q = search.trim().toLowerCase();
    const matchesSearch = q
      ? (event.title || "").toLowerCase().includes(q) || (event.description || "").toLowerCase().includes(q)
      : true;
    const matchesStatus = statusFilter ? event.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  if (loading) return <div>Loading events...</div>;

  return (
    <section className="admin-dashboard-container">
      <div className="admin-header">
        <div>
          <h1>Manage Events</h1>
          <p>Create, edit, and manage platform events</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm((s) => !s)}>
          {showForm ? "Cancel" : "Create New Event"}
        </button>
      </div>

      {error && (
        <div style={{ color: "red", backgroundColor: "#fee", padding: 10, borderRadius: 6, marginBottom: 20 }}>{error}</div>
      )}

      {showForm && (
        <div style={{ marginBottom: 24 }}>
          <EventForm event={editingEvent || undefined} onSubmit={handleFormSubmit} onCancel={() => { setShowForm(false); setEditingEvent(null); }} />
        </div>
      )}

      <div style={{ display: "flex", gap: 20, marginBottom: 24, alignItems: "center" }}>
        <input
          type="text"
          placeholder="Search events..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: 10, borderRadius: 8, border: "1px solid #ddd", flex: 1 }}
        />

        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ padding: 10, borderRadius: 8, border: "1px solid #ddd" }}>
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="upcoming">Upcoming</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <button className="btn btn-secondary" onClick={fetchEvents}>Refresh</button>
      </div>

      <div className="events-grid">
        {filteredEvents.length === 0 ? (
          <div className="event-card" style={{ gridColumn: "1 / -1" }}>
            <div className="event-body"><p style={{ textAlign: "center" }}>{search || statusFilter ? "No events match your search criteria" : "No events found"}</p></div>
          </div>
        ) : (
          filteredEvents.map((event) => (
            <div key={event._id} className="event-card">
              <div className="event-header">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                  <div style={{ flex: 1 }}>
                    <h3 className="event-title">{event.title}</h3>
                    <p style={{ margin: "5px 0", color: "#666", fontSize: 14 }}>{event.category} • {event.status}</p>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button className="btn btn-secondary" onClick={() => handleEdit(event)} style={{ fontSize: 12, padding: "4px 8px" }}>Edit</button>
                    <button className="btn btn-danger" onClick={() => handleDelete(event._id)} style={{ fontSize: 12, padding: "4px 8px" }}>Delete</button>
                  </div>
                </div>
              </div>

              <div className="event-body">
                <p style={{ marginBottom: 15, fontSize: 14 }}>{event.description}</p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10, fontSize: 14 }}>
                  <div><strong>Date:</strong><br />{new Date(event.date).toLocaleDateString()}</div>
                  <div><strong>Location:</strong><br />{event.location}</div>
                  <div><strong>Capacity:</strong><br />{event.capacity}</div>
                  <div><strong>Price:</strong><br />${event.price}</div>
                  {event.organizer && <div style={{ gridColumn: "1 / -1" }}><strong>Organizer:</strong> {event.organizer}</div>}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

