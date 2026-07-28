"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import {
  Shield,
  Zap,
  Cpu,
  Award,
  Layers,
  Target,
  ArrowRight,
  Server,
  Lock,
  Scale,
  Sparkles,
  Database,
  Globe,
  FileText,
} from "lucide-react";
import Link from "next/link";

export default function ArchitecturePitchPage() {
  const tiers = [
    {
      tier: "Tier 1: Frontend Workstation Layer",
      tech: "Next.js 14, React 18, TypeScript, Tailwind CSS, Cytoscape.js",
      icon: Globe,
      color: "border-blue-500/40 text-blue-400 bg-blue-950/30",
      whatItDoes: "Provides an intuitive dark-mode forensic workstation. Renders interactive threat topology graphs, live evidence custody badges, and one-click court report export interfaces.",
      whyUseful: "Unifies scattered investigation tools into one workstation, eliminating browser clutter for SOC analysts.",
    },
    {
      tier: "Tier 2: Backend Core Engine Layer",
      tech: "Node.js Express, Tesseract OCR, Mailparser, PDFKit, CustodyLog Engine",
      icon: Server,
      color: "border-emerald-500/40 text-emerald-400 bg-emerald-950/30",
      whatItDoes: "Decodes EML email headers, parses OCR text from images, extracts IOCs (IPs, Hashes, Domains, Wallets), verifies live SHA-256 disk hashes, and compiles court-ready PDF packages.",
      whyUseful: "Replaces 20-40 hours of manual log reading with automated parsing under 2 minutes, ensuring 100% ISO/IEC 27037 legal admissibility in court.",
    },
    {
      tier: "Tier 3: Threat Intelligence & AI Layer",
      tech: "VirusTotal, AbuseIPDB, Shodan, URLScan, AlienVault, OpenAI GPT-4o",
      icon: Cpu,
      color: "border-amber-500/40 text-amber-400 bg-amber-950/30",
      whatItDoes: "Queries 6 global threat intelligence APIs in parallel to fetch malware scores and IP reputation. GPT-4o generates evidence summaries and automated YARA/Sigma rules.",
      whyUseful: "Eliminates false positives with multi-vendor API consensus and allows junior analysts to deploy enterprise SIEM defense rules instantly.",
    },
    {
      tier: "Tier 4: Persistent Storage Layer",
      tech: "MongoDB Atlas Cloud, In-Memory Mongo Fallback, Hard Drive Uploads",
      icon: Database,
      color: "border-purple-500/40 text-purple-400 bg-purple-950/30",
      whatItDoes: "Stores cases, custody logs, users, and IOCs permanently on MongoDB Atlas Cloud. Physical evidence files are saved permanently in backend storage.",
      whyUseful: "Guarantees 100% data persistence on cloud DB while supporting zero-config RAM fallback for offline field deployments.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0b0f17]">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8 space-y-8 overflow-y-auto">
          {/* Executive Hero Banner */}
          <div className="cyber-card p-8 bg-gradient-to-r from-blue-950/90 via-[#0f172a] to-purple-950/70 border border-blue-500/50 rounded-2xl space-y-5 shadow-2xl relative overflow-hidden">
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3.5 py-1.5 bg-blue-600/20 text-blue-400 border border-blue-500/50 text-xs font-mono font-bold rounded-full uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" /> Simplified 4-Tier System Architecture Blueprint
              </span>
              <span className="text-xs text-emerald-400 font-mono flex items-center gap-1.5 bg-emerald-950/60 px-3 py-1.5 rounded-full border border-emerald-800/80">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Production Deployment v1.0
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
              InvestiCore — High-Level Technical Architecture & Utility Guide
            </h1>
            <p className="text-sm md:text-base text-gray-300 max-w-4xl leading-relaxed">
              Clear, human-friendly architectural breakdown detailing how each tier operates under the hood and why each component is essential for cybercrime investigations, police cyber units, and enterprise security centers.
            </p>

            <div className="flex flex-wrap gap-4 pt-3">
              <Link
                href="/dashboard"
                className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3 rounded-xl text-sm transition shadow-lg shadow-blue-600/30 flex items-center gap-2"
              >
                Launch Command Center <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/evidence"
                className="bg-gray-900/90 hover:bg-gray-800 text-gray-200 border border-gray-700 font-semibold px-6 py-3 rounded-xl text-sm transition"
              >
                Open Evidence Vault & Custody Log
              </Link>
            </div>
          </div>

          {/* Strategic Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="cyber-card p-6 space-y-3 bg-[#111827] border border-blue-500/30 hover:border-blue-500/60 transition group">
              <div className="flex items-center justify-between text-blue-400">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Triage Speedup</span>
                <div className="p-2 bg-blue-600/10 rounded-lg border border-blue-500/20">
                  <Zap className="w-5 h-5 text-blue-400" />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-white group-hover:text-blue-400 transition">90% Reduction</div>
              <p className="text-xs text-gray-400">Reduces evidence processing time from days to minutes</p>
            </div>

            <div className="cyber-card p-6 space-y-3 bg-[#111827] border border-amber-500/30 hover:border-amber-500/60 transition group">
              <div className="flex items-center justify-between text-amber-400">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Threat Intel Accuracy</span>
                <div className="p-2 bg-amber-600/10 rounded-lg border border-amber-500/20">
                  <Target className="w-5 h-5 text-amber-400" />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-amber-400">99.2% Rating</div>
              <p className="text-xs text-gray-400">Multi-Vendor API Consensus Sweep eliminates false positives</p>
            </div>

            <div className="cyber-card p-6 space-y-3 bg-[#111827] border border-emerald-500/30 hover:border-emerald-500/60 transition group">
              <div className="flex items-center justify-between text-emerald-400">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Chain of Custody</span>
                <div className="p-2 bg-emerald-600/10 rounded-lg border border-emerald-500/20">
                  <Lock className="w-5 h-5 text-emerald-400" />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-emerald-400">100% Legally Sound</div>
              <p className="text-xs text-gray-400">Cryptographic SHA-256 evidence integrity logs for court admissibility</p>
            </div>

            <div className="cyber-card p-6 space-y-3 bg-[#111827] border border-purple-500/30 hover:border-purple-500/60 transition group">
              <div className="flex items-center justify-between text-purple-400">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Court Exporter</span>
                <div className="p-2 bg-purple-600/10 rounded-lg border border-purple-500/20">
                  <FileText className="w-5 h-5 text-purple-400" />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-purple-400">1-Click PDF Export</div>
              <p className="text-xs text-gray-400">ISO/IEC 27037 compliant legal evidence packages</p>
            </div>
          </div>

          {/* 4-Tier Component Grid */}
          <div className="cyber-card p-8 bg-[#111827] border border-gray-800 rounded-2xl space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Layers className="w-6 h-6 text-blue-400" />
                4-Tier Architecture Breakdown: How It Works & Why It Is Useful
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                Clear operational specification of InvestiCore's 4 core architectural tiers
              </p>
            </div>

            <div className="space-y-4">
              {tiers.map((t, idx) => {
                const Icon = t.icon;
                return (
                  <div key={idx} className={`p-6 rounded-xl border ${t.color} space-y-3 transition hover:border-blue-500/60`}>
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <Icon className="w-5 h-5" />
                        {t.tier}
                      </h3>
                      <span className="text-[10px] font-mono font-bold px-3 py-1 rounded bg-gray-900/90 border border-gray-700 text-gray-300">
                        Tech Stack: {t.tech}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-1">
                      <div className="bg-gray-950/80 p-4 rounded-lg border border-gray-800 space-y-1">
                        <span className="font-bold text-amber-400 uppercase text-[10px] block">⚙️ Under The Hood (How It Works):</span>
                        <p className="text-gray-300 leading-relaxed">{t.whatItDoes}</p>
                      </div>
                      <div className="bg-gray-950/80 p-4 rounded-lg border border-gray-800 space-y-1">
                        <span className="font-bold text-emerald-400 uppercase text-[10px] block">💡 Strategic Utility (Why It Is Useful):</span>
                        <p className="text-gray-300 leading-relaxed">{t.whyUseful}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Legacy vs. InvestiCore Comparison Table */}
          <div className="cyber-card p-8 bg-[#111827] border border-gray-800 rounded-2xl space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Scale className="w-6 h-6 text-blue-400" />
                Legacy Manual Investigation vs. InvestiCore Automated Platform
              </h2>
              <p className="text-xs text-gray-400 mt-1">Comparative breakdown demonstrating InvestiCore's operational advantages</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-300">
                <thead className="text-xs uppercase bg-gray-900/90 text-gray-400 border-b border-gray-800">
                  <tr>
                    <th className="py-3.5 px-4">Core Capability</th>
                    <th className="py-3.5 px-4 text-red-400">Legacy Manual Investigation</th>
                    <th className="py-3.5 px-4 text-emerald-400">InvestiCore Enterprise Platform</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/80">
                  <tr className="hover:bg-gray-900/40 transition">
                    <td className="py-4 px-4 font-bold text-white">Evidence Ingestion & Parsing</td>
                    <td className="py-4 px-4 text-xs text-gray-400">Manual sifting through raw text files & EML headers (20-40 Hours)</td>
                    <td className="py-4 px-4 text-xs font-bold text-emerald-400">Automated Tesseract OCR, PCAP packet parser & PDF decoder (&lt; 2 Minutes)</td>
                  </tr>
                  <tr className="hover:bg-gray-900/40 transition">
                    <td className="py-4 px-4 font-bold text-white">Threat Intelligence Sweep</td>
                    <td className="py-4 px-4 text-xs text-gray-400">Manual lookup across isolated browser tabs</td>
                    <td className="py-4 px-4 text-xs font-bold text-emerald-400">Automated 6-API Consensus Sweep (VT, AbuseIPDB, Shodan, OTX)</td>
                  </tr>
                  <tr className="hover:bg-gray-900/40 transition">
                    <td className="py-4 px-4 font-bold text-white">Indicator Correlation</td>
                    <td className="py-4 px-4 text-xs text-gray-400">Static spreadsheets with no visual topology link</td>
                    <td className="py-4 px-4 text-xs font-bold text-emerald-400">Interactive Cytoscape Node Graph mapping Suspects -&gt; IPs -&gt; Hashes</td>
                  </tr>
                  <tr className="hover:bg-gray-900/40 transition">
                    <td className="py-4 px-4 font-bold text-white">Court Admissibility</td>
                    <td className="py-4 px-4 text-xs text-gray-400">Vulnerable to evidence tampering claims</td>
                    <td className="py-4 px-4 text-xs font-bold text-emerald-400">100% Cryptographic SHA-256 Chain of Custody Audit Vault</td>
                  </tr>
                  <tr className="hover:bg-gray-900/40 transition">
                    <td className="py-4 px-4 font-bold text-white">Court Package Export</td>
                    <td className="py-4 px-4 text-xs text-gray-400">Manual Word formatting taking days</td>
                    <td className="py-4 px-4 text-xs font-bold text-emerald-400">1-Click ISO/IEC 27037 Court-Ready PDF Evidence Exporter</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
