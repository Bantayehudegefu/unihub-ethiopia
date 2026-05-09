"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";
import { Camera } from "lucide-react";

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>({});
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    const fetch = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      setProfile(data);
      setFullName(data.full_name);
      setBio(data.bio || "");
    };
    fetch();
  }, []);

  const updateProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from("profiles").update({ full_name: fullName, bio }).eq("id", user!.id);
    toast.success("Profile updated");
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="flex items-center gap-6">
        <div className="relative w-24 h-24 rounded-full bg-white/10 flex items-center justify-center">
          {avatarUrl ? <img src={avatarUrl} className="w-full h-full rounded-full" /> : <Camera />}
        </div>
        <div>
          <h1 className="text-3xl font-bold">{profile.full_name}</h1>
          <p className="text-gray-400">{profile.university} · {profile.department}</p>
        </div>
      </div>
      <input value={fullName} onChange={e => setFullName(e.target.value)} className="w-full bg-white/5 p-3 rounded-xl" />
      <textarea value={bio} onChange={e => setBio(e.target.value)} className="w-full bg-white/5 p-3 rounded-xl" placeholder="Bio" />
      <button onClick={updateProfile} className="bg-gradient-to-r from-neon-blue to-neon-purple px-6 py-2 rounded-full">Save</button>
    </div>
  );
}