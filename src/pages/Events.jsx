import React, { useState } from 'react';
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
  },
  {
    id: 3,
    title: 'Art Exhibition: Modern Masters',
    description: 'Collection of modern art from contemporary artists',
    date: '2024-07-05',
    location: 'Metropolitan Museum',
    category: 'exhibition',
    capacity: 200,
    registered: 150,
    status: 'active',
    price: 25,
    organizer: 'Art Council'
  },
  {
    id: 4,
    title: 'Food Festival',
    description: 'International cuisine festival',
    date: '2024-06-25',
    location: 'Waterfront Plaza',
    category: 'festival',
    capacity: 3000,
    registered: 2800,
    status: 'active',
    price: 50,
    organizer: 'Foodie Events'
  },
  {
    id: 5,
    title: 'Business Conference',
    description: 'Annual business leadership conference',
    date: '2024-07-10',
    location: 'Convention Center',
    category: 'conference',
    capacity: 1000,
    registered: 750,
    status: 'active',
    price: 299,
    organizer: 'Business Leaders'
  }
];

const Events = () => {
  const [events, setEvents] = useState(mockEvents);
  const [filters, setFilters] = useState({
    category: '',
    status: '',
    dateFrom: '',
    dateTo: '',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const filteredEvents = events.filter(event => {
    // Apply search filter
    if (searchTerm && !event.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !event.description.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Apply category filter
    if (filters.category && event.category !== filters.category) {
      return false;
    }
    
    // Apply status filter
    if (filters.status && event.status !== filters.status) {
      return false;
    }
    
    // Apply date filters
    if (filters.dateFrom && event.date < filters.dateFrom) {
      return false;
    }
    
    if (filters.dateTo && event.date > filters.dateTo) {
      return false;
    }
    
    return true;
  });

  const handleRegister = (eventId) => {
    // TODO: Replace with API call
    console.log('Registering for event:', eventId);
    alert(`Registered for event ${eventId} (Mock - Replace with API call)`);
  };

  return (
    <div className="dashboard-container">
      <Navbar />
      <div className="dashboard">
        <Sidebar />
        <main className="main-content">
          <h1>All Events</h1>
          <p>Browse and register for upcoming events</p>

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
                <select
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                >
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
                <select
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                >
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
                <input
                  type="date"
                  name="dateFrom"
                  value={filters.dateFrom}
                  onChange={handleFilterChange}
                />
              </div>
              
              <div className="form-group">
                <label>To Date</label>
                <input
                  type="date"
                  name="dateTo"
                  value={filters.dateTo}
                  onChange={handleFilterChange}
                />
              </div>
              
              <div className="form-group">
                <button
                  className="btn btn-primary"
                  style={{ marginTop: '24px' }}
                  onClick={() => setFilters({ category: '', status: '', dateFrom: '', dateTo: '' })}
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>

          <div className="events-grid">
            {filteredEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onRegister={handleRegister}
                isRegistered={user?.registeredEvents?.includes(event.id)}
              />
            ))}
          </div>

          {filteredEvents.length === 0 && (
            <div className="empty-state">
              <h3>No events found</h3>
              <p>Try adjusting your filters or search term</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Events;