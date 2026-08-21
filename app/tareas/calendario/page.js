"use client";
import { useEffect, useState, useCallback, useMemo } from "react";
import { supabase } from "../../../lib/supabaseClient";
import CalendarioMes from "../../CalendarioMes";
import EventoCalendarioForm from "../../EventoCalendarioForm";
import TareaForm from "../../TareaForm";

const LEYENDA = [
  { tipo: "trabajo", label: "Trabajo / videollamadas" },
  { tipo: "descanso", label: "Descanso" },
  { tipo: "mensajes", label: "Mensajes" },
  { tipo: "stories", label: "Stories" },
  { tipo: "skool", label: "Skool" },
  { tipo: "calendly", label: "Calendly" },
  { tipo: "google", label: "Google Calendar" },
  { tipo: "personalizado", label: "Personal" },
  { tipo: "tarea", label: "Tarea" },
  { tipo: "cumpleanos", label: "Cumpleaños" },
];

function toISO(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function hoyISO() {
  return toISO(new Date());
}

function inicioDeMes(d) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function construirGrilla(mesCursor) {
  const year = mesCursor.getFullYear();
  const month = mesCursor.getMonth();
  const primerDiaMes = new Date(year, month, 1);
  const offsetLunes = (primerDiaMes.getDay() + 6) % 7; // 0=lunes...6=domingo
  const diasEnMes = new Date(year, month + 1, 0).getDate();
  const semanasNecesarias = Math.ceil((offsetLunes + diasEnMes) / 7);
  const totalCeldas = semanasNecesarias * 7;
  const inicioGrilla = new Date(year, month, 1 - offsetLunes);

  const celdas = [];
  for (let i = 0; i < totalCeldas; i++) {
    const d = new Date(inicioGrilla);
    d.setDate(inicioGrilla.getDate() + i);
    celdas.push({ fecha: toISO(d), numero: d.getDate(), enMes: d.getMonth() === month });
  }
  return celdas;
}

function tituloMes(mesCursor) {
  const t = mesCursor.toLocaleDateString("es-ES", { month: "long", year: "numeric" });
  return t.charAt(0).toUpperCase() + t.slice(1);
}

function tituloDia(fecha) {
  const t = new Date(fecha + "T00:00:00").toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  return t.charAt(0).toUpperCase() + t.slice(1);
}

function hora(h) {
  return h ? h.slice(0, 5) : "";
}

// El año guardado en "cumpleanos" no importa (a veces es el real, a veces 2026 puesto
// a propósito) — solo se usan mes y día para saber en qué casilla del calendario cae.
function mesDiaDesdeISO(fechaISO) {
  const partes = fechaISO.split("-");
  return partes[1] + "-" + partes[2];
}

export default function CalendarioPage() {
  const [mesCursor, setMesCursor] = useState(() => inicioDeMes(new Date()));
  const [seleccionado, setSeleccionado] = useState(() => hoyISO());
  const [eventos, setEventos] = useState([]);
  const [tareas, setTareas] = useState([]);
  const [cumpleanosClientes, setCumpleanosClientes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingEvento, setEditingEvento] = useState(null);
  const [editingTarea, setEditingTarea] = useState(null);

  const grilla = useMemo(() => construirGrilla(mesCursor), [mesCursor]);
  const rangoInicio = grilla[0].fecha;
  const rangoFin = grilla[grilla.length - 1].fecha;

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    const [eventosRes, tareasRes] = await Promise.all([
      supabase.from("calendario_eventos").select("*").gte("fecha", rangoInicio).lte("fecha", rangoFin).order("hora_inicio", { ascending: true }),
      supabase.from("tareas").select("*").gte("fecha_limite", rangoInicio).lte("fecha_limite", rangoFin),
    ]);
    setLoading(false);
    if (eventosRes.error) {
      setError("No se pudo cargar el calendario: " + eventosRes.error.message);
      return;
    }
    if (tareasRes.error) {
      setError("No se pudieron cargar las tareas: " + tareasRes.error.message);
      return;
    }
    setEventos(eventosRes.data || []);
    setTareas(tareasRes.data || []);
  }, [rangoInicio, rangoFin]);

  useEffect(() => {
    load();
  }, [load]);

  // Los cumpleaños de clientes se cargan aparte (tabla pagos_clientes) y una sola vez:
  // no dependen del mes que se esté mirando, porque se repiten todos los años.
  useEffect(() => {
    supabase
      .from("pagos_clientes")
      .select("id, nombre, cumpleanos")
      .then(({ data, error: err }) => {
        if (!err) setCumpleanosClientes((data || []).filter((c) => c.cumpleanos));
      });
  }, []);

  const cumpleanosPorMesDia = useMemo(() => {
    const map = {};
    cumpleanosClientes.forEach((c) => {
      const md = mesDiaDesdeISO(c.cumpleanos);
      if (!map[md]) map[md] = [];
      map[md].push(c.nombre);
    });
    return map;
  }, [cumpleanosClientes]);

  const eventosPorDia = useMemo(() => {
    const map = {};
    eventos.forEach((e) => {
      if (!map[e.fecha]) map[e.fecha] = [];
      map[e.fecha].push({ ...e, _source: "evento" });
    });
    tareas.forEach((t) => {
      if (!t.fecha_limite) return;
      if (!map[t.fecha_limite]) map[t.fecha_limite] = [];
      map[t.fecha_limite].push({
        id: t.id,
        titulo: t.titulo,
        hora_inicio: t.hora || null,
        hora_fin: null,
        tipo: "tarea",
        completado: t.estado === "Terminada",
        _source: "tarea",
        _tarea: t,
      });
    });
    grilla.forEach((dia) => {
      const nombres = cumpleanosPorMesDia[mesDiaDesdeISO(dia.fecha)];
      if (!nombres) return;
      if (!map[dia.fecha]) map[dia.fecha] = [];
      nombres.forEach((nombre) => {
        map[dia.fecha].push({
          id: "cumple-" + nombre,
          titulo: "🎂 Cumpleaños de " + nombre,
          hora_inicio: null,
          hora_fin: null,
          tipo: "cumpleanos",
          completado: false,
          _source: "cumpleanos",
        });
      });
    });
    return map;
  }, [eventos, tareas, grilla, cumpleanosPorMesDia]);

  const diasConItems = useMemo(() => new Set(Object.keys(eventosPorDia).filter((f) => eventosPorDia[f].length > 0)), [eventosPorDia]);

  const itemsDelDia = useMemo(() => {
    const items = eventosPorDia[seleccionado] || [];
    return items.slice().sort((a, b) => {
      const ha = a.hora_inicio || "99:99";
      const hb = b.hora_inicio || "99:99";
      return ha.localeCompare(hb);
    });
  }, [eventosPorDia, seleccionado]);

  async function handleToggleDone(item) {
    if (item._source === "tarea") {
      const nuevoEstado = item.completado ? "Pendiente" : "Terminada";
      const { error } = await supabase.from("tareas").update({ estado: nuevoEstado }).eq("id", item.id);
      if (error) {
        alert("No se pudo actualizar la tarea: " + error.message);
        return;
      }
      load();
      return;
    }
    const { error } = await supabase.from("calendario_eventos").update({ completado: !item.completado }).eq("id", item.id);
    if (error) {
      alert("No se pudo actualizar: " + error.message);
      return;
    }
    load();
  }

  async function handleDelete(item) {
    if (!confirm(`¿Eliminar "${item.titulo}"?`)) return;
    if (item._source === "tarea") {
      const { error } = await supabase.from("tareas").delete().eq("id", item.id);
      if (error) {
        alert("No se pudo eliminar la tarea: " + error.message);
        return;
      }
      load();
      return;
    }
    const { error } = await supabase.from("calendario_eventos").delete().eq("id", item.id);
    if (error) {
      alert("No se pudo eliminar: " + error.message);
      return;
    }
    load();
  }

  function handleEdit(item) {
    if (item._source === "tarea") {
      setEditingTarea(item._tarea);
      return;
    }
    setEditingEvento(item);
  }

  function handleAdd() {
    setEditingEvento({ fecha: seleccionado });
  }

  function seleccionarDia(fecha) {
    setSeleccionado(fecha);
    const mesDelDia = inicioDeMes(new Date(fecha + "T00:00:00"));
    if (mesDelDia.getTime() !== mesCursor.getTime()) {
      setMesCursor(mesDelDia);
    }
  }

  function irHoy() {
    const hoy = hoyISO();
    setSeleccionado(hoy);
    setMesCursor(inicioDeMes(new Date()));
  }
  function mesAnterior() {
    setMesCursor((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1));
  }
  function mesSiguiente() {
    setMesCursor((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1));
  }

  return (
    <>
      <div className="topbar" style={{ marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button className="btn btn-secondary" onClick={mesAnterior}>← Mes anterior</button>
          <button className="btn btn-secondary" onClick={irHoy}>Hoy</button>
          <button className="btn btn-secondary" onClick={mesSiguiente}>Mes siguiente →</button>
          <span className="muted" style={{ fontSize: 13, marginLeft: 6 }}>{tituloMes(mesCursor)}</span>
        </div>
      </div>

      <div className="cal-legend">
        {LEYENDA.map((e) => (
          <span key={e.tipo}>
            <span className={"dot cal-item-" + e.tipo} />
            {e.label}
          </span>
        ))}
      </div>

      {error && <div className="login-error" style={{ marginBottom: 12 }}>{error}</div>}

      <CalendarioMes
        dias={grilla}
        hoy={hoyISO()}
        seleccionado={seleccionado}
        diasConItems={diasConItems}
        onSelectDay={seleccionarDia}
      />

      <div className="cal-day-panel">
        <div className="cal-day-panel-header">
          <h3>{tituloDia(seleccionado)}</h3>
          <button className="btn btn-primary" onClick={handleAdd}>+ Agregar</button>
        </div>

        {loading ? (
          <div className="muted">Cargando...</div>
        ) : itemsDelDia.length === 0 ? (
          <div className="muted">Sin eventos ni tareas para este día.</div>
        ) : (
          itemsDelDia.map((item) => {
            const esCumpleanos = item._source === "cumpleanos";
            return (
              <div
                key={(item._source || "evento") + "-" + item.id}
                className={"cal-item cal-item-" + (item.tipo || "personalizado") + (item.completado ? " done" : "")}
                onClick={esCumpleanos ? undefined : () => handleEdit(item)}
                style={esCumpleanos ? { cursor: "default" } : undefined}
              >
                {(item.hora_inicio || item.hora_fin) && (
                  <span className="cal-time">
                    {hora(item.hora_inicio)}
                    {item.hora_fin ? " – " + hora(item.hora_fin) : ""}
                  </span>
                )}
                <span className="cal-title">{item.titulo}</span>
                {!esCumpleanos && (
                  <div className="cal-item-actions">
                    <button className="edit-link" onClick={(e) => { e.stopPropagation(); handleToggleDone(item); }}>
                      {item.completado ? "Deshacer" : "Hecho"}
                    </button>
                    <button className="edit-link" onClick={(e) => { e.stopPropagation(); handleDelete(item); }}>
                      Eliminar
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {editingEvento !== null && (
        <EventoCalendarioForm
          initial={editingEvento}
          onClose={() => setEditingEvento(null)}
          onSaved={() => {
            setEditingEvento(null);
            load();
          }}
        />
      )}

      {editingTarea !== null && (
        <TareaForm
          initial={editingTarea}
          onClose={() => setEditingTarea(null)}
          onSaved={() => {
            setEditingTarea(null);
            load();
          }}
        />
      )}
    </>
  );
}
