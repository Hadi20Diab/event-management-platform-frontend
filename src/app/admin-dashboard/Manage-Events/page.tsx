"use client";
import React, { useState } from 'react';
import EventForm from '../../../components/Events/EventForm';
import EventCard from '../../../components/Events/EventCard';
import { useAuth } from '../../../context/AuthContext';
import '@/app/page.css';

const initialEvents = [
    {
        id: 1,
        title: 'Summer Music Festival',
        description: 'Annual summer music festival featuring top artists',
        date: '2024-06-15',
        location: 'Central Park, New York',
        category: 'concert',
        capacity: 5000,
        registered: 4200,
        status: 'active',
        price: 75,
        organizer: 'Music Events Inc.'
    },
    {
        id: 2,
        title: 'Tech Workshop: React Masterclass',
        description: 'Advanced React patterns and best practices',
        date: '2024-06-20',
        location: 'Tech Hub, San Francisco',
        category: 'workshop',
        capacity: 100,
        registered: 85,
        status: 'active',
        price: 199,
        organizer: 'React Masters'
    }
];

export default function AdminDashboardPage() {
    const [events, setEvents] = useState(initialEvents);
    const [showForm, setShowForm] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);
    const [error, setError] = useState('');
    const { user } = useAuth();

    const handleCreate = (eventData) => {
        const newEvent = { ...eventData, id: Date.now(), registered: 0, status: 'active' };
        setEvents(prev => [...prev, newEvent]);
        setShowForm(false);
        setError('');
        alert('Event created successfully (Mock - Replace with API call)');
    };

    const handleUpdate = (eventId, eventData) => {
        setEvents(prev => prev.map(event => event.id === eventId ? { ...event, ...eventData } : event));
        setEditingEvent(null);
        setError('');
        alert('Event updated successfully (Mock - Replace with API call)');
    };

    const handleDelete = (eventId) => {
        if (confirm('Are you sure you want to delete this event?')) {
            setEvents(prev => prev.filter(event => event.id !== eventId));
            alert('Event deleted successfully (Mock - Replace with API call)');
        }
    };

    const handleEdit = (event) => {
        setEditingEvent(event);
        setShowForm(true);
    };

    return (
        <section className="admin-dashboard-container">
            <div className="admin-header">
                <div>
                    <h1>Manage Events</h1>
                    <p>Create, update, and delete events</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowForm(true)}>Create New Event</button>
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            <div className="admin-actions">
                <div className="form-group" style={{ flex: 1 }}>
                    <input type="text" placeholder="Search events..." style={{ width: '100%' }} />
                </div>
                <select className="form-group" style={{ width: '200px' }}>
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="cancelled">Cancelled</option>
                </select>
            </div>

            <div className="events-grid">
                {events.map((event) => (
                    <div key={event.id} className="event-card">
                        <div className="event-header">
                            <h3 className="event-title">{event.title}</h3>
                            <span className="event-category">{event.category}</span>
                            <span style={{ float: 'right', background: event.status === 'active' ? 'var(--success-color)' : event.status === 'cancelled' ? 'var(--danger-color)' : 'var(--warning-color)', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}>
                                {event.status}
                            </span>
                        </div>
                        <div className="event-body">
                            <p>{event.description}</p>
                            <div className="event-info">
                                <div className="event-info-item">📅 {event.date}</div>
                                <div className="event-info-item">📍 {event.location}</div>
                                <div className="event-info-item">👥 {event.registered} / {event.capacity} registered</div>
                                <div className="event-info-item">💰 ${event.price}</div>
                            </div>
                        </div>
                        <div className="event-footer">
                            <div>
                                <button className="btn btn-warning" onClick={() => handleEdit(event)} style={{ marginRight: '10px' }}>Edit</button>
                                <button className="btn btn-danger" onClick={() => handleDelete(event.id)}>Delete</button>
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
                        <EventForm event={editingEvent} onSubmit={editingEvent ? (data) => handleUpdate(editingEvent.id, data) : handleCreate} onCancel={() => { setShowForm(false); setEditingEvent(null); }} />
                    </div>
                </div>
            )}
        </section>
    );
}
