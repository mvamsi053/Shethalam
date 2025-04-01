import type { Coordinates } from "@/api/types";
import { weatherAPI } from "@/api/weather";
import { useQuery } from "@tanstack/react-query";

export const API_KEYS = {
  weather: (coords: Coordinates) => ["weather", coords] as const,
  forecast: (coords: Coordinates) => ["forecast", coords] as const,
  geo: (coords: Coordinates) => ["geo", coords] as const,
  search: (query: string) => ["geo-search", query] as const,
} as const;

export function useGetWeather(coordinates: Coordinates | null) {
  return useQuery({
    queryKey: API_KEYS.weather(coordinates || { lat: 0, lon: 0 }),
    queryFn: () => weatherAPI.getCurrentWeather(coordinates!),
    enabled: Boolean(coordinates),
  });
}
export function useGetForecast(coordinates: Coordinates | null) {
  return useQuery({
    queryKey: API_KEYS.forecast(coordinates || { lat: 0, lon: 0 }),
    queryFn: () => weatherAPI.getForecasr(coordinates!),
    enabled: Boolean(coordinates),
  });
}
export function useGetGeoCode(coordinates: Coordinates | null) {
  return useQuery({
    queryKey: API_KEYS.geo(coordinates || { lat: 0, lon: 0 }),
    queryFn: () => weatherAPI.reverseGeoCode(coordinates!),
    enabled: Boolean(coordinates),
  });
}
export function useGetSearchLocations(query: string) {
  return useQuery({
    queryKey: API_KEYS.search(query),
    queryFn: () => weatherAPI.searchLocations(query),
    enabled: Boolean(query),
  });
}
