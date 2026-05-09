"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useParams } from "next/navigation";
import CommentSection from "@/components/CommentSection";
import  toast from "react-hot-toast";

export default function MaterialDetail() {
  const { id } = useParams();
  const [material, setMaterial] = useState<any>(null);

  useEffect(() => {
    supabase.from("materials").select("*, courses(name), profiles(full_name)").eq("id", id).single().then(({ data }) => setMaterial(data));
  }, [id]);

  const handleDownload = () => {
    window.open(material.file_url, "_blank");
    supabase.from("materials").update({ downloads: material.downloads + 1 }).eq("id", id).then(() => {
      toast.success("Download started");
    });
  };

  if (!material) return <div className="p-8">Loading...</div>;
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">{material.title}</h1>
      <p className="text-gray-400">{material.courses?.name} · by {material.profiles?.full_name}</p>
      <p>{material.description}</p>
      <button onClick={handleDownload} className="bg-neon-blue/20 px-6 py-2 rounded-full">Download</button>
      <CommentSection materialId={material.id} />
    </div>
  );
}