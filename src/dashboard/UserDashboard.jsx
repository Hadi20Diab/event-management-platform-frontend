// src/dashboard/UserDashboard.js
import { useEffect, useState } from "react";
import { apiRequest } from "../api/api";
import Navbar from "../components/Layout/Navbar";

export default function UserDashboard() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    apiRequest("/events/my-registrations").then(setEvents).catch(console.error);
  }, []);

  return (
    <>
      <Navbar />
      <h2>My Registered Events</h2>

      {events.map((e) => (
        <div key={e.id} className="card">
          <h3>{e.title}</h3>
          <p>{e.location}</p>
          <p>{e.date}</p>
        </div>
      ))}
    </>
  );
}
