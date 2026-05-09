"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Bell, Menu, X, LogOut, User, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Notifications from "./Notifications";

export default function Navbar() {
  const [session, setSession] = useState<any>(null);
  const [showNotif, setShowNotif] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => setSession(session));
    return () => listener.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass backdrop-blur-lg border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
          UniHub Ethiopia
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/dashboard" className="hover:text-neon-blue transition">Dashboard</Link>
          <Link href="/dashboard/search" className="hover:text-neon-blue transition"><Search size={18} /></Link>
          {session ? (
            <>
              <Link href="/dashboard/messages" className="hover:text-neon-blue transition">Messages</Link>
              <button onClick={() => setShowNotif(!showNotif)} className="relative">
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              <Link href="/dashboard/profile"><User size={20} /></Link>
              <button onClick={handleLogout}><LogOut size={20} /></button>
            </>
          ) : (
            <Link href="/auth" className="bg-gradient-to-r from-neon-blue to-neon-purple px-4 py-1 rounded-full text-white text-sm">
              Login
            </Link>
          )}
        </div>

        <div className="md:hidden">
          <button onClick={() => setMobileMenu(!mobileMenu)}>{mobileMenu ? <X /> : <Menu />}</button>
        </div>
      </div>

      <AnimatePresence>
        {showNotif && <Notifications onClose={() => setShowNotif(false)} />}
      </AnimatePresence>

      {mobileMenu && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="md:hidden glass p-4 space-y-3">
          {/* same links as desktop */}
        </motion.div>
      )}
    </nav>
  );
}