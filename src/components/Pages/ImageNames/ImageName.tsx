"use client";

import { useState } from "react";
import { Input, Button, Select, Space, Card } from "antd";
import { IoMdSend } from "react-icons/io";
import CopyList, { CopyItem } from "@/components/Reusable/CopyList";

const { Option } = Select;

const ImageNames = () => {
  const [versionNo, setVersionNo] = useState("");
  const [videoName, setVideoName] = useState("");
  const [ticketNo, setTicketNo] = useState("");
  const [gamVersion, setGamVersion] = useState("");
  const [productType, setProductType] = useState("Hero");
  const [featureSelect, setFeatureSelect] = useState("No_Feature");
  const [storageType, setStorageType] = useState("GAM");
  const [generatedItems, setGeneratedItems] = useState<CopyItem[]>([]);

  const handleProcessImages = () => {
    // Sanitize versionNo: trim spaces and replace internal spaces/whitespace with underscores
    const sanitizedVersionNo = versionNo
      ? versionNo.trim().replace(/\s+/g, "_")
      : "";

    const finalVersionNo = sanitizedVersionNo ? `_${sanitizedVersionNo}` : "";
    const finalGamVersion = gamVersion ? `_v${gamVersion}` : "_v1";

    // Standard suffix: _[versionNo]_[ticketNo]_[gamVersion]
    const finalTicketNo = ticketNo ? `_${ticketNo}` : "";
    const imgLastName =
      storageType === "SEBPO_Server"
        ? ""
        : `${finalVersionNo}${finalTicketNo}${finalGamVersion}`;

    // App_BGI suffix: adds "_app_bgi" right before the ticket number
    const bgiTicketNo = ticketNo ? `_app_bgi_${ticketNo}` : "_app_bgi";
    const bgiImgLastName =
      storageType === "SEBPO_Server"
        ? ""
        : `${finalVersionNo}${bgiTicketNo}${finalGamVersion}`;

    const newItems: CopyItem[] = [];

    if (productType === "Hero") {
      newItems.push(
        {
          id: "desktop_bg",
          label: "desktop_bg",
          text: `desktop_bg${imgLastName}`,
        },
        {
          id: "desktop_content",
          label: "desktop_content",
          text: `desktop_content${imgLastName}`,
        },
        { id: "iPad_bg", label: "iPad_bg", text: `iPad_bg${imgLastName}` },
        {
          id: "iPad_content",
          label: "iPad_content",
          text: `iPad_content${imgLastName}`,
        },
        {
          id: "iPhone_bg",
          label: "iPhone_bg",
          text: `iPhone_bg${imgLastName}`,
        },
        {
          id: "iPhone_content",
          label: "iPhone_content",
          text: `iPhone_content${imgLastName}`,
        },
        {
          id: "iPhone_content_320",
          label: "iPhone_content_320",
          text: `iPhone_content_320${imgLastName}`,
        },
        {
          id: "HeroManualLoader",
          label: "Hero Manual Loader",
          type: "code",
          text: `manualAssetsLoader:[\n  '%%FILE:desktop_bg%%',\n  '%%FILE:desktop_content%%',\n  '%%FILE:iPad_bg%%',\n  '%%FILE:iPad_content%%',\n  '%%FILE:iPhone_bg%%',\n  '%%FILE:iPhone_content%%',\n  '%%FILE:iPhone_content_320%%'\n]`,
        }
      );
    } else if (productType === "App_BGI") {
      newItems.push(
        {
          id: "mobile_ad_360",
          label: "mobile_ad_360",
          text: `mobile_ad_360${bgiImgLastName}`,
        },
        {
          id: "mobile_ad_430",
          label: "mobile_ad_430",
          text: `mobile_ad_430${bgiImgLastName}`,
        }
      );
    } else if (productType === "Desktop_Takeover") {
      newItems.push(
        {
          id: "responsive_hero_wGutter_top_content",
          label: "responsive_hero_wGutter_top_content",
          text: `responsive_hero_wGutter_top_content${imgLastName}`,
        },
        {
          id: "responsive_hero_wGutter_largeSkin",
          label: "responsive_hero_wGutter_largeSkin",
          text: `responsive_hero_wGutter_largeSkin${imgLastName}`,
        },
        {
          id: "responsive_hero_wGutter_midSkin",
          label: "responsive_hero_wGutter_midSkin",
          text: `responsive_hero_wGutter_midSkin${imgLastName}`,
        },
        {
          id: "responsive_hero_wGutter_smallSkin",
          label: "responsive_hero_wGutter_smallSkin",
          text: `responsive_hero_wGutter_smallSkin${imgLastName}`,
        },
        {
          id: "responsive_hero_wGutter_narrowSkin",
          label: "responsive_hero_wGutter_narrowSkin",
          text: `responsive_hero_wGutter_narrowSkin${imgLastName}`,
        },
        {
          id: "DesktopTakeoverManualLoader",
          label: "Desktop Takeover Manual Loader",
          type: "code",
          text: `manualAssetsLoader:[\n  '%%FILE:responsive_hero_wGutter_top_content%%',\n  '%%FILE:responsive_hero_wGutter_largeSkin%%',\n  '%%FILE:responsive_hero_wGutter_midSkin%%',\n  '%%FILE:responsive_hero_wGutter_smallSkin%%',\n  '%%FILE:responsive_hero_wGutter_narrowSkin%%'\n]`,
        }
      );
    }

    if (featureSelect === "wVideo") {
      newItems.push(
        { id: "poster", label: "poster (jpg)", text: `poster${imgLastName}` },
        {
          id: "posterPNG",
          label: "poster (png)",
          text: `poster${imgLastName}`,
        },
        { id: "Videomp4", label: "Video MP4", text: `${videoName}.mp4` },
        { id: "VideoWebm", label: "Video Webm", text: `${videoName}.webm` }
      );
    }

    setGeneratedItems(newItems);
  };

  return (
    <section className="container mx-auto p-6 flex flex-col gap-5">
      <Card title="Image Name Generator" className="rounded-lg">
        <Space wrap size="large" className="w-full">
          <Select
            value={productType}
            onChange={setProductType}
            style={{ width: 180 }}
            allowClear
            size="large"
          >
            <Option value="Hero">Hero</Option>
            <Option value="Desktop_Hero">Desktop Hero</Option>
            <Option value="Mobile_Hero">Mobile Hero</Option>
            <Option value="Desktop_Takeover">Desktop Takeover</Option>
            <Option value="Digital_Billboard">Digital Billboard</Option>
            <Option value="App_BGI">App BGI</Option>
          </Select>

          <Select
            value={featureSelect}
            onChange={setFeatureSelect}
            style={{ width: 180 }}
            allowClear
            size="large"
          >
            <Option value="No_Feature">No Dynamic Feature</Option>
            <Option value="Animated">Animated</Option>
            <Option value="wCarousel">wCarousel</Option>
            <Option value="wVideo">wVideo</Option>
          </Select>

          <Select
            value={storageType}
            onChange={setStorageType}
            style={{ width: 160 }}
            allowClear
            size="large"
          >
            <Option value="GAM">GAM</Option>
            <Option value="SEBPO_Server">SEBPO Server</Option>
          </Select>

          <Input
            placeholder="Version No"
            value={versionNo}
            onChange={(e) => setVersionNo(e.target.value)}
            style={{ width: 120 }}
            allowClear
            size="large"
          />
          <Input
            placeholder="Video Name"
            value={videoName}
            onChange={(e) => setVideoName(e.target.value)}
            style={{ width: 160 }}
            allowClear
            size="large"
          />
          <Input
            placeholder="Ticket No"
            value={ticketNo}
            onChange={(e) => setTicketNo(e.target.value)}
            style={{ width: 120 }}
            allowClear
            size="large"
          />
          <Input
            placeholder="GAM Version"
            value={gamVersion ? gamVersion : "1"}
            onChange={(e) => setGamVersion(e.target.value)}
            style={{ width: 120 }}
            allowClear
            size="large"
          />

          <Button
            type="primary"
            size="large"
            onClick={handleProcessImages}
            className="flex items-center"
          >
            Process Text <IoMdSend className="ml-2" />
          </Button>
        </Space>
      </Card>

      {generatedItems.length > 0 && (
        <Card title="Generated Image Names" className="shadow-lg rounded-lg">
          <CopyList items={generatedItems} />
        </Card>
      )}
    </section>
  );
};

export default ImageNames;