"use client";
import { useEffect, useState, useCallback, useMemo } from "react";
import { supabase } from "../../lib/supabaseClient";

const MENSAJES_BIENVENIDA = [
  { codigo: "N1", objetivo: "Probar unas 400 personas", texto: "Hola [NOMBRE], soy [TU NOMBRE], encantado/a! Que tal estás?\nPor mera curiosidad, ¿me sigues más por el tema de la nutrición o del entrenamiento?" },
  { codigo: "N2", objetivo: "Empezar a testear", texto: "Hola [NOMBRE], soy [TU NOMBRE], encantado/a!\nPor simple curiosidad, y para poder enfocar mejor lo que comparto, ¿estás buscando mejorar en algún aspecto en concreto ahora mismo?" },
  { codigo: "N3", objetivo: "Tercera opción de testeo y ver datos", texto: "Buenas [NOMBRE], gracias por seguirme, espero que te esté gustando lo que comparto por aquí.\n¿Quería preguntarte si te interesa más la parte de alimentación o entrenamiento?" },
  { codigo: "N4", objetivo: "Probar unas 400 personas", texto: "Hola, ¡Gracias por seguirme! 🌈\nMe encanta hablar con mis seguidores, sobre todo saber qué tipo de contenido le puede ayudar.\n¿Qué fue lo que te llamó la atención de mi perfil o hizo que te quedaras por aquí?" },
  { codigo: "N5", objetivo: "Empezar a testear", texto: "¡Buenas! ¡Qué genial tenerte por aquí!\nPara ver si puedo ayudarte y ofrecerte algo que te sirva\n¿qué tipo de contenido te gustaría ver por aquí?" },
  { codigo: "N6", objetivo: "Tercera opción de testeo y ver datos", texto: "¡Buenas! ¡Gracias por seguirme!\nMe encanta pasar por aquí de vez en cuando y hablar con las personas\n¿Desde dónde me sigues?" },
  { codigo: "N7", objetivo: "Empezar a testear", texto: "¡Buenas!\nVi que me seguiste hace poquito, y me gusta ver quién sigue de cerca el contenido.\nUn placer tenerte por aquí." },
];

const MENSAJES_FUP = [
  { codigo: "N1", objetivo: "Probar unas 400 personas", texto: "Buenas de nuevo, no sé si viste el mensaje o dijiste ya le respondo luego, ese luego que dura semanas 😅" },
  { codigo: "N2", objetivo: "Empezar a testear", texto: "Hola!! Vengo a resurgir entre los mensajes olvidados 👋 ¿Pudiste leer el último que te envié?" },
  { codigo: "N3", objetivo: "Tercera opción de testeo y ver datos", texto: "Buenaaas, ¿qué tal estás?, ¿has podido leer mi mensaje? Estoy por aquí atento, un saludo!" },
  { codigo: "N4", objetivo: "Empezar a testear", texto: "" },
];

function hoyISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function formatoFecha(iso) {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

function parseLocal(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function lunesDe(fecha) {
  const copia = new Date(fecha);
  const dia = copia.getDay();
  const diff = dia === 0 ? -6 : 1 - dia;
  copia.setDate(copia.getDate() + diff);
  return copia;
}

function claveFecha(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function GraficoBienvenidas({ datos }) {
  if (!datos.length) return <p className="muted" style={{ fontSize: 13 }}>Todavía no hay suficientes datos para graficar.</p>;
  const max = Math.max(1, ...datos.map((d) => d.total));
  const W = 640, H = 240, padBottom = 32, padTop = 12;
  const chartH = H - padBottom - padTop;
  const groupW = W / datos.length;
  const barW = Math.min(34, groupW - 14);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="grafico-resumen" style={{ width: "100%", height: "auto", display: "block" }}>
      {datos.map((d, idx) => {
        const cx = idx * groupW + groupW / 2;
        const h = (d.total / max) * chartH;
        return (
          <g key={d.key}>
            <rect x={cx - barW / 2} y={padTop + chartH - h} width={barW} height={Math.max(h, 0)} rx={3} fill="var(--brand-purple)">
              <title>{`${d.label}: ${d.total} bienvenidas`}</title>
            </rect>
            <text x={cx} y={padTop + chartH - h - 6} textAnchor="middle" className="chart-label" fontWeight="700">
              {d.total}
            </text>
            <text x={cx} y={H - padBottom + 16} textAnchor="middle" className="chart-label">
              {d.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function TablaMensajes({ titulo, mensajes }) {
  return (
    <div className="card" style={{ marginTop: 20, maxWidth: 900 }}>
      <div className="label" style={{ marginBottom: 12 }}>{titulo}</div>
      <table>
        <thead>
          <tr>
            <th style={{ width: 50 }}>Código</th>
            <th style={{ width: 220 }}>Objetivo</th>
            <th>Mensaje</th>
          </tr>
        </thead>
        <tbody>
          {mensajes.map((m) => (
            <tr key={m.codigo}>
              <td className="name-cell">{m.codigo}</td>
              <td>{m.objetivo}</td>
              <td style={{ whiteSpace: "pre-line" }}>{m.texto || <span className="muted">— sin mensaje registrado —</span>}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function Setting() {
  const [bienvenidas, setBienvenidas] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [nuevaFecha, setNuevaFecha] = useState(hoyISO());
  const [nuevaCantidad, setNuevaCantidad] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [vista, setVista] = useState("semana");

  const cargar = useCallback(async () => {
    setCargando(true);
    setError("");
    const { data, error: err } = await supabase.from("bienvenidas_diarias").select("*").order("fecha", { ascending: false });
    setCargando(false);
    if (err) {
      setError("No se pudo cargar: " + err.message);
      return;
    }
    setBienvenidas(data || []);
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  async function agregar(e) {
    e.preventDefault();
    if (!nuevaFecha || nuevaCantidad === "") return;
    setGuardando(true);
    setError("");
    const { error: err } = await supabase
      .from("bienvenidas_diarias")
      .upsert({ fecha: nuevaFecha, cantidad: Number(nuevaCantidad) }, { onConflict: "fecha" });
    setGuardando(false);
    if (err) {
      setError("No se pudo guardar: " + err.message);
      return;
    }
    setNuevaCantidad("");
    cargar();
  }

  const total = bienvenidas.reduce((acc, b) => acc + Number(b.cantidad || 0), 0);

  const porSemana = useMemo(() => {
    const mapa = {};
    bienvenidas.forEach((b) => {
      const lunes = lunesDe(parseLocal(b.fecha));
      const key = claveFecha(lunes);
      mapa[key] = (mapa[key] || 0) + Number(b.cantidad || 0);
    });
    return Object.entries(mapa)
      .map(([key, total]) => ({ key, total, label: formatoFecha(key).slice(0, 5) }))
      .sort((a, b) => a.key.localeCompare(b.key))
      .slice(-10);
  }, [bienvenidas]);

  const porMes = useMemo(() => {
    const mapa = {};
    bienvenidas.forEach((b) => {
      const key = b.fecha.slice(0, 7);
      mapa[key] = (mapa[key] || 0) + Number(b.cantidad || 0);
    });
    return Object.entries(mapa)
      .map(([key, total]) => ({ key, total, label: key.slice(5, 7) + "/" + key.slice(2, 4) }))
      .sort((a, b) => a.key.localeCompare(b.key))
      .slice(-8);
  }, [bienvenidas]);

  const datosChart = vista === "semana" ? porSemana : porMes;

  return (
    <>
      <p className="subtitle" style={{ marginTop: -8 }}>
        Registro de bienvenidas enviadas por Instagram y biblioteca de mensajes de referencia.
      </p>

      <div style={{ display: "flex", gap: 20, flexWrap: "wrap", alignItems: "flex-start" }}>
        <div style={{ minWidth: 320 }}>
          <div className="cards" style={{ gridTemplateColumns: "repeat(1, 1fr)", maxWidth: 260, marginBottom: 20 }}>
            <div className="card cliente">
              <div className="label">Total de bienvenidas registradas</div>
              <div className="value">{total}</div>
            </div>
          </div>

          <div className="card" style={{ maxWidth: 420 }}>
            <div className="label" style={{ marginBottom: 12 }}>Agregar bienvenidas de una fecha</div>
            <form onSubmit={agregar} style={{ display: "flex", gap: 10, alignItems: "flex-end", flexWrap: "wrap" }}>
              <label style={{ display: "flex", flexDirection: "column", fontSize: 12, color: "#6b5b73", gap: 4, fontWeight: 600 }}>
                Fecha
                <input
                  type="date"
                  value={nuevaFecha}
                  onChange={(e) => setNuevaFecha(e.target.value)}
                  style={{ padding: "8px 10px", border: "1px solid #ecdfe8", borderRadius: 8, fontFamily: "var(--font-heading)" }}
                  required
                />
              </label>
              <label style={{ display: "flex", flexDirection: "column", fontSize: 12, color: "#6b5b73", gap: 4, fontWeight: 600 }}>
                Nº Bienvenidas
                <input
                  type="number"
                  min="0"
                  value={nuevaCantidad}
                  onChange={(e) => setNuevaCantidad(e.target.value)}
                  style={{ padding: "8px 10px", border: "1px solid #ecdfe8", borderRadius: 8, width: 100, fontFamily: "var(--font-heading)" }}
                  required
                />
              </label>
              <button type="submit" className="btn btn-primary" disabled={guardando}>
                {guardando ? "Guardando..." : "Agregar"}
              </button>
            </form>
            <p className="note-count" style={{ marginTop: 10 }}>
              Si agregas una fecha que ya existe, se actualiza el número en vez de duplicarse.
            </p>
          </div>

          {error && <div className="login-error" style={{ marginTop: 10 }}>{error}</div>}

          <div className="card" style={{ marginTop: 20, maxWidth: 420, maxHeight: 480, overflowY: "auto" }}>
            <div className="label" style={{ marginBottom: 12 }}>Bienvenidas por fecha</div>
            <table>
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Nº Bienvenidas</th>
                </tr>
              </thead>
              <tbody>
                {bienvenidas.map((b) => (
                  <tr key={b.id}>
                    <td className="name-cell">{formatoFecha(b.fecha)}</td>
                    <td>{b.cantidad}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card" style={{ flex: 1, minWidth: 340 }}>
          <div className="toolbar" style={{ marginBottom: 12, justifyContent: "space-between" }}>
            <div className="label">Tendencia de bienvenidas</div>
            <div style={{ display: "flex", gap: 6 }}>
              <button type="button" className={"filter-btn" + (vista === "semana" ? " active" : "")} onClick={() => setVista("semana")}>
                Por semana
              </button>
              <button type="button" className={"filter-btn" + (vista === "mes" ? " active" : "")} onClick={() => setVista("mes")}>
                Por mes
              </button>
            </div>
          </div>
          <GraficoBienvenidas datos={datosChart} />
          <p className="note-count" style={{ marginTop: 10 }}>
            Suma de bienvenidas agrupada por {vista === "semana" ? "semana (lunes a domingo)" : "mes"}, para ver si está subiendo o bajando.
          </p>
        </div>
      </div>

      <TablaMensajes titulo="Biblioteca de mensajes — Bienvenida 👋" mensajes={MENSAJES_BIENVENIDA} />
      <TablaMensajes titulo="Biblioteca de mensajes — Follow-up 🚀" mensajes={MENSAJES_FUP} />
    </>
  );
}
