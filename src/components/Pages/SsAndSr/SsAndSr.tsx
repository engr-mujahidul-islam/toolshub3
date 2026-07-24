"use client";

import { useState } from "react";
import { Input, Button, Card, Space } from "antd";
import { IoMdSend } from "react-icons/io";
import CopyList, { CopyItem } from "@/components/Reusable/CopyList";

const SsAndSr = () => {
  const [inputUnitName, setInputUnitName] = useState("");
  const [items, setItems] = useState<CopyItem[]>([]);

  const processSSSRName = () => {
    if (!inputUnitName) return;

    const folderName = inputUnitName.replace("_Mobile_Web", "");

    const generatedItems: CopyItem[] = [
      { id: "folderName", label: "Folder Name", text: folderName },
      {
        id: "screenshotDesktop",
        label: "Screenshot Desktop",
        text: `${folderName}_Screenshot_Desktop`,
      },
      {
        id: "screenshotiPad",
        label: "Screenshot iPad",
        text: `${folderName}_Screenshot_iPad`,
      },
      {
        id: "screenshotiPhone",
        label: "Screenshot iPhone",
        text: `${folderName}_Screenshot_iPhone`,
      },
      {
        id: "screenRecordDesktop",
        label: "Screen Record Desktop",
        text: `${folderName}_Screen_Recording_Desktop`,
      },
      {
        id: "screenRecordiPad",
        label: "Screen Record iPad",
        text: `${folderName}_Screen_Recording_iPad`,
      },
      {
        id: "screenRecordiPhone",
        label: "Screen Record iPhone",
        text: `${folderName}_Screen_Recording_iPhone`,
      },
      {
        id: "desktopTakeover1920",
        label: "Desktop Takeover 1920 (SS)",
        text: `${folderName}_Screenshot_1920`,
      },
      {
        id: "desktopTakeover1366",
        label: "Desktop Takeover 1366 (SS)",
        text: `${folderName}_Screenshot_1366`,
      },
      {
        id: "desktopTakeover1920SR",
        label: "Desktop Takeover 1920 (SR)",
        text: `${folderName}_Screen_Recording_1920`,
      },
      {
        id: "desktopTakeover1366SR",
        label: "Desktop Takeover 1366 (SR)",
        text: `${folderName}_Screen_Recording_1366`,
      },
      {
        id: "mobileTakeover",
        label: "Mobile Takeover (SS)",
        text: `${folderName}_Screenshot_iPhone`,
      },
      {
        id: "mobileTakeoverSR",
        label: "Mobile Takeover (SR)",
        text: `${folderName}_Screen_Recording_iPhone`,
      },
    ];

    setItems(generatedItems);
  };

  return (
    <div className="container mx-auto p-6 flex flex-col gap-5">
      <Card title="Screenshot & Screen Recording Names" className="rounded-lg">
        <Space wrap size="middle" className="w-full flex justify-center">
          <Input
            placeholder="Fountain_Tire_2025_Promo_2_Hero_Mobile_Web"
            value={inputUnitName}
            onChange={(e) => setInputUnitName(e.target.value)}
            style={{ minWidth: 600 }}
            allowClear
            size="large"
          />
          <Button
            type="primary"
            size="large"
            onClick={processSSSRName}
            className="flex items-center"
          >
            Process Text <IoMdSend className="ml-2" />
          </Button>
        </Space>
      </Card>

      {items.length > 0 && (
        <Card title="Generated Names" className="shadow-lg rounded-lg">
          <CopyList items={items} />
        </Card>
      )}
    </div>
  );
};

export default SsAndSr;
