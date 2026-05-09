"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import GlassCard from "@/components/GlassCard";
import { motion } from "framer-motion";
import Link from "next/link";

export default function MarketplacePage() {
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => {
    supabase.from("marketplace_items").select("*").order("created_at", { ascending: false }).then(({ data }) => setItems(data || []));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Marketplace</h1>
      <Link href="/dashboard/marketplace/upload" className="inline-block mb-6 bg-neon-blue/20 px-4 py-2 rounded-full text-sm hover:bg-neon-blue/30 transition">
  + Sell an Item
</Link>
      <div className="grid md:grid-cols-3 gap-6">
        {items.map((item) => (
          <motion.div key={item.id} whileHover={{ scale: 1.02 }}>
            <GlassCard>
              {item.image_url && <img src={item.image_url} className="w-full h-40 object-cover rounded-lg mb-3" />}
              <h3 className="font-semibold">{item.title}</h3>
              <p className="text-sm text-gray-400">{item.description}</p>
              <p className="text-neon-blue font-bold mt-2">{item.price} ETB</p>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
}