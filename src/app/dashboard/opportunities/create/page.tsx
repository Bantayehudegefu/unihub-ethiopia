"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";
import GlassCard from "@/components/GlassCard";
import { motion } from "framer-motion";
import { Briefcase } from "lucide-react";

export default function OpportunityCreate() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("scholarship");
  const [link, setLink] = useState("");
  const [deadline, setDeadline] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    if (!title || !description) return toast.error("Title and description required");
    setLoading(true);
    const { error } = await supabase.from("opportunities").insert({
      title,
      description,
      type,
      link,
      deadline: deadline || null,
    });
    if (error) toast.error(error.message);
    else {
      toast.success("Opportunity posted!");
      router.push("/dashboard/opportunities");
    }
    setLoading(false);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-xl mx-auto">
      <GlassCard>
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Briefcase size={24} /> Post an Opportunity
        </h1>
        <div className="space-y-4">
          <input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 outline-none"
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 outline-none"
          />
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 outline-none"
          >
            <option value="scholarship">Scholarship</option>
            <option value="internship">Internship</option>
            <option value="job">Job</option>
            <option value="grant">Grant</option>
          </select>
          <input
            placeholder="External link (optional)"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 outline-none"
          />
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 outline-none"
          />
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-gradient-to-r from-neon-blue to-neon-purple px-6 py-3 rounded-xl font-semibold w-full"
          >
            {loading ? "Posting..." : "Post Opportunity"}
          </button>
        </div>
      </GlassCard>
    </motion.div>
  );
}