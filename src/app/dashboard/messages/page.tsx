"use client";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";
import { Send } from "lucide-react";

export default function MessagesPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMsg, setNewMsg] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null));
    fetchMessages();
    const channel = supabase
      .channel("messages")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, (payload) => {
        setMessages((prev) => [...prev, payload.new]);
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const fetchMessages = async () => {
    const { data } = await supabase.from("messages").select("*").order("created_at", { ascending: true }).limit(50);
    setMessages(data || []);
  };

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const sendMessage = async () => {
    if (!newMsg.trim()) return;
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) return toast.error("Not logged in");
    // For simplicity, this broadcasts to a general chat (receiver_id = null, group_id = null)
    await supabase.from("messages").insert({ sender_id: user.user.id, content: newMsg });
    setNewMsg("");
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-2xl mx-auto">
      <div className="flex-1 overflow-y-auto space-y-4 p-4 glass rounded-2xl mb-4">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.sender_id === userId ? "justify-end" : ""}`}>
            <div className={`max-w-[75%] p-3 rounded-2xl ${m.sender_id === userId ? "bg-neon-blue/20" : "bg-white/5"}`}>
              <p className="text-sm">{m.content}</p>
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      <div className="flex gap-2">
        <input value={newMsg} onChange={e => setNewMsg(e.target.value)} className="flex-1 bg-white/5 p-3 rounded-xl" placeholder="Type a message..." onKeyDown={e => e.key === "Enter" && sendMessage()} />
        <button onClick={sendMessage} className="bg-neon-blue/20 p-3 rounded-xl"><Send /></button>
      </div>
    </div>
  );
}