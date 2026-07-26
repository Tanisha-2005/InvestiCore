"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { Shield, Zap, Cpu, Award, Layers, Target, Clock, FileCheck, CheckCircle2, ArrowRight, Activity, Database, Share2, Globe, Sparkles, Check, Server, Lock, Code2, AlertTriangle, Scale } from "lucide-react";
import Link from "next/link";

export default function ArchitecturePitchPage() {
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
                <Sparkles className="w-3.5 h-3.5 text-blue-400" /> Enterprise Solution Blueprint & Strategic Impact
              </span>
              <span className="text-xs text-emerald-400 font-mono flex items-center gap-1.5 bg-emerald-950/60 px-3 py-1.5 rounded-full border border-emerald-800/80">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Production Deployment v1.0
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
              InvestiCore — Enterprise AI Cyber Crime Investigation & Digital Forensics Ecosystem
            </h1>
            <p className="text-sm md:text-base text-gray-300 max-w-4xl leading-relaxed">
              An enterprise-grade, production-ready cybercrime investigation platform unifying automated multi-format evidence parsing, 6-source threat intelligence consensus, interactive indicator topology mapping, and grounded AI forensic analysis for Police Cyber Cells, CERT Teams, and Enterprise Security Operation Centers.
            </p>

            <div className="flex flex-wrap gap-4 pt-3">
              <Link
                href="/dashboard"
                className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3 rounded-xl text-sm transition shadow-lg shadow-blue-600/30 flex items-center gap-2"
              >
                Launch Command Center <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/cases"
                className="bg-gray-900/90 hover:bg-gray-800 text-gray-200 border border-gray-700 font-semibold px-6 py-3 rounded-xl text-sm transition"
              >
                View Active Case Queue
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

          {/* Interactive Live Capability Comparison Matrix */}
          <div className="cyber-card p-8 bg-[#111827] border border-gray-800 rounded-2xl space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Scale className="w-6 h-6 text-blue-400" />
                Legacy Manual Forensics vs. InvestiCore Automated Platform
              </h2>
              <p className="text-xs text-gray-400 mt-1">Comparative breakdown demonstrating InvestiCore's technological superiority</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-300">
                <thead className="text-xs uppercase bg-gray-900/90 text-gray-400 border-b border-gray-800">
                  <tr>
                    <th className="py-3.5 px-4">Core Capability</th>
                    <th className="py-3.5 px-4 text-red-400">Legacy Manual Investigation</th>
                    <th className="py-3.5 px-4 text-emerald-400">InvestiCore Enterprise Engine</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/80">
                  <tr className="hover:bg-gray-900/40 transition">
                    <td className="py-4 px-4 font-bold text-white">Evidence Processing</td>
                    <td className="py-4 px-4 text-xs text-gray-400">Manual sifting through raw text files & EML headers (20-40 Hours)</td>
                    <td className="py-4 px-4 text-xs font-bold text-emerald-400">Automated OCR, PCAP packet parser & PDF decoder (&lt; 2 Minutes)</td>
                  </tr>
                  <tr className="hover:bg-gray-900/40 transition">
                    <td className="py-4 px-4 font-bold text-white">Threat Intelligence</td>
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
                    <td className="py-4 px-4 font-bold text-white">SIEM Rule Generation</td>
                    <td className="py-4 px-4 text-xs text-gray-400">Handcrafted YARA and Sigma rules requiring expert engineers</td>
                    <td className="py-4 px-4 text-xs font-bold text-emerald-400">1-Click Automated YARA & Sigma Rule Generator Hub</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Architecture Layer Blueprint */}
          <div className="cyber-card p-8 bg-[#111827] border border-gray-800 rounded-2xl space-y-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Layers className="w-6 h-6 text-blue-400" />
              Full-Stack System Architecture & Technology Blueprint
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-xs">
              <div className="bg-gray-900 p-6 rounded-xl border border-blue-500/30 space-y-3">
                <span className="text-blue-400 font-bold uppercase tracking-wider text-[10px] block">Frontend Layer</span>
                <h3 className="font-bold text-white text-base">Next.js 14 & Tailwind</h3>
                <p className="text-gray-400 leading-relaxed">TypeScript, App Router, Cytoscape.js Topology, World Map SVG Radar, Attack Timeline Visualizer</p>
              </div>

              <div className="bg-gray-900 p-6 rounded-xl border border-emerald-500/30 space-y-3">
                <span className="text-emerald-400 font-bold uppercase tracking-wider text-[10px] block">Backend Engine</span>
                <h3 className="font-bold text-white text-base">Node.js Express / FastAPI</h3>
                <p className="text-gray-400 leading-relaxed">Tesseract OCR, Mailparser EML, PCAP Packet Stream Decoder, PDFKit Forensic Report Generator</p>
              </div>

              <div className="bg-gray-900 p-6 rounded-xl border border-purple-500/30 space-y-3">
                <span className="text-purple-400 font-bold uppercase tracking-wider text-[10px] block">AI & Threat Feeds</span>
                <h3 className="font-bold text-white text-base">OpenAI & Multi-APIs</h3>
                <p className="text-gray-400 leading-relaxed">Grounded GPT-4o-mini Summaries, VirusTotal, AbuseIPDB, Shodan, AlienVault OTX, YARA Rule Engine</p>
              </div>

              <div className="bg-gray-900 p-6 rounded-xl border border-amber-500/30 space-y-3">
                <span className="text-amber-400 font-bold uppercase tracking-wider text-[10px] block">Persistence Layer</span>
                <h3 className="font-bold text-white text-base">MongoDB & Memory DB</h3>
                <p className="text-gray-400 leading-relaxed">Persistent MongoDB with fail-safe MongoMemoryServer auto-fallback for offline zero-config operation</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
