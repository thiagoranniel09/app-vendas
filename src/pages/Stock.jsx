import { useEffect, useMemo, useState } from "react";
import { supabase } from "../supabase";
import { Card, Button } from "../components/ui";

export default function Stock({ session }) {
  const user = session.user;

  const [products, setProducts] = useState([]);

  const [form, setForm] = useState({
    nome: "",
    custo: "",
    valor_venda: "",
    quantidade: 0,
    categoria: "",
    fornecedor: "",
  });

  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState(null);

  const [filters, setFilters] = useState({
    search: "",
    category: "",
    supplier: "",
  });

  // =========================
  // LOAD
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
  // CREATE
  // =========================
  async function createProduct() {
    if (!form.nome) return;

    await supabase.from("products").insert([
      {
        user_id: user.id,
        nome: form.nome,
        custo: Number(form.custo || 0),
        valor_venda: Number(form.valor_venda || 0),
        quantidade: Number(form.quantidade || 0),
        categoria: form.categoria,
        fornecedor: form.fornecedor,
      },
    ]);

    setForm({
      nome: "",
      custo: "",
      valor_venda: "",
      quantidade: 0,
      categoria: "",
      fornecedor: "",
    });

    loadProducts();
  }

  // =========================
  // DELETE
  // =========================
  async function remove(id) {
    if (!confirm("Excluir produto?")) return;
    await supabase.from("products").delete().eq("id", id);
    loadProducts();
  }

  // =========================
  // EDIT
  // =========================
  function openEdit(p) {
    setEditForm(p);
    setEditOpen(true);
  }

  async function saveEdit() {
    await supabase
      .from("products")
      .update({
        nome: editForm.nome,
        custo: Number(editForm.custo),
        valor_venda: Number(editForm.valor_venda),
        quantidade: Number(editForm.quantidade),
        categoria: editForm.categoria,
        fornecedor: editForm.fornecedor,
      })
      .eq("id", editForm.id);

    setEditOpen(false);
    setEditForm(null);
    loadProducts();
  }

  // =========================
  // QUICK STOCK UPDATE
  // =========================
  async function updateQty(p, delta) {
    const newQty = Math.max(0, (p.quantidade || 0) + delta);

    await supabase
      .from("products")
      .update({ quantidade: newQty })
      .eq("id", p.id);

    loadProducts();
  }

  // =========================
  // FILTERS
  // =========================
  const filtered = useMemo(() => {
    return products.filter((p) => {
      return (
        p.nome?.toLowerCase().includes(filters.search.toLowerCase()) &&
        (filters.category ? p.categoria === filters.category : true) &&
        (filters.supplier ? p.fornecedor === filters.supplier : true)
      );
    });
  }, [products, filters]);

  const categories = [...new Set(products.map(p => p.categoria).filter(Boolean))];
  const suppliers = [...new Set(products.map(p => p.fornecedor).filter(Boolean))];

  return (
    <div style={styles.page}>

      <h2 style={styles.title}>Estoque</h2>

      {/* ========================= */}
      {/* FORM */}
      {/* ========================= */}
      <Card style={styles.card}>

        <h3>Novo Produto</h3>

        <input placeholder="Nome do produto"
          value={form.nome}
          onChange={(e) => setForm({ ...form, nome: e.target.value })}
          style={styles.input}
        />

        <input placeholder="Custo"
          type="number"
          value={form.custo}
          onChange={(e) => setForm({ ...form, custo: e.target.value })}
          style={styles.input}
        />

        <input placeholder="Venda"
          type="number"
          value={form.valor_venda}
          onChange={(e) => setForm({ ...form, valor_venda: e.target.value })}
          style={styles.input}
        />

        <input placeholder="Quantidade"
          type="number"
          value={form.quantidade}
          onChange={(e) => setForm({ ...form, quantidade: e.target.value })}
          style={styles.input}
        />

        <input placeholder="Categoria"
          value={form.categoria}
          onChange={(e) => setForm({ ...form, categoria: e.target.value })}
          style={styles.input}
        />

        <input placeholder="Fornecedor"
          value={form.fornecedor}
          onChange={(e) => setForm({ ...form, fornecedor: e.target.value })}
          style={styles.input}
        />

        <Button onClick={createProduct}>
          + Adicionar Produto
        </Button>

      </Card>

      {/* ========================= */}
      {/* FILTERS */}
      {/* ========================= */}
      <div style={styles.filters}>

        <input
          placeholder="Buscar produto..."
          value={filters.search}
          onChange={(e) =>
            setFilters({ ...filters, search: e.target.value })
          }
          style={styles.input}
        />

        <select
          value={filters.category}
          onChange={(e) =>
            setFilters({ ...filters, category: e.target.value })
          }
          style={styles.input}
        >
          <option value="">Categoria</option>
          {categories.map((c, i) => (
            <option key={i}>{c}</option>
          ))}
        </select>

        <select
          value={filters.supplier}
          onChange={(e) =>
            setFilters({ ...filters, supplier: e.target.value })
          }
          style={styles.input}
        >
          <option value="">Fornecedor</option>
          {suppliers.map((s, i) => (
            <option key={i}>{s}</option>
          ))}
        </select>

      </div>

      {/* ========================= */}
      {/* LISTA PREMIUM */}
      {/* ========================= */}
      {filtered.map((p) => {

        const margin = (p.valor_venda || 0) - (p.custo || 0);
        const isLow = (p.quantidade || 0) <= 5;

        return (
          <Card
            key={p.id}
            style={styles.card}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = "scale(0.985)";
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.transform = "scale(1)";
            }}
          >

            {/* HEADER */}
            <div style={styles.rowTop}>
              <strong style={styles.productName}>{p.nome}</strong>

              <span style={{
                ...styles.badge,
                background: isLow ? "#fff1f2" : "#ecfdf5",
                color: isLow ? "#dc2626" : "#16a34a"
              }}>
                {isLow ? "Estoque baixo" : "OK"}
              </span>
            </div>

            {/* INFO */}
            <div style={styles.grid}>
              <div>📦 {p.quantidade}</div>
              <div>💰 R$ {p.custo}</div>
              <div>💵 R$ {p.valor_venda}</div>
              <div>📈 Lucro: R$ {margin}</div>
              <div>🏷 {p.categoria}</div>
              <div>🏭 {p.fornecedor}</div>
            </div>

            {/* ACTIONS (iOS + STRIPE) */}
            <div style={styles.actions}>

              <button style={styles.iconBtn} onClick={() => updateQty(p, -1)}>−</button>
              <button style={styles.iconBtn} onClick={() => updateQty(p, +1)}>+</button>

              <button style={styles.primaryBtn} onClick={() => openEdit(p)}>
                Editar
              </button>

              <button style={styles.dangerBtn} onClick={() => remove(p.id)}>
                Excluir
              </button>

            </div>

          </Card>
        );
      })}

      {/* ========================= */}
      {/* MODAL EDIT */}
      {/* ========================= */}
      {editOpen && editForm && (
        <div style={styles.modalBg}>
          <div style={styles.modal}>

            <h3>Editar Produto</h3>

            {Object.keys(editForm)
              .filter(k => k !== "id" && k !== "user_id")
              .map((key) => (
                <input
                  key={key}
                  value={editForm[key] || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, [key]: e.target.value })
                  }
                  style={styles.input}
                />
              ))}

            <Button onClick={saveEdit}>Salvar</Button>

          </div>
        </div>
      )}

    </div>
  );
}

// =========================
// STYLE PREMIUM FINAL
// =========================
const styles = {

  page: {
    padding: 16,
    background: "#f8fafc",
    minHeight: "100vh"
  },

  title: {
    fontSize: 22,
    fontWeight: 600,
    marginBottom: 12,
  },

  card: {
    marginBottom: 12,
    padding: 16,
    borderRadius: 18,
    background: "#fff",
    border: "1px solid #eef2f7",
    boxShadow: "0 6px 18px rgba(15, 23, 42, 0.06)",
    transition: "all 0.2s ease",
  },

  input: {
    width: "100%",
    padding: 10,
    marginBottom: 8,
    border: "1px solid #e5e7eb",
    borderRadius: 10,
  },

  filters: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr 1fr",
    gap: 8,
    marginBottom: 12,
  },

  rowTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  productName: {
    fontSize: 16,
    fontWeight: 600,
  },

  badge: {
    padding: "4px 10px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 500,
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 6,
    marginTop: 10,
    fontSize: 13,
    color: "#334155",
  },

  actions: {
    display: "flex",
    gap: 8,
    marginTop: 12,
  },

  iconBtn: {
    width: 46,
    height: 46,
    borderRadius: 14,
    border: "1px solid #e2e8f0",
    background: "#fff",
    fontSize: 20,
  },

  primaryBtn: {
    flex: 1,
    height: 46,
    borderRadius: 14,
    border: "1px solid #dbeafe",
    background: "#eff6ff",
    color: "#2563eb",
    fontWeight: 600,
  },

  dangerBtn: {
    flex: 1,
    height: 46,
    borderRadius: 14,
    border: "1px solid #fee2e2",
    background: "#fff1f2",
    color: "#dc2626",
    fontWeight: 600,
  },

  modalBg: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  modal: {
    background: "#fff",
    padding: 20,
    borderRadius: 16,
    width: 420,
  },
};