"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { Cpu, Zap, ShieldCheck } from "lucide-react";

export default function AIAssistantPage() {
  return (
    <div className="min-h-screen bg-[#0b0f17]">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8 space-y-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">AI Threat & Forensics Engine</h1>
            <p className="text-sm text-gray-400">OpenAI GPT-4o-mini & LangChain Powered Forensic Assistant</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="cyber-card p-6 space-y-3">
              <Cpu className="w-8 h-8 text-blue-400" />
              <h3 className="text-md font-bold text-white">YARA & Sigma Rule Generator</h3>
              <p className="text-xs text-gray-400">
                Automatically generate valid YARA binary detection rules and Sigma log detection logic directly from extracted evidence artifacts.
              </p>
            </div>

            <div className="cyber-card p-6 space-y-3">
              <Zap className="w-8 h-8 text-amber-400" />
              <h3 className="text-md font-bold text-white">PCAP & Malware Summarizer</h3>
              <p className="text-xs text-gray-400">
                Deconstruct network PCAP flows, beaconing routines, PE header imports, and entropy flags into concise investigator notes.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
