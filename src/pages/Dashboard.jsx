import { useEffect, useMemo, useState } from "react";
import { supabase } from "../supabase";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

export default function Dashboard({ session }) {
  const user = session.user;

  const [sales, setSales] = useState([]);

  // =========================
  // 📦 CARREGAR VENDAS
  // =========================
  async function loadSales() {
    const { data } = await supabase
      .from("sales")
      .select("*")
      .eq("user_id", user.id);

    setSales(data || []);
  }

  useEffect(() => {
    loadSales();
  }, []);

  // =========================
  // 📊 KPIs
  // =========================
  const totalRevenue = sales.reduce(
    (acc, s) => acc + Number(s.valor || 0) * Number(s.quantidade || 0),
    0
  );

  const totalCost = sales.reduce(
    (acc, s) => acc + Number(s.custo || 0) * Number(s.quantidade || 0),
    0
  );

  const profit = totalRevenue - totalCost;

  const totalSales = sales.length;

  // =========================
  // 📈 GRÁFICO LINE (dia a dia)
  // =========================
  const lineData = useMemo(() => {
    const map = {};

    sales.forEach((s) => {
      const date = s.data;

      if (!map[date]) {
        map[date] = {
          date,
          revenue: 0,
          cost: 0,
        };
      }

      map[date].revenue += Number(s.valor || 0) * Number(s.quantidade || 0);
      map[date].cost += Number(s.custo || 0) * Number(s.quantidade || 0);
    });

    return Object.values(map);
  }, [sales]);

  // =========================
  // 📊 TOP PRODUTOS
  // =========================
  const barData = useMemo(() => {
    const map = {};

    sales.forEach((s) => {
      if (!map[s.produto]) {
        map[s.produto] = {
          name: s.produto,
          qty: 0,
        };
      }

      map[s.produto].qty += Number(s.quantidade || 0);
    });

    return Object.values(map);
  }, [sales]);

  return (
    <div style={styles.page}>

      <h2>Dashboard Financeiro</h2>

      {/* ========================= */}
      {/* 📊 KPI STRIPE */}
      {/* ========================= */}
      <div style={styles.kpis}>

        <div style={styles.card}>
          <h4>Receita</h4>
          <p>R$ {totalRevenue.toFixed(2)}</p>
        </div>

        <div style={styles.card}>
          <h4>Custos</h4>
          <p>R$ {totalCost.toFixed(2)}</p>
        </div>

        <div style={styles.card}>
          <h4>Lucro</h4>
          <p style={{ color: "green" }}>
            R$ {profit.toFixed(2)}
          </p>
        </div>

        <div style={styles.card}>
          <h4>Vendas</h4>
          <p>{totalSales}</p>
        </div>

      </div>

      {/* ========================= */}
      {/* 📈 GRÁFICO LINHA */}
      {/* ========================= */}
      <div style={styles.chart}>
        <h3>Faturamento vs Custos</h3>

        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={lineData}>

            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />

            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#4F46E5"
              strokeWidth={2}
            />

            <Line
              type="monotone"
              dataKey="cost"
              stroke="#EF4444"
              strokeWidth={2}
            />

          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* ========================= */}
      {/* 📊 BARRAS */}
      {/* ========================= */}
      <div style={styles.chart}>
        <h3>Produtos mais vendidos</h3>

        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={barData}>

            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />

            <Bar dataKey="qty" fill="#4F46E5" />

          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}

// =========================
// 🎨 STYLE STRIPE
// =========================
const styles = {
  page: {
    padding: 16,
  },

  kpis: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 10,
    marginBottom: 16,
  },

  card: {
    background: "white",
    padding: 12,
    borderRadius: 12,
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
  },

  chart: {
    background: "white",
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
};