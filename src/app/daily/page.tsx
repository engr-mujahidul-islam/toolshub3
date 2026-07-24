import CopyList, { CopyItem } from "@/components/Reusable/CopyList";
import React from "react";

const dailyItems: CopyItem[] = [
  { id: "salam", label: "Salam", text: "As-Salamu Alaikum." },
  {
    id: "lunchPrayerBreak",
    label: "Lunch & Prayer Break",
    text: "Lunch & Prayer break.",
  },
  { id: "lunchBreak", label: "Lunch Break", text: "Lunch break." },
  { id: "PrayerBreak", label: "Prayer Break", text: "Prayer break." },
  { id: "break", label: "Break", text: "Break." },
  { id: "Back", label: "Back", text: "Back." },
];

const Daily: React.FC = () => {
  return <CopyList items={dailyItems} />;
};

export default Daily;
