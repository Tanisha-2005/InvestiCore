"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0b0f17]">
      <div className="text-gray-400 font-mono text-sm animate-pulse">Initializing InvestiCore Platform...</div>
    </div>
  );
}
