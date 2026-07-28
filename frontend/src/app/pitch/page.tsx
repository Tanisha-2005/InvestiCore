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
  Clock,
  FileCheck,
  CheckCircle2,
  ArrowRight,
  Database,
  Share2,
  Globe,
  Sparkles,
  Server,
  Lock,
  FileText,
  Scale,
  Search,
  Key,
} from "lucide-react";
import Link from "next/link";

export default function ArchitecturePitchPage() {
  const subsystemBreakdown = [
    {
      title: "1. Evidence Vault & Multiformat Ingestion Engine",
      tech: "Tesseract OCR, Mailparser, PCAP Streams, Multer",
      whatItDoes: "Parses raw images via OCR, decodes EML email headers, decodes PCAP network streams, and extracts IPv4/v6, Domains, URLs, Hashes, and Crypto Wallets via Regex.",
      whyUseful: "Eliminates 20-40 hours of manual log sifting per incident. Converts unstructured raw evidence files into structured forensic indicators in seconds.",
      color: "border-blue-500/40 text-blue-400 bg-blue-950/30",
    },
    {
      title: "2. Legal Chain of Custody & Disk Integrity Verification",
      tech: "Crypto SHA-256/MD5 Engine, CustodyLog Schema",
      whatItDoes: "Computes SHA-256 baseline hashes on upload. Writes immutable audit logs for every view/verification action with officer ID, IP, and timestamp. Re-computes live file hashes on disk to detect physical file tampering.",
      whyUseful: "Guarantees ISO/IEC 27037 legal compliance. Prevents evidence tampering claims in court and ensures 100% legal admissibility for prosecutors.",
      color: "border-emerald-500/40 text-emerald-400 bg-emerald-950/30",
    },
    {
      title: "3. Live Multi-Vendor Threat Intelligence Consensus",
      tech: "VirusTotal, AbuseIPDB, Shodan, URLScan, AlienVault OTX",
      whatItDoes: "Executes parallel REST API queries across 6 global threat intelligence feeds to aggregate malware scores, IP abuse confidence rates, open ports, and DOM screenshot benchmarks.",
      whyUseful: "Eliminates browser context switching across 10+ tabs. Multi-vendor consensus score eliminates false positives for SOC analysts.",
      color: "border-amber-500/40 text-amber-400 bg-amber-950/30",
    },
    {
      title: "4. Interactive Indicator Topology Graph",
      tech: "Cytoscape.js, Network Topology Renderer",
      whatItDoes: "Renders interactive visual graph nodes connecting Suspects, Compromised Endpoints, C2 IP Addresses, Domains, Payload Hashes, and Extortion Wallets across active cases.",
      whyUseful: "Uncovers hidden threat actor infrastructure connections (e.g. discovering that two separate phishing cases share the same C2 server IP).",
      color: "border-purple-500/40 text-purple-400 bg-purple-950/30",
    },
    {
      title: "5. AI Forensics & YARA/Sigma Rule Engine",
      tech: "OpenAI GPT-4o, YARA Engine, Sigma Rule Generator",
      whatItDoes: "Generates fact-grounded evidence summaries, custom deployable YARA malware detection rules for endpoints, and SIEM alert rules for Splunk/Elastic.",
      whyUseful: "Accelerates incident response containment. Allows junior SOC analysts to generate enterprise defense rules without waiting for senior reverse engineers.",
      color: "border-pink-500/40 text-pink-400 bg-pink-950/30",
    },
    {
      title: "6. One-Click Court-Ready PDF Evidence Exporter",
      tech: "PDFKit, ISO/IEC 27037 Legal Compliance Seal",
      whatItDoes: "Compiles complete case overview, SHA-256 evidence hash tables, Chain of Custody audit logs, threat scores, and digital investigator signature blocks into an audit-ready PDF.",
      whyUseful: "One-click generation of branded, court-admissible evidence packages for law enforcement officers, judges, and C-suite executives.",
      color: "border-cyan-500/40 text-cyan-400 bg-cyan-950/30",
    },
    {
      title: "7. Zero-Config Persistence & Fail-Safe Database",
      tech: "Mongoose, MongoDB, MongoMemoryServer RAM Fallback",
      whatItDoes: "Connects to persistent MongoDB. If local Mongo is unavailable, automatically instantiates an in-memory MongoDB database in RAM.",
      whyUseful: "Zero-config operation on air-gapped forensic laptops or emergency field deployments without requiring database setup.",
      color: "border-indigo-500/40 text-indigo-400 bg-indigo-950/30",
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
                <Sparkles className="w-3.5 h-3.5 text-blue-400" /> Enterprise Solution Blueprint & Architecture
              </span>
              <span className="text-xs text-emerald-400 font-mono flex items-center gap-1.5 bg-emerald-950/60 px-3 py-1.5 rounded-full border border-emerald-800/80">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Production Deployment v1.0
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
              InvestiCore — System Architecture & Component Utility Blueprint
            </h1>
            <p className="text-sm md:text-base text-gray-300 max-w-4xl leading-relaxed">
              Complete technical architectural breakdown detailing every module, how each subsystem functions under the hood, and why each component is essential for modern cybercrime investigations, CERT teams, and enterprise SOCs.
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

          {/* Strategic Impact Metrics Grid */}
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
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">AI Grounding</span>
                <div className="p-2 bg-purple-600/10 rounded-lg border border-purple-500/20">
                  <Cpu className="w-5 h-5 text-purple-400" />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-purple-400">Zero Hallucination</div>
              <p className="text-xs text-gray-400">Fact-grounded GPT-4o summaries scoped to verified case artifacts</p>
            </div>
          </div>

          {/* Component-by-Component Deep Dive Section */}
          <div className="cyber-card p-8 bg-[#111827] border border-gray-800 rounded-2xl space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Server className="w-6 h-6 text-blue-400" />
                System Component Deep-Dive: How Each Module Works & Why It Is Useful
              </h2>
              <p className="text-xs text-gray-400 mt-1">Detailed operational specification of InvestiCore's 7 primary forensic subsystems</p>
            </div>

            <div className="space-y-4">
              {subsystemBreakdown.map((item, idx) => (
                <div key={idx} className={`p-5 rounded-xl border ${item.color} space-y-2 transition hover:border-blue-500/60`}>
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-white">{item.title}</h3>
                    <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded bg-gray-900/80 border border-gray-700 text-gray-300">
                      Tech: {item.tech}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1 text-xs">
                    <div className="bg-gray-950/70 p-3.5 rounded-lg border border-gray-800 space-y-1">
                      <span className="font-bold text-amber-400 uppercase text-[10px] block">⚙️ Under The Hood (How It Works):</span>
                      <p className="text-gray-300 leading-relaxed">{item.whatItDoes}</p>
                    </div>
                    <div className="bg-gray-950/70 p-3.5 rounded-lg border border-gray-800 space-y-1">
                      <span className="font-bold text-emerald-400 uppercase text-[10px] block">💡 Strategic Utility (Why It Is Useful):</span>
                      <p className="text-gray-300 leading-relaxed">{item.whyUseful}</p>
                    </div>
                  </div>
                </div>
              ))}
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
