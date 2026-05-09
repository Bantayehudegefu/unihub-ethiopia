"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";

export default function CommentSection({ materialId }: { materialId: number }) {
  const [comments, setComments] = useState<any[]>([]);
  const [content, setContent] = useState("");

  useEffect(() => {
    fetchComments();
  }, [materialId]);

  const fetchComments = async () => {
    const { data } = await supabase.from("comments").select("*, profiles(full_name)").eq("material_id", materialId).order("created_at", { ascending: true });
    setComments(data || []);
  };

  const addComment = async () => {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) return toast.error("Sign in");
    await supabase.from("comments").insert({ material_id: materialId, user_id: user.user.id, content });
    setContent("");
    fetchComments();
  };

  return (
    <div className="glass p-6 rounded-2xl space-y-4">
      <h3 className="font-semibold">Comments</h3>
      {comments.map(c => (
        <div key={c.id} className="border-b border-white/10 pb-2"><span className="text-neon-blue text-sm">{c.profiles?.full_name}:</span> {c.content}</div>
      ))}
      <div className="flex gap-2">
        <input value={content} onChange={e => setContent(e.target.value)} className="flex-1 bg-white/5 p-2 rounded-xl" placeholder="Write a comment..." />
        <button onClick={addComment} className="bg-neon-blue/20 px-4 rounded-xl">Post</button>
      </div>
    </div>
  );
}