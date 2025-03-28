import { Coordinates } from "@/api/types";
import { useEffect, useState } from "react";

interface GeolocationState {
  loading: boolean;
  error: string | null;
  coordinates: Coordinates | null;
}

export function useGeoLocation() {
  const [location, setLocation] = useState<GeolocationState>({
    loading: true,
    error: null,
    coordinates: null,
  });
  function getLocation() {
    if (!navigator.geolocation) {
      setLocation({
        loading: false,
        error: "Geolocation is not supported by your browser",
        coordinates: null,
      });
      return;
    }
    if (navigator.geolocation.getCurrentPosition) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            loading: false,
            error: null,
            coordinates: {
              lat: position.coords.latitude,
              lon: position.coords.longitude,
            },
          });
        },
        (error) => {
          setLocation({
            loading: false,
            error: error.message,
            coordinates: null,
          });
        }
      );
    }
  }
  useEffect(() => {
    getLocation();
  }, []);
  return { ...location, getLocation };
}
