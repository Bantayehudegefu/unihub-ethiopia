import "../styles/globals.css";
import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import { Toaster } from "react-hot-toast";
import AnimatedBackground from "@/components/AnimatedBackground";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "UniHub Ethiopia",
  description: "Ethiopian university student platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-dark text-gray-200 antialiased`}>
        <AnimatedBackground />
        <Navbar />
        <main className="min-h-screen pt-20">{children}</main>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}