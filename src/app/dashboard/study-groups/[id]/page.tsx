"use client";
import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import GlassCard from "@/components/GlassCard";
import { motion } from "framer-motion";
import { Send, User } from "lucide-react";
import toast from "react-hot-toast";

export default function StudyGroupDetail() {
  const { id } = useParams();
  const [group, setGroup] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMsg, setNewMsg] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null));
  }, []);

  useEffect(() => {
    // fetch group info
    supabase
      .from("study_groups")
      .select("*, courses(name), profiles(full_name)")
      .eq("id", id)
      .single()
      .then(({ data }) => setGroup(data));

    // fetch members
    supabase
      .from("group_members")
      .select("profiles(id, full_name, avatar_url)")
      .eq("group_id", id)
      .then(({ data }) => setMembers(data?.map((m: any) => m.profiles) || []));

    // fetch existing messages
    supabase
      .from("messages")
      .select("*, profiles!sender_id(full_name)")
      .eq("group_id", id)
      .order("created_at", { ascending: true })
      .then(({ data }) => setMessages(data || []));

    // realtime subscription for new messages
    const channel = supabase
      .channel(`group-${id}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `group_id=eq.${id}` },
        (payload) => setMessages((prev) => [...prev, payload.new])
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id]);

  useEffect(() => {
    chatRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!newMsg.trim()) return;
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) return toast.error("Sign in first");
    await supabase.from("messages").insert({
      group_id: id,
      sender_id: user.user.id,
      content: newMsg,
    });
    setNewMsg("");
  };

  if (!group) return <div className="p-8 text-center">Loading group...</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto space-y-6">
      <GlassCard>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
          {group.name}
        </h1>
        <p className="text-gray-400">
          Course: {group.courses?.name} | Created by {group.profiles?.full_name}
        </p>
      </GlassCard>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Members Section */}
        <GlassCard className="md:col-span-1">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <User size={20} /> Members ({members.length})
          </h2>
          <div className="space-y-2">
            {members.map((member: any) => (
              <div key={member.id} className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-neon-blue/20 flex items-center justify-center text-sm">
                  {member.full_name?.[0]?.toUpperCase()}
                </div>
                <span className="text-sm">{member.full_name}</span>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Group Chat Section */}
        <GlassCard className="md:col-span-2 flex flex-col h-[calc(100vh-20rem)]">
          <h2 className="text-xl font-semibold mb-4">Group Chat</h2>
          <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-2">
            {messages.map((msg: any) => (
              <div key={msg.id} className={`flex ${msg.sender_id === userId ? "justify-end" : ""}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl ${msg.sender_id === userId ? "bg-neon-blue/20" : "bg-white/5"}`}>
                  {msg.sender_id !== userId && msg.profiles && (
                    <p className="text-xs text-neon-blue mb-1">{msg.profiles.full_name}</p>
                  )}
                  <p className="text-sm">{msg.content}</p>
                </div>
              </div>
            ))}
            <div ref={chatRef} />
          </div>
          <div className="flex gap-2">
            <input
              value={newMsg}
              onChange={(e) => setNewMsg(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type a message..."
              className="flex-1 bg-white/5 border border-white/10 rounded-xl p-2 outline-none"
            />
            <button onClick={sendMessage} className="bg-neon-blue/20 p-2 rounded-xl">
              <Send size={18} />
            </button>
          </div>
        </GlassCard>
      </div>
    </motion.div>
  );
}