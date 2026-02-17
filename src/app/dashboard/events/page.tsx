"use client";
import React, { useState, useEffect } from 'react';
import EventCard from '../../../components/Events/EventCard';
import { useAuth } from '../../../context/AuthContext';
import { apiRequest } from '../../../api/api';
import '@/app/page.css';

export default function Events() {
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filters, setFilters] = useState({ category: '', status: '', dateFrom: '', dateTo: '' });
    const [searchTerm, setSearchTerm] = useState('');
    const { user } = useAuth() as any;

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const response = await apiRequest('/events');
            
            // Handle both {meta, data} format and direct array format
            const eventsData = response.data || response;
            setEvents(Array.isArray(eventsData) ? eventsData : []);
            setError('');
        } catch (err: any) {
            console.error('Error fetching events:', err);
            setError(err.message || 'Failed to load events');
            // Fallback to empty array on error
            setEvents([]);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e: any) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const filteredEvents = events.filter(event => {
        if (searchTerm && !event.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
            !event.description.toLowerCase().includes(searchTerm.toLowerCase())) {
            return false;
        }
        if (filters.category && event.category !== filters.category) return false;
        if (filters.status && event.status !== filters.status) return false;
        if (filters.dateFrom && event.date < filters.dateFrom) return false;
        if (filters.dateTo && event.date > filters.dateTo) return false;
        return true;
    });

    const handleRegister = async (eventId: any) => {
        if (!user?.id) {
            alert('Please log in to register for events');
            return;
        }

        try {
            await apiRequest('/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: user.id,
                    eventId: eventId
                })
            });
            
            alert('Successfully registered for event!');
            // Optionally refresh events to update registered counts
            // fetchEvents();
        } catch (err: any) {
            console.error('Registration error:', err);
            if (err.message.includes('already registered')) {
                alert('You are already registered for this event');
            } else {
                alert(`Registration failed: ${err.message}`);
            }
        }
    };

    return (
        <section className="events-page">
            <h1>All Events</h1>
            <p>Browse and register for upcoming events</p>

            {error && (
                <div className="alert alert-danger" style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#f8d7da', borderLeft: '4px solid #dc3545', borderRadius: '4px', color: '#721c24' }}>
                    Error loading events: {error}
                </div>
            )}

            {loading ? (
                <div className="loading-container" style={{ textAlign: 'center', padding: '40px' }}>
                    <div>Loading events...</div>
                </div>
            ) : (
                <>
                    <div className="filters">
                <div className="filter-row">
                    <div className="form-group">
                        <label>Search Events</label>
                        <input
                            type="text"
                            placeholder="Search by title or description..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label>Category</label>
                        <select name="category" value={filters.category} onChange={handleFilterChange}>
                            <option value="">All Categories</option>
                            <option value="concert">Concert</option>
                            <option value="workshop">Workshop</option>
                            <option value="exhibition">Exhibition</option>
                            <option value="festival">Festival</option>
                            <option value="conference">Conference</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Status</label>
                        <select name="status" value={filters.status} onChange={handleFilterChange}>
                            <option value="">All Status</option>
                            <option value="active">Active</option>
                            <option value="upcoming">Upcoming</option>
                            <option value="cancelled">Cancelled</option>
                            <option value="sold-out">Sold Out</option>
                        </select>
                    </div>
                </div>

                <div className="filter-row">
                    <div className="form-group">
                        <label>From Date</label>
                        <input type="date" name="dateFrom" value={filters.dateFrom} onChange={handleFilterChange} />
                    </div>

                    <div className="form-group">
                        <label>To Date</label>
                        <input type="date" name="dateTo" value={filters.dateTo} onChange={handleFilterChange} />
                    </div>

                    <div className="form-group">
                        <button className="btn btn-primary" style={{ marginTop: '24px' }} onClick={() => setFilters({ category: '', status: '', dateFrom: '', dateTo: '' })}>
                            Clear Filters
                        </button>
                    </div>
                </div>
            </div>

            <div className="events-grid">
                {filteredEvents.map((event) => (
                    <EventCard key={event._id || event.id} event={event} onRegister={handleRegister} isRegistered={user?.registeredEvents?.includes(event._id || event.id)} onUnregister={undefined} />
                ))}
            </div>

            {filteredEvents.length === 0 && !loading && (
                <div className="empty-state">
                    <h3>No events found</h3>
                    <p>Try adjusting your filters or search term</p>
                </div>
            )}
                </>
            )}
        </section>
    );
}
