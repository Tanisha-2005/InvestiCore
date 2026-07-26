"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { Plus, Search, Filter, Briefcase, ChevronRight } from "lucide-react";
import { api } from "@/lib/api";
import Link from "next/link";

export default function CasesPage() {
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [victimName, setVictimName] = useState("");
  const [priority, setPriority] = useState("medium");

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    try {
      const res = await api.get("/cases/");
      setCases(Array.isArray(res.data) ? res.data : (res.data?.cases || []));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const safeCases = Array.isArray(cases) ? cases : [];

  const handleCreateCase = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/cases/", {
        title,
        description,
        victim_name: victimName,
        priority,
      });
      setShowModal(false);
      setTitle("");
      setDescription("");
      setVictimName("");
      fetchCases();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f17]">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">Investigation Cases</h1>
              <p className="text-sm text-gray-400">Manage and track active cybercrime investigations</p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-4 py-2.5 rounded-lg shadow-lg shadow-blue-600/20 transition"
            >
              <Plus className="w-4 h-4" />
              Create Investigation Case
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {safeCases.map((c) => (
              <div key={c.id} className="cyber-card p-6 flex flex-col justify-between space-y-4 hover:border-blue-500/50 transition group">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-semibold text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800">
                      {c.case_number}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded font-semibold uppercase ${
                        c.priority === "critical"
                          ? "bg-red-950 text-red-400 border border-red-800"
                          : c.priority === "high"
                          ? "bg-amber-950 text-amber-400 border border-amber-800"
                          : "bg-gray-800 text-gray-400"
                      }`}
                    >
                      {c.priority}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg text-white group-hover:text-blue-400 transition">{c.title}</h3>
                  <p className="text-xs text-gray-400 line-clamp-2">{c.description || "No description provided."}</p>
                </div>

                <div className="pt-4 border-t border-gray-800 flex items-center justify-between text-xs">
                  <span className="text-gray-500">Victim: <strong className="text-gray-300">{c.victim_name || "N/A"}</strong></span>
                  <Link
                    href={`/cases/${c.id}`}
                    className="text-blue-400 font-semibold flex items-center gap-1 hover:underline"
                  >
                    Open Case <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Create Modal */}
          {showModal && (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
              <div className="w-full max-w-lg bg-[#111827] border border-gray-800 rounded-xl p-6 space-y-6 shadow-2xl">
                <h2 className="text-xl font-bold text-white">Create New Investigation Case</h2>
                <form onSubmit={handleCreateCase} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Case Title</label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Operation PhishStorm - Banking Trojan Attack"
                      className="w-full bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Victim / Target Organization</label>
                    <input
                      type="text"
                      value={victimName}
                      onChange={(e) => setVictimName(e.target.value)}
                      placeholder="Acme Financial Services"
                      className="w-full bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Priority</label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                      className="w-full bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Case Description</label>
                    <textarea
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Enter detailed background on the incident..."
                      className="w-full bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 text-xs font-semibold text-gray-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2 rounded-lg"
                    >
                      Save Case
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
