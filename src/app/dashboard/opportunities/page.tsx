"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import GlassCard from "@/components/GlassCard";
import Link from "next/link";

export default function OpportunitiesPage() {
  const [ops, setOps] = useState<any[]>([]);
  useEffect(() => {
    supabase
      .from("opportunities")
      .select("*")
      .order("posted_at", { ascending: false })
      .then(({ data }) => setOps(data || []));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Scholarships & Opportunities</h1>
      <Link
        href="/dashboard/opportunities/create"
        className="inline-block mb-6 bg-neon-blue/20 px-4 py-2 rounded-full text-sm hover:bg-neon-blue/30 transition"
      >
        + Post an Opportunity
      </Link>
      <div className="space-y-4">
        {ops.map((op) => (
          <GlassCard key={op.id}>
            <div className="flex justify-between">
              <h3 className="font-semibold">{op.title}</h3>
              <span className="text-xs bg-neon-purple/20 px-2 py-1 rounded-full">
                {op.type}
              </span>
            </div>
            <p className="text-sm">{op.description}</p>
            {op.link && (
              <a href={op.link} target="_blank" className="text-neon-blue text-sm">
                Apply ↗
              </a>
            )}
            {op.deadline && (
              <p className="text-xs text-gray-500 mt-1">Deadline: {op.deadline}</p>
            )}
          </GlassCard>
        ))}
      </div>
    </div>
  );
}