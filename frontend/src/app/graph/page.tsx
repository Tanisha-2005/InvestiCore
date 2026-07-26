"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { Share2, RefreshCw, ZoomIn, ZoomOut, Filter, Info, ShieldAlert, Database } from "lucide-react";
import CytoscapeComponent from "react-cytoscapejs";

export default function GraphPage() {
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [filterType, setFilterType] = useState<string>("all");
  const [layoutName, setLayoutName] = useState<string>("cose");
  const [cyRef, setCyRef] = useState<any>(null);

  // High-fidelity forensic topology dataset
  const initialElements = [
    // Cases & Victims
    { data: { id: "case_101", label: "Operation PhishStorm", type: "case", priority: "CRITICAL" } },
    { data: { id: "victim_1", label: "Apex Healthcare Corp", type: "victim", sector: "Healthcare" } },
    
    // Suspects & Threat Actors
    { data: { id: "suspect_1", label: "APT-41 (Shadow Lynx)", type: "suspect", origin: "State-Sponsored" } },

    // Infrastructure (IPs & Domains)
    { data: { id: "ip_1", label: "185.220.101.5", type: "ip", status: "MALICIOUS", isp: "CyberBunker Hosting" } },
    { data: { id: "ip_2", label: "194.165.16.42", type: "ip", status: "SUSPICIOUS", isp: "DigitalOcean Netherlands" } },
    { data: { id: "ip_3", label: "8.8.8.8", type: "ip", status: "CLEAN", isp: "Google DNS" } },
    { data: { id: "domain_1", label: "malicious-c2-update.com", type: "domain", status: "MALICIOUS" } },
    { data: { id: "domain_2", label: "apex-portal-phish.net", type: "domain", status: "MALICIOUS" } },

    // Evidence Artifacts & Hashes
    { data: { id: "hash_1", label: "e1107a4143b17bf... (Trojan)", type: "hash", md5: "e1107a4143b17bf59928b7e1d5a3c234" } },
    { data: { id: "hash_2", label: "7c9f8a31940e2d... (Payload)", type: "hash", md5: "7c9f8a31940e2d93e11b4028fa958611" } },
    { data: { id: "mitre_1", label: "T1566 - Phishing", type: "mitre", tactic: "Initial Access" } },
    { data: { id: "mitre_2", label: "T1071 - C2 Traffic", type: "mitre", tactic: "Command & Control" } },

    // Relationships (Edges)
    { data: { source: "case_101", target: "victim_1", label: "TARGETS" } },
    { data: { source: "suspect_1", target: "case_101", label: "ATTRIBUTED_TO" } },
    { data: { source: "suspect_1", target: "ip_1", label: "OPERATES_C2" } },
    { data: { source: "ip_1", target: "domain_1", label: "HOSTS_DOMAIN" } },
    { data: { source: "domain_1", target: "hash_1", label: "DISTRIBUTES" } },
    { data: { source: "hash_1", target: "victim_1", label: "EXECUTED_ON" } },
    { data: { source: "domain_2", target: "victim_1", label: "PHISHED" } },
    { data: { source: "ip_2", target: "domain_2", label: "HOSTS_DOMAIN" } },
    { data: { source: "case_101", target: "mitre_1", label: "LEVERAGES" } },
    { data: { source: "case_101", target: "mitre_2", label: "LEVERAGES" } },
  ];

  const stylesheet: any = [
    {
      selector: "node",
      style: {
        label: "data(label)",
        "color": "#e2e8f0",
        "font-size": "11px",
        "font-weight": "600",
        "text-valign": "bottom",
        "text-margin-y": 6,
        "background-color": "#3b82f6",
        width: 38,
        height: 38,
        "border-width": 2,
        "border-color": "#1d4ed8",
      },
    },
    {
      selector: 'node[type = "case"]',
      style: {
        "background-color": "#ef4444",
        "border-color": "#b91c1c",
        width: 48,
        height: 48,
      },
    },
    {
      selector: 'node[type = "ip"][status = "MALICIOUS"]',
      style: {
        "background-color": "#f97316",
        "border-color": "#c2410c",
      },
    },
    {
      selector: 'node[type = "domain"]',
      style: {
        "background-color": "#8b5cf6",
        "border-color": "#6d28d9",
      },
    },
    {
      selector: 'node[type = "hash"]',
      style: {
        "background-color": "#14b8a6",
        "border-color": "#0f766e",
      },
    },
    {
      selector: 'node[type = "suspect"]',
      style: {
        "background-color": "#ec4899",
        "border-color": "#be185d",
        width: 44,
        height: 44,
      },
    },
    {
      selector: 'node[type = "mitre"]',
      style: {
        "background-color": "#eab308",
        "border-color": "#a16207",
      },
    },
    {
      selector: "edge",
      style: {
        width: 2,
        "line-color": "#334155",
        "target-arrow-color": "#475569",
        "target-arrow-shape": "triangle",
        "curve-style": "bezier",
        label: "data(label)",
        "font-size": "9px",
        "color": "#94a3b8",
        "text-rotation": "autorotate",
      },
    },
    {
      selector: ":selected",
      style: {
        "border-width": 4,
        "border-color": "#38bdf8",
        "line-color": "#38bdf8",
        "target-arrow-color": "#38bdf8",
      },
    },
  ];

  const handleNodeClick = (evt: any) => {
    const node = evt.target;
    setSelectedNode(node.data());
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
                <Share2 className="w-6 h-6 text-blue-500" />
                Interactive Cytoscape Relationship Topology
              </h1>
              <p className="text-sm text-gray-400">
                Visual Indicator Network Mapping Suspects, C2 IPs, Domains, Malware Hashes, and MITRE Techniques
              </p>
            </div>

            {/* Layout & Control Buttons */}
            <div className="flex items-center gap-3">
              <select
                value={layoutName}
                onChange={(e) => setLayoutName(e.target.value)}
                className="bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 text-xs font-semibold text-gray-300 focus:outline-none"
              >
                <option value="cose">Force Directed (Cose)</option>
                <option value="concentric">Concentric Topology</option>
                <option value="circle">Circular Layout</option>
                <option value="grid">Grid Layout</option>
              </select>

              <button
                onClick={() => cyRef?.fit()}
                className="p-2 bg-gray-900 border border-gray-800 rounded-lg text-gray-300 hover:text-white transition"
                title="Fit to Screen"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Main Graph & Inspector Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Cytoscape Canvas Container */}
            <div className="lg:col-span-3 cyber-card p-2 relative h-[650px] overflow-hidden bg-[#0a0e17] rounded-xl border border-gray-800">
              <CytoscapeComponent
                elements={initialElements}
                style={{ width: "100%", height: "100%" }}
                stylesheet={stylesheet}
                layout={{ name: layoutName, animate: true }}
                cy={(cy) => {
                  setCyRef(cy);
                  cy.on("tap", "node", handleNodeClick);
                }}
              />
              
              {/* Legend Overlay */}
              <div className="absolute bottom-4 left-4 bg-gray-950/80 backdrop-blur-md border border-gray-800 rounded-lg p-3 space-y-1 text-xs font-medium text-gray-300 z-10 shadow-lg">
                <div className="font-bold text-gray-400 text-[10px] uppercase tracking-wider mb-1">Topology Legend</div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-red-500" /> Case / Investigation</div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-pink-500" /> Threat Actor / Suspect</div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-orange-500" /> Malicious C2 IP</div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-purple-500" /> Phishing Domain</div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-teal-500" /> Malware File Hash</div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-yellow-500" /> MITRE ATT&CK ID</div>
              </div>
            </div>

            {/* Node Inspector Drawer */}
            <div className="cyber-card p-6 space-y-4 bg-[#111827] border border-gray-800 rounded-xl h-[650px] overflow-y-auto">
              <div className="flex items-center gap-2 text-blue-400 font-bold border-b border-gray-800 pb-3">
                <Info className="w-5 h-5 text-blue-500" />
                Node Inspector
              </div>

              {selectedNode ? (
                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Node Label</span>
                    <div className="text-md font-bold text-white break-words">{selectedNode.label}</div>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Indicator Type</span>
                    <div className="mt-1">
                      <span className="px-2.5 py-1 text-xs font-mono font-bold rounded uppercase bg-blue-950 text-blue-400 border border-blue-800">
                        {selectedNode.type}
                      </span>
                    </div>
                  </div>

                  {selectedNode.status && (
                    <div>
                      <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Threat Status</span>
                      <div className="mt-1">
                        <span
                          className={`px-2.5 py-1 text-xs font-bold rounded uppercase ${
                            selectedNode.status === "MALICIOUS"
                              ? "bg-red-950 text-red-400 border border-red-800"
                              : "bg-emerald-950 text-emerald-400 border border-emerald-800"
                          }`}
                        >
                          {selectedNode.status}
                        </span>
                      </div>
                    </div>
                  )}

                  {selectedNode.isp && (
                    <div>
                      <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">ISP / Organization</span>
                      <div className="text-sm font-semibold text-gray-300">{selectedNode.isp}</div>
                    </div>
                  )}

                  {selectedNode.md5 && (
                    <div>
                      <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">MD5 Hash</span>
                      <div className="text-xs font-mono text-gray-400 break-all bg-gray-900 p-2 rounded border border-gray-800">
                        {selectedNode.md5}
                      </div>
                    </div>
                  )}

                  {selectedNode.tactic && (
                    <div>
                      <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">MITRE Tactic</span>
                      <div className="text-sm font-semibold text-amber-400">{selectedNode.tactic}</div>
                    </div>
                  )}

                  <div className="pt-4 border-t border-gray-800 space-y-2">
                    <button
                      onClick={() => alert(`Enriching indicator ${selectedNode.label} across live threat APIs...`)}
                      className="w-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold py-2 rounded shadow transition"
                    >
                      Enrich Threat Intel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-20 space-y-3 text-gray-500">
                  <Database className="w-8 h-8 text-gray-600 mx-auto" />
                  <p className="text-xs">Click on any node in the topology graph to inspect detailed forensic metadata & connections.</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
