import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";
import "../styles/Map.css";

// Fix default icon issue in Leaflet + Vite
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = new Icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  title: string;
  category: string;
}

interface MapProps {
  markers?: MapMarker[];
  center?: [number, number];
  zoom?: number;
  onMarkerClick?: (marker: MapMarker) => void;
  onMapClick?: (lat: number, lng: number) => void;
  interactive?: boolean;
}

const MapClickHandler = ({ onMapClick }: { onMapClick?: (lat: number, lng: number) => void }) => {
  useMapEvents({
    click(e) {
      if (onMapClick) {
        onMapClick(e.latlng.lat, e.latlng.lng);
      }
    },
  });
  return null;
};

const Map = ({
  markers = [],
  center = [37.7749, -122.4194],
  zoom = 13,
  onMarkerClick,
  onMapClick,
  interactive = true,
}: MapProps) => {
  return (
    <div className="map-container fade-in">
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={interactive}
        dragging={interactive}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" // Modern, clean basemap
        />

        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={[marker.lat, marker.lng]}
            icon={DefaultIcon}
            eventHandlers={{
              click: () => onMarkerClick && onMarkerClick(marker),
            }}
          >
            <Popup>
              <strong>{marker.title}</strong>
              <br />
              {marker.category}
            </Popup>
          </Marker>
        ))}

        {onMapClick && <MapClickHandler onMapClick={onMapClick} />}
      </MapContainer>
    </div>
  );
};

export default Map;
