import CurrentWeather from "@/components/CurrentWeather";
import { FavoriteCities } from "@/components/FavouriteCities";
import HourlyTemperature from "@/components/HourlyTemperature";
import LoaderSkeletion from "@/components/LoaderSkeletion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { WeatherDetails } from "@/components/WeatherDetails";
import { WeatherForecast } from "@/components/WeatherForcast";
import { useGeoLocation } from "@/hooks/useGeoLocation";
import {
  useGetForecast,
  useGetGeoCode,
  useGetWeather,
} from "@/hooks/useWeather";
import { AlertTriangle, MapPin, RefreshCw } from "lucide-react";

const Dashboard = () => {
  const {
    coordinates,
    getLocation,
    error: locationError,
    loading: locationLoading,
  } = useGeoLocation();

  const weatherQuery = useGetWeather({
    lat: coordinates?.lat || 0,
    lon: coordinates?.lon || 0,
  });

  const forCastQuery = useGetForecast({
    lat: coordinates?.lat || 0,
    lon: coordinates?.lon || 0,
  });
  const reverseGeoQuery = useGetGeoCode({
    lat: coordinates?.lat || 0,
    lon: coordinates?.lon || 0,
  });

  function refetchLocation() {
    getLocation();
    weatherQuery.refetch();
    forCastQuery.refetch();
    reverseGeoQuery.refetch();
  }

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

  if (weatherQuery.error || forCastQuery.error) {
    return (
      <Alert variant='destructive'>
        <AlertTriangle className='h-4 w-4' />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription className='flex flex-col gap-4'>
          <p>Failed to fetch weather data. Please try again.</p>
          <Button variant='outline' onClick={refetchLocation} className='w-fit'>
            <RefreshCw className='mr-2 h-4 w-4' />
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (!weatherQuery.data || !forCastQuery.data) {
    return <LoaderSkeletion />;
  }

  const locationData = reverseGeoQuery?.data?.[0];

  if (!locationData || !forCastQuery?.data) {
    return null;
  }

  return (
    <div className='flex w-full flex-col flex-auto gap-y-6 pb-8'>
      <FavoriteCities />
      <div className='w-full flex items-center justify-between'>
        <p className='text-xl font-bold tracking-tight '>
          My Location
        </p>
        <Button
          size={"icon"}
          onClick={refetchLocation}
          disabled={weatherQuery?.isFetching || forCastQuery?.isFetching}
        >
          <RefreshCw
            className={`${
              weatherQuery?.isFetching || forCastQuery?.isFetching
                ? "animate-spin"
                : ""
            } h-4 w-4 `}
          />
        </Button>
      </div>

      <div className='flex flex-col lg:flex-row gap-x-10 gap-y-6 '>
        <CurrentWeather
          data={weatherQuery.data}
          locationData={locationData ?? null}
        />
        <HourlyTemperature data={forCastQuery?.data} />
      </div>
      <div className='flex flex-col lg:flex-row gap-x-10 gap-y-6 '>
        <div className='flex-1'>
          <WeatherDetails data={weatherQuery.data} />
        </div>
        <div className='flex-1'>
          <WeatherForecast data={forCastQuery?.data} />
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
