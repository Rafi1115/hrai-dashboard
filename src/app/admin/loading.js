"use client"; // This directive is required for client-side functionality in App Router components

import React, { useState, useEffect } from "react";
import { RingLoader } from "react-spinners";

// A simple loading page component for Next.js applications
export default function LoadingPage() {
  // State to control the visibility of the loading spinner
  const [isLoading, setIsLoading] = useState(true);

  // useEffect hook to manage the loading duration
  useEffect(() => {
    // Set a timeout to hide the spinner after 5 seconds (5000 milliseconds)
    const timer = setTimeout(() => {
      setIsLoading(false); // Set isLoading to false to hide the spinner
    }, 10000);

    // Cleanup function: Clear the timeout if the component unmounts before 5 seconds
    return () => clearTimeout(timer);
  }, []); // Empty dependency array ensures this effect runs only once on mount

  // Render the loading spinner only if isLoading is true
  if (!isLoading) {
    return null; // Return null to render nothing if not loading
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="flex flex-col items-center space-y-4">
        {/* Loading Spinner */}
        {/* The RingLoader will be displayed as long as isLoading is true */}
        <RingLoader color="red" loading={true} speedMultiplier={5} size={100} />
      </div>
    </div>
  );
}
