import { motion } from "framer-motion";

// PAGE (entrada suave)
export function Page({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      {children}
    </motion.div>
  );
}

// CARD ANIMADO
export function AnimatedCard({ children, style }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      style={style}
    >
      {children}
    </motion.div>
  );
}

// BOTÃO ANIMADO
export function AnimatedButton({ children, onClick }) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.15 }}
      style={{
        width: "100%",
        padding: 12,
        borderRadius: 12,
        border: "none",
        background: "#111827",
        color: "white",
        fontWeight: 500,
        cursor: "pointer",
      }}
    >
      {children}
    </motion.button>
  );
}