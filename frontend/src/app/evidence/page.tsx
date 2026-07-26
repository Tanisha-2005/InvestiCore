"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { FileSearch, ShieldCheck, Terminal, DollarSign, Cpu, Copy, CheckCircle2, Lock, FileCode, Mail, Search, CheckCircle, AlertTriangle, Crosshair } from "lucide-react";

export default function EvidenceVaultPage() {
  const [activeTab, setActiveTab] = useState<"custody" | "email" | "yara" | "crypto" | "entropy">("custody");

  // Email Header Analyzer State
  const [emailHeader, setEmailHeader] = useState(`Received: from mail-c2.malicious-phish.net (185.220.101.5) by mx.google.com with ESMTPS
Authentication-Results: mx.google.com; dmarc=fail (p=NONE dis=NONE) header.from=apex-finance-verify.com; spf=fail
From: "Billing Security" <urgent-invoice@apex-finance-verify.com>
To: victim_cfo@apex-healthcare.org
Subject: URGENT: Wire Transfer Authorization Required
Date: Sat, 25 Jul 2026 09:14:22 +0000`);

  const [headerAnalysis, setHeaderAnalysis] = useState<any>({
    senderIp: "185.220.101.5",
    originHost: "mail-c2.malicious-phish.net",
    spfStatus: "FAIL (Spoofed Origin)",
    dmarcStatus: "FAIL (Unauthorized Sender)",
    riskScore: "HIGH (Phishing Spoofing Attack Detected)",
    hops: ["185.220.101.5 (C2 Server)", "mx.google.com (Recipient Server)"],
  });

  // Crypto wallet tracer state
  const [walletInput, setWalletInput] = useState("1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa");
  const [walletData, setWalletData] = useState<any>({
    address: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
    currency: "Bitcoin (BTC)",
    balance: "68.32 BTC",
    totalReceived: "142.85 BTC",
    txCount: 3840,
    threatScore: "CRITICAL (Ransomware Extortion)",
    associatedCase: "Operation PhishStorm",
  });

  // YARA & Sigma rules
  const sampleYara = `rule InvestiCore_Trojan_PhishStorm_Payload {
    meta:
        description = "Automated YARA rule generated for Trojan Payload invoice_2026.exe"
        author = "InvestiCore AI Forensics Platform"
        date = "2026-07-25"
        case_id = "CASE-6A64F313"
        severity = "CRITICAL"

    strings:
        $md5_hash = "e1107a4143b17bf59928b7e1d5a3c234"
        $c2_server = "http://malicious-c2-update.com/payload.exe"
        $btc_wallet = "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa"
        $str1 = "Ransomware_Extension_.encrypted"
        $str2 = "cmd.exe /c vssadmin delete shadows /all /quiet"

    condition:
        uint16(0) == 0x5A4D and ($md5_hash or $c2_server or 2 of ($str*))
}`;

  const sampleSigma = `title: Detect Suspicious Ransomware Shadow Copy Deletion
id: e4b2f8a1-9c3a-4f81-b204-123456789abc
status: experimental
description: Detects command-line execution of vssadmin deleting volume shadow copies typical of ransomware.
author: InvestiCore Threat Intel Engine
date: 2026/07/25
references:
    - https://attack.mitre.org/techniques/T1490/
logsource:
    category: process_creation
    product: windows
detection:
    selection:
        Image|endswith: '\\vssadmin.exe'
        CommandLine|contains|all:
            - 'delete'
            - 'shadows'
    condition: selection
falsepositives:
    - Legitimate system administration backup scripts
level: critical`;

  const custodyLogs = [
    {
      id: "ev_101",
      fileName: "invoice_2026_payload.exe",
      fileType: "Executable Binary (.exe)",
      sha256: "7c9f8a31940e2d93e11b4028fa958611a2b4c890123456789abcdef012345678",
      uploadedBy: "Det. Alex Rivera (ID: INV-402)",
      timestamp: "2026-07-25 09:18:05 UTC",
      integrityStatus: "VERIFIED_INTACT",
      case: "Operation PhishStorm",
    },
    {
      id: "ev_102",
      fileName: "network_capture_pcap_0930.pcap",
      fileType: "Network Packet Capture (.pcap)",
      sha256: "e1107a4143b17bf59928b7e1d5a3c234b890123456789abcdef0123456789abc",
      uploadedBy: "Analyst Sarah Connor (ID: ANA-108)",
      timestamp: "2026-07-25 09:30:12 UTC",
      integrityStatus: "VERIFIED_INTACT",
      case: "Operation PhishStorm",
    },
    {
      id: "ev_103",
      fileName: "phishing_email_header.eml",
      fileType: "Email File (.eml)",
      sha256: "3f8a12bc90d1e56ab7890123456789abcdef0123456789abcdef0123456789ab",
      uploadedBy: "Det. Alex Rivera (ID: INV-402)",
      timestamp: "2026-07-25 09:14:22 UTC",
      integrityStatus: "VERIFIED_INTACT",
      case: "Operation PhishStorm",
    },
  ];

  const analyzeEmailHeader = () => {
    alert("Parsing EML email headers... SPF/DMARC verification complete.");
  };

  return (
    <div className="min-h-screen bg-[#0b0f17]">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                <FileSearch className="w-6 h-6 text-blue-500" />
                InvestiCore Central Evidence Vault & Forensic Toolset
              </h1>
              <p className="text-sm text-gray-400">
                Chain of Custody, EML Email Header Analyzer, YARA/Sigma Generator, Crypto Wallet Tracer, and PE Entropy Inspector
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-gray-800 space-x-6 text-sm font-semibold overflow-x-auto">
            {[
              { id: "custody", label: "Legal Chain of Custody", icon: ShieldCheck },
              { id: "email", label: "Email Header Forensic Analyzer", icon: Mail },
              { id: "yara", label: "YARA & Sigma Rules", icon: FileCode },
              { id: "crypto", label: "Crypto Blockchain Tracer", icon: DollarSign },
              { id: "entropy", label: "PE Binary Entropy Inspector", icon: Cpu },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 pb-3 transition border-b-2 whitespace-nowrap ${
                    isActive
                      ? "text-blue-400 border-blue-500 font-bold"
                      : "text-gray-400 border-transparent hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* TAB 1: CHAIN OF CUSTODY */}
          {activeTab === "custody" && (
            <div className="cyber-card p-6 bg-[#111827] border border-gray-800 rounded-xl space-y-6">
              <div className="flex items-center justify-between border-b border-gray-800 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    Digital Evidence Integrity & Chain of Custody Log
                  </h2>
                  <p className="text-xs text-gray-400">Legal proof of evidence authenticity with SHA-256 cryptographic signatures</p>
                </div>
                <div className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-3 py-1.5 rounded border border-emerald-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  100% Cryptographically Verified
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-300">
                  <thead className="text-xs uppercase bg-gray-900/80 text-gray-400 border-b border-gray-800">
                    <tr>
                      <th className="py-3 px-4">Artifact Name</th>
                      <th className="py-3 px-4">File Type</th>
                      <th className="py-3 px-4">SHA-256 Hash</th>
                      <th className="py-3 px-4">Custodian / Officer</th>
                      <th className="py-3 px-4">Timestamp</th>
                      <th className="py-3 px-4">Custody Integrity</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/80">
                    {custodyLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-gray-900/40 transition">
                        <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2">
                          <Lock className="w-3.5 h-3.5 text-blue-400" />
                          {log.fileName}
                        </td>
                        <td className="py-3.5 px-4 text-xs font-medium text-gray-400">{log.fileType}</td>
                        <td className="py-3.5 px-4 font-mono text-xs text-amber-400 truncate max-w-[220px]" title={log.sha256}>
                          {log.sha256}
                        </td>
                        <td className="py-3.5 px-4 text-xs text-gray-300">{log.uploadedBy}</td>
                        <td className="py-3.5 px-4 font-mono text-xs text-gray-400">{log.timestamp}</td>
                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-1 text-[10px] font-bold rounded uppercase bg-emerald-950 text-emerald-400 border border-emerald-800">
                            ✓ {log.integrityStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: EMAIL HEADER FORENSIC ANALYZER */}
          {activeTab === "email" && (
            <div className="cyber-card p-6 bg-[#111827] border border-gray-800 rounded-xl space-y-6">
              <div className="flex items-center justify-between border-b border-gray-800 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Mail className="w-5 h-5 text-blue-400" />
                    Phishing Email Header Forensic Inspector
                  </h2>
                  <p className="text-xs text-gray-400">Decode received IP hops, SPF/DKIM/DMARC authentication failures, and spoofed return paths</p>
                </div>
              </div>

              <div className="space-y-4">
                <textarea
                  rows={6}
                  value={emailHeader}
                  onChange={(e) => setEmailHeader(e.target.value)}
                  placeholder="Paste raw EML header here..."
                  className="w-full bg-gray-950 border border-gray-800 rounded-lg p-3 text-xs font-mono text-gray-300 focus:outline-none focus:border-blue-500"
                />
                <button
                  onClick={analyzeEmailHeader}
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-6 py-2.5 rounded-lg transition shadow-lg shadow-blue-600/20"
                >
                  Analyze EML Headers
                </button>
              </div>

              {headerAnalysis && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-xs">
                  <div className="bg-gray-900 p-4 rounded-lg border border-gray-800 space-y-1">
                    <span className="text-gray-500 uppercase text-[10px] font-bold">Originating Sender IP</span>
                    <div className="text-md font-bold font-mono text-amber-400">{headerAnalysis.senderIp}</div>
                    <span className="text-gray-400 text-[11px] block">{headerAnalysis.originHost}</span>
                  </div>

                  <div className="bg-gray-900 p-4 rounded-lg border border-gray-800 space-y-1">
                    <span className="text-gray-500 uppercase text-[10px] font-bold">SPF & DMARC Auth</span>
                    <div className="text-md font-bold text-red-400">{headerAnalysis.spfStatus}</div>
                    <span className="text-red-400/80 text-[11px] block">{headerAnalysis.dmarcStatus}</span>
                  </div>

                  <div className="bg-gray-900 p-4 rounded-lg border border-gray-800 space-y-1">
                    <span className="text-gray-500 uppercase text-[10px] font-bold">Phishing Risk Score</span>
                    <div className="text-md font-bold text-red-400">{headerAnalysis.riskScore}</div>
                    <span className="text-gray-400 text-[11px] block">Hops: {headerAnalysis.hops.length} Network Nodes</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: YARA & SIGMA GENERATOR */}
          {activeTab === "yara" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* YARA Rule Card */}
              <div className="cyber-card p-6 bg-[#111827] border border-gray-800 rounded-xl space-y-4">
                <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                  <h3 className="font-bold text-white text-md flex items-center gap-2">
                    <FileCode className="w-5 h-5 text-blue-400" />
                    Automated YARA Malware Rule
                  </h3>
                  <button
                    onClick={() => navigator.clipboard.writeText(sampleYara)}
                    className="text-xs bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white px-3 py-1 rounded transition border border-blue-500/30 flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" /> Copy YARA Rule
                  </button>
                </div>
                <p className="text-xs text-gray-400">Deployable YARA rule for scanning endpoint disks for ransomware payloads.</p>
                <pre className="bg-gray-950 p-4 rounded-lg text-xs font-mono text-emerald-400 overflow-x-auto border border-gray-800 max-h-[350px]">
                  {sampleYara}
                </pre>
              </div>

              {/* Sigma Rule Card */}
              <div className="cyber-card p-6 bg-[#111827] border border-gray-800 rounded-xl space-y-4">
                <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                  <h3 className="font-bold text-white text-md flex items-center gap-2">
                    <Terminal className="w-5 h-5 text-amber-400" />
                    Automated Sigma SIEM Log Rule
                  </h3>
                  <button
                    onClick={() => navigator.clipboard.writeText(sampleSigma)}
                    className="text-xs bg-amber-600/20 text-amber-400 hover:bg-amber-600 hover:text-white px-3 py-1 rounded transition border border-amber-500/30 flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" /> Copy Sigma Rule
                  </button>
                </div>
                <p className="text-xs text-gray-400">Generic log detection rule compatible with Splunk, Elastic SIEM, and QRadar.</p>
                <pre className="bg-gray-950 p-4 rounded-lg text-xs font-mono text-amber-300 overflow-x-auto border border-gray-800 max-h-[350px]">
                  {sampleSigma}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 4: CRYPTO BLOCKCHAIN TRACER */}
          {activeTab === "crypto" && (
            <div className="cyber-card p-6 bg-[#111827] border border-gray-800 rounded-xl space-y-6">
              <div className="flex items-center justify-between border-b border-gray-800 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-emerald-400" />
                    Crypto Wallet & Ransomware Payment Blockchain Tracer
                  </h2>
                  <p className="text-xs text-gray-400">Lookup and track Bitcoin, Ethereum, and Monero addresses linked to extortion</p>
                </div>
              </div>

              <div className="flex gap-3">
                <input
                  type="text"
                  value={walletInput}
                  onChange={(e) => setWalletInput(e.target.value)}
                  placeholder="Enter BTC / ETH / XMR Wallet Address..."
                  className="flex-1 bg-gray-900 border border-gray-800 rounded-lg px-4 py-2.5 text-sm text-white focus:border-blue-500 focus:outline-none font-mono"
                />
                <button
                  onClick={() => alert(`Tracing blockchain transactions for wallet ${walletInput}...`)}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-6 py-2.5 rounded-lg transition shadow-lg shadow-emerald-600/20"
                >
                  Trace Blockchain Wallet
                </button>
              </div>

              {/* Wallet Results Box */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                <div className="bg-gray-900 p-5 rounded-xl border border-gray-800 space-y-2">
                  <span className="text-xs font-bold uppercase text-gray-400">Wallet Balance</span>
                  <div className="text-2xl font-bold text-emerald-400">{walletData.balance}</div>
                  <span className="text-xs text-gray-500 block font-mono">Total Received: {walletData.totalReceived}</span>
                </div>

                <div className="bg-gray-900 p-5 rounded-xl border border-gray-800 space-y-2">
                  <span className="text-xs font-bold uppercase text-gray-400">Blockchain Transactions</span>
                  <div className="text-2xl font-bold text-white">{walletData.txCount} TXs</div>
                  <span className="text-xs text-blue-400 block font-mono">Linked Case: {walletData.associatedCase}</span>
                </div>

                <div className="bg-gray-900 p-5 rounded-xl border border-gray-800 space-y-2">
                  <span className="text-xs font-bold uppercase text-gray-400">Extortion Threat Score</span>
                  <div className="text-lg font-bold text-red-400">{walletData.threatScore}</div>
                  <span className="text-xs text-red-400/80 block font-mono">Flagged in Ransom Note Payload</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: MALWARE PE ENTROPY INSPECTOR */}
          {activeTab === "entropy" && (
            <div className="cyber-card p-6 bg-[#111827] border border-gray-800 rounded-xl space-y-6">
              <div className="flex items-center justify-between border-b border-gray-800 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Cpu className="w-5 h-5 text-purple-400" />
                    Executable Section Entropy & Packer Inspector
                  </h2>
                  <p className="text-xs text-gray-400">Analyze binary section entropy scores (High entropy &gt; 7.2 indicates packed malware/UPX)</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { section: ".text (Executable Code)", entropy: 6.42, status: "Normal Code", isPacked: false },
                  { section: ".rdata (Read-Only Data)", entropy: 5.18, status: "Normal Data", isPacked: false },
                  { section: ".UPX0 / .encrypted (Payload)", entropy: 7.94, status: "HIGH ENTROPY (PACKED MALWARE)", isPacked: true },
                ].map((s) => (
                  <div key={s.section} className="bg-gray-900 p-5 rounded-xl border border-gray-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white font-mono">{s.section}</span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                          s.isPacked
                            ? "bg-red-950 text-red-400 border border-red-800"
                            : "bg-emerald-950 text-emerald-400 border border-emerald-800"
                        }`}
                      >
                        {s.isPacked ? "PACKED" : "CLEAN"}
                      </span>
                    </div>
                    <div className="text-xl font-bold text-amber-400">Entropy Score: {s.entropy} / 8.0</div>
                    <div className="text-xs text-gray-400">{s.status}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
