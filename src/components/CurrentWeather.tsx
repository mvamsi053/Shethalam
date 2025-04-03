import type { GeoCodeResponse, WeatherData } from "@/api/types";
import { Card, CardContent } from "./ui/card";
import { ArrowDownIcon, ArrowUpIcon, Droplets, Fan } from "lucide-react";
import RainPredictor from "./RainPredictor";
interface CurrentWeatherProps {
  data: WeatherData;
  locationData: GeoCodeResponse;
}

function renderTemperature(temp: number) {
  return `${Math.floor(temp)}°`;
}

function renderIcon(icon: string) {
  return `https://openweathermap.org/img/wn/${icon}@2x.png`;
}

const CurrentWeather = ({ data, locationData }: CurrentWeatherProps) => {
  const {
    main: { feels_like, temp, temp_min, temp_max, humidity },
    wind: { speed },
    weather: [{ icon, description }],
  } = data as WeatherData;
  return (
    <Card className='overflow-hidden'>
      <CardContent>
        <div className='flex flex-col items-center justify-center gap-y-2 w-full'>
          <h2 className='font-bold text-lg w-full text-blue-400'>
            {locationData?.name},{" "}
            <span className='font-normal text-base'>{locationData?.state}</span>
            ,{" "}
            <span className='font-normal text-base'>
              {locationData?.country}
            </span>
          </h2>
          <div className='flex w-full gap-x-10 justify-between items-center '>
            <div className='grid sm:grid-cols-2 justify-start gap-4'>
              <h3 className='text-4xl font-bold '>{renderTemperature(temp)}</h3>
              <div className='flex flex-col gap-y-2'>
                <p className='text-sm'>
                  Feels like {renderTemperature(feels_like)}
                </p>
                <div className='flex gap-x-4'>
                  <div className='flex items-center gap-x-2 text-blue-400'>
                    <ArrowDownIcon className='size-4' />
                    <p className='text-sm'>{renderTemperature(temp_min)}</p>
                  </div>
                  <div className='flex items-center gap-x-2 text-red-400'>
                    <ArrowUpIcon className='size-4' />
                    <p className='text-sm'>{renderTemperature(temp_max)}</p>
                  </div>
                </div>
              </div>

              <div className='flex items-center gap-x-2 '>
                <Droplets className='size-4 text-blue-400' />
                <div className='flex flex-col gap-y-1 text-sm'>
                  <p>Humidity</p>
                  <p>{humidity}%</p>
                </div>
              </div>
              <div className='flex items-center gap-x-2 '>
                <Fan className='size-4 text-blue-400 animate-spin ' />
                <div className='flex flex-col gap-y-1 text-sm'>
                  <p>Wind speed</p>
                  <p>{speed} m/s</p>
                </div>
              </div>
            </div>
            <div className='flex flex-col gap-y-3 items-center justify-center'>
              <img src={renderIcon(icon)} alt={description} />
              <p className='text-sm capitalize'>{description}</p>
            </div>
          </div>
          <RainPredictor data={data} />
        </div>
      </CardContent>
    </Card>
  );
};
export default CurrentWeather;
