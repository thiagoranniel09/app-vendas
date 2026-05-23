import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { Card, Button } from "../components/ui";
import { motion } from "framer-motion";

export default function Sales({ session }) {
  const [sales, setSales] = useState([]);
  const user = session.user;

  async function load() {
    const { data } = await supabase
      .from("sales")
      .select("*")
      .eq("user_id", user.id)
      .order("id", { ascending: false });

    setSales(data || []);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(id) {
    await supabase.from("sales").delete().eq("id", id);
    load();
  }

  return (
    <div style={{ padding: 16, background: "#f8fafc", minHeight: "100vh" }}>
      <h2>Vendas</h2>
      <p style={{ color: "#64748B", fontSize: 13 }}>histórico de vendas</p>

      <div style={{ marginTop: 12 }}>
        {sales.map((s, index) => {
          const lucro = (s.valor - s.custo) * s.quantidade;

          return (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card style={{ marginBottom: 10 }}>
                <strong>{s.produto}</strong>

                <p style={{ fontSize: 12, color: "#64748B" }}>
                  Qtd: {s.quantidade} • Data: {s.data}
                </p>

                <p style={{ fontSize: 12 }}>
                  Lucro:{" "}
                  <span style={{ color: lucro >= 0 ? "#16A34A" : "#DC2626" }}>
                    R$ {lucro.toFixed(2)}
                  </span>
                </p>

                <Button variant="secondary" onClick={() => handleDelete(s.id)}>
                  Excluir
                </Button>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}