"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import axios from "axios";
import { getApiUrl } from "@/components/configs/api";

// Enhanced Avatar component that prioritizes real user images
function UserAvatar({ src, alt, name }) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  // Generate initials from name for fallback
  const getInitials = (name) => {
    if (!name) return "UN";
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .join("")
      .substring(0, 2);
  };

  // Handle image load error - fallback to initials avatar
  const handleImageError = () => {
    setHasError(true);
    const initials = getInitials(name || alt);
    // Create a more professional looking avatar with better colors
    setImgSrc(
      `https://ui-avatars.com/api/?name=${encodeURIComponent(
        initials
      )}&size=256&background=4F46E5&color=FFFFFF&font-size=0.33&format=png`
    );
  };

  // Reset error state when src changes
  useEffect(() => {
    if (src && src !== imgSrc && !hasError) {
      setImgSrc(src);
      setHasError(false);
    }
  }, [src, imgSrc, hasError]);

  // If no src provided, use initials placeholder immediately
  if (!src) {
    const initials = getInitials(name || alt);
    const fallbackSrc = `https://ui-avatars.com/api/?name=${encodeURIComponent(
      initials
    )}&size=256&background=4F46E5&color=FFFFFF&font-size=0.33&format=png`;
    return (
      <img
        src={fallbackSrc}
        alt={alt}
        width={256}
        height={256}
        className="w-full h-full object-cover"
      />
    );
  }

  return (
    <img
      src={imgSrc}
      alt={alt}
      width={256}
      height={256}
      className="w-full h-full object-cover"
      onError={handleImageError}
    />
  );
}

export default function UserDetailsPage({ params }) {
  // Mock router for back functionality
  const router = {
    back: () => window.history.back(),
  };

  // The user ID is retrieved from the URL parameters.
  const userId = params.id;

  // State for user data, loading, and error handling.
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSubscriptionDetails() {
      setLoading(true);
      try {
        const response = await axios.get(
          getApiUrl("/api/dashboard/subscriptions/?search&plan_type&page")
        );

        const subscriptions = response.data.results;
        console.log("subscriptions", subscriptions);

        // Find the specific subscription that matches the user ID from the URL.
        const foundSubscription = subscriptions.find(
          (sub) => sub.id === parseInt(userId)
        );

        if (foundSubscription) {
          setUser(foundSubscription);
        } else {
          setUser(null);
        }
      } catch (err) {
        toast.error("Could not fetch user details.");
        console.error("API Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchSubscriptionDetails();
  }, [userId]);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 backdrop-blur-sm flex items-center justify-center">
        <div className="bg-white rounded-lg p-8 shadow-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-700 text-center">Loading user details...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="fixed inset-0 z-50 backdrop-blur-sm flex items-center justify-center">
        <div className="bg-white rounded-lg p-8 shadow-lg text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <p className="text-red-600 text-xl font-semibold">User not found.</p>
          <button
            onClick={() => router.back()}
            className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-100 relative px-8 py-10 flex flex-col items-center"
          initial={{ scale: 0.95, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 40 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {/* Close button */}
          <button
            className="absolute top-6 right-6 text-gray-400 hover:text-red-500 transition-colors duration-200"
            onClick={() => router.back()}
            aria-label="Close"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 6l12 12M6 18L18 6"
              />
            </svg>
          </button>

          {/* User profile image with REAL profile picture from API */}
          <div className="w-32 h-32 rounded-full overflow-hidden shadow-lg mb-6 border-4 border-gray-100 bg-gray-50 flex items-center justify-center">
            <UserAvatar
              src={user.profile} // Using the real profile picture from API
              alt={user.subscription_plan_name}
              name={user.subscription_plan_name}
            />
          </div>

          <h2 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight text-center">
            {user.subscription_plan_name}
          </h2>
          <p className="text-base text-gray-500 mb-4 text-center">
            User ID: <span className="font-bold text-gray-700">#{user.id}</span>
          </p>

          {/* User details section */}
          <div className="w-full flex flex-col gap-3 mb-6">
            <div className="flex items-center gap-2 text-gray-700">
              <svg
                className="w-5 h-5 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m-7 6l-2 2-2-2m-8 6h16a2 2 0 002-2V6a2 2 0 00-2-2H4a2 2 0 00-2 2v12a2 2 0 002 2z"
                ></path>
              </svg>
              <span className="font-medium">Email:</span>
              <span className="text-blue-600">{user.user_email}</span>
            </div>

            <div className="flex items-center gap-2 text-gray-700">
              <svg
                className="w-5 h-5 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                ></path>
              </svg>
              <span className="font-medium">Phone:</span>
              <span>{user.user_phone || "Not provided"}</span>
            </div>

            <div className="flex items-center gap-2 text-gray-700">
              <svg
                className="w-5 h-5 text-purple-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <span className="font-medium">Plan Type:</span>
              <span className="px-2 py-1 bg-purple-100 text-purple-700 text-sm rounded-full font-semibold">
                {user.plan_type}
              </span>
            </div>

            <div className="flex items-center gap-2 text-gray-700">
              <svg
                className="w-5 h-5 text-orange-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                ></path>
              </svg>
              <span className="font-medium">Joined:</span>
              <span>{user.joined_date}</span>
            </div>

            <div className="flex items-center gap-2 text-gray-700">
              <svg
                className="w-5 h-5 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <span className="font-medium">Price:</span>
              <span className="text-green-600 font-bold">${user.price}</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="w-full flex gap-4 mt-4">
            <button
              onClick={() => router.back()}
              className="px-6 py-3 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold  w-full border border-gray-200 shadow-sm transition-all duration-200 hover:shadow-md"
            >
              Close
            </button>
            {/* <button
              className="px-6 py-3 rounded-lg w-1/2 font-semibold shadow-sm transition-all duration-200 hover:shadow-md bg-blue-500 hover:bg-blue-600 text-white border border-blue-500"
            >
              Edit User
            </button> */}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
