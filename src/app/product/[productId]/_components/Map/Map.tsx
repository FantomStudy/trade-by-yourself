"use client";

import L from "leaflet";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import { useGeocodeAddress } from "./geocodeAddress";
import styles from "./Map.module.css";
import "leaflet/dist/leaflet.css";

// Временное решение проблемы с иконками маркеров в Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const ORENBURG_CENTER: [number, number] = [51.7687, 55.0963];

interface MapProps {
  address: string;
}

export const Map = ({ address }: MapProps) => {
  const geocode = useGeocodeAddress(address);

  if (!geocode.data) return null;

  const lat = Number.parseFloat(geocode.data.lat);
  const lon = Number.parseFloat(geocode.data.lon);
  const coordinates: [number, number] = [lat, lon];

  return (
    <div className={styles.container}>
      <MapContainer
        center={coordinates || ORENBURG_CENTER}
        className={styles.map}
        dragging={true}
        doubleClickZoom={false}
        scrollWheelZoom={false}
        touchZoom={true}
        zoom={15}
        zoomControl={true}
      >
        <TileLayer
          attribution='Data by &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          detectRetina
        />
        {coordinates && <Marker position={coordinates} />}
      </MapContainer>
    </div>
  );
};
