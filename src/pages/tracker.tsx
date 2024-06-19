import { SimpleSouthKoreaMapChart } from "@/components/korea-map/SouthKoreaMap";
import { Skeleton } from "@/components/ui/skeleton";
import coordinates from "@/data/coordinates";
import KmaClient, { weatherCode, xyConvertCode } from "@/lib/kma";
import { useEffect, useState } from "react";

const setColorByCount = (count: number) => {
  if (count === weatherCode.clear) return "#d6f1ff";
  if (count === weatherCode.rain) return "#b9e8ff";
  if (count === weatherCode.rain_snow) return "#7eb9d6";
  if (count === weatherCode.snow) return "#b5ccd7";
  if (count === weatherCode.shower) return "#a4a7d1";
  if (count === weatherCode.drizzle) return "#3857b5";
  if (count === weatherCode.drizzle_snow) return "#435299";
  if (count === weatherCode.snow_flurry) return "#514887";
  else return "#ffffff";
};

export default function TrackerPage() {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState<
    {
      locale: string;
      temp: number;
      speed: number;
      direction: string;
      weatherCode: number;
    }[]
  >([]);
  const [userWeather, setUserWeather] = useState<{
    temp: number;
    speed: number;
    direction: string;
    weatherCode: number;
  }>();

  const kmaClient = new KmaClient(import.meta.env.VITE_KMA_API_KEY || "");

  useEffect(() => {
    const success = async (position: GeolocationPosition) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      const fixedCoord = kmaClient.dfs_xy_conv(xyConvertCode.grid, lat, lon);
      const res = await kmaClient.getWeatherInfo(fixedCoord.x, fixedCoord.y);
      setUserWeather({
        temp: res.temprature,
        speed: res.speed,
        direction: res.wind,
        weatherCode: res.weather,
      });
    };
    const error = () => {};

    const prepare = async () => {
      let newData = [];
      for (const coord of Object.values(coordinates)) {
        const res = await kmaClient.getWeatherInfo(coord.x, coord.y);
        newData.push({
          locale: coord.locale,
          temp: res.temprature,
          speed: res.speed,
          direction: res.wind,
          weatherCode: res.weather,
        });
      }

      navigator.geolocation.getCurrentPosition(success, error);
      setData(newData);
      setLoading(false);
    };

    prepare();
  }, []);

  if (isLoading) {
    return (
      <main>
        <Skeleton className="w-[50vw] h-[50vh] absolute right-10 top-20 mt-[10vh]" />
        <Skeleton className="w-[300px] h-[200px] absolute left-20 bottom-20left-20 bottom-20" />
      </main>
    );
  }

  return (
    <main className="relative max-w-[1200px] mx-auto h-[100vh]">
      <div className="font-bold absolute left-20 bottom-20 ">
        현재 당신 지역의 날씨는..{" "}
        {kmaClient.parseWeatherCode(userWeather?.weatherCode || 0)}
        <div>
          <div>온도 : {userWeather?.temp}°c</div>
          <div>풍속 : {userWeather?.speed}m/s</div>
          <div>풍향 : {userWeather?.direction}</div>
        </div>
      </div>
      <div className="w-fit h-[80vh] absolute right-10 top-20 mt-[10vh]">
        <SimpleSouthKoreaMapChart
          darkMode={false}
          setColorByCount={setColorByCount}
          data={data}
        />
      </div>
    </main>
  );
}
