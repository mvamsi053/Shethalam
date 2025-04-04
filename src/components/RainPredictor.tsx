import type { WeatherData } from "@/api/types";

interface RainPredictorProps {
  data: WeatherData;
}

function predictRain(weatherData: WeatherData) {
  const weatherMain = weatherData.weather[0].main;
  const cloudCover = weatherData.clouds.all;
  const humidity = weatherData.main.humidity;
  const rainVolume = weatherData.rain ? weatherData.rain["1h"] || 0 : 0;

  if (weatherMain === "Rain" || rainVolume > 0) {
    return "RAINING";
  }
  if (cloudCover > 80 && humidity > 70) {
    return "RAINING_SOON";
  }
  if (cloudCover > 50) {
    return "CLOUDY";
  }
  return "NO_RAIN";
}

const icons = {
  RAINING: <img src='/rain-unscreen.gif' alt='rain' className='size-8 ' />,
  RAINING_SOON: (
    <img src='/umbrella-unscreen.gif' alt='rain' className='size-8 ' />
  ),
  CLOUDY: <img src='/clouds-unscreen.gif' alt='rain' className='size-8 ' />,
  NO_RAIN: <img src='/cycling-unscreen.gif' alt='rain' className='size-8 ' />,
};

const predictions = {
  RAINING: "It's currently raining!",
  RAINING_SOON: "High chance of rain soon!",
  CLOUDY: "Cloudy, but rain is uncertain.",
  NO_RAIN: "No rain expected soon.",
};

const RainPredictor = ({ data }: RainPredictorProps) => {
  const prediction = predictRain(data);
  return (
    <div className='w-full flex items-center gap-x-2'>
      {icons[prediction]}{" "}
      <p className='text-sm text-muted-foreground'>{predictions[prediction]}</p>
    </div>
  );
};

export default RainPredictor;
