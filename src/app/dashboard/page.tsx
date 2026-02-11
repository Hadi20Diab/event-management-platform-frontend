"use client";
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Layout/Navbar';
import Sidebar from '../../components/Layout/Sidebar';
import { FaCalendarCheck, FaMusic, FaTheaterMasks } from 'react-icons/fa';
import '@/app/page.css'

export default function Dashboard() {
  const { user, isAdmin } = useAuth();

  const stats = {
    totalEvents: 15,
    registeredEvents: user?.registeredEvents?.length || 0,
    upcomingEvents: 8,
  };

  const recentEvents = [
    { id: 1, title: 'Summer Music Festival', date: '2024-06-15', type: 'concert', registered: true },
    { id: 2, title: 'Tech Workshop', date: '2024-06-20', type: 'workshop', registered: true },
    { id: 3, title: 'Art Exhibition', date: '2024-07-05', type: 'exhibition', registered: false },
  ];

  return (
    <div className="dashboard-container">
      <Navbar />
      <div className="dashboard">
        <Sidebar />
        <main className="main-content">
          <h1>Welcome back, {user?.name}!</h1>
          <p className="text-muted" style={{ marginBottom: '30px' }}>
            {isAdmin() ? 'Manage events and user registrations from your admin panel' : 'Browse and register for upcoming events'}
          </p>

          <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
            <div className="stat-card" style={{ background: 'white', padding: '20px', borderRadius: 'var(--border-radius)', boxShadow: 'var(--box-shadow)', textAlign: 'center' }}>
              <FaCalendarCheck style={{ fontSize: '32px', color: 'var(--primary-color)', marginBottom: '10px' }} />
              <h3>{stats.totalEvents}</h3>
              <p>Total Events</p>
            </div>
            <div className="stat-card" style={{ background: 'white', padding: '20px', borderRadius: 'var(--border-radius)', boxShadow: 'var(--box-shadow)', textAlign: 'center' }}>
              <FaMusic style={{ fontSize: '32px', color: 'var(--success-color)', marginBottom: '10px' }} />
              <h3>{stats.registeredEvents}</h3>
              <p>Your Registrations</p>
            </div>
            <div className="stat-card" style={{ background: 'white', padding: '20px', borderRadius: 'var(--border-radius)', boxShadow: 'var(--box-shadow)', textAlign: 'center' }}>
              <FaTheaterMasks style={{ fontSize: '32px', color: 'var(--warning-color)', marginBottom: '10px' }} />
              <h3>{stats.upcomingEvents}</h3>
              <p>Upcoming</p>
            </div>
          </div>

          <div className="recent-events" style={{ background: 'white', padding: '30px', borderRadius: 'var(--border-radius)', boxShadow: 'var(--box-shadow)' }}>
            <h2 style={{ marginBottom: '20px' }}>Recent Events</h2>
            <div className="events-list">
              {recentEvents.map((event) => (
                <div key={event.id} className="event-item" style={{ padding: '15px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ marginBottom: '5px' }}>{event.title}</h4>
                    <p style={{ color: 'var(--gray-color)', fontSize: '14px' }}>Date: {event.date} • Type: {event.type}</p>
                  </div>
                  <span className={`badge ${event.registered ? 'badge-success' : 'badge-secondary'}`} style={{ padding: '5px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '500', background: event.registered ? 'var(--success-color)' : '#e9ecef', color: event.registered ? 'white' : 'var(--dark-color)' }}>{event.registered ? 'Registered' : 'Available'}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <a href="/events" className="btn btn-primary">View All Events</a>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
