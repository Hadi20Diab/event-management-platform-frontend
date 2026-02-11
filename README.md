# Event Management Platform - Frontend

A React-based frontend for the Event Management Platform that handles user authentication, event browsing, registration, and admin management.

## Features

### Authentication
- User registration with form validation
- User login with JWT token storage
- Protected routes based on authentication status
- Admin vs User role differentiation

### User Features
- Browse all events with filtering
- Register for events
- View registered events
- Dashboard with statistics

### Admin Features
- Create, read, update, delete events
- Manage all events
- Admin-specific dashboard

## Pages

1. **Login Page** (`/login`)
   - Email and password authentication
   - Redirects to dashboard on success

2. **Register Page** (`/register`)
   - User registration with validation
   - Auto-login on successful registration

3. **Dashboard** (`/dashboard`)
   - Welcome message with user info
   - Event statistics
   - Recent events list

4. **All Events** (`/events`)
   - Browse all events with filters
   - Search functionality
   - Register for events

5. **My Events** (`/my-events`)
   - View registered events
   - Unregister option

6. **Admin Events** (`/admin/events`)
   - Full CRUD operations for events
   - Event management interface

## Setup Instructions

1. **Install dependencies:**
   ```bash
   npm install