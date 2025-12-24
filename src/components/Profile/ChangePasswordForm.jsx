"use client";

import React, { useState } from "react";
import { getApiUrl } from "../configs/api";

export default function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 'success' or 'error'

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setMessageType("");

    if (newPassword !== confirmedPassword) {
      setMessage("New password and confirmed password do not match.");
      setMessageType("error");
      return;
    }

    // IMPORTANT: You need to get the user's auth token,
    // likely from localStorage or cookies after they log in.
    const authToken = localStorage.getItem("authToken");

    if (!authToken) {
      setMessage("You are not authorized. Please log in again.");
      setMessageType("error");
      return;
    }

    try {
      const response = await fetch(
        getApiUrl('/api/auth/password/change/') , 
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Add the Authorization header
            Authorization: `Bearer ${authToken}`,
          },
          // Match the keys from your Postman request body
          body: JSON.stringify({
            old_password: currentPassword,
            new_password: newPassword,
            new_password2: confirmedPassword,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        // Handle potential validation errors from the API
        let errorMessage = "Failed to change password.";
        if (result && typeof result === "object") {
          // Combine multiple error messages if the API sends them
          errorMessage = Object.values(result).flat().join(" ");
        }
        setMessage(errorMessage);
        setMessageType("error");
      } else {
        setMessage(result.message || "Password changed successfully!");
        setMessageType("success");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmedPassword("");
      }
    } catch (err) {
      setMessage("An error occurred. Please try again.");
      setMessageType("error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 flex flex-col items-center">
      {/* Added flex-col and items-center to center form fields */}
      <div className="mb-4 w-full max-w-[982px]">
        {/* Constrain div width for centering */}
        <label
          htmlFor="currentPassword"
          className="block text-black text-sm font-bold mb-2" // Changed text to black
        >
          Current Password
        </label>
        <input
          type="password"
          id="currentPassword"
          className="shadow appearance-none rounded w-full h-[50px] py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border border-[#C3C3C3] bg-gray-100" // Changed text and background of input
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
        />
      </div>
      <div className="mb-4 w-full max-w-[982px]">
        {/* Constrain div width for centering */}
        <label
          htmlFor="newPassword"
          className="block text-black text-sm font-bold mb-2" // Changed text to black
        >
          New Password
        </label>
        <input
          type="password"
          id="newPassword"
          className="shadow appearance-none rounded w-full h-[50px] py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border border-[#C3C3C3] bg-gray-100" // Changed text and background of input
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
      </div>
      <div className="mb-6 w-full max-w-[982px]">
        {/* Constrain div width for centering */}
        <label
          htmlFor="confirmedPassword"
          className="block text-black text-sm font-bold mb-2" // Changed text to black
        >
          Confirmed Password
        </label>
        <input
          type="password"
          id="confirmedPassword"
          className="shadow appearance-none rounded w-full h-[50px] py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border border-[#C3C3C3] bg-gray-100" // Changed text and background of input
          value={confirmedPassword}
          onChange={(e) => setConfirmedPassword(e.target.value)}
          required
        />
      </div>
      {message && (
        <p
          className={`text-center mb-4 ${
            messageType === "success" ? "text-green-500" : "text-red-500"
          }`}
        >
          {message}
        </p>
      )}
      <div className="flex items-center justify-center mt-6 md:w-[982px]">
        <button
          type="submit"
          className="bg-[#013D3B] hover:bg-opacity-80 cursor-pointer text-white font-bold w-full py-3 px-4 rounded-[4px] focus:outline-none focus:shadow-outline transition duration-150 ease-in-out transform hover:scale-105"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
}
