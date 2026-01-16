"use client";

import Link from "next/link";
import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import hrLogo from "../../../../public/side-bar-logo.png";
import Image from "next/image";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  // OTP States
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [otpError, setOtpError] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  // Enhanced email validation function (same as login)
  const validateEmail = (email) => {
    setEmailError("");

    if (!email.trim()) {
      setEmailError("Email is required");
      return false;
    }

    const emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address");
      return false;
    }

    if (email.length < 5) {
      setEmailError("Email must be at least 5 characters long");
      return false;
    }

    if (email.length > 254) {
      setEmailError("Email is too long (maximum 254 characters)");
      return false;
    }

    const parts = email.split("@");
    if (parts.length !== 2) {
      setEmailError("Email must contain exactly one @ symbol");
      return false;
    }

    const [localPart, domain] = parts;

    if (localPart.length === 0) {
      setEmailError("Email must have content before @ symbol");
      return false;
    }

    if (localPart.length > 64) {
      setEmailError("Local part of email is too long (maximum 64 characters)");
      return false;
    }

    if (localPart.includes("..")) {
      setEmailError("Email cannot contain consecutive dots");
      return false;
    }

    if (localPart.startsWith(".") || localPart.endsWith(".")) {
      setEmailError("Email cannot start or end with a dot");
      return false;
    }

    if (domain.length === 0) {
      setEmailError("Email must have a domain after @ symbol");
      return false;
    }

    if (domain.length > 253) {
      setEmailError("Domain part of email is too long");
      return false;
    }

    const domainRegex =
      /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!domainRegex.test(domain)) {
      setEmailError("Invalid domain format");
      return false;
    }

    if (!domain.includes(".")) {
      setEmailError("Domain must contain at least one dot");
      return false;
    }

    const domainParts = domain.split(".");
    const tld = domainParts[domainParts.length - 1];
    if (tld.length < 2) {
      setEmailError("Domain extension must be at least 2 characters");
      return false;
    }

    if (!/^[a-zA-Z]+$/.test(tld)) {
      setEmailError("Domain extension must contain only letters");
      return false;
    }

    const maliciousPatterns = [
      /javascript:/i,
      /data:/i,
      /vbscript:/i,
      /<script/i,
      /onclick/i,
      /onerror/i,
    ];

    for (const pattern of maliciousPatterns) {
      if (pattern.test(email)) {
        setEmailError("Email contains invalid characters");
        return false;
      }
    }

    return true;
  };

  // Password validation
  const validatePassword = (password) => {
    setPasswordError("");

    if (!password) {
      setPasswordError("Password is required");
      return false;
    }

    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      return false;
    }

    if (!/(?=.*[a-z])/.test(password)) {
      setPasswordError("Password must contain at least one lowercase letter");
      return false;
    }

    if (!/(?=.*[A-Z])/.test(password)) {
      setPasswordError("Password must contain at least one uppercase letter");
      return false;
    }

    if (!/(?=.*\d)/.test(password)) {
      setPasswordError("Password must contain at least one number");
      return false;
    }

    if (!/(?=.*[@$!%*?&])/.test(password)) {
      setPasswordError(
        "Password must contain at least one special character (@$!%*?&)"
      );
      return false;
    }

    return true;
  };

  // Confirm password validation
  const validateConfirmPassword = (confirmPassword, password) => {
    setConfirmPasswordError("");

    if (!confirmPassword) {
      setConfirmPasswordError("Please confirm your password");
      return false;
    }

    if (confirmPassword !== password) {
      setConfirmPasswordError("Passwords do not match");
      return false;
    }

    return true;
  };

  // Handle email input change with real-time validation
  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);

    if (error) setError("");

    if (newEmail.trim()) {
      setTimeout(() => {
        validateEmail(newEmail);
      }, 300);
    } else {
      setEmailError("");
    }
  };

  // Handle password input change
  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);

    if (error) setError("");

    if (newPassword.trim()) {
      setTimeout(() => {
        validatePassword(newPassword);
        if (confirmPassword) {
          validateConfirmPassword(confirmPassword, newPassword);
        }
      }, 300);
    } else {
      setPasswordError("");
    }
  };

  // Handle confirm password input change
  const handleConfirmPasswordChange = (e) => {
    const newConfirmPassword = e.target.value;
    setConfirmPassword(newConfirmPassword);

    if (error) setError("");

    if (newConfirmPassword.trim()) {
      setTimeout(() => {
        validateConfirmPassword(newConfirmPassword, password);
      }, 300);
    } else {
      setConfirmPasswordError("");
    }
  };

  // Handle OTP input change
  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (otpError) setOtpError("");

    // Auto focus next input
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  // Handle OTP backspace
  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Comprehensive validation
    if (!email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      toast.error("Please fill in all fields.");
      setLoading(false);
      return;
    }

    // Validate all fields
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    const isConfirmPasswordValid = validateConfirmPassword(
      confirmPassword,
      password
    );

    if (!isEmailValid || !isPasswordValid || !isConfirmPasswordValid) {
      setError("Please fix the errors above.");
      toast.error("Please fix the errors above.");
      setLoading(false);
      return;
    }

    // API Call
    try {
      console.log("Starting signup process...");

      const response = await fetch(
        "https://api.hrlynx.ai/api/dashboard/auth/signup/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim().toLowerCase(),
            password: password,
            confirm_password: confirmPassword,
          }),
        }
      );

      console.log("Signup response:", response);
      const data = await response.json();
      console.log("Signup data:", data);

      if (response.ok) {
        // Signup successful - show OTP verification
        console.log("Admin signup successful!", data);
        toast.success(
          "Account created successfully! Please check your email for OTP."
        );

        // Switch to OTP verification view
        setShowOtpVerification(true);
      } else {
        // Handle signup errors based on API response structure
        console.error("Signup failed:", data);

        if (data.errors) {
          // Handle field-specific errors from API
          if (data.errors.email && Array.isArray(data.errors.email)) {
            setEmailError(data.errors.email[0]);
            toast.error(`Email: ${data.errors.email[0]}`);
          }

          if (data.errors.password && Array.isArray(data.errors.password)) {
            setPasswordError(data.errors.password[0]);
            toast.error(`Password: ${data.errors.password[0]}`);
          }

          if (
            data.errors.confirm_password &&
            Array.isArray(data.errors.confirm_password)
          ) {
            setConfirmPasswordError(data.errors.confirm_password[0]);
            toast.error(`Confirm Password: ${data.errors.confirm_password[0]}`);
          }
        } else {
          // Handle general error messages
          const errorMessage = data?.message || "Signup failed";

          if (response.status === 400) {
            setError(errorMessage);
            toast.error(errorMessage);
          } else if (response.status === 409) {
            setError("An account with this email already exists.");
            toast.error("An account with this email already exists.");
          } else if (response.status >= 500) {
            setError("Server error. Please try again later.");
            toast.error("Server error. Please try again later.");
          } else {
            setError(errorMessage);
            toast.error(errorMessage);
          }
        }
      }
    } catch (err) {
      console.error("Network error:", err);

      if (err.name === "TypeError" && err.message.includes("fetch")) {
        setError("Network error. Please check your internet connection.");
        toast.error("Network error. Please check your internet connection.");
      } else {
        setError("An unexpected error occurred. Please try again.");
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP verification
  const handleOtpVerification = async (e) => {
    e.preventDefault();
    setOtpError("");
    setOtpLoading(true);

    const otpString = otp.join("");

    if (otpString.length !== 4) {
      setOtpError("Please enter all 4 digits");
      toast.error("Please enter all 4 digits");
      setOtpLoading(false);
      return;
    }

    try {
      const response = await fetch(
        "https://api.hrlynx.ai/api/dashboard/auth/verify-email/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim().toLowerCase(),
            otp: otpString,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success("Email verified successfully! Redirecting to login...");

        // Clear all form data
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setOtp(["", "", "", ""]);

        // Redirect to login page after 2 seconds
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
      } else {
        const errorMessage = data?.message || "Invalid OTP. Please try again.";
        setOtpError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (err) {
      console.error("OTP verification error:", err);
      setOtpError("Network error. Please try again.");
      toast.error("Network error. Please try again.");
    } finally {
      setOtpLoading(false);
    }
  };

  // Handle resend OTP
  const handleResendOtp = async () => {
    setResendLoading(true);
    setOtpError("");

    try {
      const response = await fetch(
        "https://api.hrlynx.ai/api/dashboard/auth/resend-otp/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim().toLowerCase(),
            purpose: "verification",
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success("OTP resent successfully! Check your email.");
      } else {
        const errorMessage =
          data?.message || "Failed to resend OTP. Please try again.";
        toast.error(errorMessage);
      }
    } catch (err) {
      console.error("Resend OTP error:", err);
      toast.error("Network error. Please try again.");
    } finally {
      setResendLoading(false);
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // Go back to signup form
  const goBackToSignup = () => {
    setShowOtpVerification(false);
    setOtp(["", "", "", ""]);
    setOtpError("");
  };

  return (
    <div className="flex min-h-screen">
      <Toaster position="top-center" reverseOrder={false} />

      {/* Left Panel - same as login */}
      <div className="hidden lg:flex w-1/2 login_bg items-center justify-center"></div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-4 sm:p-8">
        <div className="md:w-[564px] p-10 rounded-[15px] flex flex-col justify-center items-center gap-10">
          <div className="self-stretch flex flex-col justify-start items-center gap-[30px]">
            <div className="self-stretch flex flex-col justify-center items-center gap-[30px]">
              <div className="w-full flex flex-col justify-start gap-[18px]">
                {/* Logo placeholder */}
                <Image
                  src={hrLogo}
                  alt="Arkive"
                  width={200}
                  height={40}
                  className="w-[200] "
                />

                {!showOtpVerification ? (
                  <>
                    <p className="self-stretch text-start text-black text-[24px] font-semibold">
                      Admin Registration
                    </p>
                    <p className="self-stretch text-start text-black text-sm font-semibold">
                      Create your admin account
                    </p>
                  </>
                ) : (
                  <>
                    <p className="self-stretch text-start text-black text-[24px] font-semibold">
                      Verify Your Email
                    </p>
                    <p className="self-stretch text-start text-black text-sm font-semibold">
                      Enter the 6-digit code sent to {email}
                    </p>
                  </>
                )}
              </div>

              <div className="w-full flex flex-col items-end gap-[18px]">
                {!showOtpVerification ? (
                  /* Signup Form */
                  <div className="self-stretch flex flex-col justify-start items-start gap-[18px]">
                    {/* Email Input */}
                    <div className="self-stretch flex flex-col justify-start items-start gap-2">
                      <label
                        htmlFor="email"
                        className="self-stretch text-black text-sm font-normal font-[Inter]"
                      >
                        Admin Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        className={`self-stretch h-10 w-full px-3 py-2.5 rounded-md border ${
                          emailError ? "border-red-500" : "border-[#DCDCDC]"
                        } text-black focus:outline-none focus:ring-1 ${
                          emailError
                            ? "focus:ring-red-500"
                            : "focus:ring-[#66B8FF]"
                        } font-[Inter]`}
                        placeholder="Enter your admin email"
                        value={email}
                        onChange={handleEmailChange}
                        required
                      />
                      {emailError && (
                        <p className="text-red-500 text-xs mt-1 font-[Inter]">
                          {emailError}
                        </p>
                      )}
                    </div>

                    {/* Password Input */}
                    <div className="self-stretch flex flex-col justify-start items-start gap-2">
                      <label
                        htmlFor="password"
                        className="self-stretch text-black text-sm font-normal font-[Inter]"
                      >
                        Admin Password
                      </label>
                      <div className="relative self-stretch">
                        <input
                          type={showPassword ? "text" : "password"}
                          id="password"
                          className={`h-10 px-3 py-2.5 rounded-md border ${
                            passwordError
                              ? "border-red-500"
                              : "border-[#DCDCDC]"
                          } text-black focus:outline-none focus:ring-1 ${
                            passwordError
                              ? "focus:ring-red-500"
                              : "focus:ring-[#66B8FF]"
                          } font-[Inter] w-full pr-10`}
                          placeholder="Create a strong password"
                          value={password}
                          onChange={handlePasswordChange}
                          required
                        />
                        <button
                          type="button"
                          onClick={togglePasswordVisibility}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? (
                            <svg
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                              />
                            </svg>
                          ) : (
                            <svg
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                          )}
                        </button>
                      </div>
                      {passwordError && (
                        <p className="text-red-500 text-xs mt-1 font-[Inter]">
                          {passwordError}
                        </p>
                      )}
                    </div>

                    {/* Confirm Password Input */}
                    <div className="self-stretch flex flex-col justify-start items-start gap-2">
                      <label
                        htmlFor="confirmPassword"
                        className="self-stretch text-black text-sm font-normal font-[Inter]"
                      >
                        Confirm Password
                      </label>
                      <div className="relative self-stretch">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          id="confirmPassword"
                          className={`h-10 px-3 py-2.5 rounded-md border ${
                            confirmPasswordError
                              ? "border-red-500"
                              : "border-[#DCDCDC]"
                          } text-black focus:outline-none focus:ring-1 ${
                            confirmPasswordError
                              ? "focus:ring-red-500"
                              : "focus:ring-[#66B8FF]"
                          } font-[Inter] w-full pr-10`}
                          placeholder="Confirm your password"
                          value={confirmPassword}
                          onChange={handleConfirmPasswordChange}
                          required
                        />
                        <button
                          type="button"
                          onClick={toggleConfirmPasswordVisibility}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword ? (
                            <svg
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                              />
                            </svg>
                          ) : (
                            <svg
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                          )}
                        </button>
                      </div>
                      {confirmPasswordError && (
                        <p className="text-red-500 text-xs mt-1 font-[Inter]">
                          {confirmPasswordError}
                        </p>
                      )}
                    </div>

                    {error && (
                      <p className="text-red-500 text-sm text-center mt-2 font-[Inter]">
                        {error}
                      </p>
                    )}

                    {/* Create Account Button */}
                    <button
                      onClick={handleSubmit}
                      className={`w-full h-10 mx-auto mt-4 bg-[#013D3B] text-white rounded-md text-sm font-normal font-[Inter] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] flex justify-center items-center transition duration-300 ease-in-out hover:bg-[#012D2B] ${
                        loading ? "opacity-70 cursor-not-allowed" : ""
                      }`}
                      disabled={loading}
                    >
                      {loading ? "Creating Account..." : "Create Admin Account"}
                    </button>

                    {/* Login Link */}
                    <div className="w-full text-center mt-4">
                      <span className="text-black text-sm font-normal font-[Inter]">
                        Already have an account?{" "}
                        <Link
                          href="/"
                          className="text-[#013D3B] hover:underline font-semibold"
                        >
                          Sign In
                        </Link>
                      </span>
                    </div>
                  </div>
                ) : (
                  /* OTP Verification Form */
                  <div className="self-stretch flex flex-col justify-start items-start gap-[18px]">
                    {/* OTP Input */}
                    <div className="self-stretch flex flex-col justify-start items-center gap-4">
                      <div className="flex gap-3 justify-center">
                        {otp.map((digit, index) => (
                          <input
                            key={index}
                            id={`otp-${index}`}
                            type="text"
                            value={digit}
                            onChange={(e) =>
                              handleOtpChange(index, e.target.value)
                            }
                            onKeyDown={(e) => handleOtpKeyDown(index, e)}
                            className={`w-12 h-12 text-center text-xl font-bold border-2 rounded-md ${
                              otpError ? "border-red-500" : "border-[#DCDCDC]"
                            } focus:outline-none focus:ring-1 ${
                              otpError
                                ? "focus:ring-red-500"
                                : "focus:ring-[#66B8FF]"
                            } font-[Inter]`}
                            maxLength="1"
                          />
                        ))}
                      </div>

                      {otpError && (
                        <p className="text-red-500 text-sm text-center font-[Inter]">
                          {otpError}
                        </p>
                      )}
                    </div>

                    {/* Verify Button */}
                    <button
                      onClick={handleOtpVerification}
                      className={`w-full h-10 mx-auto mt-4 bg-[#013D3B] text-white rounded-md text-sm font-normal font-[Inter] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] flex justify-center items-center transition duration-300 ease-in-out hover:bg-[#012D2B] ${
                        otpLoading ? "opacity-70 cursor-not-allowed" : ""
                      }`}
                      disabled={otpLoading}
                    >
                      {otpLoading ? "Verifying..." : "Verify Email"}
                    </button>

                    {/* Resend OTP */}
                    <div className="w-full text-center mt-4">
                      <span className="text-black text-sm font-normal font-[Inter]">
                        Didn't receive the code?{" "}
                        <button
                          onClick={handleResendOtp}
                          disabled={resendLoading}
                          className={`text-[#013D3B] hover:underline font-semibold ${
                            resendLoading ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                        >
                          {resendLoading ? "Resending..." : "Resend OTP"}
                        </button>
                      </span>
                    </div>

                    {/* Back to Signup */}
                    <div className="w-full text-center mt-2">
                      <button
                        onClick={goBackToSignup}
                        className="text-gray-600 text-sm font-normal font-[Inter] hover:text-black"
                      >
                        ← Back to Registration
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
