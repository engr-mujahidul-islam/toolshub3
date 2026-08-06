"use client";

import { useState } from "react";
import { Input, Button, Card, Space, Select } from "antd";
import { IoMdSend } from "react-icons/io";
import CopyList, { CopyItem } from "@/components/Reusable/CopyList";

const { Option } = Select;

const SsAndSr = () => {
  const [inputUnitName, setInputUnitName] = useState("");
  const [productType, setProductType] = useState("Hero");
  const [mediaType, setMediaType] = useState("Screenshot"); // Screenshot, Screen_Recording, Both
  const [items, setItems] = useState<CopyItem[]>([]);

  const processSSSRName = () => {
    if (!inputUnitName) return;

    // Clean up trailing '_Mobile_Web' or '_Desktop_Web' suffixes if present
    const folderName = inputUnitName
      .replace(/_Mobile_Web$/i, "")
      .replace(/_Desktop_Web$/i, "");

    const generatedItems: CopyItem[] = [
      { id: "folderName", label: "Folder Name", text: folderName },
    ];

    const showSS = mediaType === "Screenshot" || mediaType === "Both";
    const showSR = mediaType === "Screen_Recording" || mediaType === "Both";

    switch (productType) {
      case "Hero":
        if (showSS) {
          generatedItems.push(
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
            }
          );
        }
        if (showSR) {
          generatedItems.push(
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
            }
          );
        }
        break;

      case "Desktop_Hero":
        if (showSS) {
          generatedItems.push({
            id: "screenshotDesktop",
            label: "Screenshot Desktop",
            text: `${folderName}_Screenshot_Desktop`,
          });
        }
        if (showSR) {
          generatedItems.push({
            id: "screenRecordDesktop",
            label: "Screen Record Desktop",
            text: `${folderName}_Screen_Recording_Desktop`,
          });
        }
        break;

      case "Mobile_Hero":
      case "Mobile_Takeover":
      case "App_BGI":
        if (showSS) {
          generatedItems.push({
            id: "screenshotiPhone",
            label: "Screenshot iPhone",
            text: `${folderName}_Screenshot_iPhone`,
          });
        }
        if (showSR) {
          generatedItems.push({
            id: "screenRecordiPhone",
            label: "Screen Record iPhone",
            text: `${folderName}_Screen_Recording_iPhone`,
          });
        }
        break;

      case "Desktop_Takeover":
        if (showSS) {
          generatedItems.push(
            {
              id: "desktopTakeover1920",
              label: "Desktop Takeover 1920 (SS)",
              text: `${folderName}_Screenshot_1920`,
            },
            {
              id: "desktopTakeover1366",
              label: "Desktop Takeover 1366 (SS)",
              text: `${folderName}_Screenshot_1366`,
            }
          );
        }
        if (showSR) {
          generatedItems.push(
            {
              id: "desktopTakeover1920SR",
              label: "Desktop Takeover 1920 (SR)",
              text: `${folderName}_Screen_Recording_1920`,
            },
            {
              id: "desktopTakeover1366SR",
              label: "Desktop Takeover 1366 (SR)",
              text: `${folderName}_Screen_Recording_1366`,
            }
          );
        }
        break;

      default:
        break;
    }

    setItems(generatedItems);
  };

  return (
    <div className="container mx-auto p-6 flex flex-col gap-5">
      <Card title="Screenshot & Screen Recording Names" className="rounded-lg">
        <Space wrap size="middle" className="w-full flex justify-center">
          <Select
            value={productType}
            onChange={setProductType}
            style={{ width: 180 }}
            size="large"
          >
            <Option value="Hero">Hero</Option>
            <Option value="Desktop_Hero">Desktop Hero</Option>
            <Option value="Mobile_Hero">Mobile Hero</Option>
            <Option value="Mobile_Takeover">Mobile Takeover</Option>
            <Option value="Desktop_Takeover">Desktop Takeover</Option>
            <Option value="App_BGI">App BGI</Option>
          </Select>

          <Select
            value={mediaType}
            onChange={setMediaType}
            style={{ width: 200 }}
            size="large"
          >
            <Option value="Screenshot">Screenshot</Option>
            <Option value="Screen_Recording">Screen Recording</Option>
            <Option value="Both">Both (SS & SR)</Option>
          </Select>

          <Input
            placeholder="Fountain_Tire_2025_Promo_2_Hero_Mobile_Web"
            value={inputUnitName}
            onChange={(e) => setInputUnitName(e.target.value)}
            style={{ minWidth: 400 }}
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