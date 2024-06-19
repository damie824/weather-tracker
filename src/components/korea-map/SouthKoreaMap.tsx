import { useEffect, useState } from "react";
import { SouthKoreaSvgMap } from "./SouthKoreaSvgMap";
import KmaClient from "@/lib/kma";

type MapDataType = {
  [location: string]: {
    temp: number;
    speed: number;
    direction: string;
    weatherCode: number;
  };
};

const DefaultTooltip = ({ darkMode, tooltipStyle, children }: any) => {
  return (
    <div
      style={{
        borderRadius: "10px",
        color: darkMode ? "#f5f5f5" : "#41444a",
        position: "fixed",
        minWidth: "200px",
        padding: "10px",
        border: `1px solid ${darkMode ? "#41444a" : "#f5f5f5"}`,
        backgroundColor: darkMode ? "#41444a" : "#fff",
        ...tooltipStyle,
      }}
    >
      {children}
    </div>
  );
};

type ChartDataType = {
  locale: string;
  temp: number;
  speed: number;
  direction: string;
  weatherCode: number;
};

export const SimpleSouthKoreaMapChart = ({
  darkMode = false,
  data,
  setColorByCount,
}: {
  darkMode: boolean;
  data: ChartDataType[];
  setColorByCount: (weather: number) => string;
}) => {
  const [mapData, setMapData] = useState<MapDataType>({});
  const [tooltipStyle, setTooltipStyle] = useState<any>(false);
  const [location, setLocation] = useState<string>("");

  useEffect(() => {
    const items = data.reduce((acc: any, item: ChartDataType) => {
      return {
        ...acc,
        [item.locale]: {
          temp: item.temp,
          speed: item.speed,
          direction: item.direction,
          weatherCode: item.weatherCode,
        },
      };
    }, {});

    setMapData(items);
  }, [data]);

  const handleLocationMouseOver = (event: any) => {
    const location = event.target.attributes.name.value;
    setLocation(location);
  };

  const handleLocationMouseOut = () => {
    setTooltipStyle({ display: "none" });
  };

  const handleLocationMouseMove = (event: any) => {
    const tooltipStyle = {
      display: "block",
      top: event.clientY - 130,
      left: event.clientX - 60,
    };
    setTooltipStyle(tooltipStyle);
  };

  const kmaClient = new KmaClient("");

  return (
    <>
      <SouthKoreaSvgMap
        data={mapData}
        setColorByCount={setColorByCount}
        onLocationMouseOver={handleLocationMouseOver}
        onLocationMouseOut={handleLocationMouseOut}
        childrenBefore={null}
        childrenAfter={null}
        onLocationMouseMove={handleLocationMouseMove}
      />
      <DefaultTooltip darkMode={darkMode} tooltipStyle={tooltipStyle}>
        {location} -{" "}
        {kmaClient.parseWeatherCode(mapData[location]?.weatherCode)}
        <br />
        {mapData[location]?.temp}°c
        <br />
        {mapData[location]?.speed}m/s
        <br />
        {mapData[location]?.direction}
      </DefaultTooltip>
    </>
  );
};
