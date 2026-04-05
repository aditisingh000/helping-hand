import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Map, { MapMarker } from "../components/Map.js";
import "../styles/HomePage.css";

interface EventData {
  id: string;
  title: string;
  category: string;
  dateTime: string;
  locationAddress: string;
  location: { type: "Point"; coordinates: [number, number] } | null;
  bannerUrl: string | null;
}

const HomePage = () => {
  const [events, setEvents] = useState<EventData[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("/api/events");
        if (res.ok) {
          const data = await res.json();
          setEvents(data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchEvents();
  }, []);

  const markers: MapMarker[] = events
    .filter((e) => e.location !== null)
    .map((e) => ({
      id: e.id,
      lat: e.location!.coordinates[1],
      lng: e.location!.coordinates[0],
      title: e.title,
      category: e.category,
    }));

  const handleMarkerClick = (marker: MapMarker) => {
    navigate(`/events/${marker.id}`);
  };

  return (
    <div className="home-container fade-in">
      <div className="home-hero">
        <div className="hero-content">
          <h1>Find Your Community</h1>
          <p>Discover local events, connect with neighbors, and make an impact.</p>
          <Link to="/create-event" className="btn-hero-action">
            Host an Event
          </Link>
        </div>
      </div>

      <div className="home-dashboard">
        <div className="home-map-section">
          <h2>Explore Map</h2>
          <div className="main-map-wrapper">
            <Map
              markers={markers}
              onMarkerClick={handleMarkerClick}
              center={[37.7749, -122.4194]}
              zoom={12}
            />
          </div>
        </div>

        <div className="home-events-section">
          <h2>Upcoming Activities</h2>
          <div className="events-grid">
            {events.slice(0, 6).map((event) => (
              <Link to={`/events/${event.id}`} key={event.id} className="event-card">
                <img
                  src={
                    event.bannerUrl ||
                    "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=400&q=80"
                  }
                  alt={event.title}
                />
                <div className="event-card-content">
                  <span className="event-tag">{event.category}</span>
                  <h3>{event.title}</h3>
                  <p className="event-time">{new Date(event.dateTime).toLocaleDateString()}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
