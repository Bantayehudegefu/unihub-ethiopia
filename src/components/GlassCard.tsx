import { motion } from "framer-motion";

export default function GlassCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div whileHover={{ scale: 1.02 }} className={`glass p-6 rounded-2xl ${className}`}>
      {children}
    </motion.div>
  );
}