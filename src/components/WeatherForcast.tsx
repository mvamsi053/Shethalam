import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ArrowDown, ArrowUp, Droplets, Wind } from "lucide-react";
import type { ForecastData } from "@/api/types";
import dayjs from "dayjs";

interface WeatherForecastProps {
  data: ForecastData;
}

interface DailyForecast {
  date: number;
  temp_min: number;
  temp_max: number;
  humidity: number;
  wind: number;
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  };
}

export function WeatherForecast({ data }: WeatherForecastProps) {
  // Group forecast by day and get daily min/max
  const dailyForecasts = data.list.reduce((acc, forecast) => {
    const date = dayjs(forecast.dt_txt).format("YYYY-MM-DD");

    if (!acc[date]) {
      acc[date] = {
        temp_min: forecast.main.temp_min,
        temp_max: forecast.main.temp_max,
        humidity: forecast.main.humidity,
        wind: forecast.wind.speed,
        weather: forecast.weather[0],
        date: forecast.dt,
      };
    } else {
      acc[date].temp_min = Math.min(acc[date].temp_min, forecast.main.temp_min);
      acc[date].temp_max = Math.max(acc[date].temp_max, forecast.main.temp_max);
    }

    return acc;
  }, {} as Record<string, DailyForecast>);

  // Get next 5 days
  const nextDays = Object.values(dailyForecasts).slice(1, 6);

  // Format temperature
  const formatTemp = (temp: number) => `${Math.round(temp)}°`;

  return (
    <Card>
      <CardHeader>
        <CardTitle>5-Day Forecast</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='grid gap-4'>
          {nextDays.map((day) => (
            <div
              key={day.date}
              className='grid grid-cols-1 sm:grid-cols-3 items-center gap-4 rounded-lg border p-4'
            >
              <div className="flex sm:flex-col  items-center sm:items-start gap-x-2">
                <p className='font-medium'>
                  {dayjs(new Date(day.date * 1000)).format("ddd, MMM DD")}
                </p>
                <p className='text-sm text-muted-foreground capitalize'>
                  {day.weather.description}
                </p>
              </div>
              <div className='flex sm:justify-center gap-4'>
                <div className='flex items-center text-blue-400'>
                  <ArrowDown className='mr-1 h-4 w-4' />
                  {formatTemp(day.temp_min)}
                </div>
                <div className='flex items-center text-red-400'>
                  <ArrowUp className='mr-1 h-4 w-4' />
                  {formatTemp(day.temp_max)}
                </div>
              </div>

              <div className='flex sm:justify-end gap-4'>
                <div className='flex items-center gap-1'>
                  <Droplets className='h-4 w-4 text-blue-400' />
                  <span className='text-sm'>{day.humidity}%</span>
                </div>
                <div className='flex items-center gap-1'>
                  <Wind className='h-4 w-4 text-blue-400' />
                  <span className='text-sm'>{day.wind}m/s</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
