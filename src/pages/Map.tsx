"use client";

import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "esri-leaflet";
import { LatLngExpression, LatLng } from "leaflet";
import { useGeoLocation } from "@/hooks/useGeoLocation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, Loader2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import LoaderSkeletion from "@/components/LoaderSkeletion";
import { useNavigate } from "react-router-dom";
import { useGetGeoCode, useGetWeather } from "@/hooks/useWeather";
import { useState } from "react";
import { Coordinates } from "@/api/types";
import { useFavourites } from "@/hooks/useFavourites";

// Define the custom icon
const currentIcon = L.icon({
  iconUrl: "./location-pin.png",
  iconSize: [40, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Define the custom icon
const favIcon = L.icon({
  iconUrl: "./location-yellow.png",
  iconSize: [35, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Define the custom icon
const homeIcon = L.icon({
  iconUrl: "./home-address.png",
  iconSize: [35, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

interface CityCardProps {
  lat: number;
  lon: number;
}

const MapClickHandler = ({
  onClick,
}: {
  onClick: (latlng: LatLng) => void;
}) => {
  useMapEvents({
    click: (e) => onClick(e.latlng), // Capture click coordinates
  });
  return null; // This component doesn't render anything
};

const MapPage = () => {
  const {
    coordinates,
    getLocation,
    error: locationError,
    loading: locationLoading,
  } = useGeoLocation();
  const [position, setPosition] = useState<Coordinates>({
    lat: 0,
    lon: 0,
  });
  const { favourites } = useFavourites();

  if (locationLoading) {
    return <LoaderSkeletion />;
  }
  if (locationError) {
    return (
      <Alert variant='destructive'>
        <AlertTriangle className='h-4 w-4' />
        <AlertTitle>Location Error</AlertTitle>
        <AlertDescription className='flex flex-col gap-4'>
          <p>{locationError}</p>
          <Button variant='outline' onClick={getLocation} className='w-fit'>
            <MapPin className='mr-2 h-4 w-4' />
            Enable Location
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (!coordinates) {
    return (
      <Alert variant='destructive'>
        <AlertTriangle className='h-4 w-4' />
        <AlertTitle>Oops</AlertTitle>
        <AlertDescription className='flex flex-col gap-4'>
          <p> {locationError}</p>
          <Button onClick={getLocation} variant={"outline"} className='w-fit'>
            <MapPin className='mr-2 h-4 w-4' />
            Enable Location
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  const currentPosition: LatLngExpression = [
    coordinates?.lat,
    coordinates?.lon,
  ];

  const handleMapClick = (latlng: LatLng) => {
    setPosition({ lat: latlng.lat, lon: latlng.lng });
  };

  return (
    <div className='flex flex-col flex-auto relative'>
      <MapContainer
        center={currentPosition}
        zoom={13}
        style={{ width: "100%", height: "90dvh", zIndex: 49 }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
        <MapClickHandler onClick={handleMapClick} />
        <Marker position={currentPosition} icon={homeIcon}>
          <Popup>
            <CityCard lat={coordinates?.lat} lon={coordinates?.lon} />
          </Popup>
        </Marker>

        {/* On Click */}
        <Marker
          position={{ lat: position.lat, lng: position.lon }}
          icon={currentIcon}
        >
          <Popup>
            <CityCard lat={position.lat} lon={position.lon} />
          </Popup>
        </Marker>
        {favourites.map((city) => (
          <Marker
            key={`${city.lat}-${city.lon}`}
            position={{ lat: city.lat, lng: city.lon }}
            icon={favIcon}
          >
            <Popup closeOnClick={true}>
              <CityCard lat={city.lat} lon={city.lon} />
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

function CityCard({ lat, lon }: CityCardProps) {
  const navigate = useNavigate();
  const { data: weather, isLoading } = useGetWeather({ lat, lon });
  const reverseGeoQuery = useGetGeoCode({
    lat: lat || 0,
    lon: lon || 0,
  });
  const locationData = reverseGeoQuery?.data?.[0];

  const name = locationData?.name || "";

  const handleClick = () => {
    if (!name) return;
    navigate(`/city/${name}?lat=${lat}&lon=${lon}`);
  };

  return (
    <div
      onClick={handleClick}
      className='relative flex min-w-[300px]  cursor-pointer items-center gap-3 rounded-lg border bg-card p-4 pr-8 shadow-sm transition-all hover:shadow-md'
      role='button'
      tabIndex={0}
    >
      {isLoading || reverseGeoQuery.isLoading ? (
        <div className='flex h-8 items-center justify-center'>
          <Loader2 className='h-4 w-4 animate-spin' />
        </div>
      ) : weather ? (
        <>
          <div className='flex items-center gap-2'>
            <img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
              alt={weather.weather[0].description}
              className='h-8 w-8'
            />
            <div>
              <p className='font-medium text-base'>{name}</p>
              <p className='text-xs text-muted-foreground'>
                {weather.sys.country}
              </p>
            </div>
          </div>
          <div className='ml-auto text-right'>
            <p className='text-xl font-bold'>
              {Math.round(weather.main.temp)}°
            </p>
            <p className='text-sm capitalize text-muted-foreground'>
              {weather.weather[0].description}
            </p>
          </div>
        </>
      ) : null}
    </div>
  );
}

export default MapPage;
