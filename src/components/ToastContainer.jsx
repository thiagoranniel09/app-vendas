import { useEffect, useState } from "react";
import { subscribeToast } from "./toast";

export default function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    return subscribeToast((t) => {
      const id = Date.now();

      setToasts((prev) => [...prev, { ...t, id }]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((x) => x.id !== id));
      }, 2500);
    });
  }, []);

  return (
    <div style={styles.container}>
      {toasts.map((t) => (
        <div
          key={t.id}
          style={{
            ...styles.toast,
            background:
              t.type === "error" ? "#ef4444" : "#22c55e",
          }}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}

const styles = {
  container: {
    position: "fixed",
    top: 16,
    right: 16,
    zIndex: 9999,
  },

  toast: {
    color: "white",
    padding: "10px 14px",
    borderRadius: 10,
    marginBottom: 8,
    boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
    fontSize: 13,
  },
};