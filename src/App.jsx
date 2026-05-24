import { useEffect, useState } from "react";
import { supabase } from "./supabase";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Sales from "./pages/Sales";
import NewSale from "./pages/NewSale";
import Stock from "./pages/Stock";

import ToastContainer from "./components/ToastContainer";

export default function App() {
  const [session, setSession] = useState(null);
  const [tab, setTab] = useState("dashboard");
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    const { data } = supabase.auth.onAuthStateChange(
      (_, session) => setSession(session)
    );

    return () => data.subscription.unsubscribe();
  }, []);

  function changeTab(newTab) {
    setAnimating(true);

    setTimeout(() => {
      setTab(newTab);
      setAnimating(false);
    }, 150);
  }

  if (!session) return <Login setSession={setSession} />;

  return (
    <div style={styles.app}>

      {/* CONTENT COM ANIMAÇÃO */}
      <div
        style={{
          ...styles.content,
          opacity: animating ? 0 : 1,
          transform: animating
            ? "translateY(10px)"
            : "translateY(0)",
        }}
      >
        {tab === "dashboard" && <Dashboard session={session} />}
        {tab === "new" && (
          <NewSale session={session} setTab={changeTab} />
        )}
        {tab === "sales" && <Sales session={session} />}
        {tab === "stock" && <Stock session={session} />}
      </div>

      {/* NAVBAR FIXA */}
      <div style={styles.nav}>

        <NavButton
          icon="📊"
          label="Dash"
          active={tab === "dashboard"}
          onClick={() => changeTab("dashboard")}
        />

        <NavButton
          icon="➕"
          label="Venda"
          active={tab === "new"}
          onClick={() => changeTab("new")}
        />

        <NavButton
          icon="📦"
          label="Vendas"
          active={tab === "sales"}
          onClick={() => changeTab("sales")}
        />

        <NavButton
          icon="🏪"
          label="Estoque"
          active={tab === "stock"}
          onClick={() => changeTab("stock")}
        />

      </div>

      <ToastContainer />

    </div>
  );
}

// =========================
// BOTÃO NAV MODERNO
// =========================
function NavButton({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        ...styles.btn,
        background: active ? "#EEF2FF" : "transparent",
        color: active ? "#4F46E5" : "#64748B",
        transform: active ? "translateY(-2px)" : "none",
      }}
    >
      <span style={{ fontSize: 18 }}>{icon}</span>
      <span style={{ fontSize: 11 }}>{label}</span>
    </button>
  );
}

const styles = {
  app: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    background: "#F8FAFC",
  },

  content: {
    flex: 1,
    overflow: "auto",
    padding: 16,
    paddingBottom: 90,
    transition: "all 0.2s ease",
  },

  nav: {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    background: "white",
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    borderTop: "1px solid #E2E8F0",
  },

  btn: {
    border: "none",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 2,
    padding: 8,
    borderRadius: 12,
    transition: "0.2s",
  },
};