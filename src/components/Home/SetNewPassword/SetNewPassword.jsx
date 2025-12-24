// "use client"; // This directive is required for client-side functionality in App Router components

// import Image from "next/image";
// import React, { useState } from "react";

// export default function App() {
//   // Changed to App for default export
//   const [newPassword, setNewPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [showNewPassword, setShowNewPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError(""); // Clear previous errors
//     setLoading(true); // Indicate loading state

//     // --- Client-side validation ---
//     if (!newPassword || !confirmPassword) {
//       setError("Please enter both new password and confirm password.");
//       setLoading(false);
//       return;
//     }

//     if (newPassword.length < 6) {
//       setError("Password must be at least 6 characters long.");
//       setLoading(false);
//       return;
//     }

//     if (newPassword !== confirmPassword) {
//       setError("Passwords do not match.");
//       setLoading(false);
//       return;
//     }

//     // --- Simulate API Call for setting new password (Replace with your actual backend call) ---
//     console.log("Attempting to set new password:", { newPassword });

//     try {
//       await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate network delay

//       // In a real app, redirect to login page after successful password reset
//       console.log("Password has been reset successfully! (Simulated)");
//     } catch (err) {
//       console.error("Set new password error:", err);
//       setError("An unexpected error occurred. Please try again.");
//     } finally {
//       setLoading(false); // End loading state
//     }
//   };

//   return (
//     <div className="flex min-h-screen bg-white font-[Inter]">
//       {/* Left Panel - Image background with blur */}
//       <div className="hidden lg:flex w-1/2 login_bg p-8 items-center justify-center">
//         {/* This div is for the background image, styled via CSS */}
//       </div>

//       {/* Right Set New Password Panel */}
//       <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-4 sm:p-8">
//         <div className="md:w-[564px] p-10 rounded-[15px] flex flex-col justify-center items-center gap-10">
//           <div className="self-stretch flex flex-col justify-start items-center gap-[30px]">
//             <div className="self-stretch flex flex-col justify-center items-center gap-[30px]">
//               <div className="w-full flex flex-col justify-start gap-[18px]">
//                 {/* Logo/Text */}
//                 <Image
//                   src="/side-bar-logo.png"
//                   alt="Arkive"
//                   width={200}
//                   height={40}
//                   className="w-[200]"
//                 />
//                 <p className="self-stretch text-start text-gray-900 text-[24px] font-semibold ">
//                   Set New Password
//                 </p>
//                 <p className="self-stretch text-start text-gray-700 text-sm font-semibold ">
//                   Enter your new password and make sure you remember it:
//                 </p>
//               </div>
//               <form
//                 onSubmit={handleSubmit}
//                 className="w-full flex flex-col items-center gap-[18px]"
//               >
//                 {/* New Password Input */}
//                 <div className="self-stretch flex flex-col justify-start items-start gap-2">
//                   <label
//                     htmlFor="newPassword"
//                     className="self-stretch text-gray-900 text-sm font-semibold "
//                   >
//                     Password
//                   </label>
//                   <div className="relative self-stretch">
//                     <input
//                       type={showNewPassword ? "text" : "password"}
//                       id="newPassword"
//                       className="h-10 px-3 py-2.5 font-semibold rounded-md border border-gray-300 text-gray-900 bg-gray-50 focus:outline-none focus:ring-1 focus:ring-[#66B8FF] w-full pr-10"
//                       placeholder=""
//                       value={newPassword}
//                       onChange={(e) => setNewPassword(e.target.value)}
//                       required
//                     />
//                     <div
//                       className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
//                       onClick={() => setShowNewPassword(!showNewPassword)}
//                     >
//                       {showNewPassword ? (
//                         <svg
//                           xmlns="http://www.w3.org/2000/svg"
//                           width="20"
//                           height="20"
//                           viewBox="0 0 24 24"
//                           fill="none"
//                           stroke="#B0B0B0"
//                           strokeWidth="2"
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           className="lucide lucide-eye-off"
//                         >
//                           <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
//                           <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
//                           <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.749 9.749 0 0 0 5.39-1.61" />
//                           <line x1="2" x2="22" y1="2" y2="22" />
//                         </svg>
//                       ) : (
//                         <svg
//                           xmlns="http://www.w3.org/2000/svg"
//                           width="20"
//                           height="20"
//                           viewBox="0 0 24 24"
//                           fill="none"
//                           stroke="#B0B0B0"
//                           strokeWidth="2"
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           className="lucide lucide-eye"
//                         >
//                           <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
//                           <circle cx="12" cy="12" r="3" />
//                         </svg>
//                       )}
//                     </div>
//                   </div>
//                 </div>

//                 {/* Confirm Password Input */}
//                 <div className="self-stretch flex flex-col justify-start items-start gap-2">
//                   <label
//                     htmlFor="confirmPassword"
//                     className="self-stretch text-gray-900 text-sm font-semibold "
//                   >
//                     Confirmed Password
//                   </label>
//                   <div className="relative self-stretch">
//                     <input
//                       type={showConfirmPassword ? "text" : "password"}
//                       id="confirmPassword"
//                       className="h-10 px-3 py-2.5 rounded-md border font-semibold border-gray-300 text-gray-900 bg-gray-50 focus:outline-none focus:ring-1 focus:ring-[#66B8FF] w-full pr-10"
//                       placeholder=""
//                       value={confirmPassword}
//                       onChange={(e) => setConfirmPassword(e.target.value)}
//                       required
//                     />
//                     <div
//                       className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
//                       onClick={() =>
//                         setShowConfirmPassword(!showConfirmPassword)
//                       }
//                     >
//                       {showConfirmPassword ? (
//                         <svg
//                           xmlns="http://www.w3.org/2000/svg"
//                           width="20"
//                           height="20"
//                           viewBox="0 0 24 24"
//                           fill="none"
//                           stroke="#B0B0B0"
//                           strokeWidth="2"
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           className="lucide lucide-eye-off"
//                         >
//                           <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
//                           <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
//                           <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.749 9.749 0 0 0 5.39-1.61" />
//                           <line x1="2" x2="22" y1="2" y2="22" />
//                         </svg>
//                       ) : (
//                         <svg
//                           xmlns="http://www.w3.org/2000/svg"
//                           width="20"
//                           height="20"
//                           viewBox="0 0 24 24"
//                           fill="none"
//                           stroke="#B0B0B0"
//                           strokeWidth="2"
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           className="lucide lucide-eye"
//                         >
//                           <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
//                           <circle cx="12" cy="12" r="3" />
//                         </svg>
//                       )}
//                     </div>
//                   </div>
//                 </div>

//                 {error && (
//                   <p className="text-red-500 text-sm text-center mt-2 font-[Inter]">
//                     {error}
//                   </p>
//                 )}

//                 {/* Save Changes Button */}
//                 <button
//                   type="submit"
//                   className={`w-full h-10 mx-auto mt-4 bg-[#013D3B] text-white rounded-md text-sm font-normal font-[Inter] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] flex justify-center items-center transition duration-300 ease-in-out ${
//                     loading ? "opacity-70 cursor-not-allowed" : ""
//                   }`}
//                   disabled={loading}
//                 >
//                   {loading ? "Saving..." : "Save Changes"}
//                 </button>
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
