"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Upload, Search, FolderOpen, User, MessageCircle, ShoppingBag, Briefcase, Bot, Users } from "lucide-react";
import { motion } from "framer-motion";

const links = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Home" },
  { href: "/dashboard/upload", icon: Upload, label: "Upload" },
  { href: "/dashboard/search", icon: Search, label: "Search" },
  { href: "/dashboard/materials", icon: FolderOpen, label: "Materials" }, // we use dynamic id route but can list
  { href: "/dashboard/profile", icon: User, label: "Profile" },
  { href: "/dashboard/messages", icon: MessageCircle, label: "Messages" },
  { href: "/dashboard/marketplace", icon: ShoppingBag, label: "Marketplace" },
  { href: "/dashboard/opportunities", icon: Briefcase, label: "Opportunities" },
  { href: "/dashboard/ai-assistant", icon: Bot, label: "AI Assistant" },
  { href: "/dashboard/study-groups", icon: Users, label: "Groups" },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden md:flex flex-col w-64 glass border-r border-white/10 p-4 space-y-2">
      {links.map((link) => (
        <Link key={link.href} href={link.href}>
          <motion.div whileHover={{ x: 4 }} className={`flex items-center gap-3 p-3 rounded-xl transition ${pathname === link.href ? "bg-neon-blue/10 text-neon-blue" : "hover:bg-white/5"}`}>
            <link.icon size={20} />
            <span>{link.label}</span>
          </motion.div>
        </Link>
      ))}
    </aside>
  );
}