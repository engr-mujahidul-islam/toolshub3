"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import { toast } from "sonner"; // Sonner toast integration

const MobileHtmlFormatter: React.FC = () => {
    const [inputCode, setInputCode] = useState("");
    const [outputCode, setOutputCode] = useState("");
    const outputRef = useRef<HTMLTextAreaElement>(null);

    // --- Core Formatting Logic (Matches Mobile HTML behavior) ---
    const formatHTMLandCSS = useCallback((inputValue: string) => {
        const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/;
        const bodyRegex = /<body[^>]*>([\s\S]*?)<\/body>/;
        const styleMatch = inputValue.match(styleRegex);
        const bodyMatch = inputValue.match(bodyRegex);

        let formattedCode = "";

        // Condition: ONLY include user styles if <title>Mobile App</title> is found.
        if (styleMatch && inputValue.includes("<title>Mobile App</title>")) {
            formattedCode += `<style>\n${styleMatch[1]}\n</style>\n`;
        }

        if (bodyMatch) {
            let bodyContent = bodyMatch[1];
            const imgTagRegex = /<img[^>]*src="[^"]+"[^>]*>/g;
            const imgTags = bodyContent.match(imgTagRegex);

            // Replace first image src with [%Asset1%]
            if (imgTags && imgTags.length > 0) {
                bodyContent = bodyContent.replace(
                    imgTags[0],
                    imgTags[0].replace(/src="[^"]+"/, 'src="[%Asset1%]"')
                );
            }

            // Replace second image src with [%Asset2%]
            if (imgTags && imgTags.length > 1) {
                bodyContent = bodyContent.replace(
                    imgTags[1],
                    imgTags[1].replace(/src="[^"]+"/, 'src="[%Asset2%]"')
                );
            }

            // Wrap in anchor tag
            formattedCode += `<a href="javascript:void(0);" onclick="window.open(clickTag, '_top');" style="color: #000;">\n${bodyContent}\n</a>\n`;
        }

        setOutputCode(formattedCode);
    }, []);

    // --- Auto-format on input change ---
    useEffect(() => {
        formatHTMLandCSS(inputCode);
    }, [inputCode, formatHTMLandCSS]);

    // --- Reset ---
    const handleReset = useCallback(() => {
        setInputCode("");
        setOutputCode("");
        toast.info("Reset complete");
    }, []);

    // --- Copy Output ---
    const handleCopy = useCallback(() => {
        if (!outputCode.trim()) {
            toast.error("Nothing to copy");
            return;
        }

        navigator.clipboard
            .writeText(outputCode)
            .then(() => {
                toast.success("✅ Code copied successfully!");
            })
            .catch(() => {
                toast.error("❌ Failed to copy");
            });
    }, [outputCode]);

    const isCopyDisabled = !outputCode.trim();

    // --- UI (Reverted to simpler styling/sizing) ---
    return (
        <div className="min-h-screen p-4 sm:p-8 bg-gray-100 dark:bg-gray-900">
            <div 
                // Reverting to the simpler/original container look
                className="container bg-white/60 backdrop-blur-md dark:bg-gray-800 p-8 rounded-xl shadow-2xl mx-auto max-w-8xl border border-gray-200 dark:border-gray-700"
            >
                <h2 className="text-2xl font-bold text-center text-dark mb-6 border-b pb-2">
                    📱 Mobile HTML Formatter for GAM
                </h2>

                {/* Text Area Container: Removed fixed height, relies on rows=10 now */}
                <div className="flex flex-col md:flex-row gap-6 h-[500px]">
                    {/* Input Code */}
                    <div className="flex-1 flex flex-col">
                        <label
                            htmlFor="inputCode"
                            className="block text-sm font-semibold text-dark dark:text-gray-300 mb-2"
                        >
                            Input HTML:
                        </label>
                        <textarea
                            id="inputCode"
                            value={inputCode}
                            onChange={(e) => setInputCode(e.target.value)}
                            placeholder="Paste your HTML code here (Mobile version)..."
                            rows={10} // Restored rows=10 for simpler sizing
                            className="w-full flex-1 rounded-md border border-gray-400 shadow-sm p-4 resize-none focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 bg-white dark:bg-gray-900 dark:text-gray-100 font-mono text-sm"
                        ></textarea>
                    </div>

                    {/* Output Code */}
                    <div className="flex-1 flex flex-col">
                        <label
                            htmlFor="outputCode"
                            className="block text-sm font-semibold text-dark dark:text-gray-300 mb-2"
                        >
                            Formatted Output:
                        </label>
                        <textarea
                            ref={outputRef}
                            id="outputCode"
                            value={outputCode}
                            readOnly
                            placeholder="Formatted HTML will appear here..."
                            rows={10} // Restored rows=10 for simpler sizing
                            // Simple styling matching the original output box color
                            className="mt-1 flex-1 rounded-lg border-2 border-green-500 shadow-lg w-full break-words p-4 overflow-auto 
                         bg-green-50 text-green-800 dark:bg-gray-700 dark:text-gray-100 dark:border-green-400 font-sans text-base"
                        ></textarea>
                    </div>
                </div>

                {/* Buttons (Modern Rounded Style) */}
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button
                        onClick={handleCopy}
                        disabled={isCopyDisabled}
                        className="w-full sm:w-auto min-w-[200px] bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 
                                   text-white font-bold py-3 px-6 rounded-full shadow-lg transition duration-300 
                                   focus:outline-none focus:ring-4 focus:ring-blue-300"
                    >
                        Copy Output
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

const page = () => {
    return (
        <div>
            <MobileHtmlFormatter />
        </div>
    );
};

export default page;