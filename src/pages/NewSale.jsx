import { useState } from "react";
import { supabase } from "../supabase";
import { Card, Button, InputField } from "../components/ui";
import { motion } from "framer-motion";

export default function NewSale({ session, setTab }) {
  const user = session.user;
  const today = new Date().toISOString().split("T")[0];

  const [produto, setProduto] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [valor, setValor] = useState("");
  const [custo, setCusto] = useState("");
  const [data, setData] = useState(today);

  async function handleSave() {
    if (!produto || !quantidade || !valor || !custo) return;

    await supabase.from("sales").insert([
      {
        produto,
        quantidade: Number(quantidade),
        valor: Number(valor),
        custo: Number(custo),
        data,
        user_id: user.id,
      },
    ]);

    setProduto("");
    setQuantidade("");
    setValor("");
    setCusto("");
    setData(today);

    if (setTab) setTab("sales");
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      style={{ padding: 16, background: "#F8FAFC", minHeight: "100vh" }}
    >
      <h2>Nova venda</h2>
      <p style={{ color: "#64748B", fontSize: 13 }}>registre uma venda</p>

      <Card style={{ maxWidth: 520, marginTop: 12 }}>
        <InputField
          label="Produto"
          placeholder="Ex: Coca-Cola 2L"
          value={produto}
          onChange={(e) => setProduto(e.target.value)}
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
            gap: 8,
            marginTop: 8,
          }}
        >
          <InputField
            label="Qtd"
            type="number"
            value={quantidade}
            onChange={(e) => setQuantidade(e.target.value)}
          />

          <InputField
            label="Valor"
            type="number"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
          />

          <InputField
            label="Custo"
            type="number"
            value={custo}
            onChange={(e) => setCusto(e.target.value)}
          />
        </div>

        <div style={{ marginTop: 10 }}>
          <InputField
            label="Data da venda"
            type="date"
            value={data}
            onChange={(e) => setData(e.target.value)}
          />
        </div>

        <div style={{ marginTop: 14 }}>
          <Button onClick={handleSave}>Registrar venda</Button>
        </div>
      </Card>
    </motion.div>
  );
}