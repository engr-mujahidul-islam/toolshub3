"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Copy, RotateCw } from "lucide-react";

// --- 1. CONFIGURATION DATA ---
interface Field {
    name: string;
    label: string;
    example: string;
    isOptional?: boolean;
    defaultValue?: string;
    isCategory?: boolean;
}

interface DynamicFieldsConfig {
    [key: string]: string[];
}

const DESTINATION_FIELDS: DynamicFieldsConfig = {
    "shop-home": ["query", "cid", "icid"],
    "shop-categories": ["query", "cid", "icid"],
    "shop-plp-categories": ["catID", "query", "cid", "icid"],
    "shop-curated-plp": ["widgetId", "pageTitle", "query", "cid", "icid"],
    "shop-plp-coupon": ["pageTitle", "campaignId", "query", "cid", "icid"],
    "shop-pdp": ["productSku", "query", "cid", "icid"],
    "shop-search": ["searchTerm", "query", "cid", "icid"],
    "shop-brand": ["brand", "brandValue", "query", "cid", "icid"],
    "shop-curated-dynamic": ["path", "title", "query", "cid", "icid"],
    "shop-web-view": ["URL", "title", "query", "cid", "icid"],
    "shop-web": ["URL", "query", "cid", "icid"],
    custom: [],
};

const FIELD_METADATA: Record<string, Omit<Field, 'name' | 'label'>> = {
    widgetId: { example: "Example: {7sd240a}" },
    catID: { example: "Example: {cat20315}" },
    path: { example: "Example: {app/shop/HalloweenLandingPage}" },
    title: { example: "Example: {Halloween Event}" },
    productSku: { example: "Example: {7200088}" },
    searchTerm: { example: "Example: {Pain Relief}" },
    brand: { example: "Example: {Loreal}" },
    brandValue: { example: "Example: {loreal-paris}" },
    URL: { example: "Example: {https://www.cvs.com/extracare/home}" },
    pageTitle: { example: "Example: {Big Hair Event}" },
    query: { example: "Example: {cat900022}", defaultValue: "0" },
    cat: { example: "Example: {cat3361}", isCategory: true },
    cid: { example: "Example: {halloween-event}", isOptional: true },
    icid: { example: "Example: {shop-beauty-app-extracareplus}", isOptional: true },
};

const BASE_URL = "https://cvs.app.link/shop";

// --- 2. UTILITY FUNCTIONS ---
const ucfirst = (str: string): string =>
    str ? str.charAt(0).toUpperCase() + str.slice(1) : str;

const separateCamelCase = (camelCaseString: string): string =>
    camelCaseString.replace(/([a-z])([A-Z])/g, "$1 $2");

// --- 3. REACT COMPONENT ---
const CdrUrlGenerator: React.FC = () => {
    const [module, setModule] = useState("Shop");
    const [destination, setDestination] = useState("");
    const [customDestination, setCustomDestination] = useState("");
    const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
    const [dynamicFields, setDynamicFields] = useState<Field[]>([]);
    const [generatedUrl, setGeneratedUrl] = useState(""); // PLP APP URL
    const [plpWebUrl, setPlpWebUrl] = useState("");
    const [widgetIdOutput, setWidgetIdOutput] = useState("");
    const resultRef = useRef<HTMLDivElement>(null);

    // --- Dynamic Field Generation Effect ---
    useEffect(() => {
        const selectedDestination = destination;
        const fields: Field[] = [];
        const initialValues: Record<string, string> = {};

        // 1. Handle dynamic category fields for specific destinations
        if (
            selectedDestination === "shop-categories" ||
            selectedDestination === "shop-plp-categories"
        ) {
            fields.push({
                name: "cat1",
                label: "Category 1",
                example: FIELD_METADATA.cat.example,
                isCategory: true,
            });
        }

        // 2. Add fixed fields for the destination
        const fieldNames = DESTINATION_FIELDS[selectedDestination] || [];

        fieldNames.forEach((name) => {
            const meta = FIELD_METADATA[name] || {};
            const label = name === "cid" || name === "icid"
                ? `${name.toUpperCase()} (Optional)`
                : separateCamelCase(ucfirst(name));

            fields.push({
                name,
                label,
                example: meta.example || "",
                isOptional: meta.isOptional,
                defaultValue: meta.defaultValue,
                isCategory: meta.isCategory,
            });

            if (meta.defaultValue !== undefined) {
                initialValues[name] = meta.defaultValue;
            }
        });

        setDynamicFields(fields);
        setFieldValues(prev => ({ ...initialValues, ...prev }));
    }, [destination]);

    // --- Input Change Handler (Handles dynamic category creation) ---
    const handleFieldChange = useCallback((name: string, value: string) => {
        setFieldValues(prev => ({ ...prev, [name]: value }));

        // Logic for creating new 'cat' input field when the last one is filled
        if (name.startsWith('cat') && value.trim() !== '') {
            const currentCatIndex = parseInt(name.replace('cat', ''));
            const nextCatName = `cat${currentCatIndex + 1}`;
            const exists = dynamicFields.some(f => f.name === nextCatName);

            if (!exists) {
                setDynamicFields(prevFields => [
                    ...prevFields,
                    {
                        name: nextCatName,
                        label: `Category ${currentCatIndex + 1}`,
                        example: FIELD_METADATA.cat.example,
                        isCategory: true,
                    }
                ]);
            }
        }
    }, [dynamicFields]);


    // --- URL Generation Logic ---
    const handleGenerateUrl = useCallback((e: React.FormEvent) => {
        e.preventDefault();

        const params: string[] = [];
        let finalDestination = destination;
        let pageTitle = "";
        let widgetId = "";

        // 1. Determine Final Destination
        if (destination === "custom") {
            finalDestination = customDestination;
        }
        if (!finalDestination) {
            toast.error("Please select a destination.");
            return;
        }

        // 2. Collect Parameters
        const allFieldNames = dynamicFields.map(f => f.name);
        const allKeys = [...allFieldNames, ...Object.keys(fieldValues)].filter((v, i, a) => a.indexOf(v) === i);
        
        const paramKeys = new Set<string>();
        
        // Add Module and Destination first
        paramKeys.add(`Module=${encodeURIComponent(module.trim())}`);
        paramKeys.add(`Destination=${encodeURIComponent(finalDestination.trim())}`);

        allKeys.forEach((name) => {
            const value = fieldValues[name]?.trim() || "";

            if (value !== "") {
                if (name === "pageTitle") pageTitle = value;
                if (name === "widgetId") widgetId = value;

                // Handle categories (cat1, cat2, ...)
                if (name.startsWith('cat') && dynamicFields.find(f => f.name === name)?.isCategory) {
                    paramKeys.add(`cat=${encodeURIComponent(value)}`);
                } else if (!paramKeys.has(`${name}=${encodeURIComponent(value)}`)) {
                    paramKeys.add(`${name}=${encodeURIComponent(value)}`);
                }
            }
        });
        
        // Filter out Module and Destination before creating the URL query string
        const finalParams = Array.from(paramKeys).filter(p => 
             !p.startsWith('Module=') && !p.startsWith('Destination=')
        );

        // 3. Construct URL 1 (App Link)
        let newUrl = `${BASE_URL}/${finalDestination}`;
        if (finalParams.length > 0) {
            newUrl += "?" + finalParams.join("&");
        }

        setGeneratedUrl(newUrl);
        setPlpWebUrl("");
        setWidgetIdOutput("");

        // 4. Special case: shop-curated-plp => Generate 2nd URL (Web Link)
        if (destination === "shop-curated-plp" && pageTitle && widgetId) {
            const slugTitle = pageTitle.replace(/\s+/g, "-");
            const webUrl = `https://www.cvs.com/shop/merch/${slugTitle}?widgetID=${widgetId}?mc=cvscontentpage`;
            
            setPlpWebUrl(webUrl);
            setWidgetIdOutput(widgetId);
        }

        // 5. Scroll to result and show success
        if (resultRef.current) {
            resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        toast.success("URL generated successfully!");
    }, [module, destination, customDestination, fieldValues, dynamicFields]);
    
    // --- Reset Handler ---
    const handleReset = useCallback(() => {
        setModule("Shop");
        setDestination("");
        setCustomDestination("");
        setFieldValues({});
        setDynamicFields([]);
        setGeneratedUrl("");
        setPlpWebUrl("");
        setWidgetIdOutput("");
        toast.info("Form reset complete.");
    }, []);

    // --- Copy Handler (Copies ALL generated URLs) ---
    const handleCopyAll = useCallback(() => {
        const appUrlText = generatedUrl;
        const webUrlText = plpWebUrl ? `\nPLP Web URL: ${plpWebUrl}` : '';
        const widgetIdText = widgetIdOutput ? `\nWidget ID: ${widgetIdOutput}` : '';

        // Combine the URLs and Widget ID for full clipboard copy
        const textToCopy = [
            `PLP APP URL: ${appUrlText}`,
            widgetIdOutput && `Widget ID: ${widgetIdOutput}`,
            plpWebUrl && `PLP Web URL: ${plpWebUrl}`
        ].filter(Boolean).join('\n'); // Filter out empty strings/false values
        
        if (!appUrlText) {
            toast.error("Nothing to copy.");
            return;
        }

        navigator.clipboard
            .writeText(textToCopy.trim())
            .then(() => toast.success("✅ URLs copied to clipboard!"))
            .catch(() => toast.error("❌ Failed to copy."));
    }, [generatedUrl, plpWebUrl, widgetIdOutput]);


    // --- Render Helper for Dynamic Inputs ---
    const renderDynamicInputs = () => {
        return dynamicFields.map(field => {
            const isCategoryField = field.name.startsWith('cat');
            const label = isCategoryField ? field.label : (field.isOptional ? `${field.label} (Optional)` : field.label);
            const inputBorderClass = field.name === 'cid' || field.name === 'icid' 
                ? "border-green-300" : "border-gray-300 dark:border-gray-600";
            
            if (isCategoryField && field.name !== 'cat1') {
                const prevCatIndex = parseInt(field.name.replace('cat', '')) - 1;
                if (!fieldValues[`cat${prevCatIndex}`]?.trim()) {
                    return null; // Don't render if the previous category field is empty
                }
            }

            return (
                <div key={field.name}>
                    <label htmlFor={field.name} className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
                        {label}
                    </label>
                    <input
                        placeholder={field.example}
                        type="text"
                        id={field.name}
                        name={field.name}
                        value={fieldValues[field.name] || field.defaultValue || ''}
                        onChange={(e) => handleFieldChange(field.name, e.target.value)}
                        className={`w-full p-3 border ${inputBorderClass} rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 dark:text-gray-100 text-gray-900`}
                    />
                </div>
            );
        });
    };

    // --- UI RENDER ---
    return (
        <div id="tab1" className="p-4 sm:p-8 bg-gray-100 dark:bg-gray-900 min-h-screen">
            <div
                // Main Container: Simple white/dark background with max-w-4xl
                className="container bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg mx-auto max-w-8xl border border-gray-200 dark:border-gray-700"
            >
                <h2
                    className="text-2xl font-bold text-center text-gray-900 dark:text-gray-100 mb-4 border-b pb-2"
                >
                    <span title="Common Destination Route">CDR</span> APP URL Generator
                </h2>
                
                {/* --- RESULT / OUTPUT SECTION (MOVED TO TOP & STYLED) --- */}
                <div ref={resultRef} className="my-8">
                    <div className={`transition-all duration-300 ${generatedUrl ? 'opacity-100 max-h-[500px] mb-4' : 'opacity-0 max-h-0 overflow-hidden'}`}>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                            Generated URLs:
                        </h2>
                        
                        <div className="relative bg-gray-100 dark:bg-gray-700 p-4 rounded-lg border border-gray-300 dark:border-gray-600 text-sm">
                            <div className="text-gray-700 dark:text-gray-100 break-all pr-12">
                                
                                {/* Widget ID */}
                                {widgetIdOutput && (
                                    <p className="font-semibold text-base">
                                        Widget ID: <span className="font-mono text-sm">{widgetIdOutput}</span>
                                    </p>
                                )}
                                
                                {/* PLP APP URL */}
                                {generatedUrl && (
                                    <p className="font-semibold text-base mt-2">
                                        PLP APP URL: <span className="font-mono text-sm">{generatedUrl}</span>
                                    </p>
                                )}

                                {/* PLP Web URL */}
                                {plpWebUrl && (
                                    <p className="font-semibold text-base mt-2">
                                        PLP Web URL: <span className="font-mono text-sm">{plpWebUrl}</span>
                                    </p>
                                )}
                            </div>
                            
                            {/* Copy Button (Copies ALL generated content) */}
                            <button
                                onClick={handleCopyAll}
                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-md transition-colors duration-200"
                                title="Copy All URLs"
                            >
                                <Copy className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>
                {/* --- END RESULT SECTION --- */}

                <p className="text-center text-gray-700 dark:text-gray-300 mb-1 text-sm">
                    Select a destination to see the required fields and generate a CDR APP URL.
                    <br />Empty fields are removed automatically.
                </p>
                <p className="text-center text-red-600 bg-red-100 dark:bg-red-900/50 p-2 rounded-lg text-sm mb-4">
                    URL is case-sensitive. Be aware about your input.
                </p>

                <form onSubmit={handleGenerateUrl} className="space-y-4">
                    {/* Module Input */}
                    <div>
                        <label
                            htmlFor="module"
                            className="block text-gray-700 dark:text-gray-100 font-semibold mb-1"
                        >
                            Module
                        </label>
                        <input
                            placeholder="Example: {Shop/Photo/storeLocator}"
                            type="text"
                            id="module"
                            value={module}
                            onChange={(e) => setModule(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 dark:text-gray-100 text-gray-900"
                        />
                    </div>

                    {/* Destination Select */}
                    <div>
                        <label
                            htmlFor="destination"
                            className="block text-gray-700 dark:text-gray-100 font-semibold mb-1"
                        >
                            Destination
                        </label>
                        <select
                            id="destination"
                            value={destination}
                            onChange={(e) => {
                                setDestination(e.target.value);
                                setCustomDestination('');
                            }}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 dark:text-gray-100 text-gray-900"
                        >
                            <option value="">-- Select Destination --</option>
                            <option disabled value="shop-home">Shop Home</option>
                            <option disabled value="shop-web">Shop Web</option>
                            <option disabled value="shop-pdp">Shop PDP</option>
                            <option disabled value="shop-brand">Shop Brand</option>
                            <option disabled value="shop-search">Shop Search</option>
                            <option disabled value="shop-web-view">Shop Web View</option>
                            <option disabled value="shop-categories">
                                Shop Categories
                            </option>
                            <option value="shop-curated-plp">Shop Curated PLP</option>
                            <option disabled value="shop-plp-coupon">
                                Shop PLP Coupon
                            </option>
                            <option disabled value="shop-plp-categories">
                                Shop PLP Categories
                            </option>
                            <option disabled value="shop-curated-dynamic">
                                Shop Curated Dynamic
                            </option>
                            <option value="custom">Custom...</option>
                        </select>

                        {/* Custom Destination Input */}
                        {destination === "custom" && (
                            <input
                                type="text"
                                id="customDestination"
                                value={customDestination}
                                onChange={(e) => setCustomDestination(e.target.value)}
                                placeholder="Enter custom value"
                                className="mt-2 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 dark:text-gray-100 text-gray-900"
                                autoFocus
                            />
                        )}
                    </div>

                    {/* Dynamic Inputs Container */}
                    <div id="dynamicInputsContainer" className="space-y-4">
                        {renderDynamicInputs()}
                    </div>
                    
                    {/* Submit & Reset Buttons (Modern Style) */}
                    <div className="pt-6 flex flex-col sm:flex-row justify-center gap-4">
                        <button
                            type="submit"
                            className="w-full sm:w-auto min-w-[200px] bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300"
                        >
                            Generate URL
                        </button>
                        
                        <button
                            type="button"
                            onClick={handleReset}
                            className="w-full sm:w-auto min-w-[100px] bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-full shadow-lg transition duration-300 focus:outline-none focus:ring-4 focus:ring-red-300"
                        >
                            <div className="flex items-center justify-center gap-2">
                                <RotateCw className="w-4 h-4" /> Reset
                            </div>
                        </button>
                    </div>
                </form>

            </div>
        </div>
    );
};

const page = () => {
    return (
        <div>
            <CdrUrlGenerator />
        </div>
    );
};

export default page;