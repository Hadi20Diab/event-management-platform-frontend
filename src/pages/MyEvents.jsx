import React from 'react';
import Navbar from '../components/Layout/Navbar';
import Sidebar from '../components/Layout/Sidebar';
import EventCard from '../components/Events/EventCard';
import { useAuth } from '../context/AuthContext';

// Mock data - Replace with API data
const mockEvents = [
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

const MyEvents = () => {
  const { user } = useAuth();

  const handleUnregister = (eventId) => {
    // TODO: Replace with API call
    console.log('Unregistering from event:', eventId);
    alert(`Unregistered from event ${eventId} (Mock - Replace with API call)`);
  };

  return (
    <div className="dashboard-container">
      <Navbar />
      <div className="dashboard">
        <Sidebar />
        <main className="main-content">
          <h1>My Registered Events</h1>
          <p>View and manage your event registrations</p>

          {mockEvents.length === 0 ? (
            <div className="empty-state">
              <h3>No events registered yet</h3>
              <p>Browse events and register to see them here</p>
              <a href="/events" className="btn btn-primary" style={{ marginTop: '20px' }}>
                Browse Events
              </a>
            </div>
          ) : (
            <>
              <div className="events-grid">
                {mockEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onUnregister={handleUnregister}
                    isRegistered={true}
                  />
                ))}
              </div>
              
              <div style={{ marginTop: '30px', textAlign: 'center' }}>
                <p>Showing {mockEvents.length} registered events</p>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default MyEvents;