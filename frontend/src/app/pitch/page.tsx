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
  FileSearch,
  Share2,
  CheckCircle2,
  HelpCircle,
  Wrench,
  Search,
  Activity,
  Terminal,
} from "lucide-react";
import Link from "next/link";

export default function ArchitecturePitchPage() {
  // Step-by-step pipeline stages
  const pipelineSteps = [
    {
      step: "01",
      name: "Evidence Ingestion & Parsing",
      tool: "Tesseract OCR, Mailparser, PCAP Decoder",
      desc: "Upload screenshots, EML emails, PCAP captures, or PDFs. System decodes raw text, headers, and streams.",
      icon: FileSearch,
      color: "border-blue-500/50 bg-blue-950/40 text-blue-400",
    },
    {
      step: "02",
      name: "Cryptographic Hash Baseline",
      tool: "Node.js Crypto (SHA-256, MD5)",
      desc: "Generates byte-level SHA-256 & MD5 hash baselines and records an immutable Chain of Custody entry.",
      icon: Lock,
      color: "border-emerald-500/50 bg-emerald-950/40 text-emerald-400",
    },
    {
      step: "03",
      name: "Automatic IOC Extraction",
      tool: "Regex Engine (IPs, Domains, Wallets)",
      desc: "Automatically extracts IPv4/v6, Domains, URLs, Hashes, and Ransomware Crypto Wallets from parsed content.",
      icon: Search,
      color: "border-purple-500/50 bg-purple-950/40 text-purple-400",
    },
    {
      step: "04",
      name: "Live Threat Intel Sweep",
      tool: "VirusTotal, AbuseIPDB, Shodan, OTX",
      desc: "Queries 6 global threat databases in parallel to aggregate malware scores and IP abuse confidence ratings.",
      icon: Shield,
      color: "border-amber-500/50 bg-amber-950/40 text-amber-400",
    },
    {
      step: "05",
      name: "AI & Topology Correlation",
      tool: "Cytoscape.js & OpenAI GPT-4o",
      desc: "Visualizes threat actor node graph and generates AI evidence summaries with YARA & Sigma rules.",
      icon: Share2,
      color: "border-pink-500/50 bg-pink-950/40 text-pink-400",
    },
    {
      step: "06",
      name: "Court PDF Evidence Package",
      tool: "PDFKit & ISO/IEC 27037 Seal",
      desc: "Compiles complete case overview, hash tables, custody audit logs, and digital seals into a downloadable PDF.",
      icon: Award,
      color: "border-cyan-500/50 bg-cyan-950/40 text-cyan-400",
    },
  ];

  // Tools & Technologies Showcase
  const toolsShowcase = [
    {
      category: "Frontend Workstation",
      icon: Globe,
      color: "border-blue-500/40 text-blue-400",
      items: [
        { name: "Next.js 14 & React 18", use: "Fast, modern web UI app router" },
        { name: "Tailwind CSS", use: "Sleek dark-mode cyber aesthetic" },
        { name: "Cytoscape.js", use: "Interactive threat node graph visualizer" },
        { name: "Lucide React", use: "High-contrast forensic workstation icons" },
      ],
    },
    {
      category: "Backend Forensic Engine",
      icon: Server,
      color: "border-emerald-500/40 text-emerald-400",
      items: [
        { name: "Node.js & Express.js", use: "High-throughput API gateway & controllers" },
        { name: "Tesseract.js OCR", use: "Reads text from screenshots & image files" },
        { name: "Mailparser", use: "Decodes EML email headers, SPF/DMARC, and hops" },
        { name: "PDFKit", use: "Generates court-admissible PDF evidence packages" },
      ],
    },
    {
      category: "Threat Intel & AI APIs",
      icon: Cpu,
      color: "border-amber-500/40 text-amber-400",
      items: [
        { name: "VirusTotal API", use: "Scans hashes & domains against 70+ AV engines" },
        { name: "AbuseIPDB API", use: "Checks IP reputation & abuse confidence score" },
        { name: "Shodan & URLScan", use: "Scans open ports, banners, and website DOMs" },
        { name: "OpenAI (GPT-4o)", use: "Grounded evidence summaries, YARA & Sigma rules" },
      ],
    },
    {
      category: "Database & File Vault",
      icon: Database,
      color: "border-purple-500/40 text-purple-400",
      items: [
        { name: "MongoDB Atlas Cloud", use: "Permanent cloud storage for cases & logs" },
        { name: "MongoMemoryServer", use: "RAM database fallback for zero-config offline use" },
        { name: "Disk Storage (/uploads)", use: "Permanent local hard drive storage for evidence files" },
        { name: "CustodyLog Mongoose Schema", use: "Immutable audit logging for court admissibility" },
      ],
    },
  ];

  // Why Useful / Problem-Solution Benefits
  const whyUsefulPoints = [
    {
      title: "⏱️ Saves 90%+ Investigation Time",
      desc: "Instead of spending 20-40 hours manually copying IPs from logs and checking isolated websites, InvestiCore parses files and queries threat feeds in under 2 minutes.",
    },
    {
      title: "⚖️ 100% Court-Admissible Evidence",
      desc: "SHA-256 live disk hash verification and immutable Chain of Custody audit logs prevent evidence tampering claims in court under ISO/IEC 27037 guidelines.",
    },
    {
      title: "🛡️ Zero False Positives with API Consensus",
      desc: "Combines 6 threat intelligence sources (VirusTotal, AbuseIPDB, Shodan, AlienVault) so security analysts get a unified threat score instead of guessing.",
    },
    {
      title: "🤖 Instant SIEM & Endpoint Protection",
      desc: "AI automatically generates YARA malware scanning rules and Sigma log alert rules, allowing junior analysts to deploy enterprise defenses without delay.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0b0f17]">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8 space-y-8 overflow-y-auto">
          {/* Hero Section - Plain English Project Overview */}
          <div className="cyber-card p-8 bg-gradient-to-r from-blue-950/90 via-[#0f172a] to-purple-950/70 border border-blue-500/50 rounded-2xl space-y-5 shadow-2xl relative overflow-hidden">
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3.5 py-1.5 bg-blue-600/20 text-blue-400 border border-blue-500/50 text-xs font-mono font-bold rounded-full uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" /> All-In-One Cybercrime Forensic Platform Overview
              </span>
              <span className="text-xs text-emerald-400 font-mono flex items-center gap-1.5 bg-emerald-950/60 px-3 py-1.5 rounded-full border border-emerald-800/80">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Live Production Platform v1.0
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
              InvestiCore — Project Overview & System Architecture
            </h1>
            <p className="text-sm md:text-base text-gray-300 max-w-4xl leading-relaxed">
              <strong className="text-white font-bold">InvestiCore</strong> is an all-in-one digital forensic workstation and live threat intelligence platform built for Police Cyber Units, CERT Teams, and Security Operations Centers (SOC). It takes raw evidence (emails, screenshots, logs, network captures), automatically extracts indicators of compromise (IOCs), queries global threat feeds, visualizes threat actor networks, and exports court-admissible PDF packages.
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

          {/* Section 1: How Evidence Flows (Step-by-Step Graph Pipeline) */}
          <div className="cyber-card p-8 bg-[#111827] border border-gray-800 rounded-2xl space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Activity className="w-6 h-6 text-blue-400" />
                How InvestiCore Works: Step-by-Step Evidence Pipeline
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                Visual flow of how raw uploaded evidence transforms into threat intelligence and court-ready legal evidence
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {pipelineSteps.map((s, idx) => {
                const Icon = s.icon;
                return (
                  <div key={idx} className={`p-4 rounded-xl border ${s.color} space-y-2 flex flex-col justify-between transition hover:scale-105`}>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-gray-400">STAGE {s.step}</span>
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className="font-bold text-white text-sm leading-snug">{s.name}</h3>
                      <div className="text-[10px] font-mono text-gray-400 border-t border-gray-800/80 pt-1.5">
                        {s.tool}
                      </div>
                      <p className="text-[11px] text-gray-300 leading-relaxed pt-1">{s.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2: Complete Tools & Technology Showcase */}
          <div className="cyber-card p-8 bg-[#111827] border border-gray-800 rounded-2xl space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Wrench className="w-6 h-6 text-emerald-400" />
                Tools & Technologies Powering InvestiCore
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                Complete breakdown of libraries, frameworks, and APIs used in this platform and their specific role
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {toolsShowcase.map((t, idx) => {
                const Icon = t.icon;
                return (
                  <div key={idx} className={`p-6 rounded-xl border ${t.color} bg-gray-950/60 space-y-4`}>
                    <div className="flex items-center gap-2 border-b border-gray-800 pb-3">
                      <Icon className="w-5 h-5" />
                      <h3 className="font-bold text-white text-sm">{t.category}</h3>
                    </div>

                    <div className="space-y-3">
                      {t.items.map((item, iIdx) => (
                        <div key={iIdx} className="space-y-0.5">
                          <span className="font-mono font-bold text-xs text-white block">{item.name}</span>
                          <span className="text-[11px] text-gray-400 block leading-tight">{item.use}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 3: Why This Project Is Useful (Real-World Impact) */}
          <div className="cyber-card p-8 bg-[#111827] border border-gray-800 rounded-2xl space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Award className="w-6 h-6 text-amber-400" />
                Why InvestiCore Is Essential For Cybercrime Investigation
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                Real-world operational benefits for police cyber cells, CERT teams, and enterprise incident response
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              {whyUsefulPoints.map((p, idx) => (
                <div key={idx} className="bg-gray-900 p-5 rounded-xl border border-gray-800 space-y-2 hover:border-amber-500/50 transition">
                  <h3 className="font-bold text-amber-400 text-sm">{p.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Legacy vs InvestiCore Comparison Table */}
          <div className="cyber-card p-8 bg-[#111827] border border-gray-800 rounded-2xl space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Scale className="w-6 h-6 text-purple-400" />
                Legacy Manual Investigation vs. InvestiCore Platform
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
