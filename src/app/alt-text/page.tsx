"use client";

import React, { useState, useCallback, useMemo } from "react";
import { toast } from "sonner"; // ✅ Added toast import

// Core logic for processing the input text
const processAltText = (inputText: string): string => {
  // Step 1: Split into lines and remove labels before colon
  const lines = inputText.split("\n").map((line) => {
    return line.replace(/^[^:]+:\s*/, "");
  });

  // Step 2: Join lines, collapse extra spaces, and trim
  const processedText = lines.join(" ").replace(/\s+/g, " ").trim();

  return processedText;
};

const AltTextProcessorPage: React.FC = () => {
  const [inputText, setInputText] = useState("");

  // Memoize the processed text
  const processedText = useMemo(() => processAltText(inputText), [inputText]);

  // --- Copy Handler ---
  const handleCopy = useCallback(async () => {
    if (!processedText.trim()) {
      toast.error("No text to copy");
      return;
    }

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(processedText);
        toast.success("✅ Alt text copied successfully!");
      } else {
        // Fallback for browsers without navigator.clipboard
        const tempTextArea = document.createElement("textarea");
        tempTextArea.value = processedText;
        document.body.appendChild(tempTextArea);
        tempTextArea.select();
        document.execCommand("copy");
        document.body.removeChild(tempTextArea);
        toast.success("✅ Alt text copied!");
      }
    } catch (err) {
      console.error("Copy failed:", err);
      toast.error("❌ Failed to copy. Please check browser permissions.");
    }
  }, [processedText]);

  // --- Reset Handler ---
  const handleReset = useCallback(() => {
    setInputText("");
    toast.info("Input cleared");
  }, []);

  // --- UI ---
  return (
    <div className="min-h-screen p-4 sm:p-8 bg-gray-100 dark:bg-gray-900">
      <div className="container bg-white/60 backdrop-blur-sm dark:bg-gray-800 p-6 md:p-8 rounded-xl shadow-2xl mx-auto max-w-8xl border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-extrabold text-center text-gray-900 dark:text-gray-100 mb-6 border-b pb-2">
          🤖 ALT Text Processor
        </h2>

        {/* --- Input and Preview Area --- */}
        <div className="flex flex-col md:flex-row gap-6 mb-6 h-[400px]">
          {/* Input Area */}
          <div className="flex-1 flex flex-col">
            <label
              htmlFor="text-input"
              className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
            >
              Input Details (e.g., &quot;Label: text to keep&quot;):
            </label>
            <textarea
              id="text-input"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste your labeled text here (one line per label/detail)..."
              className="mt-1 flex-1 rounded-lg border-2 border-gray-300 shadow-inner focus:border-blue-500 focus:ring focus:ring-blue-200 p-4 
                         bg-white text-gray-900 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 resize-none font-mono text-sm"
            ></textarea>
          </div>

          {/* Preview Area */}
          <div className="flex-1 flex flex-col">
            <label
              htmlFor="output"
              className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
            >
              Processed Alt Text Preview:
            </label>
            <div
              id="output"
              className="mt-1 flex-1 rounded-lg border-2 border-green-500 shadow-lg w-full break-words p-4 overflow-auto 
                         bg-green-50 text-green-800 dark:bg-gray-700 dark:text-gray-100 dark:border-green-400 font-sans text-base"
            >
              {processedText ||
                "Processed text will appear here. The text will automatically be stripped of leading labels (e.g., “Title:”) and combined into a single, clean sentence."}
            </div>
          </div>
        </div>

        {/* --- Buttons --- */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={handleCopy}
            disabled={!processedText.trim()}
            className="w-full sm:w-auto min-w-[200px] bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 
                       text-white font-bold py-3 px-6 rounded-full shadow-lg transition duration-300 
                       focus:outline-none focus:ring-4 focus:ring-blue-300"
          >
            Copy Alt Text
          </button>

          <button
            onClick={handleReset}
            className="w-full sm:w-auto min-w-[100px] bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-full 
                       shadow-lg transition duration-300 focus:outline-none focus:ring-4 focus:ring-red-300"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default AltTextProcessorPage;
