import { useState } from "react";
import { supabase } from "../supabase";

export default function Login({ setSession }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("login"); // login | signup
  const [error, setError] = useState("");

  // =========================
  // 🔐 LOGIN
  // =========================
  async function handleLogin() {
    setLoading(true);
    setError("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      setSession(data.session);
    }

    setLoading(false);
  }

  // =========================
  // 🆕 CADASTRO
  // =========================
  async function handleSignup() {
    setLoading(true);
    setError("");

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      setError("Conta criada! Confirme o email se necessário.");
      setMode("login");
    }

    setLoading(false);
  }

  return (
    <div style={styles.container}>

      {/* CARD */}
      <div style={styles.card}>

        <h1 style={styles.title}>Vendify</h1>
        <p style={styles.subtitle}>
          Gestão de vendas e estoque
        </p>

        {/* EMAIL */}
        <input
          style={styles.input}
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* SENHA */}
        <input
          style={styles.input}
          placeholder="Senha"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* ERRO */}
        {error && (
          <p style={styles.error}>{error}</p>
        )}

        {/* BOTÃO */}
        <button
          onClick={
            mode === "login"
              ? handleLogin
              : handleSignup
          }
          disabled={loading}
          style={styles.button}
        >
          {loading
            ? "Carregando..."
            : mode === "login"
              ? "Entrar"
              : "Criar conta"}
        </button>

        {/* TROCAR MODO */}
        <p
          onClick={() =>
            setMode(
              mode === "login"
                ? "signup"
                : "login"
            )
          }
          style={styles.switch}
        >
          {mode === "login"
            ? "Não tem conta? Criar agora"
            : "Já tem conta? Entrar"}
        </p>

      </div>

    </div>
  );
}

// =========================
// 🎨 STYLE LOGIN MODERNO
// =========================
const styles = {
  container: {
    height: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #EEF2FF, #F8FAFC)",
    padding: 20,
  },

  card: {
    width: "100%",
    maxWidth: 360,
    background: "white",
    padding: 24,
    borderRadius: 16,
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
    textAlign: "center",
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 13,
    color: "#64748B",
    marginBottom: 18,
  },

  input: {
    width: "100%",
    padding: 12,
    marginBottom: 10,
    borderRadius: 10,
    border: "1px solid #E2E8F0",
    outline: "none",
  },

  button: {
    width: "100%",
    padding: 12,
    borderRadius: 10,
    border: "none",
    background: "#4F46E5",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: 10,
  },

  switch: {
    marginTop: 14,
    fontSize: 13,
    color: "#4F46E5",
    cursor: "pointer",
  },

  error: {
    color: "red",
    fontSize: 12,
    marginBottom: 8,
  },
};