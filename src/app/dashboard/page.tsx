"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import GlassCard from "@/components/GlassCard";
import { motion } from "framer-motion";

export default function Dashboard() {
  const [profile, setProfile] = useState<any>(null);
  const [materials, setMaterials] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: prof } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      setProfile(prof);
      const { data: mats } = await supabase.from("materials").select("*, courses(name)").order("created_at", { ascending: false }).limit(6);
      setMaterials(mats || []);
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-8">
      <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-3xl font-bold">
        Welcome back, {profile?.full_name?.split(" ")[0]}
      </motion.h1>
      <div className="grid md:grid-cols-3 gap-6">
        <GlassCard><p className="text-2xl font-bold text-neon-blue">{materials.length}</p><p>Recent Materials</p></GlassCard>
        {/* More stats */}
      </div>
      <h2 className="text-xl font-semibold">Latest Uploads</h2>
      <div className="grid md:grid-cols-2 gap-4">
        {materials.map((m) => (
          <GlassCard key={m.id}>
            <h3 className="font-semibold">{m.title}</h3>
            <p className="text-sm text-gray-400">{m.courses?.name}</p>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}