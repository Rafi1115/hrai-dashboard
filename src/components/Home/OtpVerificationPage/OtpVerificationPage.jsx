// "use client"; // This directive is required for client-side functionality in App Router components

// import Image from "next/image";
// import React, { useState, useRef, useEffect } from "react";
// import toast, { Toaster } from "react-hot-toast";

// export default function OtpVerificationPage() {
//   const [otp, setOtp] = useState(["", "", "", ""]);
//   const [email, setEmail] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [resendTimer, setResendTimer] = useState(60); // 60 seconds for resend
//   const [canResend, setCanResend] = useState(false);
//   const otpInputRefs = useRef([]);

//   // Effect to get email from URL query parameters
//   useEffect(() => {
//     const urlParams = new URLSearchParams(window.location.search);
//     const emailFromUrl = urlParams.get("email");
//     if (emailFromUrl) {
//       setEmail(decodeURIComponent(emailFromUrl));
//     }
//   }, []);

//   // Effect for the resend timer
//   useEffect(() => {
//     let timer;
//     if (resendTimer > 0 && !canResend) {
//       timer = setTimeout(() => {
//         setResendTimer((prev) => prev - 1);
//       }, 1000);
//     } else if (resendTimer === 0) {
//       setCanResend(true);
//     }
//     return () => clearTimeout(timer);
//   }, [resendTimer, canResend]);

//   const handleOtpChange = (e, index) => {
//     const { value } = e.target;
//     if (/[^0-9]/.test(value)) return; // Only allow digits

//     const newOtp = [...otp];
//     newOtp[index] = value;
//     setOtp(newOtp);

//     // Move focus to the next input if a digit is entered
//     if (value && index < otp.length - 1) {
//       otpInputRefs.current[index + 1].focus();
//     }
//   };

//   const handleKeyDown = (e, index) => {
//     if (e.key === "Backspace" && !otp[index] && index > 0) {
//       // Move focus to the previous input on backspace if the current one is empty
//       otpInputRefs.current[index - 1].focus();
//     }
//   };

//   const handleResendCode = async () => {
//     if (canResend) {
//       setLoading(true);
//       const toastId = toast.loading("Resending OTP...");
//       try {
//         // --- API Call to resend OTP ---
//         const response = await fetch(
//           "https://parental-creek-latin-monroe.trycloudflare.com/api/dashboard/auth/forgot-password/",
//           {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ email }),
//           }
//         );
//         const data = await response.json();
//         if (response.ok) {
//           toast.success(data.message || "A new OTP has been sent.", {
//             id: toastId,
//           });
//           setResendTimer(60); // Reset timer
//           setCanResend(false);
//         } else {
//           toast.error(data.message || "Failed to resend OTP.", { id: toastId });
//         }
//       } catch (err) {
//         console.error("Resend OTP error:", err);
//         toast.error("An unexpected error occurred.", { id: toastId });
//       } finally {
//         setLoading(false);
//       }
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);
//     const toastId = toast.loading("Verifying OTP...");

//     const enteredOtp = otp.join("");

//     // --- Client-side validation ---
//     if (enteredOtp.length !== 4 || !/^\d{4}$/.test(enteredOtp)) {
//       setError("Please enter a valid 4-digit OTP.");
//       toast.error("Please enter a valid 4-digit OTP.", { id: toastId });
//       setLoading(false);
//       return;
//     }

//     // --- API Call for OTP verification ---
//     console.log("Attempting to verify OTP:", { otp: enteredOtp, email });

//     try {
//       // Replace with your actual backend verification call
//       await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate network delay

//       // Simulate success or failure
//       if (enteredOtp === "1234") {
//         // Using a simple OTP for simulation
//         toast.success("OTP Verified! Redirecting...", { id: toastId });
//         // Redirect to a password reset page, passing the OTP and email
//         window.location.href = `/set-new-password?email=${encodeURIComponent(
//           email
//         )}&otp=${encodeURIComponent(enteredOtp)}`;
//       } else {
//         setError("Invalid OTP. Please try again.");
//         toast.error("Invalid OTP. Please try again.", { id: toastId });
//       }
//     } catch (err) {
//       console.error("OTP verification error:", err);
//       setError("An unexpected error occurred. Please try again.");
//       toast.error("An unexpected error occurred.", { id: toastId });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex min-h-screen bg-white">
//       <Toaster position="top-center" reverseOrder={false} />

//       {/* Left Panel - Image background */}
//       <div className="hidden lg:flex w-1/2 login_bg items-center justify-center">
//         {/* Background image is handled by the 'login_bg' class */}
//       </div>

//       {/* Right OTP Verification Panel */}
//       <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-4 sm:p-8">
//         <div className="md:w-[564px] p-10 rounded-[15px] flex flex-col justify-center items-center gap-10">
//           <div className="self-stretch flex flex-col justify-start items-center gap-[30px]">
//             <div className="self-stretch flex flex-col justify-center items-center gap-[30px]">
//               <div className="w-full flex flex-col justify-start gap-[18px]">
//                 <Image
//                   src="/side-bar-logo.png"
//                   alt="Arkive"
//                   width={200}
//                   height={40}
//                   className="w-[200]"
//                 />
//                 <p className="self-stretch text-start text-black text-[24px] font-semibold">
//                   OTP Verification
//                 </p>
//                 <p className="self-stretch text-start text-black text-sm font-semibold">
//                   Enter the 4-digit code sent to your email.
//                 </p>
//                 <p className="self-stretch text-start text-gray-600 text-sm">
//                   We have sent the code to{" "}
//                   <span className="text-black font-medium">
//                     {email || "your email"}
//                   </span>
//                   .
//                 </p>
//               </div>
//               <form
//                 onSubmit={handleSubmit}
//                 className="w-full flex flex-col items-center gap-[18px]"
//               >
//                 {/* OTP Input Fields */}
//                 <div className="flex justify-center gap-3 mt-4 w-full">
//                   {otp.map((digit, index) => (
//                     <input
//                       key={index}
//                       type="text"
//                       maxLength="1"
//                       value={digit}
//                       onChange={(e) => handleOtpChange(e, index)}
//                       onKeyDown={(e) => handleKeyDown(e, index)}
//                       ref={(el) => (otpInputRefs.current[index] = el)}
//                       className="w-full h-12 text-center text-black bg-gray-100 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 font-sans text-xl"
//                       required
//                     />
//                   ))}
//                 </div>

//                 {/* Resend Code */}
//                 <div className="self-stretch text-center mt-4">
//                   {canResend ? (
//                     <button
//                       type="button"
//                       onClick={handleResendCode}
//                       className="text-blue-600 text-xs font-medium hover:underline"
//                       disabled={loading}
//                     >
//                       Resend Code
//                     </button>
//                   ) : (
//                     <span className="text-gray-500 text-xs font-normal">
//                       Resend code in{" "}
//                       {resendTimer < 10 ? `0${resendTimer}` : resendTimer}s
//                     </span>
//                   )}
//                 </div>

//                 {error && (
//                   <p className="text-red-500 text-sm text-center mt-2">
//                     {error}
//                   </p>
//                 )}

//                 {/* Verify Button */}
//                 <button
//                   type="submit"
//                   className={`w-full h-10 mx-auto mt-4 bg-[#013D3B] text-white rounded-md text-sm font-normal shadow-sm flex justify-center items-center transition duration-300 ease-in-out hover:bg-[#025a57] disabled:opacity-70 disabled:cursor-not-allowed`}
//                   disabled={loading}
//                 >
//                   {loading ? "Verifying..." : "Verify"}
//                 </button>
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
