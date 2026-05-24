import { useEffect, useMemo, useState } from "react";
import { supabase } from "../supabase";
import { Card, Button } from "../components/ui";

export default function Stock({ session }) {
  const user = session.user;

  const [products, setProducts] = useState([]);

  // =========================
  // 🔎 FILTROS AVANÇADOS
  // =========================
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    supplier: "",
    minStock: "",
    maxStock: "",
  });

  // =========================
  // 📦 LOAD
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
  // 🔎 FILTRO INTELIGENTE
  // =========================
  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchSearch = p.nome
        ?.toLowerCase()
        .includes(filters.search.toLowerCase());

      const matchCategory = filters.category
        ? p.categoria === filters.category
        : true;

      const matchSupplier = filters.supplier
        ? p.fornecedor === filters.supplier
        : true;

      const matchMinStock = filters.minStock
        ? p.quantidade >= Number(filters.minStock)
        : true;

      const matchMaxStock = filters.maxStock
        ? p.quantidade <= Number(filters.maxStock)
        : true;

      return (
        matchSearch &&
        matchCategory &&
        matchSupplier &&
        matchMinStock &&
        matchMaxStock
      );
    });
  }, [products, filters]);

  // =========================
  // 📊 OPTIONS
  // =========================
  const categories = [...new Set(products.map(p => p.categoria).filter(Boolean))];
  const suppliers = [...new Set(products.map(p => p.fornecedor).filter(Boolean))];

  // =========================
  // 🗑 DELETE
  // =========================
  async function remove(id) {
    if (!confirm("Deseja excluir este produto?")) return;

    await supabase.from("products").delete().eq("id", id);

    loadProducts();
  }

  return (
    <div style={styles.page}>

      <h2>Estoque</h2>

      {/* ========================= */}
      {/* 🔎 FILTROS */}
      {/* ========================= */}
      <Card style={styles.filters}>

        <input
          placeholder="Buscar produto..."
          value={filters.search}
          onChange={(e) =>
            setFilters({ ...filters, search: e.target.value })
          }
          style={styles.input}
        />

        <select
          onChange={(e) =>
            setFilters({ ...filters, category: e.target.value })
          }
          style={styles.input}
        >
          <option value="">Categoria</option>
          {categories.map((c, i) => (
            <option key={i} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          onChange={(e) =>
            setFilters({ ...filters, supplier: e.target.value })
          }
          style={styles.input}
        >
          <option value="">Fornecedor</option>
          {suppliers.map((s, i) => (
            <option key={i} value={s}>
              {s}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Estoque mínimo"
          onChange={(e) =>
            setFilters({ ...filters, minStock: e.target.value })
          }
          style={styles.input}
        />

        <input
          type="number"
          placeholder="Estoque máximo"
          onChange={(e) =>
            setFilters({ ...filters, maxStock: e.target.value })
          }
          style={styles.input}
        />

      </Card>

      {/* ========================= */}
      {/* 📦 LISTA COMPLETA */}
      {/* ========================= */}
      {filtered.map((p) => {

        const profitUnit = (p.valor_venda || 0) - (p.custo || 0);
        const totalStockValue = (p.custo || 0) * (p.quantidade || 0);

        return (
          <Card key={p.id} style={styles.card}>

            <strong>{p.nome}</strong>

            <div style={styles.grid}>

              <p>📦 Qtd: {p.quantidade}</p>
              <p>💰 Custo: R$ {p.custo}</p>
              <p>💵 Venda: R$ {p.valor_venda}</p>

              <p>📈 Margem: R$ {profitUnit}</p>
              <p>💎 Estoque: R$ {totalStockValue}</p>

              <p>🏷 Categoria: {p.categoria || "-"}</p>
              <p>🏭 Fornecedor: {p.fornecedor || "-"}</p>

            </div>

            {/* AÇÕES */}
            <div style={styles.actions}>

              <Button onClick={() => alert("Editar aqui")}>
                Editar
              </Button>

              <Button
                onClick={() => remove(p.id)}
                style={{ background: "#EF4444" }}
              >
                Excluir
              </Button>

            </div>

          </Card>
        );
      })}

    </div>
  );
}

// =========================
// 🎨 STYLE
// =========================
const styles = {
  page: {
    padding: 16,
  },

  filters: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    marginBottom: 16,
  },

  input: {
    padding: 10,
    borderRadius: 8,
    border: "1px solid #E2E8F0",
  },

  card: {
    marginBottom: 12,
    padding: 12,
  },

  grid: {
    fontSize: 13,
    color: "#475569",
    marginTop: 8,
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 4,
  },

  actions: {
    display: "flex",
    gap: 8,
    marginTop: 10,
  },
};