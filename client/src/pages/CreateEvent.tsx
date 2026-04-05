import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Map from "../components/Map.js";
import "../styles/CreateEvent.css";

const CreateEvent = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Social",
    locationAddress: "",
    dateTime: "",
    durationMinutes: "120",
    capacity: "",
  });

  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!coords) {
      setError("Please click on the map to pin the exact event location.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          latitude: coords.lat,
          longitude: coords.lng,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to create event");
      }

      const data = await res.json();
      navigate(`/events/${data.event.id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMapClick = (lat: number, lng: number) => {
    setCoords({ lat, lng });
  };

  return (
    <div className="create-event-container fade-in">
      <div className="create-event-card">
        <h1>Create New Event</h1>
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="create-event-form">
          <div className="form-split">
            <div className="form-left">
              <label>
                Title
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Saturday Night Board Games"
                />
              </label>

              <label>
                Category
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="Social">Social</option>
                  <option value="Sports">Sports</option>
                  <option value="Education">Education</option>
                  <option value="Music">Music</option>
                  <option value="Other">Other</option>
                </select>
              </label>

              <label>
                Date & Time
                <input
                  type="datetime-local"
                  required
                  value={formData.dateTime}
                  onChange={(e) => setFormData({ ...formData, dateTime: e.target.value })}
                />
              </label>

              <div className="row">
                <label>
                  Duration (mins)
                  <input
                    type="number"
                    min="15"
                    value={formData.durationMinutes}
                    onChange={(e) => setFormData({ ...formData, durationMinutes: e.target.value })}
                  />
                </label>
                <label>
                  Capacity (optional)
                  <input
                    type="number"
                    min="2"
                    placeholder="Unlimited"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                  />
                </label>
              </div>

              <label>
                Description
                <textarea
                  required
                  rows={5}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your event details..."
                />
              </label>
            </div>

            <div className="form-right">
              <label>
                Location Address
                <input
                  type="text"
                  required
                  value={formData.locationAddress}
                  onChange={(e) => setFormData({ ...formData, locationAddress: e.target.value })}
                  placeholder="123 Main St..."
                />
              </label>
              <div className="map-picker-warning">
                📌 Click on the map to pin the exact coordinates for users to find.
              </div>
              <div className="map-picker-container">
                <Map
                  interactive={true}
                  onMapClick={handleMapClick}
                  markers={
                    coords
                      ? [
                          {
                            id: "temp",
                            lat: coords.lat,
                            lng: coords.lng,
                            title: "Pin",
                            category: "",
                          },
                        ]
                      : []
                  }
                />
              </div>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-create">
            {loading ? "Creating..." : "Create Event"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
