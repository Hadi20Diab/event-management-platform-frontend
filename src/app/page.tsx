import "./page.css";
import Navbar from '@/components/Layout/Navbar';

export default function Home() {
  return (
    <>
      <Navbar />

      <header className="landing-hero">
        <div className="container hero-content">
          <div className="hero-text">
            <h1>Host, Discover, and Manage Events Easily</h1>
            <p>Organize sell-out experiences, manage registrations, and find events you'll love — all in one place.</p>

            <div className="hero-ctas">
              <a className="btn btn-primary" href="/dashboard/events">Browse Events</a>
              <a className="btn btn-outline" href="/register">Create Account</a>
            </div>
          </div>

          <div className="hero-visual" aria-hidden>
            <div style={{fontSize:24}}>Events Platform</div>
          </div>
        </div>
      </header>

      <section className="features">
        <div className="container features-grid">
          <div className="feature">
            <h3>For Organizers</h3>
            <p>Create events, manage attendees, and track sales with simple tools.</p>
          </div>
          <div className="feature">
            <h3>For Attendees</h3>
            <p>Discover local events, register instantly, and keep tickets organized.</p>
          </div>
          <div className="feature">
            <h3>Analytics</h3>
            <p>Get insights into registrations, revenue, and audience engagement.</p>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="container">
          <p>© {new Date().getFullYear()} Event Manager — Built for communities and creators.</p>
        </div>
      </footer>
    </>
  );
}