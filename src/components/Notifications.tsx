"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";

export default function Notifications({ onClose }: { onClose: () => void }) {
  const [notifs, setNotifs] = useState<any[]>([]);
  useEffect(() => {
    const fetch = async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;
      const { data } = await supabase.from("notifications").select("*").eq("user_id", user.user.id).order("created_at", { ascending: false }).limit(10);
      setNotifs(data || []);
    };
    fetch();
  }, []);

  return (
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute right-4 top-16 w-80 glass rounded-xl p-4 shadow-2xl">
      <h3 className="font-semibold mb-2">Notifications</h3>
      {notifs.length === 0 ? <p className="text-sm text-gray-400">No new notifications</p> :
        notifs.map((n) => (
          <div key={n.id} className="text-sm py-1 border-b border-white/10">{n.content}</div>
        ))}
      <button onClick={onClose} className="text-xs text-neon-blue mt-2">Close</button>
    </motion.div>
  );
}