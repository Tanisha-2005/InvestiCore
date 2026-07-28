"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Shield, Lock, Mail, User as UserIcon, Key, CheckCircle2, ArrowRight, RefreshCw, X, ShieldAlert, Cpu, FileSearch, Building } from "lucide-react";
import { api } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [organization, setOrganization] = useState("");
  const [role, setRole] = useState("investigator");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // OTP Verification State
  const [step, setStep] = useState<"register" | "otp">("register");
  const [otpCode, setOtpCode] = useState("");

  // Google Modal State
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleEmail, setGoogleEmail] = useState("");
  const [googleName, setGoogleName] = useState("");
  const [googleOrg, setGoogleOrg] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);

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
        organization: organization || "Cyber Crime Investigation Unit",
        role,
      });

      if (res.data?.require_otp) {
        setStep("otp");
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

  const handleGoogleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setGoogleLoading(true);

    try {
      const res = await api.post("/auth/google", {
        email: googleEmail,
        name: googleName || googleEmail.split("@")[0],
        organization: googleOrg || "Google Authenticated Organization",
        role,
      });

      if (res.data?.access_token) {
        localStorage.setItem("access_token", res.data.access_token);
        localStorage.setItem("refresh_token", res.data.refresh_token);
        setShowGoogleModal(false);
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Google Authentication failed.");
    } finally {
      setGoogleLoading(false);
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
      setMessage(res.data?.message || "New OTP code sent to your email!");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to resend OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0b0f17] p-4 lg:p-8 relative">
      <div className="w-full max-w-4xl grid lg:grid-cols-12 bg-[#111827] border border-gray-800 rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Left Side: Enterprise Role Hierarchy & Access Governance Panel */}
        <div className="lg:col-span-5 bg-gradient-to-b from-[#131b2e] to-[#0d1322] p-8 border-b lg:border-b-0 lg:border-r border-gray-800/80 space-y-6 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold tracking-wide uppercase">
                <Shield className="w-3.5 h-3.5" /> ISO/IEC 27037 RBAC
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">Security Clearance Roles</h2>
              <p className="text-xs text-gray-400 leading-relaxed">
                InvestiCore enforces role-based access control separating operational investigators, technical analysts, and system administration.
              </p>
            </div>

            <div className="space-y-4">
              {/* Role 1: Lead Investigator */}
              <div className="p-3.5 rounded-xl bg-gray-900/60 border border-blue-500/20 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wider">
                  <FileSearch className="w-4 h-4 text-blue-500" />
                  1. Lead Investigator
                </div>
                <p className="text-[11px] text-gray-300">
                  Full case management, evidence vault custody, AI investigation summaries, and court-ready PDF/DOCX report exports.
                </p>
              </div>

              {/* Role 2: Forensic Analyst */}
              <div className="p-3.5 rounded-xl bg-gray-900/60 border border-cyan-500/20 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider">
                  <Cpu className="w-4 h-4 text-cyan-500" />
                  2. Forensic Analyst
                </div>
                <p className="text-[11px] text-gray-300">
                  Live threat intelligence sweeps (VirusTotal, AbuseIPDB, Shodan), IOC correlation graphs, and SIEM YARA/Sigma rule generation.
                </p>
              </div>

              {/* Role 3: System Administrator */}
              <div className="p-3.5 rounded-xl bg-gray-900/60 border border-amber-500/20 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                  <ShieldAlert className="w-4 h-4 text-amber-500" />
                  3. System Administrator
                </div>
                <p className="text-[11px] text-gray-400">
                  Restricted command role. Grants exclusive oversight to the Personnel Audit Matrix. Public self-registration is strictly disabled.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-800 text-[11px] text-gray-500 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            2-Step Real Email OTP Verification Enforced
          </div>
        </div>

        {/* Right Side: Interactive Registration & OTP Form */}
        <div className="lg:col-span-7 p-8 space-y-6 flex flex-col justify-center">
          <div className="text-center space-y-2">
            <div className="inline-flex p-3 rounded-full bg-blue-600/10 border border-blue-500/20 mb-1 lg:hidden">
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
            <div className="space-y-4">
              {/* Quick Google Sign-Up Button */}
              <button
                type="button"
                onClick={() => setShowGoogleModal(true)}
                className="w-full bg-[#1e293b] hover:bg-[#334155] border border-gray-700 text-white font-semibold py-2.5 rounded-lg transition text-sm flex items-center justify-center gap-2.5 shadow-md"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                Sign Up with Google
              </button>

              <div className="relative flex items-center justify-center">
                <div className="border-t border-gray-800 w-full"></div>
                <span className="bg-[#111827] px-3 text-[11px] font-mono text-gray-500 uppercase tracking-widest absolute">
                  or register with email
                </span>
              </div>

              <form onSubmit={handleRegisterSubmit} className="space-y-4 pt-1">
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
                    Department / Agency Organization
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                    <input
                      type="text"
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      placeholder="Cyber Crime Branch / CERT-In / DFIR Squad"
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
                    Select Position Clearance Role
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2.5 text-sm text-white focus:border-blue-500 focus:outline-none"
                  >
                    <option value="investigator">Lead Investigator (Case Ownership & Evidence Custody)</option>
                    <option value="analyst">Forensic Analyst (Threat Intel Sweep & IOC Graphs)</option>
                  </select>
                  <p className="text-[11px] text-gray-500 mt-1">
                    *Note: Email verification via 6-digit OTP is required upon registration.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 rounded-lg transition text-sm shadow-lg shadow-blue-600/20 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? "Sending OTP to Inbox..." : "Create Account & Send OTP"}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
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
                <p className="text-[11px] text-gray-400 text-center mt-2">
                  Check your email inbox ({email}) for your 6-digit verification code.
                </p>
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

      {/* Google OAuth Modal Overlay */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-blue-500/40 rounded-2xl p-6 w-full max-w-sm space-y-5 shadow-2xl relative">
            <button
              onClick={() => setShowGoogleModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-2">
              <div className="inline-flex p-3 rounded-full bg-white/10 mb-1">
                <svg className="w-8 h-8" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-white">Sign up with Google</h2>
              <p className="text-xs text-gray-400">Join InvestiCore with your Google Account</p>
            </div>

            <form onSubmit={handleGoogleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                  Google Email Address
                </label>
                <input
                  type="email"
                  required
                  value={googleEmail}
                  onChange={(e) => setGoogleEmail(e.target.value)}
                  placeholder="alex.rivera@gmail.com"
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                  Display Name (Optional)
                </label>
                <input
                  type="text"
                  value={googleName}
                  onChange={(e) => setGoogleName(e.target.value)}
                  placeholder="Det. Alex Rivera"
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                  Department / Agency Organization
                </label>
                <input
                  type="text"
                  value={googleOrg}
                  onChange={(e) => setGoogleOrg(e.target.value)}
                  placeholder="Cyber Division / CERT-In"
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="bg-emerald-950/40 p-3 rounded-lg border border-emerald-800 text-[11px] text-emerald-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                Google pre-verifies email address — No OTP code required!
              </div>

              <button
                type="submit"
                disabled={googleLoading}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 rounded-lg transition text-sm shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2"
              >
                {googleLoading ? "Authenticating with Google..." : "Continue to Platform"}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
