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
    if (!confirm("Deseja excluir este produto?")) return;
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
  // QUICK STOCK
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

      {/* CADASTRO */}
      <Card style={styles.card}>
        <h3>Novo produto</h3>

        <input placeholder="Nome"
          value={form.nome}
          onChange={(e) => setForm({ ...form, nome: e.target.value })}
          style={styles.input}
        />

        <input placeholder="Custo" type="number"
          value={form.custo}
          onChange={(e) => setForm({ ...form, custo: e.target.value })}
          style={styles.input}
        />

        <input placeholder="Preço de venda" type="number"
          value={form.valor_venda}
          onChange={(e) => setForm({ ...form, valor_venda: e.target.value })}
          style={styles.input}
        />

        <input placeholder="Quantidade" type="number"
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
          + Cadastrar produto
        </Button>
      </Card>

      {/* FILTROS */}
      <div style={styles.filters}>
        <input
          placeholder="Buscar produto..."
          value={filters.search}
          onChange={(e) =>
            setFilters({ ...filters, search: e.target.value })
          }
          style={styles.filterInput}
        />

        <select
          value={filters.category}
          onChange={(e) =>
            setFilters({ ...filters, category: e.target.value })
          }
          style={styles.filterInput}
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
          style={styles.filterInput}
        >
          <option value="">Fornecedor</option>
          {suppliers.map((s, i) => (
            <option key={i}>{s}</option>
          ))}
        </select>
      </div>

      {/* LISTA */}
      {filtered.map((p) => {

        const lucro = (p.valor_venda || 0) - (p.custo || 0);
        const baixo = (p.quantidade || 0) <= 5;

        return (
          <Card key={p.id} style={styles.card}>

            <div style={styles.rowTop}>
              <strong>{p.nome}</strong>

              <span style={{
                ...styles.badge,
                background: baixo ? "#fff1f2" : "#ecfdf5",
                color: baixo ? "#dc2626" : "#16a34a"
              }}>
                {baixo ? "Baixo" : "OK"}
              </span>
            </div>

            <div style={styles.grid}>
              <div>📦 {p.quantidade}</div>
              <div>💰 {p.custo}</div>
              <div>💵 {p.valor_venda}</div>
              <div>📈 {lucro}</div>
              <div>🏷 {p.categoria}</div>
              <div>🏭 {p.fornecedor}</div>
            </div>

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

      {/* MODAL (SÓ X) */}
      {editOpen && editForm && (
        <div style={styles.modalBg}>
          <div style={styles.modal}>

            {/* HEADER */}
            <div style={styles.modalHeader}>
              <h3>Editar produto</h3>

              <button
                onClick={() => {
                  setEditOpen(false);
                  setEditForm(null);
                }}
                style={styles.closeBtn}
              >
                ✕
              </button>
            </div>

            <p style={styles.modalSub}>Ajuste os dados do produto</p>

            <input value={editForm.nome}
              onChange={(e) =>
                setEditForm({ ...editForm, nome: e.target.value })
              }
              style={styles.input}
            />

            <input value={editForm.custo}
              type="number"
              onChange={(e) =>
                setEditForm({ ...editForm, custo: e.target.value })
              }
              style={styles.input}
            />

            <input value={editForm.valor_venda}
              type="number"
              onChange={(e) =>
                setEditForm({ ...editForm, valor_venda: e.target.value })
              }
              style={styles.input}
            />

            <input value={editForm.quantidade}
              type="number"
              onChange={(e) =>
                setEditForm({ ...editForm, quantidade: e.target.value })
              }
              style={styles.input}
            />

            <input value={editForm.categoria}
              onChange={(e) =>
                setEditForm({ ...editForm, categoria: e.target.value })
              }
              style={styles.input}
            />

            <input value={editForm.fornecedor}
              onChange={(e) =>
                setEditForm({ ...editForm, fornecedor: e.target.value })
              }
              style={styles.input}
            />

            <Button onClick={saveEdit} style={{ width: "100%" }}>
              Salvar alterações
            </Button>

          </div>
        </div>
      )}

    </div>
  );
}

// styles (mantidos)
const styles = {
  page: { padding: 16, background: "#f8fafc", minHeight: "100vh" },
  title: { fontSize: 22, fontWeight: 600, marginBottom: 12 },
  card: { marginBottom: 12, padding: 16, borderRadius: 18, background: "#fff", border: "1px solid #eef2f7" },
  input: { width: "100%", padding: 10, marginBottom: 8, border: "1px solid #e5e7eb", borderRadius: 10 },
  filters: { display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 },
  filterInput: { flex: 1, minWidth: 140, padding: 10, border: "1px solid #e5e7eb", borderRadius: 10 },
  rowTop: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  badge: { padding: "4px 10px", borderRadius: 999, fontSize: 12 },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 6, marginTop: 10 },
  actions: { display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" },
  iconBtn: { width: 44, height: 44, borderRadius: 12, border: "1px solid #e2e8f0", background: "#fff" },
  primaryBtn: { flex: 1, minWidth: 100, height: 44, borderRadius: 12, background: "#eff6ff", border: "1px solid #dbeafe", color: "#2563eb", fontWeight: 600 },
  dangerBtn: { flex: 1, minWidth: 100, height: 44, borderRadius: 12, background: "#fff1f2", border: "1px solid #fee2e2", color: "#dc2626", fontWeight: 600 },
  modalBg: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", justifyContent: "center", alignItems: "center" },
  modal: { background: "#fff", padding: 20, borderRadius: 16, width: 420 },
  modalHeader: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  modalSub: { fontSize: 13, color: "#64748b", marginBottom: 10 },
  closeBtn: { width: 36, height: 36, borderRadius: 10, border: "1px solid #e2e8f0", background: "#fff", cursor: "pointer" }
};