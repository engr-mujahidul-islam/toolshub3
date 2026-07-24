"use client";

import { useState } from "react";
import { Input, Button, Checkbox, Space, Card, Modal } from "antd";
import { FaFilter } from "react-icons/fa";
import { IoMdSend } from "react-icons/io";
import CopyList, { CopyItem } from "@/components/Reusable/CopyList";

const { Group: CheckboxGroup } = Checkbox;

type FeatureKeys =
  | "Animated"
  | "wCarousel"
  | "wVideo"
  | "wCountdown"
  | "wHoliday_Module"
  | "wCalendar_Module"
  | "wCommute_Outlook_Module"
  | "Ahead_Module"
  | "wContent_Module"
  | "wSpotlight_Module";

type ProductTypeKeys =
  | "Hero"
  | "BothHero"
  | "DesktopHero"
  | "MobileHero"
  | "BothTakeover"
  | "DesktopTakeover"
  | "MobileTakeover"
  | "AppBGI"
  | "AppParallax"
  | "Standard";

type SizeKeys =
  | "300x250"
  | "320x50"
  | "320x100"
  | "468x60"
  | "728x90"
  | "970x250"
  | "970x90"
  | "160x600"
  | "300x600"
  | "300x1050";

const Creatives = () => {
  const [inputText, setInputText] = useState<string>("");
  const [inputVersion, setInputVersion] = useState<string>("");
  const [taskNumber, setTaskNumber] = useState<string>("");
  const [inputTypes, setInputTypes] = useState<string>("");
  const [filterModal, setFilterModal] = useState<boolean>(false);

  const [features, setFeatures] = useState<Record<FeatureKeys, boolean>>({
    Animated: false,
    wCarousel: false,
    wVideo: false,
    wCountdown: false,
    wHoliday_Module: false,
    wCalendar_Module: false,
    wCommute_Outlook_Module: false,
    Ahead_Module: false,
    wContent_Module: false,
    wSpotlight_Module: false,
  });

  const [productTypes, setProductTypes] = useState<
    Record<ProductTypeKeys, boolean>
  >({
    Hero: true,
    BothHero: true,
    DesktopHero: false,
    MobileHero: false,
    BothTakeover: true,
    DesktopTakeover: false,
    MobileTakeover: false,
    AppBGI: true,
    AppParallax: true,
    Standard: true,
  });

  const [sizes, setSizes] = useState<Record<SizeKeys, boolean>>({
    "300x250": true,
    "320x50": true,
    "320x100": false,
    "468x60": false,
    "728x90": true,
    "970x250": true,
    "970x90": false,
    "160x600": true,
    "300x600": true,
    "300x1050": false,
  });

  const [generatedItems, setGeneratedItems] = useState<CopyItem[]>([]);

  const handleFeatureChange = (checkedValues: string[]) => {
    const newFeatures = Object.keys(features).reduce((acc, key) => {
      acc[key as FeatureKeys] = checkedValues.includes(key);
      return acc;
    }, {} as Record<FeatureKeys, boolean>);
    setFeatures(newFeatures);
  };

  const handleProductTypeChange = (checkedValues: string[]) => {
    const newProductTypes = Object.keys(productTypes).reduce((acc, key) => {
      acc[key as ProductTypeKeys] = checkedValues.includes(key);
      return acc;
    }, {} as Record<ProductTypeKeys, boolean>);
    setProductTypes(newProductTypes);
  };

  const handleSizeChange = (checkedValues: string[]) => {
    const newSizes = Object.keys(sizes).reduce((acc, key) => {
      acc[key as SizeKeys] = checkedValues.includes(key);
      return acc;
    }, {} as Record<SizeKeys, boolean>);
    setSizes(newSizes);
  };

  const handleProcessText = () => {
    setFilterModal(false);
    const parts = inputText.split(" (");
    const beforeText = parts[0].trim();
    const afterText = parts[1]?.replace(")", "").trim() || "";
    const processedParentFolder = beforeText
      .replace(/[-()"'.`’#*@\/\\]/g, "")
      .replace(/\s+/g, "_");
    const converseIDTxt =
      beforeText === "Mock Request" ? beforeText + " " + afterText : afterText;
    const processedConverseID = converseIDTxt
      .replace(/[-()"'.`’#*@\/\\]/g, "")
      .replace(/\s+/g, "_");
    const currentDate = new Date();
    const fullYear = currentDate.getFullYear().toString();
    const year = fullYear.slice(-2);
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const date = String(currentDate.getDate()).padStart(2, "0");
    const finalTaskNumber = taskNumber || "";
    const newItems: CopyItem[] = [];
    newItems.push({
      id: "converIdFolderParent",
      label: "Parent Folder Name",
      text: processedParentFolder,
    });
    newItems.push({
      id: "converIdFolderName",
      label: "Task Folder Name",
      text: `${processedConverseID}_${year}${month}0${finalTaskNumber}`,
    });
    newItems.push({
      id: "BriefName",
      label: "Brief Name",
      text: `brief_${year}${month}0${finalTaskNumber}`,
    });
    newItems.push({
      id: "BriefTitle",
      label: "Brief Title",
      text: `${inputText} - ${year}${month}0${finalTaskNumber}`,
    });
    newItems.push({
      id: "BriefTabInitial",
      label: "Tab Name Initial",
      text: `${month}.${date}.${fullYear}_Initial_build`,
    });
    newItems.push({
      id: "BriefTabRevision",
      label: "Tab Name Revision",
      text: `${month}.${date}.${fullYear}_Revision`,
    });
    let baseName = "";
    for (const feature in features)
      if (features[feature as FeatureKeys]) baseName += `_${feature}`;
    const inputArray = inputVersion
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item !== "");

    const generateUnits = (type: string, suffixes: string[] = [""]) => {
      let text = "";
      suffixes.forEach((suffix) => {
        for (const size in sizes) {
          if (sizes[size as SizeKeys])
            text += `${processedConverseID}_${type}_${size}${suffix}<br/>`;
        }
      });
      return text;
    };

    if (productTypes.Hero) {
      const heroUnits = inputArray.length
        ? inputArray
            .map(
              (v) =>
                `${processedConverseID}_Hero${baseName}_Desktop_${v}<br/>${processedConverseID}_Hero${baseName}_Mobile_Web_${v}`
            )
            .join("<br/>")
        : `${processedConverseID}_Hero${baseName}_Desktop<br/>${processedConverseID}_Hero${baseName}_Mobile_Web`;
      newItems.push({
        id: "converIdHeroDesktop",
        label: "Hero",
        text: <div dangerouslySetInnerHTML={{ __html: heroUnits }} />,
      });
    }

    if (productTypes.BothHero) {
      const bothHeroUnits = inputArray.length
        ? inputArray
            .map(
              (v) =>
                `${processedConverseID}_Desktop_Hero${baseName}_${v}<br/>${processedConverseID}_Mobile_Hero${baseName}_${v}`
            )
            .join("<br/>")
        : `${processedConverseID}_Desktop_Hero${baseName}<br/>${processedConverseID}_Mobile_Hero${baseName}`;
      newItems.push({
        id: "converIdBothHero",
        label: "Both Hero",
        text: <div dangerouslySetInnerHTML={{ __html: bothHeroUnits }} />,
      });
    }

    if (productTypes.Standard) {
      const typesArray = inputTypes
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t !== "");
      const standardUnits = inputArray.length
        ? inputArray
            .map((v) =>
              generateUnits(
                `Standard`,
                typesArray.map((t) => `_${t}_${v}`)
              )
            )
            .join("<br/>")
        : generateUnits(
            "Standard",
            typesArray.length ? typesArray.map((t) => `_${t}`) : ["_Static"]
          );
      newItems.push({
        id: "converIdStandard",
        label: "Standard",
        text: <div dangerouslySetInnerHTML={{ __html: standardUnits }} />,
      });
    }

    setGeneratedItems(newItems);
  };

  return (
    <section className="tab-pane fade show active" id="home" role="tabpanel">
      <Card title="Creative Names" className="rounded-lg">
        <Space wrap size="large" className="mb-6 flex justify-center w-full">
          <Input
            placeholder="Jackery (Jackery Summer 2025)"
            style={{ width: 320 }}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            allowClear
            size="large"
          />
          <Input
            placeholder="v1,v2,v3 or Patio, Grills or Additional"
            style={{ width: 320 }}
            value={inputVersion}
            onChange={(e) => setInputVersion(e.target.value)}
            allowClear
            size="large"
          />
          <Input
            placeholder="09 (2 digit)"
            style={{ width: 120 }}
            value={taskNumber}
            onChange={(e) => setTaskNumber(e.target.value)}
            allowClear
            size="large"
          />
          <Button
            type="dashed"
            onClick={() => setFilterModal(!filterModal)}
            size="large"
          >
            Additional Filters <FaFilter />
          </Button>
          <Button type="primary" size="large" onClick={handleProcessText}>
            Process Text <IoMdSend />
          </Button>
        </Space>

        <Modal
          title="Creative Filter"
          centered
          open={filterModal}
          onCancel={() => setFilterModal(false)}
          width={1400}
          footer={
            <Button type="primary" size="large" onClick={handleProcessText}>
              Process Text <IoMdSend />
            </Button>
          }
        >
          <div className="flex flex-col gap-4 p-5">
            <Card title="Features" className="mb-4">
              <CheckboxGroup
                options={Object.keys(features)}
                value={Object.keys(features).filter(
                  (f) => features[f as FeatureKeys]
                )}
                onChange={handleFeatureChange}
              />
            </Card>
            <Card title="Product Types" className="mb-4">
              <CheckboxGroup
                options={Object.keys(productTypes)}
                value={Object.keys(productTypes).filter(
                  (p) => productTypes[p as ProductTypeKeys]
                )}
                onChange={handleProductTypeChange}
              />
            </Card>

            <Card title="Sizes & Types" className="mb-6">
              <Space wrap size="middle">
                <CheckboxGroup
                  options={Object.keys(sizes)}
                  value={Object.keys(sizes).filter((s) => sizes[s as SizeKeys])}
                  onChange={handleSizeChange}
                />
                <Input
                  placeholder="Types"
                  style={{ width: 200 }}
                  value={inputTypes}
                  onChange={(e) => setInputTypes(e.target.value)}
                />
              </Space>
            </Card>
          </div>
        </Modal>
      </Card>

      <div id="generatedCreatives">
        {generatedItems.length > 0 && (
          <div className="space-y-4">
            <CopyList items={generatedItems} />
          </div>
        )}
      </div>
    </section>
  );
};

export default Creatives;
