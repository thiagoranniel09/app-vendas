import { useEffect, useState } from "react";
import { supabase } from "./supabase";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Sales from "./pages/Sales";
import NewSale from "./pages/NewSale";

export default function App() {
  const [session, setSession] = useState(null);
  const [tab, setTab] = useState("dashboard");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    const { data } = supabase.auth.onAuthStateChange(
      (_, session) => setSession(session)
    );

    return () => data.subscription.unsubscribe();
  }, []);

  if (!session) return <Login setSession={setSession} />;

  return (
    <div style={styles.app}>

      {/* CONTEÚDO */}
      <div style={styles.content}>
        {tab === "dashboard" && <Dashboard session={session} />}
        {tab === "sales" && <Sales session={session} />}
        {tab === "new" && <NewSale session={session} setTab={setTab} />}
      </div>

      {/* NAVBAR */}
      <div style={styles.nav}>

        <button onClick={() => setTab("dashboard")}>📊</button>

        <button onClick={() => setTab("new")}>➕</button>

        <button onClick={() => setTab("sales")}>📦</button>

      </div>
    </div>
  );
}

const styles = {
  app: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    background: "#f8fafc",
  },

  content: {
    flex: 1,
    overflow: "auto",
    padding: 16,
  },

  nav: {
    height: 60,
    background: "white",
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    borderTop: "1px solid #e2e8f0",
  },
};