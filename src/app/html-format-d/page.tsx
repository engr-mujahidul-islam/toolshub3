"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import { toast } from "sonner";

// --- DEFAULT STYLES (MATCHES ORIGINAL JAVASCRIPT) ---
const DEFAULT_STYLES = `*,*::before,*::after{box-sizing:inherit;}.desktopHide{display:none;}.mobileHide{display:block;}body{margin:0;padding:0;color:#000;background:#fff;box-sizing:border-box;}body{height:100%;}a,a img{text-decoration:none;border:0px;}#CVSmainAnchor{width:100%;height:100%;max-width:300px;max-height:100px;top:0;left:0;margin:auto;padding:0;background-color:#fff;overflow:hidden;}#CVSmain{width:100%;height:100%;max-width:2426px;max-height:300px;top:0;left:0;margin:auto;padding:0;background-color:#fff;overflow:hidden;}#CVSmain1{width:100%;height:100%;max-width:1280px;max-height:300px;top:0;left:0;margin:auto;padding:0;background-color:#fff;overflow:hidden;}#CVSmain2{width:100%;height:100%;max-width:1040px;max-height:100px;top:0;left:0;margin:auto;padding:0;background-color:#fff;overflow:hidden;}#CVSmain3{width:100%;height:100%;max-width:1280px;max-height:100px;top:0;left:0;margin:auto;padding:0;background-color:#fff;overflow:hidden;}#CVSmain4{width:100%;height:100%;max-width:240px;max-height:620px;top:0;left:0;margin:auto;padding:0;background-color:#fff;overflow:hidden;}.CVSflexbox{width:100%;}.CVScol1{align-items:center;justify-content:center;align-self:center;}.CVScol1 img{width:100%;height:100%;display:block;}#CVSmain ul{margin:0;padding:0;list-style:none;}#CVSmain li{padding:0;margin:0;color:#212121;}.CVScol1 img{display:block;width:100%;height:100%;align-items:center;justify-content:center;align-self:center;margin-left:auto;margin-right:auto;}@media only screen and (min-width:1260px) and (max-width:2000px){.CVScol1 img{display:block;width:100%;height:100%;align-items:center;justify-content:center;align-self:center;margin-left:auto;margin-right:auto;}}@media only screen and (max-width:660px){.desktopHide{display:block;}.mobileHide{display:none;}#CVSmain{max-width:660px;max-height:220px;background:#fff url(images/Tena_Overnight_mbl_bckgrd.jpg) no-repeat top right;background-size:cover;}.legal{position:absolute;width:89%;top:63%;left:0;margin:0 auto;}.legal p{font-family:'Graphik-Regular',Arial,sans-serif;font-size:7px;text-align:left;color:#000;padding:0 0 0px 10px;}}@media only screen and (max-width:300px){.desktopHide{display:block;}.mobileHide{display:none;}#CVSmain{max-width:300px;max-height:100px;}#CVSmain1{max-width:300px;max-height:100px;}#CVSmain2{max-width:300px;max-height:100px;}#CVSmain3{max-width:300px;max-height:100px;}}`;


const DesktopHtmlFormatter: React.FC = () => {
    const [inputCode, setInputCode] = useState("");
    const [outputCode, setOutputCode] = useState("");
    const outputRef = useRef<HTMLTextAreaElement>(null);

    // --- Core Formatter Logic (Updated to match JS conditional logic) ---
    const formatHTMLandCSS = useCallback((inputValue: string) => {
        const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/;
        const bodyRegex = /<body[^>]*>([\s\S]*?)<\/body>/;
        const styleMatch = inputValue.match(styleRegex);
        const bodyMatch = inputValue.match(bodyRegex);

        let formattedCode = "";

        // Step 1: Add default + user <style> block
        if (styleMatch) {
            // Check for Mobile App title to determine if default styles should be included
            if (inputValue.includes("<title>Mobile App</title>")) {
                // Case 1: Mobile App - only include user's styles
                formattedCode += `<style>\n${styleMatch[1]}\n</style>\n`;
            } else {
                // Case 2: Desktop/Other - include default styles AND user's styles
                formattedCode += `<style>\n${DEFAULT_STYLES}\n${styleMatch[1]}\n</style>\n`;
            }
        }

        // Step 2: Replace images & wrap in clickTag anchor
        if (bodyMatch) {
            let bodyContent = bodyMatch[1];
            const imgTagRegex = /<img[^>]*src="[^"]+"[^>]*>/g;
            const imgTags = bodyContent.match(imgTagRegex);

            // Replace first image src
            if (imgTags && imgTags.length > 0) {
                bodyContent = bodyContent.replace(
                    imgTags[0],
                    imgTags[0].replace(/src="[^"]+"/, 'src="[%Asset1%]"')
                );
            }

            // Replace second image src
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

    // --- Auto Update on Input Change ---
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
            .then(() => toast.success("✅ Code copied successfully!"))
            .catch(() => toast.error("❌ Failed to copy"));
    }, [outputCode]);

    const isCopyDisabled = !outputCode.trim();

    // --- UI (Reverting to simpler styling while keeping modern buttons) ---
    return (
        <div className="min-h-screen p-4 sm:p-8 bg-gray-100 dark:bg-gray-900">
            <div 
                // Matches the general tone of the original HTML container, but slightly wider/larger
                className="container bg-white/60 backdrop-blur-md dark:bg-gray-800 p-8 rounded-xl shadow-2xl mx-auto max-w-8xl border border-gray-200 dark:border-gray-700"
            >
                <h2 className="text-2xl font-bold text-center text-dark mb-6 border-b pb-2">
                    💻 Desktop HTML Code Formatter for GAM
                </h2>

                {/* Text Area Container: Using h-[500px] for taller boxes */}
                <div className="flex flex-col md:flex-row gap-6 h-[500px]">
                    {/* Input Code */}
                    <div className="flex-1 flex flex-col">
                        <label
                            htmlFor="inputCode"
                            className="block text-sm font-semibold text-dark mb-2"
                        >
                            Input HTML:
                        </label>
                        <textarea
                            id="inputCode"
                            value={inputCode}
                            onChange={(e) => setInputCode(e.target.value)}
                            placeholder="Paste your desktop HTML code here..."
                            className="w-full flex-1 rounded-md border border-gray-400 shadow-sm p-4 resize-none focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 bg-white dark:bg-gray-900 dark:text-gray-100 font-mono text-sm"
                        ></textarea>
                    </div>

                    {/* Output Code */}
                    <div className="flex-1 flex flex-col">
                        <label
                            htmlFor="outputCode"
                            className="block text-sm font-semibold text-dark mb-2"
                        >
                            Output HTML:
                        </label>
                        <textarea
                            ref={outputRef}
                            id="outputCode"
                            value={outputCode}
                            readOnly
                            placeholder="Formatted HTML will appear here..."
                            // Simple styling for output box
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
            <DesktopHtmlFormatter />
        </div>
    );
};

export default page;