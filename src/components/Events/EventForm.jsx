import React, { useState, useEffect } from 'react';

const EventForm = ({ event, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    category: 'concert',
    capacity: 100,
    price: 0,
    status: 'active',
    organizer: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title || '',
        description: event.description || '',
        date: event.date || '',
        location: event.location || '',
        category: event.category || 'concert',
        capacity: event.capacity || 100,
        price: event.price || 0,
        status: event.status || 'active',
        organizer: event.organizer || ''
      });
    }
  }, [event]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.date) {
      newErrors.date = 'Date is required';
    } else if (new Date(formData.date) < new Date()) {
      newErrors.date = 'Date cannot be in the past';
    }
    
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    
    if (formData.capacity <= 0) {
      newErrors.capacity = 'Capacity must be greater than 0';
    }
    
    if (formData.price < 0) {
      newErrors.price = 'Price cannot be negative';
    }
    
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 style={{ marginBottom: '20px' }}>
        {event ? 'Edit Event' : 'Create New Event'}
      </h2>

      <div className="form-group">
        <label htmlFor="title">Event Title *</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter event title"
        />
        {errors.title && <span style={{ color: 'var(--danger-color)', fontSize: '14px' }}>{errors.title}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="description">Description *</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter event description"
          rows="3"
          style={{ width: '100%', padding: '12px 16px', border: '1px solid #ddd', borderRadius: 'var(--border-radius)' }}
        />
        {errors.description && <span style={{ color: 'var(--danger-color)', fontSize: '14px' }}>{errors.description}</span>}
      </div>

      <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
        <div className="form-group">
          <label htmlFor="date">Event Date *</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
          />
          {errors.date && <span style={{ color: 'var(--danger-color)', fontSize: '14px' }}>{errors.date}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="concert">Concert</option>
            <option value="workshop">Workshop</option>
            <option value="exhibition">Exhibition</option>
            <option value="festival">Festival</option>
            <option value="conference">Conference</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="location">Location *</label>
        <input
          type="text"
          id="location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="Enter event location"
        />
        {errors.location && <span style={{ color: 'var(--danger-color)', fontSize: '14px' }}>{errors.location}</span>}
      </div>

      <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
        <div className="form-group">
          <label htmlFor="capacity">Capacity *</label>
          <input
            type="number"
            id="capacity"
            name="capacity"
            value={formData.capacity}
            onChange={handleChange}
            min="1"
          />
          {errors.capacity && <span style={{ color: 'var(--danger-color)', fontSize: '14px' }}>{errors.capacity}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="price">Price ($)</label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            min="0"
            step="0.01"
          />
          {errors.price && <span style={{ color: 'var(--danger-color)', fontSize: '14px' }}>{errors.price}</span>}
        </div>
      </div>

      <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="active">Active</option>
            <option value="upcoming">Upcoming</option>
            <option value="cancelled">Cancelled</option>
            <option value="sold-out">Sold Out</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="organizer">Organizer</label>
          <input
            type="text"
            id="organizer"
            name="organizer"
            value={formData.organizer}
            onChange={handleChange}
            placeholder="Enter organizer name"
          />
        </div>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginTop: '30px' }}>
        <button type="submit" className="btn btn-primary">
          {event ? 'Update Event' : 'Create Event'}
        </button>
        <button type="button" className="btn" onClick={onCancel} style={{ background: '#6c757d', color: 'white' }}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default EventForm;