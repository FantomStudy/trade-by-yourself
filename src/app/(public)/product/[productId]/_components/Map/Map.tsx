"use client";

import { useQuery } from "@tanstack/react-query";
import L from "leaflet";
import { ofetch } from "ofetch";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
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

interface GeocodePlace {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  lat: string;
  lon: string;
  class: string;
  type: string;
  place_rank: number;
  importance: number;
  addresstype: string;
  name: string;
  display_name: string;
  boundingbox: string[];
}

export const Map = ({ address }: MapProps) => {
  const geocode = useQuery({
    queryKey: ["geocode", address],
    queryFn: () =>
      ofetch<GeocodePlace[]>(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`,
      ),
  });

  const coordinates =
    geocode.data?.[0] &&
    ([Number.parseFloat(geocode.data[0].lat), Number.parseFloat(geocode.data[0].lon)] satisfies [
      number,
      number,
    ]);
  const mapCenter = coordinates || ORENBURG_CENTER;

  if (geocode.isPending) {
    return (
      <div className={styles.stateContainer}>
        <div className={styles.stateContent}>
          <div className={styles.spinner} />
          <p className={styles.stateText}>Загрузка карты...</p>
        </div>
      </div>
    );
  }

  if (geocode.isError) {
    return (
      <div className={styles.stateContainer}>
        <div className={styles.stateContent}>
          <p className={styles.stateText}>Не удалось загрузить карту</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <MapContainer
        center={mapCenter}
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
        <Marker position={mapCenter} />
      </MapContainer>
    </div>
  );
};
