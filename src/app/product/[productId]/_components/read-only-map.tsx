"use client";

import L from "leaflet";
import { useEffect, useState } from "react";
import { MapContainer, Marker, TileLayer } from "react-leaflet";

import "leaflet/dist/leaflet.css";

// Исправляем проблему с иконками маркеров в Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface ReadOnlyMapProps {
  address: string;
}

// Координаты Оренбурга по умолчанию
const ORENBURG_CENTER: [number, number] = [51.7687, 55.0963];

export const ReadOnlyMap = ({ address }: ReadOnlyMapProps) => {
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const geocodeAddress = async () => {
      if (!address) {
        setCoordinates(ORENBURG_CENTER);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Используем Nominatim API для геокодирования
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`,
        );

        if (!response.ok) {
          throw new Error("Ошибка при загрузке карты");
        }

        const data = await response.json();

        if (data.length > 0) {
          const lat = Number.parseFloat(data[0].lat);
          const lon = Number.parseFloat(data[0].lon);
          setCoordinates([lat, lon]);
        } else {
          // Если адрес не найден, показываем центр Оренбурга
          setCoordinates(ORENBURG_CENTER);
        }
      } catch (err) {
        console.error("Ошибка геокодирования:", err);
        setError("Не удалось загрузить карту");
        setCoordinates(ORENBURG_CENTER);
      } finally {
        setIsLoading(false);
      }
    };

    geocodeAddress();
  }, [address]);

  if (isLoading) {
    return (
      <div className="mx-auto flex h-80 w-1/2 items-center justify-center rounded-lg border border-gray-200 bg-gray-50">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-500"></div>
          <p className="mt-2 text-sm text-gray-500">Загрузка карты...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto flex h-80 w-1/2 items-center justify-center rounded-lg border border-gray-200 bg-gray-50">
        <div className="text-center text-gray-500">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto h-80 w-1/2 overflow-hidden rounded-lg border border-gray-200">
      <MapContainer
        center={coordinates || ORENBURG_CENTER}
        className="z-0 [&_.leaflet-control-attribution]:hidden"
        dragging={true}
        style={{ height: "100%", width: "100%" }}
        doubleClickZoom={false}
        scrollWheelZoom={false}
        touchZoom={true}
        zoom={15}
        zoomControl={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {coordinates && <Marker position={coordinates} />}
      </MapContainer>
    </div>
  );
};
