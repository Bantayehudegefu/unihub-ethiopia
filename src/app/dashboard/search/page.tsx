"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Search } from "lucide-react";
import Link from "next/link";
import GlassCard from "@/components/GlassCard";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);

  const handleSearch = async () => {
    if (!query) return;
    const { data } = await supabase.from("materials").select("*, courses(name)").ilike("title", `%${query}%`).limit(20);
    setResults(data || []);
  };

  return (
    <div>
      <div className="flex gap-4 mb-8">
        <input value={query} onChange={e => setQuery(e.target.value)} className="flex-1 bg-white/5 p-4 rounded-xl" placeholder="Search materials..." />
        <button onClick={handleSearch} className="bg-neon-blue/20 p-4 rounded-xl"><Search /></button>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {results.map(m => (
          <Link key={m.id} href={`/dashboard/materials/${m.id}`}>
            <GlassCard>
              <h3>{m.title}</h3>
              <p className="text-sm">{m.courses?.name}</p>
            </GlassCard>
          </Link>
        ))}
      </div>
    </div>
  );
}