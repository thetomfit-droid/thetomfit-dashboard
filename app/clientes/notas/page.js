"use client";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "../../../lib/supabaseClient";
import ClientesTable from "../../ClientesTable";
import ClienteForm from "../../ClienteForm";

export default function NotasAsesoradesPage() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    const { data, error: err } = await supabase.from("clientes_notas").select("*").order("nombre", { ascending: true });
    setLoading(false);
    if (err) {
      setError("No se pudieron cargar los clientes: " + err.message);
      return;
    }
    setClientes(data || []);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleDelete(cliente) {
    if (!confirm(`¿Eliminar a "${cliente.nombre}" de la lista de clientes?`)) return;
    const { error: err } = await supabase.from("clientes_notas").delete().eq("id", cliente.id);
    if (err) {
      alert("No se pudo eliminar: " + err.message);
      return;
    }
    load();
  }

  const conNotas = clientes.filter((c) => c.notas && c.notas.trim()).length;
  const tarjetas = [
    { label: "Total de clientes", value: clientes.length, cls: "cliente" },
    { label: "Con notas pendientes", value: conNotas, cls: "baja2" },
  ];

  return (
    <>
      <div className="topbar" style={{ marginBottom: 4 }}>
        <div />
        <div className="topbar-actions">
          <button className="btn btn-primary" onClick={() => setEditing({})}>
            + Agregar cliente/a
          </button>
        </div>
      </div>

      <div className="cards" style={{ gridTemplateColumns: "repeat(2, 1fr)", maxWidth: 500 }}>
        {tarjetas.map((t) => (
          <div className={"card " + t.cls} key={t.label}>
            <div className="label">{t.label}</div>
            <div className="value">{t.value}</div>
          </div>
        ))}
      </div>

      {error && <div className="login-error" style={{ marginBottom: 12 }}>{error}</div>}
      {loading ? <div>Cargando clientes...</div> : <ClientesTable clientes={clientes} onEdit={(c) => setEditing(c)} onDelete={handleDelete} />}

      {editing !== null && (
        <ClienteForm initial={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); load(); }} />
      )}
    </>
  );
}
