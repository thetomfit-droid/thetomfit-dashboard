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

// Para buscar sin importar tildes ni mayúsculas
function normalizar(texto) {
  return String(texto || "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

// Arregla espacios dobles y nombres todo en MAYÚSCULAS al mostrarlos
function nombreBonito(nombre) {
  const limpio = String(nombre || "").replace(/\s+/g, " ").trim();
  if (limpio && limpio === limpio.toUpperCase()) {
    return limpio.toLowerCase().replace(/(^|\s)(\S)/g, (_, a, b) => a + b.toUpperCase());
  }
  return limpio;
}

// Días que faltan para el próximo cumpleaños (0 = hoy)
function diasHasta(fechaISO, hoy) {
  const { mes, dia } = mesDia(fechaISO);
  const base = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
  let prox = new Date(hoy.getFullYear(), mes - 1, dia);
  if (prox < base) prox = new Date(hoy.getFullYear() + 1, mes - 1, dia);
  return Math.round((prox - base) / 86400000);
}

function textoDias(d) {
  if (d === 0) return "hoy";
  if (d === 1) return "mañana";
  return `en ${d} días`;
}

const PRIORIDAD_ESTADO = { "Cliente Actual": 0, Pausa: 1, "Ex cliente": 2 };

export default function CumpleanosAsesoradesPage() {
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [busqueda, setBusqueda] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    const { data, error: err } = await supabase
      .from("pagos_clientes")
      .select("id, nombre, cumpleanos, cliente_estado")
      .order("nombre", { ascending: true });
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

  // Una persona por nombre (un cliente puede tener varios pagos)
  const personas = useMemo(() => {
    const mapa = new Map();
    for (const p of pagos) {
      const clave = normalizar(p.nombre);
      if (!clave) continue;
      const actual = mapa.get(clave);
      if (!actual) {
        mapa.set(clave, { id: p.id, nombre: nombreBonito(p.nombre), cumpleanos: p.cumpleanos || null, estado: p.cliente_estado || "" });
      } else {
        if (!actual.cumpleanos && p.cumpleanos) actual.cumpleanos = p.cumpleanos;
        const a = PRIORIDAD_ESTADO[actual.estado] ?? 9;
        const b = PRIORIDAD_ESTADO[p.cliente_estado] ?? 9;
        if (b < a) actual.estado = p.cliente_estado;
      }
    }
    return Array.from(mapa.values());
  }, [pagos]);

  const hoy = useMemo(() => new Date(), []);

  const conCumple = useMemo(
    () =>
      personas
        .filter((p) => p.cumpleanos)
        .map((p) => ({ ...p, _md: mesDia(p.cumpleanos), _dias: diasHasta(p.cumpleanos, hoy) }))
        .sort((a, b) => a._md.mes - b._md.mes || a._md.dia - b._md.dia || a.nombre.localeCompare(b.nombre)),
    [personas, hoy]
  );

  const sinCumple = useMemo(() => personas.filter((p) => !p.cumpleanos).sort((a, b) => a.nombre.localeCompare(b.nombre)), [personas]);

  const proximos = useMemo(() => [...conCumple].sort((a, b) => a._dias - b._dias).slice(0, 3), [conCumple]);

  const q = normalizar(busqueda);
  const resultados = q ? conCumple.filter((c) => normalizar(c.nombre).includes(q)) : [];
  const resultadosSin = q ? sinCumple.filter((c) => normalizar(c.nombre).includes(q)) : [];
  const lista = q ? resultados : conCumple;

  function etiquetaEstado(estado) {
    if (estado === "Ex cliente") return <span className="muted"> (ex cliente)</span>;
    if (estado === "Pausa") return <span className="muted"> (pausa)</span>;
    return null;
  }

  return (
    <>
      <div className="cards" style={{ gridTemplateColumns: "repeat(3, 1fr)", maxWidth: 700, marginTop: 4 }}>
        <div className="card cliente">
          <div className="label">Cumpleaños registrados</div>
          <div className="value">{conCumple.length}</div>
        </div>
        <div className="card">
          <div className="label">Total de asesorades</div>
          <div className="value">{personas.length}</div>
        </div>
        <div className="card">
          <div className="label">Sin cumpleaños</div>
          <div className="value">{sinCumple.length}</div>
        </div>
      </div>

      {error && <div className="login-error" style={{ marginBottom: 12 }}>{error}</div>}

      {!loading && proximos.length > 0 && (
        <div style={{ margin: "12px 0", fontSize: 14 }}>
          <strong>Próximos:</strong>{" "}
          {proximos.map((p, i) => (
            <span key={p.id}>
              {i > 0 && " · "}
              {p.nombre} ({formatoCumple(p.cumpleanos)}, {textoDias(p._dias)})
            </span>
          ))}
        </div>
      )}

      <div style={{ margin: "12px 0", maxWidth: 480 }}>
        <input
          type="search"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar cumpleaños por nombre..."
          aria-label="Buscar cumpleaños por nombre"
          style={{ width: "100%" }}
        />
      </div>

      {loading ? (
        <div>Cargando cumpleaños...</div>
      ) : conCumple.length === 0 ? (
        <div className="muted">Todavía no hay cumpleaños registrados. Se agregan desde Finanzas → Clientes totales, al editar un pago.</div>
      ) : (
        <>
          {q && lista.length === 0 && resultadosSin.length === 0 && <div className="muted" style={{ marginBottom: 12 }}>No encontré a nadie con ese nombre.</div>}
          {q && resultadosSin.length > 0 && (
            <div className="muted" style={{ marginBottom: 12 }}>
              Sin cumpleaños registrado: {resultadosSin.map((p) => p.nombre).join(", ")}.
            </div>
          )}
          {lista.length > 0 && (
            <table style={{ maxWidth: 480 }}>
              <thead>
                <tr>
                  <th>Cumpleaños</th>
                  <th>Nombre</th>
                </tr>
              </thead>
              <tbody>
                {lista.map((c) => (
                  <tr key={c.id}>
                    <td className="name-cell">{formatoCumple(c.cumpleanos)}</td>
                    <td>
                      {c.nombre}
                      {etiquetaEstado(c.estado)}
                      {c._dias <= 30 && <span className="muted"> · {textoDias(c._dias)}</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}

      {!loading && !q && sinCumple.length > 0 && (
        <div style={{ marginTop: 24, maxWidth: 480 }}>
          <h3 style={{ fontSize: 15, marginBottom: 6 }}>Sin cumpleaños registrado</h3>
          <div className="muted">
            {sinCumple.map((p, i) => (
              <span key={p.id}>
                {i > 0 && ", "}
                {p.nombre}
              </span>
            ))}
            . Se agregan desde Finanzas → Clientes totales, al editar un pago.
          </div>
        </div>
      )}
    </>
  );
}
