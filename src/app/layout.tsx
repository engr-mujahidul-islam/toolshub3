"use client";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import "./globals.css";
import { Toaster, toast } from "sonner";
import { ConfigProvider, Modal, Input, Button } from "antd";
import Navbar from "@/components/Shared/Navbar/Navbar";
import Footer from "@/components/Shared/Footer/Footer";
import "@ant-design/v5-patch-for-react-19";
import { useState, useEffect } from "react";

// Set your PIN here
const APP_PIN = "1234"; 

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
 
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isLocked, setIsLocked] = useState<boolean>(true);
  const [enteredPin, setEnteredPin] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"
    const lastAccessDate = localStorage.getItem("app_last_access_date");
    const isSessionVerified = sessionStorage.getItem("app_pin_verified") === "true";

    // If it's a new day, clear session verification
    if (lastAccessDate !== today) {
      sessionStorage.removeItem("app_pin_verified");
      localStorage.setItem("app_last_access_date", today);
      setIsLocked(true);
    } else if (isSessionVerified) {
      setIsLocked(false);
    } else {
      setIsLocked(true);
    }

    setIsLoading(false);
  }, []);

  const handleVerifyPin = () => {
    if (enteredPin === APP_PIN) {
      sessionStorage.setItem("app_pin_verified", "true");
      setIsLocked(false);
      toast.success("Access granted!");
    } else {
      toast.error("Incorrect PIN. Please try again.");
      setEnteredPin("");
    }
  };

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AntdRegistry>
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: "#10b981",
              },
            }}
          >
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow container mx-auto py-4 mt-10">
                {children}
              </main>
              <Footer />
            </div>

            {/* PIN Verification Modal */}
            {!isLoading && (
              <Modal
                title="Security Verification"
                open={isLocked}
                closable={false}
                maskClosable={false}
                footer={null}
                styles={{
                  mask: {
                    // Hex with alpha (e.g., #000000e6 is ~90% opacity black) 
                    // or use rgba(0, 0, 0, 0.85)
                    backgroundColor: "rgba(0, 0, 0, 0.85)", 
                    backdropFilter: "blur(4px)", // Optional: adds a slight blur effect
                  },
                }}
                centered
              >
                <p className="mb-4 text-gray-600">
                  Please enter the access PIN to continue.
                </p>
                <div className="flex flex-col gap-3">
                  <Input.Password
                    placeholder="Enter PIN"
                    value={enteredPin}
                    onChange={(e) => setEnteredPin(e.target.value)}
                    onPressEnter={handleVerifyPin}
                    maxLength={10}
                  />
                  <Button type="primary" onClick={handleVerifyPin} block>
                    Unlock
                  </Button>
                </div>
              </Modal>
            )}

            <Toaster
              richColors
              duration={2000}
              position="top-right"
              closeButton
            />
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}