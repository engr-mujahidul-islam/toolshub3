"use client";

import React, { useState } from "react";
import { Button } from "antd";
import { toast } from "sonner";
import { motion } from "framer-motion";

export interface CopyItem {
  id: string;
  label: string;
  type?: string;
  text: string | React.ReactNode;
}

interface CopyListProps {
  items: CopyItem[];
  replaceTodayDate?: boolean;
}

const CopyList: React.FC<CopyListProps> = ({
  items,
  replaceTodayDate = false,
}) => {
  const [activeId, setActiveId] = useState<string | null>(null);

  const today = new Date();
  const todayDateStr = today.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const formatText = (text: string | React.ReactNode) => {
    if (typeof text === "string" && replaceTodayDate) {
      return text.replace(/TODAY_DATE/g, todayDateStr);
    }
    return text;
  };

  const copyText = async (text: string | React.ReactNode, id: string) => {
    const textToCopy = typeof text === "string" ? text : String(text);

    try {
      if (navigator.clipboard && window.isSecureContext) {
        // Preferred modern API for HTTPS / localhost
        await navigator.clipboard.writeText(textToCopy);
      } else {
        // Fallback for HTTP / non-secure environments
        const textArea = document.createElement("textarea");
        textArea.value = textToCopy;
        
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        
        textArea.focus();
        textArea.select();
        
        const successful = document.execCommand("copy");
        textArea.remove();

        if (!successful) {
          throw new Error("Fallback copy failed");
        }
      }

      setActiveId(id);
      toast.success(`Copied: ${textToCopy}`);
      setTimeout(() => setActiveId(null), 1500);
    } catch (err) {
      toast.error("Failed to copy text to clipboard.");
      console.error("Copy error:", err);
    }
  };

  const clearAllSelection = () => {
    setActiveId(null);
    toast.info("Selections cleared");
  };

  return (
    <section className="container mx-auto px-4 space-y-4">
      <div className="flex flex-col gap-6">
        {items.map((item) => (
          <motion.div
            key={item.id}
            animate={{
              backgroundColor: activeId === item.id ? "#d1fae5" : "#ffffff",
            }}
            onClick={() => copyText(formatText(item.text), item.id)}
            transition={{ duration: 0.3 }}
            className="cursor-pointer rounded-xl border border-gray-200 shadow-sm hover:shadow-lg hover:scale-105 transform transition-all duration-500 flex items-center justify-between"
          >
            <div className="flex-1 p-4 space-y-3 flex flex-col">
              <div className="flex-1">
                <h3
                  className="font-bold text-lg md:text-xl truncate text-green-700"
                  title={item.label}
                >
                  {item.label}
                </h3>

                {item.type === "code" ? (
                  <pre className="bg-gray-900 text-white p-3 rounded-lg overflow-x-auto text-sm mt-2 max-h-48">
                    <code>{item.text}</code>
                  </pre>
                ) : (
                  <p className="text-gray-700 text-sm md:text-base break-words whitespace-pre-line max-h-40 overflow-hidden font-medium">
                    {item.text}
                  </p>
                )}
              </div>
            </div>

            <div className="p-4" onClick={(e) => e.stopPropagation()}>
              <Button
                type={activeId === item.id ? "primary" : "default"}
                onClick={() => copyText(formatText(item.text), item.id)}
                className="w-full"
                size="large"
              >
                {activeId === item.id ? "Copied" : "Copy"}
              </Button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="text-center mt-6 ">
        <Button danger onClick={clearAllSelection}>
          Clear All Selection
        </Button>
      </div>
    </section>
  );
};

export default CopyList;