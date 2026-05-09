"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import GlassCard from "@/components/GlassCard";

export default function MaterialsPage() {
  const [materials, setMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMaterials = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("materials")
        .select("*, courses(name)")
        .order("created_at", { ascending: false });

      if (!error) setMaterials(data || []);
      setLoading(false);
    };

    fetchMaterials();
  }, []);

  if (loading) {
    return <div className="p-6">Loading materials...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">All Materials</h1>

      {materials.length === 0 ? (
        <p className="text-gray-400">No materials uploaded yet.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {materials.map((m) => (
            <Link key={m.id} href={`/dashboard/materials/${m.id}`}>
              <GlassCard>
                <h3 className="font-semibold">{m.title}</h3>
                <p className="text-sm text-gray-400">
                  {m.courses?.name || "No course"}
                </p>
              </GlassCard>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}