"use client";

import { useState, useEffect } from "react";
import { Input, Button, Card, Typography } from "antd";
import CopyList, { CopyItem } from "@/components/Reusable/CopyList";

const { TextArea } = Input;
const { Title } = Typography;

const products = {
  Hero: [
    "desktop_bg.jpg",
    "desktop_content.png",
    "desktop_content.jpg",
    "iPad_bg.jpg",
    "iPad_content.png",
    "iPad_content.jpg",
    "iPhone_bg.jpg",
    "iPhone_content.png",
    "iPhone_content.jpg",
    "iPhone_content_320.png",
    "iPhone_content_320.jpg",
  ],
  Hero_wVideo: [
    "amfam.mp4",
    "amfam.webm",
    "poster.png",
    "poster.jpg",
    "desktop_bg.jpg",
    "desktop_content.png",
    "desktop_content.jpg",
    "iPad_bg.jpg",
    "iPad_content.png",
    "iPad_content.jpg",
    "iPhone_bg.jpg",
    "iPhone_content.png",
    "iPhone_content.jpg",
    "iPhone_content_320.png",
    "iPhone_content_320.jpg",
  ],
  Desktop_Hero: [
    "desktop_bg.jpg", 
    "desktop_content.png",
    "desktop_content.jpg",
  ],
  Desktop_Takeover: [
    "amfam.mp4",
    "amfam.webm",
    "poster.png",
    "poster.jpg",
    "responsive_hero_wGutter_top_content.png",
    "responsive_hero_wGutter_top_content.jpg",
    "responsive_hero_wGutter_largeSkin.png",
    "responsive_hero_wGutter_largeSkin.jpg",
    "responsive_hero_wGutter_midSkin.png",
    "responsive_hero_wGutter_midSkin.jpg",  
    "responsive_hero_wGutter_midSkin.jpg",  
    "responsive_hero_wGutter_narrowSkin.png",  
    "responsive_hero_wGutter_narrowSkin.jpg",  
    "responsive_hero_wGutter_smallSkin.png",  
    "responsive_hero_wGutter_smallSkin.jpg",  
  ],
};

const formatBytes = (bytes: number) => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
};

const Paths = () => {
  const [iframeSrc, setIframeSrc] = useState(
    "https://creativeapp.sebpo.net/banner/awcreative/2026/"
  );
  const [iframeInput, setIframeInput] = useState(iframeSrc);

  const [selectedProduct, setSelectedProduct] = useState<keyof typeof products>(
    Object.keys(products)[0] as keyof typeof products
  );
  const [fileNames, setFileNames] = useState(
    products[selectedProduct].join("\n")
  );
  const [converterInput, setConverterInput] = useState("");
  const [filePath, setFilePath] = useState(
    "https://creativeapp.sebpo.net/banner/awcreative/2026/golden_isles/q1_2026_tac/hero_wvideo/v1/"
  );
  const [mediaHtml, setMediaHtml] = useState("");
  const [inputText, setInputText] = useState("");
  const [extractedFileNames, setExtractedFileNames] = useState<string[]>([]);
  const [loadingMedia, setLoadingMedia] = useState(false);

  const updateIframeSrc = () => setIframeSrc(iframeInput);

  // Sanitizes Windows/UNC server paths to Web URLs
  const sanitizePath = (rawPath: string) => {
    if (!rawPath) return "";
    
    // 1. Convert backslashes to forward slashes
    let cleaned = rawPath.replace(/\\/g, "/");

    // 2. Remove internal network drive prefixes (e.g. /adcfs-data/Data1/AccuWeb1/)
    cleaned = cleaned.replace(/\/adcfs-data\/Data1\/AccuWeb1\//i, "/");

    // 3. Ensure trailing slash exists
    if (!cleaned.endsWith("/")) {
      cleaned += "/";
    }

    return cleaned;
  };

  const handleConverterChange = (val: string) => {
    setConverterInput(val);
    const converted = sanitizePath(val);
    if (converted) {
      setFilePath(converted);
    }
  };

  const extractFileNames = () => {
    const indexOfMatch = inputText.match(/Index of\s+(\S+)/i);
    if (indexOfMatch && indexOfMatch[1]) {
      let relativePath = indexOfMatch[1];
      if (relativePath.startsWith("/")) {
        relativePath = relativePath.slice(1);
      }
      if (!relativePath.endsWith("/")) {
        relativePath += "/";
      }

      const generatedUrl = `https://creativeapp.sebpo.net/${relativePath}`;
      setFilePath(generatedUrl);
    }

    const lines = inputText.trim().split("\n");
    const files = lines
      .map((line) => {
        const parts = line.trim().split(/\t+/);
        return parts.length > 1 ? parts[1].trim() : parts[0].trim();
      })
      .filter((filename) => {
        if (!filename) return false;
        
        const lower = filename.toLowerCase();
        if (
          lower.startsWith("index of") ||
          lower.includes("name") ||
          lower.includes("parent directory") ||
          lower.includes("apache/") ||
          lower.includes("last modified") ||
          lower.includes("description")
        ) {
          return false;
        }

        return true;
      });

    setExtractedFileNames(files);

    if (files.length > 0) {
      setFileNames(files.join("\n"));
    }
  };

  const addStylesToIframe = () => {
    const iframe = document.getElementById("pathIframe") as HTMLIFrameElement;
    if (iframe && iframe.contentDocument) {
      const style = document.createElement("style");
      style.textContent = `
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
        .media-box { margin-bottom: 20px; max-width: 30%; }
        .media-box img, .media-box video { max-width: 100%; height: auto; border-radius: 6px; }
        .media-box img[src$=".png"] { background-color: #3b82f6; }
      `;
      iframe.contentDocument.head.appendChild(style);
    }
  };

  useEffect(() => {
    setFileNames(products[selectedProduct].join("\n"));
    setMediaHtml("");
  }, [selectedProduct]);

  const generateMedia = async () => {
    setLoadingMedia(true);
    setMediaHtml("");

    const fileList = fileNames
      .split(/[\n\t]+/)
      .map((name) => name.trim())
      .filter((name) => name);

    if (fileList.length === 0) {
      setLoadingMedia(false);
      return;
    }

    const mediaPromises = fileList.map(async (fileName) => {
      const fullUrl = filePath + fileName;
      const isPng = fileName.toLowerCase().endsWith(".png");
      const isVideo = fileName.match(/\.(mp4|webm)$/i);

      let dims = "";
      let fileSize = "";

      try {
        const res = await fetch(fullUrl, { method: "HEAD" });
        const contentLength = res.headers.get("content-length");
        if (contentLength) {
          fileSize = formatBytes(parseInt(contentLength, 10));
        }
      } catch (e) {
        // Fallback for CORS or missing HEAD headers
      }

      if (!isVideo) {
        dims = await new Promise<string>((resolve) => {
          const img = new Image();
          img.onload = () => resolve(`${img.naturalWidth}x${img.naturalHeight}px`);
          img.onerror = () => resolve("");
          img.src = fullUrl;
        });
      }

      const metaInfo = [dims, fileSize].filter(Boolean).join(" • ");
      const bgStyle = isPng ? "bg-blue-500 p-1" : "";

      if (isVideo) {
        return `
          <div class="media-box w-full max-w-[30%] border border-gray-200 p-2 rounded-lg bg-gray-50">
            <div class="mb-2">
              <span class="font-bold block text-sm truncate">${fileName}</span>
              ${metaInfo ? `<span class="text-xs text-gray-500 block">${metaInfo}</span>` : ""}
            </div>
            <video controls class="w-full h-auto rounded-lg">
              <source src="${fullUrl}" type="video/${fileName.toLowerCase().endsWith(".mp4") ? "mp4" : "webm"}">
            </video>
          </div>
        `;
      } else {
        return `
          <div class="media-box w-full max-w-[30%] border border-gray-200 p-2 rounded-lg bg-gray-50">
            <div class="mb-2">
              <span class="font-bold block text-sm truncate">${fileName}</span>
              ${metaInfo ? `<span class="text-xs text-gray-500 block">${metaInfo}</span>` : ""}
            </div>
            <img src="${fullUrl}" alt="${fileName}" class="w-full h-auto rounded-lg ${bgStyle}"/>
          </div>
        `;
      }
    });

    const media = await Promise.all(mediaPromises);
    setMediaHtml(media.join("\n"));
    setLoadingMedia(false);
  };

  // Define the dynamic item array for CopyList using current state
  const copyItems: CopyItem[] = [
    {
      id: "baseFilePath",
      label: "Base File Path",
      text: filePath,
    },
  ];

  return (
    <div className="space-y-10 p-6 min-h-screen flex flex-col gap-5">
      <Card className="shadow-lg rounded-lg p-6 bg-white">
        <Title level={3}>Dynamic Iframe Loader</Title>
        <div className="flex flex-col md:flex-row gap-4">
          <Input
            value={iframeInput}
            onChange={(e) => setIframeInput(e.target.value)}
            placeholder="Enter new iframe URL"
            allowClear
            size="large"
          />
          <Button type="primary" onClick={updateIframeSrc} size="large">
            Load Iframe
          </Button>
        </div>
        <iframe
          src={iframeSrc}
          onLoad={addStylesToIframe}
          id="pathIframe"
          className="w-full mt-4 border border-gray-300 rounded-lg"
          height={500}
          title="Media Iframe"
        />
      </Card>

      <Card className="shadow-lg rounded-lg p-6 bg-white">
        <Title level={3}>Extract File Names</Title>
        <TextArea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          rows={6}
          placeholder="Paste your file data here..."
          allowClear
          size="large"
        />
        <Button
          type="primary"
          className="mt-3 w-full"
          onClick={extractFileNames}
          size="large"
        >
          Extract
        </Button>
        {extractedFileNames.length > 0 && (
          <TextArea
            value={extractedFileNames.join("\n")}
            rows={6}
            readOnly
            className="ant-input ant-input-lg css-dev-only-do-not-override-la24ln mt-4 p-4 bg-gray-100 rounded-md"
          />
        )}
      </Card>

      <Card className="shadow-lg rounded-lg p-6 bg-white">
        <Title level={3}>Product Media Viewer</Title>

        <div className="flex flex-wrap gap-3 mb-4">
          {Object.keys(products).map((product) => (
            <Button
              key={product}
              type={product === selectedProduct ? "primary" : "default"}
              onClick={() =>
                setSelectedProduct(product as keyof typeof products)
              }
            >
              {product}
            </Button>
          ))}
        </div>

        <TextArea
          value={fileNames}
          onChange={(e) => setFileNames(e.target.value)}
          rows={6}
          placeholder="Paste or edit filenames here..."
          allowClear
          size="large"
        />

        {/* Path Converter Input Field */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Convert Network Path
          </label>
          <Input
            value={converterInput}
            onChange={(e) => handleConverterChange(e.target.value)}
            placeholder="Paste raw server path here (e.g. https://vortex.accuweather.com\adcfs-data\Data1\AccuWeb1\adc2010\...)"
            allowClear
            size="large"
          />
        </div>

        {/* Base File Path Input */}
        <div className="mt-2 mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Base File Path
          </label>
          <Input
            value={filePath}
            onChange={(e) => setFilePath(e.target.value)}
            placeholder="Enter base file path"
            allowClear
            size="large"
            className="ant-input ant-input-lg css-dev-only-do-not-override-la24ln"
          />
        </div>

        {/* Embedded CopyList Component */}
        <div className="mt-2 mb-4">
          <CopyList items={copyItems} />
        </div>

        <Button
          type="primary"
          className="mt-4 w-full"
          onClick={generateMedia}
          loading={loadingMedia}
          size="large"
        >
          Generate Media
        </Button>

        <div
          className="mt-6 flex flex-wrap gap-4 items-start"
          dangerouslySetInnerHTML={{ __html: mediaHtml }}
        />
      </Card>
    </div>
  );
};

export default Paths;