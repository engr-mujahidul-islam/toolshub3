import CopyList, { CopyItem } from "@/components/Reusable/CopyList";
import React from "react";

const teamItems: CopyItem[] = [
  // Team Members
  { id: "Kamal", label: "Team Member", text: "Kamal Hossain" },
  { id: "Shahedur", label: "Team Member", text: "Shahedur Rahman" },
  { id: "Tajul", label: "Team Member", text: "Md. Tajul Islam" },
  { id: "Mujahidul", label: "Team Member", text: "Md. Mujahidul Islam" },
  { id: "Imran", label: "Team Member", text: "Imran Ahmed" },
  { id: "Emrul", label: "Team Member", text: "Emrul Kaesh" },
  { id: "Ashiqur", label: "Team Member", text: "Ashiqur Rahman" },

  // Client Names
  { id: "priorityTo", label: "Priority To", text: "@Luke  - " },
  {
    id: "priorityCC",
    label: "Priority CC",
    text: "@Badinn  , @Jake  , @Jessie  , @Ryan  , @Amanda  , @Lauren  & @Taylor ",
  },
  { id: "Luke", label: "Client", text: "Luke Streett" },
  { id: "Badinn", label: "Client", text: "Badinn Chobhaphand" },
  { id: "Jake", label: "Client", text: "Jake Swensen" },
  { id: "Jessie", label: "Client", text: "Jessie Harrisson" },
  { id: "Ryan", label: "Client", text: "Ryan Martorano" },
  { id: "Amanda", label: "Client", text: "Amanda Thomson-Smith" },
  { id: "Lauren", label: "Client", text: "Lauren Alfano" },
  { id: "Taylor", label: "Client", text: "Taylor Madaffari" },
];

// const teamItems: CopyItem[] = [
//   { id: 'test', label: '#', text: 'comming soon...' },
// ];

const Team: React.FC = () => {
  return <CopyList items={teamItems} />;
};

export default Team;
