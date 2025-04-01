import { useParams, useSearchParams } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Loader2 } from "lucide-react";
import {
  useGetForecast,
  useGetGeoCode,
  useGetWeather,
} from "@/hooks/useWeather";
import HourlyTemperature from "@/components/HourlyTemperature";
import { WeatherDetails } from "@/components/WeatherDetails";
import { WeatherForecast } from "@/components/WeatherForcast";
import CurrentWeather from "@/components/CurrentWeather";

export default function City() {
  const [searchParams] = useSearchParams();
  const params = useParams();
  const lat = parseFloat(searchParams.get("lat") || "0");
  const lon = parseFloat(searchParams.get("lon") || "0");

  const coordinates = { lat, lon };

  const weatherQuery = useGetWeather(coordinates);
  const forecastQuery = useGetForecast(coordinates);
  const reverseGeoQuery = useGetGeoCode(coordinates);

  if (weatherQuery.error || forecastQuery.error) {
    return (
      <Alert variant='destructive'>
        <AlertTriangle className='h-4 w-4' />
        <AlertDescription>
          Failed to load weather data. Please try again.
        </AlertDescription>
      </Alert>
    );
  }

  if (!weatherQuery.data || !forecastQuery.data || !params.cityName) {
    return <Loader2 className='h-4 w-4 animate-spin' />;
  }
  const locationData = reverseGeoQuery?.data?.[0] || {
    name: "",
    country: "",
    state: "",
    lat: 0,
    lon: 0,
    local_names: {},
  };

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-3xl font-bold tracking-tight'>
          {params.cityName}, {weatherQuery.data.sys.country}
        </h1>
        <div className='flex gap-2'>
          {/* <FavoriteButton
            data={{ ...weatherQuery.data, name: params.cityName }}
          /> */}
        </div>
      </div>

      <div className='grid gap-6'>
        <CurrentWeather data={weatherQuery.data} locationData={locationData} />
        <HourlyTemperature data={forecastQuery.data} />
        <div className='grid gap-6 md:grid-cols-2 items-start'>
          <WeatherDetails data={weatherQuery.data} />
          <WeatherForecast data={forecastQuery.data} />
        </div>
      </div>
    </div>
  );
}
