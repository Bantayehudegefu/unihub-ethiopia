"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";
import GlassCard from "@/components/GlassCard";
import { motion } from "framer-motion";
import { Upload } from "lucide-react";

export default function MarketplaceUpload() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleUpload = async () => {
    if (!title || !price) return toast.error("Title and price are required");
    setLoading(true);

    const { data: user } = await supabase.auth.getUser();
    if (!user.user) return toast.error("Not logged in");

    let imageUrl = "";
    if (imageFile) {
      const filePath = `marketplace/${user.user.id}/${Date.now()}-${imageFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from("materials") // we can reuse the same storage bucket for marketplace images
        .upload(filePath, imageFile);
      if (uploadError) {
        toast.error("Image upload failed");
        setLoading(false);
        return;
      }
      const { data: urlData } = supabase.storage.from("materials").getPublicUrl(filePath);
      imageUrl = urlData.publicUrl;
    }

    const { error } = await supabase.from("marketplace_items").insert({
      title,
      description,
      price: parseFloat(price),
      category,
      image_url: imageUrl,
      seller_id: user.user.id,
    });

    if (error) toast.error(error.message);
    else {
      toast.success("Item listed!");
      router.push("/dashboard/marketplace");
    }
    setLoading(false);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-xl mx-auto">
      <GlassCard>
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Upload size={24} /> Sell an Item
        </h1>
        <div className="space-y-4">
          <input
            placeholder="Item title *"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 outline-none"
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 outline-none"
          />
          <div className="flex gap-4">
            <input
              type="number"
              placeholder="Price (ETB) *"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 outline-none"
            />
            <input
              type="text"
              placeholder="Category (e.g., Books, Electronics)"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 outline-none"
            />
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            className="text-sm"
          />
          <button
            onClick={handleUpload}
            disabled={loading}
            className="bg-gradient-to-r from-neon-blue to-neon-purple px-6 py-3 rounded-xl font-semibold w-full"
          >
            {loading ? "Listing..." : "List Item"}
          </button>
        </div>
      </GlassCard>
    </motion.div>
  );
}