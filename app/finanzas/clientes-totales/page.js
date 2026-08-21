"use client";
import { useEffect, useState, useCallback, useMemo } from "react";
import { supabase } from "../../../lib/supabaseClient";
import PagosTable from "../../PagosTable";
import PagoForm from "../../PagoForm";
import RegistrarPagoForm from "../../RegistrarPagoForm";

const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

function contar(lista, campo, valor) {
  return lista.filter((o) => o[campo] === valor).length;
}

function sumaDinero(valor) {
  if (!valor) return 0;
  const nums = String(valor).match(/\d+([.,]\d+)?/g);
  return nums ? nums.reduce((s, n) => s + parseFloat(n.replace(",", ".")), 0) : 0;
}

// El año guardado en "cumpleanos" no importa (a veces es el año real, a veces 2026
// puesto a propósito para que Notion notificara) — solo cuentan mes y día.
function mesDia(fechaISO) {
  const partes = fechaISO.split("-");
  return { mes: parseInt(partes[1], 10), dia: parseInt(partes[2], 10) };
}

function formatoCumple(fechaISO) {
  const { mes, dia } = mesDia(fechaISO);
  return `${dia} de ${MESES[mes - 1]}`;
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

  const cumpleanos = useMemo(() => {
    return pagos
      .filter((p) => p.cumpleanos)
      .map((p) => ({ ...p, _md: mesDia(p.cumpleanos) }))
      .sort((a, b) => a._md.mes - b._md.mes || a._md.dia - b._md.dia);
  }, [pagos]);

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

      {cumpleanos.length > 0 && (
        <div style={{ background: "#fff", borderRadius: 12, padding: "16px 18px", margin: "18px 0", boxShadow: "0 1px 2px #5a2d820f", maxWidth: 420 }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: "#2e1c3d", marginBottom: 10 }}>Cumpleaños</div>
          <table>
            <tbody>
              {cumpleanos.map((c) => (
                <tr key={c.id}>
                  <td style={{ whiteSpace: "nowrap", fontWeight: 700, color: "#2e1c3d" }}>{formatoCumple(c.cumpleanos)}</td>
                  <td>{c.nombre}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

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
