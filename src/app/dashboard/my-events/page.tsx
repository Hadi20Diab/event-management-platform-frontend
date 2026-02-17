"use client";
import React, { useState, useEffect } from 'react';
import EventCard from '../../../components/Events/EventCard';
import { useAuth } from '../../../context/AuthContext';
import { apiRequest } from '../../../api/api';
import '@/app/page.css';

export default function MyEvents() {
    const { user } = useAuth() as any;
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (user?.id) {
            fetchMyEvents();
        }
    }, [user?.id]);

    const fetchMyEvents = async () => {
        if (!user?.id) return;
        
        try {
            setLoading(true);
            const response = await apiRequest(`/register/user/${user.id}`);
            
            // Handle both paginated {data: [...]} format and direct array format
            const registrationsData = response.data || response.registrations || response;
            const registrations = Array.isArray(registrationsData) ? registrationsData : [];
            
            // Extract event data from registrations
            const eventsData = registrations.map((registration: any) => ({
                ...registration.event,
                registrationId: registration._id,
                registrationStatus: registration.status
            }));
            
            setEvents(eventsData);
            setError('');
        } catch (err: any) {
            console.error('Error fetching my events:', err);
            setError(err.message || 'Failed to load your events');
            setEvents([]);
        } finally {
            setLoading(false);
        }
    };

    const handleUnregister = async (eventId: any) => {
        if (!confirm('Are you sure you want to unregister from this event?')) {
            return;
        }

        // Find the registration for this event
        const event = events.find(e => (e._id || e.id) === eventId);
        const registrationId = event?.registrationId;

        if (!registrationId) {
            alert('Unable to find registration to cancel');
            return;
        }

        try {
            await apiRequest(`/register/${registrationId}`, {
                method: 'DELETE'
            });
            
            alert('Successfully unregistered from event!');
            // Refresh the events list
            fetchMyEvents();
        } catch (err: any) {
            console.error('Unregistration error:', err);
            alert(`Failed to unregister: ${err.message}`);
        }
    };

    if (loading) {
        return (
            <section className="my-events-container">
                <h1>My Registered Events</h1>
                <div className="loading-container" style={{ textAlign: 'center', padding: '40px' }}>
                    <div>Loading your registered events...</div>
                </div>
            </section>
        );
    }

    return (
        <section className="my-events-container">
            <h1>My Registered Events</h1>
            <p>View and manage your event registrations</p>

            {error && (
                <div className="alert alert-danger" style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#f8d7da', borderLeft: '4px solid #dc3545', borderRadius: '4px', color: '#721c24' }}>
                    Error loading your events: {error}
                </div>
            )}

            {events.length === 0 ? (
                <div className="empty-state">
                    <h3>No events registered yet</h3>
                    <p>Browse events and register to see them here</p>
                    <a href="/dashboard/events" className="btn btn-primary" style={{ marginTop: '20px' }}>
                        Browse Events
                    </a>
                </div>
            ) : (
                <>
                    <div className="events-grid">
                        {events.map((event) => (
                            <EventCard key={event._id || event.id} event={event} onUnregister={handleUnregister} isRegistered={true} onRegister={undefined} />
                        ))}
                    </div>

                    <div style={{ marginTop: '30px', textAlign: 'center' }}>
                        <p>Showing {events.length} registered events</p>
                    </div>
                </>
            )}
        </section>
    );
}
