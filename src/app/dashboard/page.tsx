"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiRequest } from '../../api/api';
import { FaCalendarCheck, FaMusic, FaTheaterMasks } from 'react-icons/fa';
import '@/app/page.css';

export default function Dashboard() {
  const { user } = useAuth() as any;
  const [stats, setStats] = useState({
    totalEvents: 0,
    registeredEvents: 0,
    upcomingEvents: 0,
  });
  const [recentEvents, setRecentEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await apiRequest('/dashboard/my-stats');
      setStats(response.data.stats);
      setRecentEvents(response.data.recentEvents);
    } catch (err: any) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message || 'Failed to load dashboard data');
      // Fallback to mock data if API fails
      setStats({
        totalEvents: 15,
        registeredEvents: user?.registeredEvents?.length || 0,
        upcomingEvents: 8,
      });
      setRecentEvents([
        { id: 1, title: 'Summer Music Festival', date: '2024-06-15', type: 'concert', registered: true },
        { id: 2, title: 'Tech Workshop', date: '2024-06-20', type: 'workshop', registered: true },
        { id: 3, title: 'Art Exhibition', date: '2024-07-05', type: 'exhibition', registered: false },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div>Loading dashboard...</div>
      </div>
    );
  }

  return (
    <>
      <h1>Welcome back, {user?.name}!</h1>
      <p className="text-muted" style={{ marginBottom: '30px' }}>
        Browse and register for upcoming events
      </p>

      {error && (
        <div className="alert alert-warning" style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#fff3cd', borderLeft: '4px solid #ffc107', borderRadius: '4px' }}>
          <small>Using cached data: {error}</small>
        </div>
      )}

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
          <a href="/dashboard/events" className="btn btn-primary">View All Events</a>
        </div>
      </div>
    </>
  );
}
