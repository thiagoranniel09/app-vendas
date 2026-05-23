import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { Card } from "../components/ui";
import { motion } from "framer-motion";

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
  const [sales, setSales] = useState([]);

  const user = session.user;

  // =========================
  // 📥 CARREGAR DADOS
  // =========================
  async function load() {
    const { data } = await supabase
      .from("sales")
      .select("*")
      .eq("user_id", user.id);

    setSales(data || []);
  }

  useEffect(() => {
    load();
  }, []);

  // =========================
  // 📊 KPIs
  // =========================
  const totalSales = sales.length;

  const totalRevenue = sales.reduce(
    (acc, s) => acc + s.valor * s.quantidade,
    0
  );

  const totalCost = sales.reduce(
    (acc, s) => acc + s.custo * s.quantidade,
    0
  );

  const profit = totalRevenue - totalCost;

  // =========================
  // 📈 DADOS POR DIA
  // =========================
  const chartData = Object.values(
    sales.reduce((acc, s) => {
      if (!acc[s.data]) {
        acc[s.data] = { data: s.data, receita: 0, custo: 0 };
      }

      acc[s.data].receita += s.valor * s.quantidade;
      acc[s.data].custo += s.custo * s.quantidade;

      return acc;
    }, {})
  );

  // =========================
  // 📦 TOP PRODUTOS
  // =========================
  const productData = Object.values(
    sales.reduce((acc, s) => {
      if (!acc[s.produto]) {
        acc[s.produto] = { produto: s.produto, qtd: 0 };
      }

      acc[s.produto].qtd += Number(s.quantidade);

      return acc;
    }, {})
  ).sort((a, b) => b.qtd - a.qtd);

  return (
    <div style={{ padding: 16, background: "#f8fafc", minHeight: "100vh" }}>
      
      <h2>Dashboard</h2>
      <p style={{ color: "#64748b", fontSize: 13 }}>
        visão geral do seu negócio
      </p>

      {/* ========================= */}
      {/* 📊 KPIs */}
      {/* ========================= */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: 10,
          marginTop: 12,
        }}
      >
        <KPI title="Vendas" value={totalSales} />
        <KPI title="Faturamento" value={`R$ ${totalRevenue.toFixed(2)}`} />
        <KPI title="Custos" value={`R$ ${totalCost.toFixed(2)}`} />
        <KPI
          title="Lucro"
          value={`R$ ${profit.toFixed(2)}`}
          color={profit >= 0 ? "#16A34A" : "#DC2626"}
        />
      </div>

      {/* ========================= */}
      {/* 📈 GRÁFICO LINHA */}
      {/* ========================= */}
      <Card style={{ marginTop: 16 }}>
        <h3>Faturamento vs Custos</h3>

        <div style={{ width: "100%", height: 250 }}>
          <ResponsiveContainer>
            <LineChart data={chartData}>
              <XAxis dataKey="data" />
              <YAxis />
              <Tooltip />

              <Line
                type="monotone"
                dataKey="receita"
                stroke="#2563EB"
                strokeWidth={2}
              />

              <Line
                type="monotone"
                dataKey="custo"
                stroke="#DC2626"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* ========================= */}
      {/* 📦 TOP PRODUTOS */}
      {/* ========================= */}
      <Card style={{ marginTop: 16 }}>
        <h3>Produtos mais vendidos</h3>

        <div style={{ width: "100%", height: 250 }}>
          <ResponsiveContainer>
            <BarChart data={productData}>
              <XAxis dataKey="produto" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="qtd" fill="#2563EB" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}

// =========================
// 💡 COMPONENTE KPI
// =========================
function KPI({ title, value, color }) {
  return (
    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
      <Card>
        <p style={{ fontSize: 12, color: "#64748b" }}>{title}</p>
        <h3 style={{ margin: 0, color: color || "#0f172a" }}>
          {value}
        </h3>
      </Card>
    </motion.div>
  );
}