import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { Card, Button } from "../components/ui";
import { toast } from "../components/toast";

export default function NewSale({ session, setTab }) {
  const user = session.user;

  const [products, setProducts] = useState([]);
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [customPrice, setCustomPrice] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);

  const today = new Date().toISOString().split("T")[0];

  // =========================
  // 📦 CARREGAR PRODUTOS
  // =========================
  async function loadProducts() {
    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("user_id", user.id);

    setProducts(data || []);
  }

  useEffect(() => {
    loadProducts();
  }, []);

  // =========================
  // 📌 SELEÇÃO DO PRODUTO
  // =========================
  useEffect(() => {
    const prod = products.find(
      (p) => p.id === Number(productId)
    );

    setSelectedProduct(prod || null);

    if (prod) {
      setCustomPrice(prod.valor_venda);
    }
  }, [productId, products]);

  // =========================
  // 🔢 NORMALIZAÇÃO SEGURA
  // =========================
  const unitCost = Number(selectedProduct?.custo || 0);
  const unitPrice = Number(customPrice || selectedProduct?.valor_venda || 0);
  const qty = Number(quantity || 0);

  const totalCost = unitCost * qty;
  const totalRevenue = unitPrice * qty;
  const profit = totalRevenue - totalCost;

  const stock = Number(selectedProduct?.quantidade || 0);
  const outOfStock = qty > stock;

  // =========================
  // 🚨 ALERTA INTELIGENTE
  // =========================
  const isInvalidMargin = unitPrice < unitCost;

  // =========================
  // 💾 SALVAR VENDA
  // =========================
  async function handleSale() {
    if (!selectedProduct) {
      toast("Selecione um produto", "error");
      return;
    }

    if (outOfStock) {
      toast("Estoque insuficiente", "error");
      return;
    }

    if (isInvalidMargin) {
      toast("Preço menor que custo (prejuízo)", "error");
      return;
    }

    await supabase.from("sales").insert([
      {
        user_id: user.id,
        produto: selectedProduct.nome,
        quantidade: qty,
        valor: unitPrice,
        custo: unitCost,
        data: today,
      },
    ]);

    await supabase
      .from("products")
      .update({
        quantidade: stock - qty,
      })
      .eq("id", selectedProduct.id);

    toast("Venda registrada com sucesso!");

    setTab("dashboard");
  }

  return (
    <div style={{ padding: 16, paddingBottom: 120 }}>

      <h2>Nova Venda</h2>

      <Card>

        {/* PRODUTO */}
        <label>Produto</label>
        <select
          value={productId}
          onChange={(e) =>
            setProductId(e.target.value)
          }
          style={styles.input}
        >
          <option value="">Selecione</option>

          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nome} (estoque: {p.quantidade})
            </option>
          ))}
        </select>

        {/* QUANTIDADE */}
        <label>Quantidade</label>
        <input
          type="number"
          value={quantity}
          onChange={(e) =>
            setQuantity(e.target.value)
          }
          style={styles.input}
        />

        {/* PREÇO */}
        <label>Preço de venda (unitário)</label>
        <input
          type="number"
          value={customPrice}
          onChange={(e) =>
            setCustomPrice(e.target.value)
          }
          style={styles.input}
        />

        {/* ALERTAS */}
        {outOfStock && (
          <p style={{ color: "red" }}>
            ⚠ Estoque insuficiente
          </p>
        )}

        {isInvalidMargin && (
          <p style={{ color: "orange" }}>
            ⚠ Venda com prejuízo
          </p>
        )}

        {/* RESUMO CORRETO */}
        <div style={styles.preview}>
          <p>💸 Custo total: R$ {totalCost.toFixed(2)}</p>
          <p>💰 Faturamento: R$ {totalRevenue.toFixed(2)}</p>
          <p style={{ color: "green" }}>
            📈 Lucro: R$ {profit.toFixed(2)}
          </p>
        </div>

      </Card>

      {/* BOTÃO FIXO */}
      <div style={styles.fixed}>
        <Button onClick={handleSale}>
          Confirmar Venda
        </Button>
      </div>

    </div>
  );
}

const styles = {
  input: {
    width: "100%",
    padding: 10,
    margin: "6px 0 12px",
    borderRadius: 8,
    border: "1px solid #ddd",
  },

  preview: {
    marginTop: 12,
    padding: 10,
    background: "#eef2ff",
    borderRadius: 8,
  },

  fixed: {
    position: "fixed",
    bottom: 80,
    left: 16,
    right: 16,
  },
};