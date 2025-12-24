"use client";

import { useEffect, useState } from "react";
import { Geist, Geist_Mono, Montserrat } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./admin.css";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import NotificationPage from "@/components/Notification/NotificationPage";
import { getApiUrl } from "@/components/configs/api";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // choose weights you need
  variable: "--font-montserrat", // optional for using with Tailwind
  display: "swap",
});

export default function RootLayout({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [adminInfo, setAdminInfo] = useState(null);

  // State to control whether NotificationPage is shown
  const [showNotifications, setShowNotifications] = useState(false);

  // Function to toggle notification page visibility
  const handleBellClick = () => {
    setShowNotifications(true);
  };

  // Function to go back from NotificationPage (e.g., from the back arrow)
  const handleGoBack = () => {
    setShowNotifications(false);
  };

  const baseUrl = process.env.BASE_URL;

  useEffect(() => {
    // get token from cookie
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("adminToken"));
    if (token) {
      const tokenValue = token.split("=")[1];
      // Set token in headers for all fetch requests
      fetch(
        getApiUrl('/api/auth/profile/'),
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenValue}`,
          },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          setAdminInfo(data?.data);
        });
    }
  }, []);

  useEffect(() => {
    const handler = (e) => setAdminInfo(e.detail);
    window.addEventListener("profileUpdated", handler);
    return () => window.removeEventListener("profileUpdated", handler);
  }, []);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${montserrat.variable} antialiased`}
      >
        <div className="flex bg-white  text-black min-h-screen">
          <Sidebar
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            adminInfo={adminInfo}
          />


            
          <main
            className={`transition-all duration-300 ease-in-out flex-1 flex flex-col ${
              isOpen ? "ml-64" : "ml-0"
            }`}
          >
            {/* Topbar always visible */}
            <Topbar onBellClick={handleBellClick} adminInfo={adminInfo} />
          

            {/* Conditionally render NotificationPage or MainContent */}
            {showNotifications ? (
              <div className="p-6">
                <NotificationPage onBackClick={handleGoBack} />
              </div> // Pass handler to NotificationPage
            ) : (
              <div className="p-4">{children}</div>
            )}
            {/* Toast container for react-hot-toast */}
            <Toaster  position="top-center"  reverseOrder={false} />
          </main>
        </div>
      </body>
    </html>
  );
}
