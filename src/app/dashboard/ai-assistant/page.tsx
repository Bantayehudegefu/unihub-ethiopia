"use client";
import { useState } from "react";
import { Send, Bot } from "lucide-react";
import toast from "react-hot-toast";

export default function AIAssistantPage() {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const askAI = async () => {
    if (!question.trim()) return;
    setLoading(true);
    // Use your OpenAI key from env
    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: "You are an Ethiopian university study assistant. Answer in a helpful, concise manner." },
            { role: "user", content: question },
          ],
        }),
      });
      const data = await res.json();
      setResponse(data.choices?.[0]?.message?.content || "No response");
    } catch {
      toast.error("AI unavailable");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2"><Bot /> AI Study Assistant</h1>
      <div className="glass rounded-2xl p-6 space-y-4">
        {response && <div className="bg-white/5 p-4 rounded-xl">{response}</div>}
        <div className="flex gap-2">
          <input value={question} onChange={e => setQuestion(e.target.value)} className="flex-1 bg-white/5 p-3 rounded-xl" placeholder="Ask anything..." />
          <button onClick={askAI} disabled={loading} className="bg-neon-blue/20 p-3 rounded-xl"><Send /></button>
        </div>
      </div>
    </div>
  );
}