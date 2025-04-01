import type { ForecastData } from "@/api/types";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import dayjs from "dayjs";
interface HourlyTemperatureProps {
  data: ForecastData;
}

const HourlyTemperature = ({ data }: HourlyTemperatureProps) => {
  const chartData = data.list.slice(0, 5)?.map((item) => ({
    time: dayjs(item?.dt_txt).format("h A"),
    temp: Math.round(item.main.temp),
    feels_like: Math.round(item.main.feels_like),
  }));
  return (
    <Card className='overflow-hidden flex-1'>
      <CardHeader>
        <CardTitle>Today's temperature</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='w-full h-[200px]'>
          <ResponsiveContainer width='100%' height='100%'>
            <LineChart data={chartData}>
              <XAxis
                dataKey='time'
                stroke='#888888'
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                dataKey='temp'
                stroke='#888888'
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}°`}
              />
              <Line
                type='monotone'
                dataKey='temp'
                stroke='#25638b'
                strokeWidth={2}
                dot={false}
              />
              <Line
                type='monotone'
                dataKey='feels_like'
                stroke='#64748b'
                strokeWidth={2}
                dot={false}
                strokeDasharray={"5 5"}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <Card className='p-2'>
                        <CardContent>
                          <p className='label'>{`Temperature ${payload[0].value}°`}</p>
                          <p className='label'>{`Feels like ${payload[1].value}°C`}</p>
                        </CardContent>
                      </Card>
                    );
                  }
                  return null;
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default HourlyTemperature;
