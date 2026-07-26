"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import {
  Briefcase, FileSearch, ShieldAlert, Cpu, Share2, FileText, Upload,
  Zap, AlertTriangle, CheckCircle, RefreshCw, Send, Terminal, Network, ShieldCheck
} from "lucide-react";
import { api } from "@/lib/api";

export default function CaseDetailPage() {
  const params = useParams();
  const caseId = params.id as string;

  const [activeTab, setActiveTab] = useState("overview");
  const [caseData, setCaseData] = useState<any>(null);
  const [evidences, setEvidences] = useState<any[]>([]);
  const [iocs, setIocs] = useState<any[]>([]);
  const [timeline, setTimeline] = useState<any[]>([]);
  const [graphData, setGraphData] = useState<any>({ nodes: [], edges: [] });
  const [loading, setLoading] = useState(true);

  // File Upload State
  const [uploading, setUploading] = useState(false);
  const [fileType, setFileType] = useState("image");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // AI Chat State
  const [chatPrompt, setChatPrompt] = useState("");
  const [chatHistory, setChatHistory] = useState<{ role: string; text: string }[]>([]);
  const [chatLoading, setChatLoading] = useState(false);

  useEffect(() => {
    if (caseId) {
      loadCaseAllData();
    }
  }, [caseId]);

  const loadCaseAllData = async () => {
    setLoading(true);
    try {
      const [cRes, evRes, iocRes, timeRes, gRes] = await Promise.all([
        api.get(`/cases/${caseId}`),
        api.get(`/evidence/case/${caseId}`),
        api.get(`/iocs/case/${caseId}`),
        api.get(`/timeline/case/${caseId}`),
        api.get(`/graph/case/${caseId}`),
      ]);
      setCaseData(cRes.data);
      setEvidences(evRes.data);
      setIocs(iocRes.data);
      setTimeline(timeRes.data);
      setGraphData(gRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("case_id", caseId);
    formData.append("file_type", fileType);
    formData.append("file", selectedFile);

    try {
      await api.post("/evidence/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSelectedFile(null);
      await loadCaseAllData();
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleGenerateSummary = async () => {
    try {
      const res = await api.post(`/cases/${caseId}/ai-summary`);
      setCaseData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEnrichIOC = async (iocId: string) => {
    try {
      await api.post(`/threat-intel/enrich/${iocId}`);
      await loadCaseAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleChatSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatPrompt.trim()) return;

    const userMsg = chatPrompt;
    setChatPrompt("");
    setChatHistory((prev) => [...prev, { role: "user", text: userMsg }]);
    setChatLoading(true);

    try {
      const res = await api.post("/ai/chat", {
        case_id: caseId,
        prompt: userMsg,
      });
      setChatHistory((prev) => [...prev, { role: "ai", text: res.data.reply }]);
    } catch (err) {
      console.error(err);
    } finally {
      setChatLoading(false);
    }
  };

  const handleGenerateReport = async (format: string) => {
    try {
      const res = await api.post("/reports/generate", {
        case_id: caseId,
        title: `Investigation Report - ${caseData?.case_number}`,
        report_type: "executive",
        file_format: format,
      });

      // Stream file download
      const downloadRes = await api.get(`/reports/download/${res.data.id}`, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([downloadRes.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Report_${caseData?.case_number}.${format}`);
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading || !caseData) {
    return (
      <div className="min-h-screen bg-[#0b0f17] flex items-center justify-center text-gray-400 font-mono">
        Loading investigation environment...
      </div>
    );
  }

  const tabs = [
    { id: "overview", label: "Overview & AI Summary", icon: Briefcase },
    { id: "evidence", label: `Evidence (${evidences.length})`, icon: FileSearch },
    { id: "iocs", label: `Extracted IOCs (${iocs.length})`, icon: ShieldAlert },
    { id: "threat-intel", label: "Threat Intel", icon: Zap },
    { id: "graph", label: "Relationship Graph", icon: Share2 },
    { id: "ai-assistant", label: "AI Forensics Chat", icon: Cpu },
    { id: "reports", label: "Reports Export", icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-[#0b0f17]">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8 space-y-6 overflow-y-auto">
          {/* Header Banner */}
          <div className="cyber-card p-6 flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm font-bold text-blue-400 bg-blue-950 px-3 py-1 rounded border border-blue-800">
                  {caseData.case_number}
                </span>
                <h1 className="text-2xl font-bold text-white">{caseData.title}</h1>
              </div>
              <p className="text-xs text-gray-400">Victim: <strong className="text-gray-200">{caseData.victim_name || "N/A"}</strong> | Priority: <strong className="uppercase text-amber-400">{caseData.priority}</strong></p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-xs uppercase text-gray-400">Risk Score</div>
                <div className="text-2xl font-bold text-amber-400">{caseData.risk_score}/100</div>
              </div>
              <button
                onClick={handleGenerateSummary}
                className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2.5 rounded-lg flex items-center gap-2"
              >
                <Zap className="w-4 h-4" />
                Generate AI Overview
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-gray-800 pb-2 overflow-x-auto">
            {tabs.map((t) => {
              const Icon = t.icon;
              const isActive = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition ${
                    isActive
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                      : "text-gray-400 hover:text-white hover:bg-gray-800"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {t.label}
                </button>
              );
            })}
          </div>

          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="cyber-card p-6 space-y-4">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-blue-400" />
                  AI Executive Case Overview
                </h2>
                <div className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">
                  {caseData.summary_ai || caseData.description || "Click 'Generate AI Overview' to synthesize evidence."}
                </div>
              </div>

              {/* MITRE ATT&CK Tags */}
              <div className="cyber-card p-6 space-y-3">
                <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider">MITRE ATT&CK Matrix Identifiers</h3>
                <div className="flex flex-wrap gap-2">
                  {(caseData.mitre_attack_mapping || []).map((m: any, idx: number) => (
                    <span key={idx} className="bg-red-950/70 border border-red-800 text-red-300 text-xs px-3 py-1 rounded font-mono">
                      {m.id}: {m.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: EVIDENCE VAULT */}
          {activeTab === "evidence" && (
            <div className="space-y-6">
              {/* Upload Form */}
              <div className="cyber-card p-6 space-y-4">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Upload className="w-5 h-5 text-blue-400" />
                  Upload Digital Evidence Artifact
                </h2>
                <form onSubmit={handleFileUpload} className="flex flex-wrap items-center gap-4">
                  <select
                    value={fileType}
                    onChange={(e) => setFileType(e.target.value)}
                    className="bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
                  >
                    <option value="image">Screenshot / Image (OCR)</option>
                    <option value="pdf">PDF Forensic Document</option>
                    <option value="email">Email (.eml)</option>
                    <option value="pcap">Network PCAP</option>
                    <option value="log">Log File</option>
                    <option value="office">Office (.docx)</option>
                  </select>

                  <input
                    type="file"
                    required
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    className="text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500"
                  />

                  <button
                    type="submit"
                    disabled={uploading || !selectedFile}
                    className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2 rounded-lg disabled:opacity-50"
                  >
                    {uploading ? "Parsing Artifact..." : "Upload & Parse"}
                  </button>
                </form>
              </div>

              {/* Evidence List */}
              <div className="cyber-card p-6 space-y-4">
                <h3 className="text-md font-bold text-white">Parsed Digital Evidence</h3>
                <div className="space-y-3">
                  {evidences.map((ev) => (
                    <div key={ev.id} className="p-4 bg-gray-900/60 border border-gray-800 rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm text-white">{ev.file_name}</span>
                        <span className="text-xs uppercase bg-gray-800 text-blue-400 px-2 py-0.5 rounded font-mono">{ev.file_type}</span>
                      </div>
                      <div className="text-xs text-gray-500 font-mono">MD5: {ev.md5_hash} | Size: {ev.file_size} bytes</div>
                      {ev.extracted_text && (
                        <div className="p-3 bg-black/40 border border-gray-800 rounded text-xs font-mono text-gray-300 max-h-32 overflow-y-auto whitespace-pre-wrap">
                          {ev.extracted_text}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: EXTRACTED IOCS */}
          {activeTab === "iocs" && (
            <div className="cyber-card p-6 space-y-4">
              <h2 className="text-lg font-bold text-white">Extracted Indicators of Compromise (IOCs)</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-300">
                  <thead className="text-xs uppercase bg-gray-900/60 text-gray-400 border-b border-gray-800">
                    <tr>
                      <th className="py-3 px-4">Type</th>
                      <th className="py-3 px-4">Indicator Value</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Threat Score</th>
                      <th className="py-3 px-4">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {iocs.map((ioc) => (
                      <tr key={ioc.id} className="hover:bg-gray-900/40 transition">
                        <td className="py-3 px-4 font-mono font-bold text-blue-400 uppercase">{ioc.ioc_type}</td>
                        <td className="py-3 px-4 font-mono text-white">{ioc.value}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 text-xs font-semibold rounded ${
                              ioc.status === "malicious"
                                ? "bg-red-950 text-red-400 border border-red-800"
                                : ioc.status === "clean"
                                ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                                : "bg-gray-800 text-gray-400"
                            }`}
                          >
                            {ioc.status?.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-bold text-amber-400">{ioc.threat_score}</td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => handleEnrichIOC(ioc.id)}
                            className="text-xs bg-amber-600/20 text-amber-400 hover:bg-amber-600 hover:text-white px-3 py-1 rounded transition border border-amber-500/30"
                          >
                            Threat Intel Sweep
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: THREAT INTEL */}
          {activeTab === "threat-intel" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {["VirusTotal", "AbuseIPDB", "Shodan", "AlienVault OTX", "URLScan.io", "HaveIBeenPwned"].map((feed) => (
                <div key={feed} className="cyber-card p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">{feed}</span>
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  </div>
                  <p className="text-xs text-gray-400">Integrated & Listening for IOC Sweeps</p>
                  <div className="text-xs font-mono text-emerald-400 bg-emerald-950/40 p-2 rounded border border-emerald-800/50">
                    API Connected
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 5: GRAPH */}
          {activeTab === "graph" && (
            <div className="cyber-card p-6 space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Share2 className="w-5 h-5 text-blue-400" />
                Case Relationship Topology
              </h2>
              <div className="h-96 bg-gray-900/60 border border-gray-800 rounded-lg p-4 flex items-center justify-center text-gray-400 font-mono text-sm">
                Relationship Graph Active: {graphData.nodes.length} Nodes & {graphData.edges.length} Connections
              </div>
            </div>
          )}

          {/* TAB 6: AI CHAT ASSISTANT */}
          {activeTab === "ai-assistant" && (
            <div className="cyber-card p-6 space-y-4 flex flex-col h-[500px]">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Cpu className="w-5 h-5 text-blue-400" />
                InvestiCore AI Investigation Assistant
              </h2>
              
              <div className="flex-1 overflow-y-auto space-y-3 p-4 bg-gray-900/50 rounded-lg border border-gray-800">
                {chatHistory.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg text-sm max-w-2xl ${
                      msg.role === "user"
                        ? "bg-blue-600 text-white ml-auto"
                        : "bg-gray-800 text-gray-200 border border-gray-700 whitespace-pre-wrap"
                    }`}
                  >
                    {msg.text}
                  </div>
                ))}
              </div>

              <form onSubmit={handleChatSend} className="flex gap-3">
                <input
                  type="text"
                  value={chatPrompt}
                  onChange={(e) => setChatPrompt(e.target.value)}
                  placeholder="Ask AI about malware, evidence, or request YARA/Sigma rule generation..."
                  className="flex-1 bg-gray-900 border border-gray-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  disabled={chatLoading}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Ask AI
                </button>
              </form>
            </div>
          )}

          {/* TAB 7: REPORTS */}
          {activeTab === "reports" && (
            <div className="cyber-card p-6 space-y-6">
              <h2 className="text-lg font-bold text-white">Export Investigation Report</h2>
              <div className="flex gap-4">
                <button
                  onClick={() => handleGenerateReport("pdf")}
                  className="bg-red-600 hover:bg-red-500 text-white text-xs font-semibold px-5 py-2.5 rounded-lg flex items-center gap-2 shadow-lg shadow-red-600/20"
                >
                  <FileText className="w-4 h-4" />
                  Generate PDF Report
                </button>
                <button
                  onClick={() => handleGenerateReport("docx")}
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-5 py-2.5 rounded-lg flex items-center gap-2 shadow-lg shadow-blue-600/20"
                >
                  <FileText className="w-4 h-4" />
                  Generate DOCX Report
                </button>
                <button
                  onClick={() => handleGenerateReport("markdown")}
                  className="bg-gray-800 hover:bg-gray-700 text-white text-xs font-semibold px-5 py-2.5 rounded-lg flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  Generate Markdown
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
