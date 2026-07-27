"use client";

import { useState, useEffect } from "react";
import { Input, Button, Card, Typography } from "antd";

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
  const [filePath, setFilePath] = useState(
    "https://creativeapp.sebpo.net/banner/awcreative/2026/golden_isles/q1_2026_tac/hero_wvideo/v1/"
  );
  const [mediaHtml, setMediaHtml] = useState("");
  const [inputText, setInputText] = useState("");
  const [extractedFileNames, setExtractedFileNames] = useState<string[]>([]);

  const updateIframeSrc = () => setIframeSrc(iframeInput);

  const extractFileNames = () => {
    // 1. Extract Base URL / Path if "Index of" exists in text
    const indexOfMatch = inputText.match(/Index of\s+(\S+)/i);
    if (indexOfMatch && indexOfMatch[1]) {
      let relativePath = indexOfMatch[1];
      // Ensure leading slash isn't duplicated
      if (relativePath.startsWith("/")) {
        relativePath = relativePath.slice(1);
      }
      // Ensure trailing slash exists
      if (!relativePath.endsWith("/")) {
        relativePath += "/";
      }

      const generatedUrl = `https://creativeapp.sebpo.net/${relativePath}`;
      setFilePath(generatedUrl);
    }

    // 2. Extract Filenames (filtering out metadata lines)
    const lines = inputText.trim().split("\n");
    const files = lines
      .map((line) => {
        const parts = line.trim().split(/\t+/);
        // Take the second tabbed column if available, otherwise take the line itself
        return parts.length > 1 ? parts[1].trim() : parts[0].trim();
      })
      .filter((filename) => {
        if (!filename) return false;
        
        // Exclude directory headers, footers, and non-file entries
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

    // Automatically set the extracted names into the Product Media Viewer area as well
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
        .media-box { margin-bottom: 20px; }
        .media-box img, .media-box video { max-width: 100%; height: auto; border-radius: 6px; }
      `;
      iframe.contentDocument.head.appendChild(style);
    }
  };

  useEffect(() => {
    setFileNames(products[selectedProduct].join("\n"));
    setMediaHtml("");
  }, [selectedProduct]);

  const generateMedia = () => {
    setMediaHtml("");
    const fileList = fileNames
      .split(/[\n\t]+/)
      .map((name) => name.trim())
      .filter((name) => name);

    if (fileList.length === 0) return;

    const media = fileList.map((fileName) => {
      const fullUrl = filePath + fileName;
      if (fileName.match(/\.(mp4|webm)$/i)) {
        return `<div class="media-box"><u>${fileName}</u><video controls class="rounded-lg"><source src="${fullUrl}" type="video/${
          fileName.toLowerCase().endsWith(".mp4") ? "mp4" : "webm"
        }"></video></div>`;
      } else {
        return `<div class="media-box"><u>${fileName}</u><img src="${fullUrl}" alt="${fileName}" class="rounded-lg"/></div>`;
      }
    });
    setMediaHtml(media.join("\n"));
  };

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
            className="ant-input ant-input-lg css-la24ln mt-4 p-4 bg-gray-100 rounded-md"
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

        <Input
          value={filePath}
          onChange={(e) => setFilePath(e.target.value)}
          placeholder="Enter base file path"
          className="mt-4"
          allowClear
          size="large"
        />

        <Button
          type="primary"
          className="mt-4 w-full"
          onClick={generateMedia}
          size="large"
        >
          Generate Media
        </Button>

        <div
          className="mt-6 flex flex-wrap gap-4"
          dangerouslySetInnerHTML={{ __html: mediaHtml }}
        />
      </Card>
    </div>
  );
};

export default Paths;