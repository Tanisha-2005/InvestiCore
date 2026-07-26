import "./globals.css";
import React from "react";

export const metadata = {
  title: "InvestiCore — AI Cyber Crime Investigation & Threat Intel Platform",
  description: "Enterprise Digital Forensics, IOC Extraction, Threat Intel Enrichment, and AI Assistance Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#0b0f17] text-gray-100 min-h-screen">
        {children}
      </body>
    </html>
  );
}
