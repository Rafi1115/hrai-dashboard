"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import ChangePasswordForm from "./ChangePasswordForm";
import { RxAvatar } from "react-icons/rx";
import toast from "react-hot-toast";
import axios from "axios";
import { getApiUrl } from "../configs/api";

export default function ProfilePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("editProfile");

  // New state to store the actual image file
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState();
  const fileInputRef = useRef(null);

  const [adminInfo, setAdminInfo] = useState(null);
  const [fullName, setFullName] = useState("");
  const [contactNo, setContactNo] = useState("");
  const handleContactChange = (e) => {
  // Remove all non-numeric characters
  const numericValue = e.target.value.replace(/\D/g, '');
  setContactNo(numericValue);
};

  const handleBackClick = () => {
    router.back();
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Store the file and create a URL for preview
      setProfileImageFile(file);
      const newImageUrl = URL.createObjectURL(file);
      setProfileImageUrl(newImageUrl);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

useEffect(() => {
  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("adminToken"));
  if (token) {
    const tokenValue = token.split("=")[1];
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
        setFullName(data?.data?.name || "");
        setContactNo(data?.data?.phone || "");
        // Fix: Use the correct field name from API response
        if (data?.data?.profile_picture) {
          setProfileImageUrl(data.data.profile_picture);
        }
      });
  }
}, []);

  const handleProfileUpdate = async (event) => {
    event.preventDefault();
    const toastId = toast.loading("Updating profile...");

    const formData = new FormData();
    formData.append("name", fullName);
    formData.append("phone", contactNo);
    
    // Append the stored image file ONLY if a new one was selected
    if (profileImageFile) {
      formData.append("profile_picture", profileImageFile);
    }

    try {
      const tokenCookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith("adminToken="));
      if (!tokenCookie) throw new Error("Authentication token not found.");

      const token = tokenCookie.split("=")[1];

      const res = await axios.post(
        getApiUrl('/api/auth/profile/') ,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data", // Important for FormData
          },
        }
      );
      toast.success("Profile updated successfully!", { id: toastId });
      setAdminInfo(res.data?.data);
      // Update the profile image URL with the new one from the response
      if (res.data?.data?.profile_picture) {
          setProfileImageUrl(res.data.data.profile_picture);
      }
      window.dispatchEvent(
        new CustomEvent("profileUpdated", { detail: res.data?.data })
      );
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "An error occurred.";
      console.error("Update failed:", err);
      toast.error(`Update failed: ${errorMessage}`, { id: toastId });
    }
  };

  return (
    <div className="min-h-screen bg-white text-black flex justify-center items-start pt-8 pb-8 rounded-lg">
      <div
        className="flex items-center gap-4 cursor-pointer ml-5"
        onClick={handleBackClick}
      >
        <div className="">
          <ArrowLeft
            className="text-black bg-[#E0E0E0] rounded-full p-2"
            size={40}
          />
        </div>
        <h1 className="text-2xl font-bold">Profile</h1>
      </div>
      <div className="w-full max-w-6xl mx-auto px-4">
        <div className="p-6">
          <div className="flex justify-center gap-[18px] items-center mb-6">
            <div
              className="relative rounded-full border-4 border-gray-300 cursor-pointer"
              onClick={handleImageClick}
            >
              <div className="w-[100px] h-[100px] rounded-full overflow-hidden flex justify-center items-center">
                {profileImageUrl ? (
                  <Image
                    src={profileImageUrl}
                    alt="User Profile"
                    width={100}
                    height={100}
                    className="rounded-full flex justify-center items-center"
                    style={{ objectFit: "cover" }}
                  />
                ) : (
                  <RxAvatar size={60} className="text-gray-500" />
                )}
              </div>
              <span className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-1 border-2 border-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-white"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M13.586 3.586a2 2 0 112.828 2.828l-7.793 7.793a.5.5 0 01-.128.093l-3 1a.5.5 0 01-.611-.611l1-3a.5.5 0 01.093-.128l7.793-7.793zM10.707 6.293a1 1 0 00-1.414 1.414L12 9.414l1.293-1.293a1 1 0 00-1.414-1.414L10.707 6.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            </div>
            <div className="flex flex-col gap-[12px]">
              <h2 className="text-[24px] font-bold mt-3 text-black">
                {adminInfo?.name}
              </h2>
              <p className="text-black font-[400] text-xl">Admin</p>
            </div>
          </div>
          <div className="flex justify-center mb-6">
            <button
              className={`py-2 px-6 text-[16px] font-semibold ${
                activeTab === "editProfile"
                  ? "border-b-2 border-[#013D3B] text-[#013D3B]"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              onClick={() => setActiveTab("editProfile")}
            >
              Edit Profile
            </button>
            <button
              className={`py-2 px-6 text-[16px] font-semibold ${
                activeTab === "changePassword"
                  ? "border-b-2 border-[#013D3B] text-[#013D3B]"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              onClick={() => setActiveTab("changePassword")}
            >
              Change Password
            </button>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            style={{ display: "none" }}
            accept="image/*"
          />

          {activeTab === "editProfile" && (
            <div className="p-6 flex flex-col items-center">
              <form className="w-full max-w-[982px]" onSubmit={handleProfileUpdate}>
                <div className="mb-4">
                  <label
                    htmlFor="fullName"
                    className="block text-black text-sm font-bold mb-2"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    onChange={(e) => setFullName(e.target.value)}
                    className="shadow appearance-none rounded w-full h-[50px] py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border border-[#C3C3C3] bg-gray-100"
                    value={fullName}
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="email"
                    className="block text-black text-sm font-bold mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="shadow appearance-none rounded w-full h-[50px] py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border border-[#C3C3C3] bg-gray-100 cursor-no-drop"
                    value={adminInfo?.email}
                    readOnly
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="contactNo"
                    className="block text-black text-sm font-bold mb-2"
                  >
                    Contact No
                  </label>
                  
                  <input
                    type="tel"
                    id="contactNo"
                    onChange={handleContactChange}
                    className="shadow appearance-none rounded w-full h-[50px] py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border border-[#C3C3C3] bg-gray-100"
                    value={contactNo}
                  />
                </div>
                <div className="flex items-center justify-center mt-6">
                  <button
                    type="submit"
                    className="bg-[#013D3B] cursor-pointer hover:bg-opacity-80 text-white font-bold w-full py-3 px-4 rounded-[4px] focus:outline-none focus:shadow-outline transition duration-150 ease-in-out transform hover:scale-105"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}
          {activeTab === "changePassword" && <ChangePasswordForm />}
        </div>
      </div>
    </div>
  );
}