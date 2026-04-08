import { useQuery } from "@tanstack/react-query";
import { ofetch } from "ofetch";

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

export const geocodeAddress = (address: string) =>
  ofetch<GeocodePlace[]>(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`,
  );

export const useGeocodeAddress = (address: string) =>
  useQuery({
    queryKey: ["geocode", address],
    queryFn: () => geocodeAddress(address).then((res) => res[0] || undefined),
  });
