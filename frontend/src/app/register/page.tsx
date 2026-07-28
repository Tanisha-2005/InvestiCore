"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Shield, Lock, Mail, User as UserIcon, Key, CheckCircle2, ArrowRight, RefreshCw } from "lucide-react";
import { api } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("investigator");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // OTP Verification State
  const [step, setStep] = useState<"register" | "otp">("register");
  const [otpCode, setOtpCode] = useState("");
  const [debugOtp, setDebugOtp] = useState("");

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await api.post("/auth/register", {
        email,
        full_name: fullName,
        password,
        role,
      });

      if (res.data?.require_otp) {
        setStep("otp");
        if (res.data.otp_debug) {
          setDebugOtp(res.data.otp_debug);
        }
        setMessage(res.data.message || `An OTP verification code was sent to ${email}`);
      } else {
        router.push("/login");
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || err.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await api.post("/auth/verify-otp", {
        email,
        otp: otpCode,
      });

      if (res.data?.access_token) {
        localStorage.setItem("access_token", res.data.access_token);
        localStorage.setItem("refresh_token", res.data.refresh_token);
        router.push("/dashboard");
      } else {
        router.push("/login");
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || err.response?.data?.message || "OTP verification failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await api.post("/auth/resend-otp", { email });
      if (res.data?.otp_debug) {
        setDebugOtp(res.data.otp_debug);
      }
      setMessage(res.data?.message || "New OTP code sent to your email!");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to resend OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0b0f17] p-4">
      <div className="w-full max-w-md bg-[#111827] border border-gray-800 rounded-xl p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-full bg-blue-600/10 border border-blue-500/20 mb-2">
            <Shield className="w-8 h-8 text-blue-500" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            {step === "register" ? "Create Personnel Account" : "Verify Email OTP"}
          </h1>
          <p className="text-sm text-gray-400">
            {step === "register"
              ? "Join the Cybercrime Threat Platform"
              : `Enter the 6-digit code sent to ${email}`}
          </p>
        </div>

        {error && (
          <div className="p-3 text-xs bg-red-950/50 border border-red-800 text-red-300 rounded-lg text-center font-medium">
            {error}
          </div>
        )}

        {message && (
          <div className="p-3 text-xs bg-emerald-950/50 border border-emerald-800 text-emerald-300 rounded-lg text-center font-medium flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            {message}
          </div>
        )}

        {step === "register" ? (
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                Full Name
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Det. Alex Rivera"
                  className="w-full bg-gray-900 border border-gray-800 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                Personnel Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="arivera@cyberunit.gov"
                  className="w-full bg-gray-900 border border-gray-800 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-gray-900 border border-gray-800 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                Position Assignment
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2.5 text-sm text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="investigator">Lead Investigator</option>
                <option value="analyst">Forensic Analyst</option>
              </select>
              <p className="text-[11px] text-gray-500 mt-1">
                *Note: Email verification via OTP is required upon registration.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 rounded-lg transition text-sm shadow-lg shadow-blue-600/20 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? "Generating OTP..." : "Create Account & Send OTP"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1 text-center">
                Enter 6-Digit Email Verification Code
              </label>
              <div className="relative">
                <Key className="absolute left-3 top-3 w-5 h-5 text-amber-400" />
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="123456"
                  className="w-full bg-gray-900 border border-amber-500/60 rounded-lg text-center font-mono text-xl tracking-widest py-3 text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              {debugOtp && (
                <div className="mt-3 p-2.5 bg-amber-950/40 border border-amber-800/80 rounded-lg text-center">
                  <span className="text-[11px] text-amber-300 font-mono block">
                    🔑 Testing Mode OTP Code: <strong className="text-amber-400 text-sm font-bold">{debugOtp}</strong>
                  </span>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2.5 rounded-lg transition text-sm shadow-lg shadow-emerald-600/20 disabled:opacity-50"
            >
              {loading ? "Verifying OTP..." : "Verify OTP & Complete Registration"}
            </button>

            <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-gray-800">
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={loading}
                className="text-amber-400 hover:underline flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" /> Resend OTP
              </button>
              <button
                type="button"
                onClick={() => setStep("register")}
                className="text-gray-400 hover:underline"
              >
                Change Email
              </button>
            </div>
          </form>
        )}

        <div className="text-center text-xs text-gray-400">
          Already registered?{" "}
          <Link href="/login" className="text-blue-400 hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
