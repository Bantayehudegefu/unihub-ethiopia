"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) toast.error(error.message);
      else {
        toast.success("Welcome back!");
        router.push("/dashboard");
      }
    } else {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) toast.error(error.message);
      else if (data.user) {
        await supabase.from("profiles").insert([{ id: data.user.id, full_name: fullName }]);
        toast.success("Account created!");
        router.push("/dashboard");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.form onSubmit={handleSubmit} className="glass p-10 rounded-3xl w-full max-w-md space-y-6" initial={{ scale: 0.9 }} animate={{ scale: 1 }}>
        <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
          {isLogin ? "Welcome Back" : "Create Account"}
        </h2>
        {!isLogin && (
          <input type="text" placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 outline-none" />
        )}
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 outline-none" />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 outline-none" />
        <button type="submit" className="w-full bg-gradient-to-r from-neon-blue to-neon-purple py-3 rounded-xl font-semibold text-white">
          {isLogin ? "Login" : "Sign Up"}
        </button>
        <p className="text-center text-sm">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-neon-blue underline">
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>
      </motion.form>
    </div>
  );
}