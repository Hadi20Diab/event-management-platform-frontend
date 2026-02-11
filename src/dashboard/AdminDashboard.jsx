// src/dashboard/AdminDashboard.js
import { useEffect, useState } from "react";
import { apiRequest } from "../api/api";
import Navbar from "../components/Layout/Navbar";

export default function AdminDashboard() {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");

  const load = () => {
    apiRequest("/events")
      .then(setEvents)
      .catch((e) => setError(e.message));
  };

  useEffect(load, []);

  const deleteEvent = async (id) => {
    try {
      await apiRequest(`/events/${id}`, "DELETE");
      load();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <>
      <Navbar />
      <h2>Admin – Manage Events</h2>
      {error && <p className="error">{error}</p>}

      {events.map((e) => (
        <div key={e.id} className="card">
          <h3>{e.title}</h3>
          <button onClick={() => deleteEvent(e.id)}>Delete</button>
        </div>
      ))}
    </>
  );
}
