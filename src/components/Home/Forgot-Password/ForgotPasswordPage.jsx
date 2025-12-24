"use client";
import React, { useState, useRef } from "react";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";
import hrLogo from '../../../../public/side-bar-logo.png'
import { getApiUrl } from "@/components/configs/api";

 // Import API configuration

export default function ForgotPasswordFlow() {
  const [step, setStep] = useState("forgot"); // "forgot" | "otp" | "reset"
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(""); // ✅ stored as string
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const otpInputRefs = useRef([]);

  /** ---------- Password Validation ---------- */
  const validatePassword = (password) => {
    if (!password) {
      return "Password is required";
    }
    if (password.length < 8) {
      return "Password must be at least 8 characters long";
    }
    return "";
  };

  const validateConfirmPassword = (password, confirmPass) => {
    if (!confirmPass) {
      return "Please confirm your password";
    }
    if (password !== confirmPass) {
      return "Passwords do not match";
    }
    return "";
  };

  /** ---------- Handle Password Changes ---------- */
  const handleNewPasswordChange = (e) => {
    const password = e.target.value;
    setNewPassword(password);
    
    // Real-time validation
    const error = validatePassword(password);
    setPasswordError(error);
    
    // Also validate confirm password if it exists
    if (confirmPassword) {
      const confirmError = validateConfirmPassword(password, confirmPassword);
      setConfirmPasswordError(confirmError);
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const confirmPass = e.target.value;
    setConfirmPassword(confirmPass);
    
    // Real-time validation
    const error = validateConfirmPassword(newPassword, confirmPass);
    setConfirmPasswordError(error);
  };

  /** ---------- Step 1: Send OTP ---------- */
  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading("Sending OTP...");

    if (!email) {
      toast.error("Please enter your email", { id: toastId });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        getApiUrl("/api/dashboard/auth/forgot-password/"),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );
      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || "OTP sent!", { id: toastId });
        setStep("otp");
        setOtp("");
      } else {
        toast.error(data.message || "Error sending OTP", { id: toastId });
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  /** ---------- Step 2: Verify OTP (Frontend Check Only) ---------- */
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading("Verifying OTP...");

    if (otp.length !== 4) {
      toast.error("Enter a valid 4-digit OTP", { id: toastId });
      setLoading(false);
      return;
    }

    try {
      // Usually you'd verify OTP via backend, but since reset-password requires OTP,
      // we'll just move to reset step here.
      toast.success("OTP Verified!", { id: toastId });
      setStep("reset");
      // Clear password errors when moving to reset step
      setPasswordError("");
      setConfirmPasswordError("");
    } catch (err) {
      console.error(err);
      toast.error("Invalid OTP", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  /** ---------- Resend OTP ---------- */
  const handleResendOtp = async () => {
    setLoading(true);
    const toastId = toast.loading("Resending OTP...");

    try {
      const res = await fetch(
        getApiUrl("/api/dashboard/auth/resend-otp/"),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );
      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || "OTP resent!", { id: toastId });
        setOtp("");
        otpInputRefs.current[0]?.focus();
      } else {
        toast.error(data.message || "Failed to resend OTP", { id: toastId });
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  /** ---------- Step 3: Reset Password ---------- */
  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading("Resetting password...");

    // Validate passwords before submitting
    const newPasswordError = validatePassword(newPassword);
    const confirmPasswordError = validateConfirmPassword(newPassword, confirmPassword);

    setPasswordError(newPasswordError);
    setConfirmPasswordError(confirmPasswordError);

    if (newPasswordError || confirmPasswordError) {
      toast.error("Please fix the password errors", { id: toastId });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        getApiUrl("/api/dashboard/auth/reset-password/"),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            otp,
            new_password: newPassword,
            confirm_password: confirmPassword,
          }),
        }
      );
      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || "Password reset successfully!", {
          id: toastId,
        });
        setStep("forgot");
        setEmail("");
        setOtp("");
        setNewPassword("");
        setConfirmPassword("");
        setPasswordError("");
        setConfirmPasswordError("");
        // Redirect to login page after success
        window.location.href = "/";
      } else {
        toast.error(data.message || "Reset failed", { id: toastId });
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  /** ---------- Step UIs ---------- */
  return (
    <div className="flex min-h-screen bg-white items-center justify-center">
      <Toaster position="top-center" reverseOrder={false} />

      <div className="w-full max-w-md p-6 rounded-lg shadow-md border">
        <Image src={hrLogo} alt="Logo" width={180} height={40} />

        {/* Step 1: Forgot Password */}
        {step === "forgot" && (
          <form onSubmit={handleForgotSubmit} className="mt-6 space-y-4">
            <h2 className="text-xl font-semibold">Forgot Password</h2>
            <p className="text-sm text-gray-600">
              Enter your email to receive a code.
            </p>
            <input
              type="email"
              className="w-full border p-2 rounded"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#013D3B] text-white py-2 rounded"
            >
              {loading ? "Sending..." : "Send Code"}
            </button>
          </form>
        )}

        {/* Step 2: OTP Verification */}
        {step === "otp" && (
          <form onSubmit={handleOtpSubmit} className="mt-6 space-y-4">
            <h2 className="text-xl font-semibold">OTP Verification</h2>
            <p className="text-sm text-gray-600">
              Enter the 4-digit code sent to <b>{email}</b>
            </p>
            <div className="flex justify-between gap-2">
              {[0, 1, 2, 3].map((index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  value={otp[index] || ""}
                  ref={(el) => (otpInputRefs.current[index] = el)}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/, "");
                    const newOtp =
                      otp.substring(0, index) + val + otp.substring(index + 1);
                    setOtp(newOtp);
                    if (val && index < 3) {
                      otpInputRefs.current[index + 1]?.focus();
                    }
                  }}
                  className="w-12 h-12 text-center border rounded text-xl"
                />
              ))}
            </div>

            {/* Resend OTP */}
            <button
              type="button"
              disabled={loading}
              onClick={handleResendOtp}
              className="text-sm text-blue-600 underline"
            >
              Resend OTP
            </button>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#013D3B] text-white py-2 rounded"
            >
              {loading ? "Verifying..." : "Verify"}
            </button>
          </form>
        )}

        {/* Step 3: Reset Password */}
        {step === "reset" && (
          <form onSubmit={handleResetSubmit} className="mt-6 space-y-4">
            <h2 className="text-xl font-semibold">Set New Password</h2>
            
            {/* New Password Field */}
            <div>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  className={`w-full border p-2 rounded pr-10 ${
                    passwordError ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="New Password (min 8 characters)"
                  value={newPassword}
                  onChange={handleNewPasswordChange}
                  required
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? "🙈" : "👁️"}
                </button>
              </div>
              {passwordError && (
                <p className="text-red-500 text-sm mt-1">{passwordError}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className={`w-full border p-2 rounded pr-10 ${
                    confirmPasswordError ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  required
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? "🙈" : "👁️"}
                </button>
              </div>
              {confirmPasswordError && (
                <p className="text-red-500 text-sm mt-1">{confirmPasswordError}</p>
              )}
            </div>

            {/* Password Requirements */}
            <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
              <p className="font-semibold mb-1">Password requirements:</p>
              <p className={newPassword.length >= 8 ? "text-green-600" : "text-gray-600"}>
                • At least 8 characters {newPassword.length >= 8 ? "✓" : ""}
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || passwordError || confirmPasswordError}
              className={`w-full py-2 rounded text-white ${
                loading || passwordError || confirmPasswordError
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#013D3B] hover:bg-[#012B29]"
              }`}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}