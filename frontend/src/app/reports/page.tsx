"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { FileText } from "lucide-react";

export default function ReportsPage() {
  return (
    <div className="min-h-screen bg-[#0b0f17]">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8 space-y-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Investigation Reports Hub</h1>
            <p className="text-sm text-gray-400">PDFKit & ReportLab Executive, Technical, and IOC Report Exporter</p>
          </div>

          <div className="cyber-card p-12 text-center space-y-4">
            <FileText className="w-12 h-12 text-blue-500 mx-auto" />
            <h2 className="text-lg font-bold text-white">Report Generation Engine Active</h2>
            <p className="text-xs text-gray-400 max-w-md mx-auto">
              Select an active case to generate and download branded PDF, DOCX, or Markdown investigation reports.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
