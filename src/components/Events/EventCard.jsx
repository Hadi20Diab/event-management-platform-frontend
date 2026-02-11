import React from 'react';
import { FaCalendar, FaMapMarkerAlt, FaUsers, FaTag, FaMusic, FaLaptopCode, FaPalette, FaUtensils, FaBriefcase } from 'react-icons/fa';

const EventCard = ({ event, onRegister, onUnregister, isRegistered }) => {
  const getCategoryIcon = (category) => {
    switch(category) {
      case 'concert': return <FaMusic />;
      case 'workshop': return <FaLaptopCode />;
      case 'exhibition': return <FaPalette />;
      case 'festival': return <FaUtensils />;
      case 'conference': return <FaBriefcase />;
      default: return <FaTag />;
    }
  };

  const getCategoryColor = (category) => {
    switch(category) {
      case 'concert': return '#f72585';
      case 'workshop': return '#4cc9f0';
      case 'exhibition': return '#7209b7';
      case 'festival': return '#f8961e';
      case 'conference': return '#38b000';
      default: return '#4361ee';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="event-card">
      <div 
        className="event-header"
        style={{ 
          background: `linear-gradient(135deg, ${getCategoryColor(event.category)}, ${getCategoryColor(event.category)}80)`
        }}
      >
        <h3 className="event-title">{event.title}</h3>
        <div className="event-category">
          {getCategoryIcon(event.category)} {event.category}
        </div>
      </div>
      
      <div className="event-body">
        <p style={{ marginBottom: '15px', color: 'var(--gray-color)' }}>
          {event.description}
        </p>
        
        <div className="event-info">
          <div className="event-info-item">
            <FaCalendar /> {formatDate(event.date)}
          </div>
          <div className="event-info-item">
            <FaMapMarkerAlt /> {event.location}
          </div>
          <div className="event-info-item">
            <FaUsers /> {event.registered} / {event.capacity} registered
          </div>
          {event.price > 0 && (
            <div className="event-info-item">
              <FaTag /> ${event.price}
            </div>
          )}
        </div>
      </div>
      
      <div className="event-footer">
        <div>
          <span style={{
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: '500',
            background: event.status === 'active' ? '#d4edda' : 
                       event.status === 'cancelled' ? '#f8d7da' : '#fff3cd',
            color: event.status === 'active' ? '#155724' : 
                   event.status === 'cancelled' ? '#721c24' : '#856404'
          }}>
            {event.status}
          </span>
        </div>
        
        {onRegister && !isRegistered && event.status === 'active' && event.registered < event.capacity && (
          <button
            className="btn btn-primary"
            onClick={() => onRegister(event.id)}
          >
            Register
          </button>
        )}
        
        {onUnregister && isRegistered && (
          <button
            className="btn btn-danger"
            onClick={() => onUnregister(event.id)}
          >
            Unregister
          </button>
        )}
        
        {isRegistered && (
          <span style={{
            padding: '8px 12px',
            background: 'var(--success-color)',
            color: 'white',
            borderRadius: 'var(--border-radius)',
            fontSize: '14px'
          }}>
            Registered ✓
          </span>
        )}
        
        {event.registered >= event.capacity && (
          <span style={{
            padding: '8px 12px',
            background: 'var(--danger-color)',
            color: 'white',
            borderRadius: 'var(--border-radius)',
            fontSize: '14px'
          }}>
            Sold Out
          </span>
        )}
      </div>
    </div>
  );
};

export default EventCard;