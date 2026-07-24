import CopyList, { CopyItem } from "@/components/Reusable/CopyList";
import React from "react";

const qaItems: CopyItem[] = [
  { id: "HTMLsQA", label: "HTML QA", text: "Bhai, HTML's are ready for QA." },
  {
    id: "QAPreviews",
    label: "Previews QA",
    text: "Bhai, Previews are ready for QA.",
  },
  {
    id: "QAPrevSSSR",
    label: "Preveiw, SS & SR QA",
    text: "Bhai, Previews Updated, SS & SR's are ready for QA.",
  },
  {
    id: "QAPrevUpdated",
    label: "Preveiw Updated QA",
    text: "Bhai, Updated Previews are ready for QA.",
  },
  {
    id: "QASSSR",
    label: "SS & SR QA",
    text: "Bhai, SS & SR's are ready for QA.",
  },
  { id: "QASS", label: "SS QA", text: "Bhai, SS's are ready for QA." },
  { id: "QASR", label: "SR QA", text: "Bhai, SR's are ready for QA." },
  {
    id: "deliveryAsset",
    label: "Delivery Assets",
    text: "Delivery Assets QA.",
  },
];

const QA: React.FC = () => {
  return <CopyList items={qaItems} />;
};

export default QA;
