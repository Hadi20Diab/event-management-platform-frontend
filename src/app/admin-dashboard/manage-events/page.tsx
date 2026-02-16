"use client";
import React, { useState, useEffect } from "react";
import EventForm from "../../../components/Events/EventForm";
import EventCard from "../../../components/Events/EventCard";
import { useAuth } from "../../../context/AuthContext";
import { apiRequest } from "../../../api/api";
import "@/app/page.css";

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  category: string;
  capacity: number;
  registered?: number;
  status: string;
  price: number;
  organizer?: string;
  createdAt?: string;
}

export default function AdminDashboardPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [error, setError] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await apiRequest("/events");
      // Handle both array response and object with events property
      const eventsData = response.events || response;
      setEvents(Array.isArray(eventsData) ? eventsData : []);
    } catch (error: any) {
      setError(error.message || "Failed to fetch events");
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (eventData: any) => {
    try {
      const newEventData = {
        ...eventData,
        organizer: user?.name || "Admin",
      };

      const response = await apiRequest("/events", "POST", newEventData);
      const createdEvent = response.event || response;
      
      setEvents([...events, createdEvent]);
      setShowForm(false);
      alert("Event created successfully!");
    } catch (error: any) {
      alert("Error creating event: " + error.message);
    }
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setShowForm(true);
  };

  const handleUpdate = async (eventData: any) => {
    if (!editingEvent) return;

    try {
      const response = await apiRequest(`/events/${editingEvent._id}`, "PUT", eventData);
      const updatedEvent = response.event || response;

      setEvents(events.map((e) => 
        e._id === editingEvent._id ? { ...e, ...updatedEvent } : e
      ));
      
      setShowForm(false);
      setEditingEvent(null);
      alert("Event updated successfully!");
    } catch (error: any) {
      alert("Error updating event: " + error.message);
    }
  };

  const handleDelete = async (eventId: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;

    try {
      await apiRequest(`/events/${eventId}`, "DELETE");
      setEvents(events.filter((e) => e._id !== eventId));
      alert("Event deleted successfully!");
    } catch (error: any) {
      alert("Error deleting event: " + error.message);
    }
  };

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(search.toLowerCase()) ||
      event.description.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter ? event.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  const handleFormSubmit = (eventData: any) => {
    if (editingEvent) {
      handleUpdate(eventData);
    } else {
      handleCreate(eventData);
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingEvent(null);
  };

  if (loading) return <div>Loading events...</div>;
  
  return (
    <section className="admin-dashboard-container">
      <div className="admin-header">
        <div>
          <h1>Manage Events</h1>
          <p>Create, edit, and manage platform events</p>
        </div>
        <button 
          className="btn btn-primary" 
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Cancel" : "Create New Event"}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div style={{ 
          color: "red", 
          backgroundColor: "#fee", 
          padding: "10px", 
          borderRadius: "5px", 
          marginBottom: "20px" 
        }}>
          Error: {error}
        </div>
      )}

      {/* Event Form */}
      {showForm && (
        <div style={{ marginBottom: "30px" }}>
          <EventForm
            onSubmit={handleFormSubmit}
            onCancel={handleCancelForm}
            initialData={editingEvent}
            isEditing={!!editingEvent}
          />
        </div>
      )}

      {/* Search and Filter Controls */}
      <div style={{ display: "flex", gap: "20px", marginBottom: "30px", alignItems: "center" }}>
        <input
          type="text"
          placeholder="Search events..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ddd",
            flex: 1,
          }}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ padding: "10px", borderRadius: "8px", border: "1px solid #ddd" }}
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="upcoming">Upcoming</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <button className="btn btn-secondary" onClick={fetchEvents}>
          Refresh
        </button>
      </div>

      {/* Events List */}
      <div className="events-grid">
        {filteredEvents.length === 0 ? (
          <div className="event-card" style={{ gridColumn: "1 / -1" }}>
            <div className="event-body">
              <p style={{ textAlign: "center" }}>
                {search || statusFilter ? "No events match your search criteria" : "No events found"}
              </p>
            </div>
          </div>
        ) : (
          filteredEvents.map((event) => (
            <div key={event._id} className="event-card">
              <div className="event-header">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                  <div style={{ flex: 1 }}>
                    <h3 className="event-title">{event.title}</h3>
                    <p style={{ margin: "5px 0", color: "#666", fontSize: "14px" }}>
                      {event.category} • {event.status}
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      className="btn btn-secondary"
                      onClick={() => handleEdit(event)}
                      style={{ fontSize: "12px", padding: "4px 8px" }}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(event._id)}
                      style={{ fontSize: "12px", padding: "4px 8px" }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>

              <div className="event-body">
                <p style={{ marginBottom: "15px", fontSize: "14px" }}>
                  {event.description}
                </p>
                
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px", fontSize: "14px" }}>
                  <div>
                    <strong>Date:</strong>
                    <br />
                    {new Date(event.date).toLocaleDateString()}
                  </div>
                  <div>
                    <strong>Location:</strong>
                    <br />
                    {event.location}
                  </div>
                  <div>
                    <strong>Capacity:</strong>
                    <br />
                    {event.capacity}
                  </div>
                  <div>
                    <strong>Price:</strong>
                    <br />
                    ${event.price}
                  </div>
                  {event.organizer && (
                    <div style={{ gridColumn: "1 / -1" }}>
                      <strong>Organizer:</strong> {event.organizer}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      status: "active",
    };
    setEvents((prev) => [...prev, newEvent]);
    setShowForm(false);
    setError("");
    alert("Event created successfully (Mock - Replace with API call)");
  };

  const handleUpdate = (eventId, eventData) => {
    setEvents((prev) =>
      prev.map((event) =>
        event.id === eventId ? { ...event, ...eventData } : event,
      ),
    );
    setEditingEvent(null);
    setShowForm(false);
    setError("");
    alert("Event updated successfully (Mock - Replace with API call)");
  };

  const handleDelete = (eventId) => {
    if (confirm("Are you sure you want to delete this event?")) {
      setEvents((prev) => prev.filter((event) => event.id !== eventId));
      alert("Event deleted successfully (Mock - Replace with API call)");
    }
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setShowForm(true);
  };

  const filteredEvents = events.filter(
    (event) =>
      event.title.toLowerCase().includes(search.toLowerCase()) &&
      (statusFilter ? event.status === statusFilter : true),
  );

  return (
    <section className="admin-dashboard-container">
      <div className="admin-header">
        <div>
          <h1>Manage Events</h1>
          <p>Create, update, and delete events</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          Create New Event
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="admin-actions">
        <div className="form-group" style={{ flex: 1 }}>
          <input
            type="text"
            placeholder="Search events..."
            style={{ width: "100%" }}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="form-group"
          style={{ width: "200px" }}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="upcoming">Upcoming</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="events-grid">
        {filteredEvents.map((event) => (
          <div key={event.id} className="event-card">
            <div className="event-header">
              <h3 className="event-title">{event.title}</h3>
              <span className="event-category">{event.category}</span>
              <span
                style={{
                  float: "right",
                  background:
                    event.status === "active"
                      ? "var(--success-color)"
                      : event.status === "cancelled"
                        ? "var(--danger-color)"
                        : "var(--warning-color)",
                  color: "white",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  fontSize: "12px",
                }}
              >
                {event.status}
              </span>
            </div>
            <div className="event-body">
              <p>{event.description}</p>
              <div className="event-info">
                <div className="event-info-item">📅 {event.date}</div>
                <div className="event-info-item">📍 {event.location}</div>
                <div className="event-info-item">
                  👥 {event.registered} / {event.capacity} registered
                </div>
                <div className="event-info-item">💰 ${event.price}</div>
              </div>
            </div>
            <div className="event-footer">
              <div>
                <button
                  className="btn btn-warning"
                  onClick={() => handleEdit(event)}
                  style={{ marginRight: "10px" }}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(event.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {events.length === 0 && (
        <div className="empty-state">
          <h3>No events found</h3>
          <p>Create your first event to get started</p>
        </div>
      )}
      {(showForm || editingEvent) && (
        <div className="event-form-modal">
          <div className="event-form-content">
            <EventForm
              event={editingEvent}
              onSubmit={
                editingEvent
                  ? (data) => handleUpdate(editingEvent.id, data)
                  : handleCreate
              }
              onCancel={() => {
                setShowForm(false);
                setEditingEvent(null);
              }}
            />
          </div>
        </div>
      )}
    </section>
  );
}
