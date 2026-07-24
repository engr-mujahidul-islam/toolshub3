import CopyList, { CopyItem } from "@/components/Reusable/CopyList";

const previewItems: CopyItem[] = [
  {
    id: "todayForecast",
    label: "Today Forecast",
    text: "https://www.accuweather.com/en/us/new-york/10021/weather-forecast/349727",
  },
  {
    id: "radarPage",
    label: "Radar Page",
    text: "https://www.accuweather.com/en/us/new-york/10021/weather-radar/349727",
  },
  {
    id: "radarChicago",
    label: "Today Forecast (Chicago)",
    text: "https://www.accuweather.com/en/us/chicago/60608/weather-forecast/348308?city=chicago",
  },
  {
    id: "appNewYorkPage",
    label: "App Preview (NY)",
    text: "https://www.accuweather.com/app/today?location-key=recent",
  },
  {
    id: "webApp",
    label: "Web App",
    text: "https://www.accuweather.com/app",
  },
  {
    id: "webAppToday",
    label: "App Preview Today",
    text: "https://www.accuweather.com/app/today",
  },
  {
    id: "webAppOne",
    label: "Web App (one)",
    text: "https://one.accuweather.com/app",
  },
  {
    id: "webAppOneToday",
    label: "Web App (one), Today",
    text: "https://one.accuweather.com/app/today",
  },
];

const Page = () => {
  return (
    <>
      <CopyList items={previewItems} />
    </>
  );
};

export default Page;
