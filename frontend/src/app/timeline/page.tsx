"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { Clock, ShieldAlert, AlertTriangle, FileText, Activity, CheckCircle, ChevronRight, Terminal } from "lucide-react";

export default function TimelinePage() {
  const [selectedPhase, setSelectedPhase] = useState<string>("all");

  const timelineEvents = [
    {
      id: "evt_1",
      timestamp: "2026-07-25 09:14:22 UTC",
      phase: "Initial Access",
      title: "Spear Phishing Email Delivered",
      description: "Inbound malicious email received from urgent-invoice@apex-finance-verify.com targeting Chief Financial Officer.",
      mitre: "T1566.002 - Spearphishing Link",
      severity: "high",
      ioc: "urgent-invoice@apex-finance-verify.com",
      evidence: "EML_Header_Dump_0914.eml",
    },
    {
      id: "evt_2",
      timestamp: "2026-07-25 09:18:05 UTC",
      phase: "Execution",
      title: "Phishing Link Clicked & Malicious Payload Dropped",
      description: "Victim workstation clicked embedded hyperlink. Payload `invoice_2026_update.exe` downloaded and executed.",
      mitre: "T1204.002 - Malicious File Execution",
      severity: "critical",
      ioc: "e1107a4143b17bf59928b7e1d5a3c234 (MD5)",
      evidence: "payload_execution_log.txt",
    },
    {
      id: "evt_3",
      timestamp: "2026-07-25 09:22:40 UTC",
      phase: "Persistence & Privilege Escalation",
      title: "Scheduled Task & Registry Run Key Created",
      description: "Malware modified Windows Registry HKLM\\Software\\Microsoft\\Windows\\CurrentVersion\\Run for persistent boot persistence.",
      mitre: "T1547.001 - Registry Run Keys",
      severity: "high",
      ioc: "HKLM\\Software\\Microsoft\\Windows\\CurrentVersion\\Run\\Updater",
      evidence: "sysmon_evtx_export.json",
    },
    {
      id: "evt_4",
      timestamp: "2026-07-25 09:30:12 UTC",
      phase: "Command & Control",
      title: "C2 Beaconing Initiated to Suspicious IP",
      description: "Host established TLS encrypted C2 connection to external IP 185.220.101.5 on port 8443 at regular 30s intervals.",
      mitre: "T1071.001 - Web Protocols (C2)",
      severity: "critical",
      ioc: "185.220.101.5:8443",
      evidence: "network_capture_pcap_0930.pcap",
    },
    {
      id: "evt_5",
      timestamp: "2026-07-25 09:45:00 UTC",
      phase: "Exfiltration & Impact",
      title: "Unauthorized Exfiltration & Ransom Note Dropped",
      description: "Encrypted volume archives exfiltrated via HTTPS. Ransom note `README_RESTORE_FILES.txt` created across share network.",
      mitre: "T1486 - Data Encrypted for Impact",
      severity: "critical",
      ioc: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa (BTC)",
      evidence: "ransom_note_sample.txt",
    },
  ];

  const filteredEvents =
    selectedPhase === "all"
      ? timelineEvents
      : timelineEvents.filter((e) => e.phase.toLowerCase().includes(selectedPhase.toLowerCase()));

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
                <Clock className="w-6 h-6 text-blue-500" />
                Live Incident Attack Timeline
              </h1>
              <p className="text-sm text-gray-400">
                Chronological Attack Sequence Mapping Initial Access, Payload Execution, C2 Beaconing, and Exfiltration
              </p>
            </div>

            {/* Filter */}
            <select
              value={selectedPhase}
              onChange={(e) => setSelectedPhase(e.target.value)}
              className="bg-gray-900 border border-gray-800 rounded-lg px-4 py-2 text-xs font-semibold text-gray-300 focus:outline-none"
            >
              <option value="all">All Attack Phases</option>
              <option value="initial access">Initial Access</option>
              <option value="execution">Execution</option>
              <option value="persistence">Persistence</option>
              <option value="command & control">Command & Control</option>
              <option value="exfiltration">Exfiltration</option>
            </select>
          </div>

          {/* Timeline Sequence Container */}
          <div className="cyber-card p-8 bg-[#0e1420] border border-gray-800 rounded-xl space-y-8">
            <div className="relative border-l-2 border-blue-600/40 ml-4 space-y-8">
              {filteredEvents.map((evt, idx) => (
                <div key={evt.id} className="relative pl-8 group">
                  {/* Timeline Dot Icon */}
                  <div
                    className={`absolute -left-[17px] top-0.5 w-8 h-8 rounded-full border-2 flex items-center justify-center shadow-lg transition ${
                      evt.severity === "critical"
                        ? "bg-red-950 border-red-500 text-red-400"
                        : "bg-amber-950 border-amber-500 text-amber-400"
                    }`}
                  >
                    <AlertTriangle className="w-4 h-4" />
                  </div>

                  {/* Event Content Card */}
                  <div className="bg-[#111827] border border-gray-800 rounded-xl p-6 space-y-3 hover:border-blue-500/50 transition">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-800/80 pb-3">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs font-semibold text-blue-400 bg-blue-950/60 px-2.5 py-1 rounded border border-blue-800">
                          {evt.timestamp}
                        </span>
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-400 bg-gray-900 px-2.5 py-1 rounded border border-gray-800">
                          {evt.phase}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-amber-400 bg-amber-950/50 px-2.5 py-1 rounded border border-amber-800/60 font-semibold">
                          {evt.mitre}
                        </span>
                        <span
                          className={`text-xs px-2.5 py-1 rounded font-bold uppercase ${
                            evt.severity === "critical"
                              ? "bg-red-950 text-red-400 border border-red-800"
                              : "bg-amber-950 text-amber-400 border border-amber-800"
                          }`}
                        >
                          {evt.severity}
                        </span>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition">{evt.title}</h3>
                      <p className="text-xs text-gray-300 mt-1 leading-relaxed">{evt.description}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-gray-800/80 text-xs">
                      <div>
                        <span className="text-gray-500 uppercase text-[10px] font-bold block mb-1">Extracted IOC</span>
                        <span className="font-mono text-amber-300 font-semibold bg-gray-900 px-2 py-1 rounded border border-gray-800 block truncate">
                          {evt.ioc}
                        </span>
                      </div>

                      <div>
                        <span className="text-gray-500 uppercase text-[10px] font-bold block mb-1">Source Evidence Artifact</span>
                        <span className="text-blue-400 font-medium flex items-center gap-1.5 bg-gray-900 px-2 py-1 rounded border border-gray-800 truncate">
                          <FileText className="w-3.5 h-3.5" />
                          {evt.evidence}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
