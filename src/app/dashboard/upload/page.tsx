"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";

export default function UploadPage() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [courseId, setCourseId] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.from("courses").select("*").then(({ data }) => setCourses(data || []));
  }, []);

  const handleUpload = async () => {
    if (!file || !title || !courseId) return toast.error("Fill all fields");
    setLoading(true);
    const { data: user } = await supabase.auth.getUser();
    const fileExt = file.name.split(".").pop();
    const filePath = `${user.user!.id}/${Date.now()}.${fileExt}`;
    await supabase.storage.from("materials").upload(filePath, file);
    const { data: urlData } = supabase.storage.from("materials").getPublicUrl(filePath);
    await supabase.from("materials").insert({
      title, description: desc, file_url: urlData.publicUrl, course_id: courseId, user_id: user.user!.id
    });
    toast.success("Material uploaded!");
    setLoading(false);
    setTitle(""); setDesc(""); setFile(null);
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Upload Material</h1>
      <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-white/5 p-3 rounded-xl" />
      <textarea placeholder="Description" value={desc} onChange={e => setDesc(e.target.value)} className="w-full bg-white/5 p-3 rounded-xl" />
      <select value={courseId} onChange={e => setCourseId(e.target.value)} className="w-full bg-white/5 p-3 rounded-xl">
        <option value="">Select Course</option>
        {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
      </select>
      <input type="file" accept=".pdf,.doc,.docx,.ppt,.pptx" onChange={e => setFile(e.target.files?.[0] || null)} className="w-full" />
      <button onClick={handleUpload} disabled={loading} className="bg-gradient-to-r from-neon-blue to-neon-purple px-6 py-3 rounded-xl font-semibold">
        {loading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
}