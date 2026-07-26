"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { Briefcase, ShieldAlert, FileText, AlertTriangle, Activity, ArrowUpRight } from "lucide-react";
import { api } from "@/lib/api";
import Link from "next/link";

export default function DashboardPage() {
  const [cases, setCases] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({ totalCases: 0, activeCases: 0, closedCases: 0, totalIOCs: 0, threatAlerts: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [casesRes, statsRes] = await Promise.all([
        api.get("/cases/").catch(() => ({ data: [] })),
        api.get("/cases/stats/dashboard").catch(() => ({ data: null }))
      ]);

      const casesList = Array.isArray(casesRes.data) ? casesRes.data : (casesRes.data?.cases || []);
      setCases(casesList);

      if (statsRes.data) {
        setStats(statsRes.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const safeCases = Array.isArray(cases) ? cases : [];
  const activeCasesCount = stats?.activeCases || safeCases.filter((c) => c.status === "open" || c.status === "active" || c.status === "investigating").length;
  const criticalCasesCount = stats?.threatAlerts || safeCases.filter((c) => c.priority === "critical" || c.priority === "high").length;
  const totalIOCsCount = stats?.totalIOCs ?? 0;

  return (
    <div className="min-h-screen bg-[#0b0f17]">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8 space-y-8 overflow-y-auto">
          {/* Header Banner */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">Investigation Command Center</h1>
              <p className="text-sm text-gray-400">Real-time Digital Forensics & Threat Intelligence Feed</p>
            </div>
            <Link
              href="/cases"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-4 py-2.5 rounded-lg shadow-lg shadow-blue-600/20 transition"
            >
              <Briefcase className="w-4 h-4" />
              New Investigation Case
            </Link>
          </div>

          {/* Metric Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="cyber-card p-5 space-y-2">
              <div className="flex items-center justify-between text-gray-400">
                <span className="text-xs font-semibold uppercase tracking-wider">Active Investigations</span>
                <Briefcase className="w-5 h-5 text-blue-400" />
              </div>
              <div className="text-3xl font-bold text-white">{activeCasesCount}</div>
              <div className="text-xs text-blue-400 font-medium">Cases currently open</div>
            </div>

            <div className="cyber-card p-5 space-y-2">
              <div className="flex items-center justify-between text-gray-400">
                <span className="text-xs font-semibold uppercase tracking-wider">Critical Threats</span>
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </div>
              <div className="text-3xl font-bold text-red-400">{criticalCasesCount}</div>
              <div className="text-xs text-red-400 font-medium">High priority flags</div>
            </div>

            <div className="cyber-card p-5 space-y-2">
              <div className="flex items-center justify-between text-gray-400">
                <span className="text-xs font-semibold uppercase tracking-wider">Indexed IOCs</span>
                <ShieldAlert className="w-5 h-5 text-amber-400" />
              </div>
              <div className="text-3xl font-bold text-amber-400">{totalIOCsCount}</div>
              <div className="text-xs text-amber-400 font-medium font-mono">Real-time DB IOCs</div>
            </div>

            <div className="cyber-card p-5 space-y-2">
              <div className="flex items-center justify-between text-gray-400">
                <span className="text-xs font-semibold uppercase tracking-wider">Threat Intel Feeds</span>
                <Activity className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="text-3xl font-bold text-emerald-400">6 Connected</div>
              <div className="text-xs text-emerald-400 font-medium">VT, AbuseIPDB, Shodan, OTX...</div>
            </div>
          </div>

          {/* Active Cases Table */}
          <div className="cyber-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">Active Case Queue</h2>
              <Link href="/cases" className="text-xs text-blue-400 hover:underline flex items-center gap-1">
                View All Cases <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>

            {loading ? (
              <div className="text-sm text-gray-500 py-8 text-center animate-pulse">Loading active cases...</div>
            ) : safeCases.length === 0 ? (
              <div className="text-sm text-gray-500 py-8 text-center">No active investigation cases. Create one to begin.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-300">
                  <thead className="text-xs uppercase bg-gray-900/60 text-gray-400 border-b border-gray-800">
                    <tr>
                      <th className="py-3 px-4">Case #</th>
                      <th className="py-3 px-4">Title</th>
                      <th className="py-3 px-4">Priority</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Risk Score</th>
                      <th className="py-3 px-4">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {safeCases.slice(0, 5).map((c) => (
                      <tr key={c.id} className="hover:bg-gray-900/40 transition">
                        <td className="py-3 px-4 font-mono font-medium text-blue-400">{c.case_number}</td>
                        <td className="py-3 px-4 font-medium text-white">{c.title}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 text-xs font-semibold rounded ${
                              c.priority === "critical"
                                ? "bg-red-950 text-red-400 border border-red-800"
                                : c.priority === "high"
                                ? "bg-amber-950 text-amber-400 border border-amber-800"
                                : "bg-gray-800 text-gray-300"
                            }`}
                          >
                            {c.priority?.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3 px-4 capitalize">{c.status}</td>
                        <td className="py-3 px-4 font-bold text-amber-400">{c.risk_score}/100</td>
                        <td className="py-3 px-4">
                          <Link
                            href={`/cases/${c.id}`}
                            className="text-xs bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white px-3 py-1 rounded transition border border-blue-500/30"
                          >
                            Open Case
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
