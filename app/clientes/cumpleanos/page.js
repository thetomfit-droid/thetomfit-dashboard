"use client";
import { useEffect, useState, useCallback, useMemo } from "react";
import { supabase } from "../../../lib/supabaseClient";

const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

// El año guardado no importa (a veces es el año real, a veces 2026 puesto a propósito
// para que Notion notificara) — solo cuentan el mes y el día.
function mesDia(fechaISO) {
  const partes = fechaISO.split("-");
  return { mes: parseInt(partes[1], 10), dia: parseInt(partes[2], 10) };
}

function formatoCumple(fechaISO) {
  const { mes, dia } = mesDia(fechaISO);
  return `${dia} de ${MESES[mes - 1]}`;
}

export default function CumpleanosAsesoradesPage() {
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    const { data, error: err } = await supabase.from("pagos_clientes").select("id, nombre, cumpleanos").order("nombre", { ascending: true });
    setLoading(false);
    if (err) {
      setError("No se pudieron cargar los cumpleaños: " + err.message);
      return;
    }
    setPagos(data || []);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const cumpleanos = useMemo(() => {
    return pagos
      .filter((p) => p.cumpleanos)
      .map((p) => ({ ...p, _md: mesDia(p.cumpleanos) }))
      .sort((a, b) => a._md.mes - b._md.mes || a._md.dia - b._md.dia);
  }, [pagos]);

  return (
    <>
      <div className="cards" style={{ gridTemplateColumns: "repeat(2, 1fr)", maxWidth: 500, marginTop: 4 }}>
        <div className="card cliente">
          <div className="label">Cumpleaños registrados</div>
          <div className="value">{cumpleanos.length}</div>
        </div>
        <div className="card">
          <div className="label">Total de asesorades</div>
          <div className="value">{pagos.length}</div>
        </div>
      </div>

      {error && <div className="login-error" style={{ marginBottom: 12 }}>{error}</div>}

      {loading ? (
        <div>Cargando cumpleaños...</div>
      ) : cumpleanos.length === 0 ? (
        <div className="muted">Todavía no hay cumpleaños registrados. Se agregan desde Finanzas → Clientes totales, al editar un pago.</div>
      ) : (
        <table style={{ maxWidth: 480 }}>
          <thead>
            <tr>
              <th>Cumpleaños</th>
              <th>Nombre</th>
            </tr>
          </thead>
          <tbody>
            {cumpleanos.map((c) => (
              <tr key={c.id}>
                <td className="name-cell">{formatoCumple(c.cumpleanos)}</td>
                <td>{c.nombre}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
