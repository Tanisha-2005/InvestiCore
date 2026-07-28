"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Shield, Lock, User as UserIcon, Key } from "lucide-react";
import { api } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [totpCode, setTotpCode] = useState("");
  const [require2FA, setRequire2FA] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", {
        email,
        password,
        totp_code: totpCode || null,
      });

      localStorage.setItem("access_token", res.data.access_token);
      localStorage.setItem("refresh_token", res.data.refresh_token);
      router.push("/dashboard");
    } catch (err: any) {
      if (err.response?.status === 401 && err.response?.data?.detail?.includes("2FA")) {
        setRequire2FA(true);
        setError("2FA Authentication required. Enter TOTP code.");
      } else {
        setError(err.response?.data?.detail || "Authentication failed.");
      }
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
          <h1 className="text-2xl font-bold tracking-tight text-white">Personnel & Admin Portal</h1>
          <p className="text-sm text-gray-400">AI Cyber Crime Platform Authentication</p>
        </div>

        {error && (
          <div className="p-3 text-xs bg-red-950/50 border border-red-800 text-red-300 rounded-lg text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
              Username or Personnel Email
            </label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="AdminInvestiCore or email@investicore.gov"
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

          {require2FA && (
            <div>
              <label className="block text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
                2FA Authenticator Code
              </label>
              <div className="relative">
                <Key className="absolute left-3 top-3 w-4 h-4 text-amber-500" />
                <input
                  type="text"
                  maxLength={6}
                  value={totpCode}
                  onChange={(e) => setTotpCode(e.target.value)}
                  placeholder="6-digit code"
                  className="w-full bg-gray-900 border border-amber-500/50 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 rounded-lg transition text-sm shadow-lg shadow-blue-600/20 disabled:opacity-50"
          >
            {loading ? "Authenticating..." : "Sign In to Platform"}
          </button>
        </form>

        <div className="text-center text-xs text-gray-400">
          New Personnel?{" "}
          <Link href="/register" className="text-blue-400 hover:underline">
            Register Personnel Account
          </Link>
        </div>
      </div>
    </div>
  );
}
