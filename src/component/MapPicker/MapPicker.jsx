import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon missing in standard leaflet webpack setup
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// A component to handle map click events and position updates
function LocationMarker({ position, setPosition, onLocationSelect }) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      if (onLocationSelect) {
        onLocationSelect(e.latlng);
      }
    },
  });

  return position === null ? null : (
    <Marker position={position}></Marker>
  );
}

// A component to automatically pan the map when position changes from outside
function MapUpdater({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo(position, 13, { duration: 1.5 });
    }
  }, [position, map]);
  return null;
}

const MapPicker = ({ defaultLocation, onLocationSelect }) => {
  const [position, setPosition] = useState(defaultLocation || null);

  // If we receive a new default location externally, update state
  useEffect(() => {
    if (defaultLocation && defaultLocation.lat && defaultLocation.lng) {
      setPosition(defaultLocation);
    }
  }, [defaultLocation]);

  // Use a default center if position is null (e.g. New Delhi, India roughly as a default)
  const mapCenter = position || { lat: 28.6139, lng: 77.2090 };

  return (
    <div className="w-full h-64 md:h-80 rounded-lg overflow-hidden border border-gray-600 shadow-sm z-0">
      <MapContainer 
        center={mapCenter} 
        zoom={position ? 13 : 5} 
        scrollWheelZoom={true} 
        style={{ height: '100%', width: '100%', zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapUpdater position={position} />
        <LocationMarker position={position} setPosition={setPosition} onLocationSelect={onLocationSelect} />
      </MapContainer>
    </div>
  );
};

export default MapPicker;
