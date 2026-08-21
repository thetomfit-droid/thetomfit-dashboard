"use client";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "../../../lib/supabaseClient";
import PagosTable from "../../PagosTable";
import PagoForm from "../../PagoForm";
import RegistrarPagoForm from "../../RegistrarPagoForm";

function contar(lista, campo, valor) {
  return lista.filter((o) => o[campo] === valor).length;
}

function sumaDinero(valor) {
  if (!valor) return 0;
  const nums = String(valor).match(/\d+([.,]\d+)?/g);
  return nums ? nums.reduce((s, n) => s + parseFloat(n.replace(",", ".")), 0) : 0;
}

export default function ClientesTotalesPage() {
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingPago, setEditingPago] = useState(null);
  const [registrandoPago, setRegistrandoPago] = useState(null);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    const { data, error: err } = await supabase.from("pagos_clientes").select("*").order("nombre", { ascending: true });
    setLoading(false);
    if (err) {
      setError("No se pudieron cargar los pagos: " + err.message);
      return;
    }
    setPagos(data || []);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const totalRecolectado = pagos.reduce((s, p) => s + sumaDinero(p.dinero_recolectado), 0);
  const tarjetas = [
    { label: "Total de registros", value: pagos.length, cls: "" },
    { label: "Total recolectado", value: "€" + totalRecolectado.toLocaleString("es-ES"), cls: "alta" },
    { label: "Falta pago", value: contar(pagos, "estado_pago", "Falta pago"), cls: "baja2" },
    { label: "En cuotas", value: contar(pagos, "estado_pago", "En cuotas"), cls: "mediaalta" },
    { label: "Clientes actuales", value: contar(pagos, "cliente_estado", "Cliente Actual"), cls: "cliente" },
  ];

  return (
    <>
      <div className="topbar" style={{ marginBottom: 4 }}>
        <div />
        <div className="topbar-actions">
          <button className="btn btn-primary" onClick={() => setEditingPago({})}>
            + Agregar pago
          </button>
        </div>
      </div>

      <div className="cards">
        {tarjetas.map((t) => (
          <div className={"card " + t.cls} key={t.label}>
            <div className="label">{t.label}</div>
            <div className="value">{t.value}</div>
          </div>
        ))}
      </div>

      {error && <div className="login-error" style={{ marginBottom: 12 }}>{error}</div>}
      {loading ? <div>Cargando pagos...</div> : <PagosTable pagos={pagos} onEdit={(p) => setEditingPago(p)} onRegistrarPago={(p) => setRegistrandoPago(p)} />}

      {editingPago !== null && (
        <PagoForm initial={editingPago} onClose={() => setEditingPago(null)} onSaved={() => { setEditingPago(null); load(); }} />
      )}

      {registrandoPago !== null && (
        <RegistrarPagoForm pago={registrandoPago} onClose={() => setRegistrandoPago(null)} onSaved={() => { setRegistrandoPago(null); load(); }} />
      )}
    </>
  );
}
