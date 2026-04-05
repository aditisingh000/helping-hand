import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Map from "../components/Map.js";
import { useAuth } from "../context/AuthContext.js";
import "../styles/EventDetails.css";

interface EventData {
  id: string;
  title: string;
  description: string;
  category: string;
  locationAddress: string;
  dateTime: string;
  durationMinutes: number;
  capacity: number | null;
  currentRsvps: number;
  bannerUrl: string | null;
  location: { type: "Point"; coordinates: [number, number] } | null;
  host: {
    id: string;
    name: string;
    avatarUrl: string | null;
  };
}

const EventDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  const [eventData, setEventData] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`/api/events/${id}`);
        if (!res.ok) throw new Error("Event not found");
        const data = await res.json();
        setEventData(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchEvent();
  }, [id]);

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    setIsUploading(true);

    const formData = new FormData();
    formData.append("banner", e.target.files[0]);

    try {
      const res = await fetch(`/api/events/${id}/banner`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Failed to upload banner");
      const data = await res.json();

      setEventData((prev) => (prev ? { ...prev, bannerUrl: data.bannerUrl } : null));
    } catch (err) {
      console.error(err);
      alert("Error uploading banner");
    } finally {
      setIsUploading(false);
    }
  };

  if (loading) return <div className="loading">Loading event...</div>;
  if (error || !eventData) return <div className="error">{error || "Event not found"}</div>;

  const isHost = user?.id === eventData.host.id;
  const isFull = eventData.capacity !== null && eventData.currentRsvps >= eventData.capacity;
  const eventDate = new Date(eventData.dateTime).toLocaleString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="event-details-container fade-in">
      <div className="event-banner-wrapper">
        <img
          src={
            eventData.bannerUrl ||
            "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80"
          }
          alt="Event Banner"
          className="event-banner"
        />
        {isHost && (
          <label className="banner-upload-btn">
            {isUploading ? "Uploading..." : "📷 Change Banner"}
            <input
              type="file"
              style={{ display: "none" }}
              accept="image/*"
              onChange={handleBannerUpload}
              disabled={isUploading}
            />
          </label>
        )}
      </div>

      <div className="event-content">
        <div className="event-main">
          <h1>{eventData.title}</h1>
          <div className="event-meta">
            <span className="event-category">{eventData.category}</span>
            <span className="event-date">📅 {eventDate}</span>
          </div>

          <p className="event-description">{eventData.description}</p>

          <div className="event-host">
            <h3>Hosted By</h3>
            <Link to={`/profile/${eventData.host.id}`} className="host-card">
              <img
                src={
                  eventData.host.avatarUrl ||
                  "https://w7.pngwing.com/pngs/178/595/png-transparent-user-profile-computer-icons-login-user-avatars-thumbnail.png"
                }
                alt="Host"
              />
              <span>{eventData.host.name}</span>
            </Link>
          </div>
        </div>

        <div className="event-sidebar">
          <div className="rsvp-card">
            <h3>Attendance</h3>
            <div className="capacity-bar">
              <div
                className="capacity-fill"
                style={{
                  width: eventData.capacity
                    ? `${(eventData.currentRsvps / eventData.capacity) * 100}%`
                    : "50%",
                }}
              ></div>
            </div>
            <p>
              {eventData.currentRsvps} attending{" "}
              {eventData.capacity ? `/ ${eventData.capacity} max` : ""}
            </p>

            <button className="btn-rsvp" disabled={isFull}>
              {isFull ? "Event Full" : "RSVP Now"}
            </button>
          </div>

          <div className="location-card">
            <h3>Location</h3>
            <p>📍 {eventData.locationAddress}</p>
            <div className="map-mini-container">
              {eventData.location ? (
                <Map
                  center={[eventData.location.coordinates[1], eventData.location.coordinates[0]]}
                  zoom={14}
                  interactive={false}
                  markers={[
                    {
                      id: eventData.id,
                      lat: eventData.location.coordinates[1],
                      lng: eventData.location.coordinates[0],
                      title: eventData.title,
                      category: eventData.category,
                    },
                  ]}
                />
              ) : (
                <div className="no-map">No coordinates provided</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
