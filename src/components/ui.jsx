import { motion } from "framer-motion";

// =========================
// 📦 CARD ANIMADO
// =========================
export function Card({ children, style }) {
  return (
    <motion.div
      whileHover={{
        scale: 1.02,
        y: -2,
        boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.15 }}
      style={{
        background: "#fff",
        border: "1px solid #E2E8F0",
        borderRadius: 14,
        padding: 16,
        width: "100%",
        boxSizing: "border-box",
        ...style,
      }}
    >
      {children}
    </motion.div>
  );
}

// =========================
// 🔘 BOTÃO ANIMADO
// =========================
export function Button({ children, onClick, variant }) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      style={{
        width: "100%",
        padding: "12px 14px",
        borderRadius: 12,
        border: variant === "secondary" ? "1px solid #E2E8F0" : "none",
        background: variant === "secondary" ? "#fff" : "#2563EB",
        color: variant === "secondary" ? "#0F172A" : "#fff",
        fontSize: 14,
        cursor: "pointer",
        transition: "0.2s",
      }}
    >
      {children}
    </motion.button>
  );
}

// =========================
// ✏️ INPUT MODERNO
// =========================
export function InputField({ label, ...props }) {
  return (
    <div style={{ width: "100%", minWidth: 0 }}>
      {label && (
        <label style={{ fontSize: 12, color: "#64748B", display: "block", marginBottom: 6 }}>
          {label}
        </label>
      )}

      <input
        {...props}
        style={{
          width: "100%",
          boxSizing: "border-box",
          padding: "10px 12px",
          borderRadius: 10,
          border: "1px solid #E2E8F0",
          fontSize: 14,
          outline: "none",
          transition: "0.2s",
        }}
        onFocus={(e) => {
          e.target.style.border = "1px solid #2563EB";
          e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.15)";
        }}
        onBlur={(e) => {
          e.target.style.border = "1px solid #E2E8F0";
          e.target.style.boxShadow = "none";
        }}
      />
    </div>
  );
}