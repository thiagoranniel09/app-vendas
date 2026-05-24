import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { Card } from "../components/ui";

export default function Sales({ session }) {
  const user = session.user;

  const [sales, setSales] = useState([]);
  const [filter, setFilter] = useState("all");

  // =========================
  // 📦 CARREGAR VENDAS
  // =========================
  async function loadSales() {
    const { data } = await supabase
      .from("sales")
      .select("*")
      .eq("user_id", user.id)
      .order("id", { ascending: false });

    setSales(data || []);
  }

  useEffect(() => {
    loadSales();
  }, []);

  // =========================
  // 📊 FILTROS
  // =========================
  const today = new Date().toISOString().split("T")[0];

  const filteredSales = sales.filter((s) => {
    if (filter === "today") return s.data === today;
    return true;
  });

  // =========================
  // 💰 RESUMO
  // =========================
  const totalRevenue = filteredSales.reduce(
    (acc, s) => acc + s.valor * s.quantidade,
    0
  );

  const totalCost = filteredSales.reduce(
    (acc, s) => acc + s.custo * s.quantidade,
    0
  );

  const totalProfit = totalRevenue - totalCost;

  return (
    <div style={styles.page}>

      <h2>Vendas</h2>

      {/* ========================= */}
      {/* 📊 KPI CARDS */}
      {/* ========================= */}
      <div style={styles.kpis}>

        <Card>
          <p>Faturamento</p>
          <h3>R$ {totalRevenue.toFixed(2)}</h3>
        </Card>

        <Card>
          <p>Custo</p>
          <h3>R$ {totalCost.toFixed(2)}</h3>
        </Card>

        <Card>
          <p>Lucro</p>
          <h3 style={{ color: totalProfit >= 0 ? "green" : "red" }}>
            R$ {totalProfit.toFixed(2)}
          </h3>
        </Card>

      </div>

      {/* ========================= */}
      {/* 🔎 FILTROS */}
      {/* ========================= */}
      <div style={styles.filters}>

        <button
          onClick={() => setFilter("all")}
          style={filter === "all" ? styles.activeBtn : styles.btn}
        >
          Todas
        </button>

        <button
          onClick={() => setFilter("today")}
          style={filter === "today" ? styles.activeBtn : styles.btn}
        >
          Hoje
        </button>

      </div>

      {/* ========================= */}
      {/* 📦 LISTA DE VENDAS */}
      {/* ========================= */}
      <div style={{ marginTop: 12 }}>

        {filteredSales.map((s) => {

          const lucro =
            (s.valor * s.quantidade) - (s.custo * s.quantidade);

          return (
            <Card key={s.id} style={styles.saleCard}>

              <div style={styles.row}>
                <strong>{s.produto}</strong>
                <span>📅 {s.data}</span>
              </div>

              <div style={styles.info}>
                <p>Qtd: {s.quantidade}</p>
                <p>Valor: R$ {s.valor}</p>
                <p>Custo: R$ {s.custo}</p>
              </div>

              <div style={styles.footer}>
                <strong style={{ color: lucro >= 0 ? "green" : "red" }}>
                  Lucro: R$ {lucro.toFixed(2)}
                </strong>
              </div>

            </Card>
          );
        })}

      </div>

    </div>
  );
}

// =========================
// 🎨 STYLES
// =========================
const styles = {
  page: {
    padding: 16,
  },

  kpis: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 10,
    marginTop: 10,
  },

  filters: {
    display: "flex",
    gap: 8,
    marginTop: 15,
  },

  btn: {
    padding: 8,
    borderRadius: 8,
    border: "1px solid #ddd",
    background: "white",
  },

  activeBtn: {
    padding: 8,
    borderRadius: 8,
    border: "1px solid #4F46E5",
    background: "#EEF2FF",
    color: "#4F46E5",
  },

  saleCard: {
    marginBottom: 10,
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
  },

  info: {
    marginTop: 8,
    fontSize: 13,
    color: "#64748B",
    display: "flex",
    justifyContent: "space-between",
  },

  footer: {
    marginTop: 10,
    textAlign: "right",
  },
};