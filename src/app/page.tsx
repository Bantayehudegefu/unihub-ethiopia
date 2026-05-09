"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, Users, Search, MessageCircle, Zap, ArrowRight } from "lucide-react";

const features = [
  { icon: BookOpen, title: "Course Materials", desc: "Access shared PDFs, notes, and past exams ordered by course." },
  { icon: Users, title: "Study Groups", desc: "Create or join groups for collaborative learning." },
  { icon: Search, title: "Smart Search", desc: "Find any material across all Ethiopian universities." },
  { icon: MessageCircle, title: "Real-time Chat", desc: "Message classmates instantly." },
  { icon: Zap, title: "AI Study Assistant", desc: "Get instant explanations from our AI tutor." },
];

export default function Landing() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-8">
        <h1 className="text-6xl md:text-8xl font-extrabold bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
          UniHub Ethiopia
        </h1>
        <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto">
          The future of Ethiopian university collaboration. Share materials, chat, find opportunities, and supercharge your studies.
        </p>
        <Link href="/auth" className="inline-flex items-center gap-2 bg-gradient-to-r from-neon-blue to-neon-purple px-8 py-4 rounded-full text-lg font-semibold hover:scale-105 transition">
          Get Started <ArrowRight />
        </Link>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8 mt-24">
        {features.map((f, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass p-8 rounded-2xl hover:border-neon-blue/50 transition">
            <f.icon size={40} className="text-neon-blue mb-4" />
            <h3 className="text-xl font-bold mb-2">{f.title}</h3>
            <p className="text-gray-400">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}