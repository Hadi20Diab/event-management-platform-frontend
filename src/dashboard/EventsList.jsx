// src/dashboard/EventsList.js
import { useEffect, useState } from "react";
import { apiRequest } from "../api/api";
import Navbar from "../components/Layout/Navbar";

export default function EventsList() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    apiRequest("/events").then(setEvents).catch(console.error);
  }, []);

  return (
    <>
      <Navbar />
      <h2>All Events</h2>

      {events.map((e) => (
        <div key={e.id} className="card">
          <h3>{e.title}</h3>
          <p>{e.location}</p>
          <p>{e.status}</p>
        </div>
      ))}
    </>
  );
}
