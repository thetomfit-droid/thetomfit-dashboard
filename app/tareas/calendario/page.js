"use client";
import { useEffect, useState, useCallback, useMemo } from "react";
import { supabase } from "../../../lib/supabaseClient";
import CalendarioSemana from "../../CalendarioSemana";
import EventoCalendarioForm from "../../EventoCalendarioForm";
import TareaForm from "../../TareaForm";

const LEYENDA = [
  { tipo: "trabajo", label: "Trabajo / videollamadas" },
  { tipo: "descanso", label: "Descanso" },
  { tipo: "mensajes", label: "Mensajes" },
  { tipo: "stories", label: "Stories" },
  { tipo: "skool", label: "Skool" },
  { tipo: "calendly", label: "Calendly" },
  { tipo: "personalizado", label: "Personal" },
  { tipo: "tarea", label: "Tarea (fecha límite)" },
];

function toISO(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function inicioDeSemana(d) {
  const date = new Date(d);
  const dow = date.getDay();
  const diff = dow === 0 ? -6 : 1 - dow;
  date.setDate(date.getDate() + diff);
  date.setHours(0, 0, 0, 0);
  return date;
}

export default function CalendarioPage() {
  const [semanaInicio, setSemanaInicio] = useState(() => inicioDeSemana(new Date()));
  const [eventos, setEventos] = useState([]);
  const [tareas, setTareas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingEvento, setEditingEvento] = useState(null);
  const [editingTarea, setEditingTarea] = useState(null);

  const dias = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(semanaInicio);
      d.setDate(d.getDate() + i);
      arr.push(toISO(d));
    }
    return arr;
  }, [semanaInicio]);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    const [eventosRes, tareasRes] = await Promise.all([
      supabase.from("calendario_eventos").select("*").gte("fecha", dias[0]).lte("fecha", dias[6]).order("hora_inicio", { ascending: true }),
      supabase.from("tareas").select("*").gte("fecha_limite", dias[0]).lte("fecha_limite", dias[6]),
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
  }, [dias]);

  useEffect(() => {
    load();
  }, [load]);

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
        hora_inicio: null,
        hora_fin: null,
        tipo: "tarea",
        completado: t.estado === "Terminada",
        _source: "tarea",
        _tarea: t,
      });
    });
    return map;
  }, [eventos, tareas]);

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

  function handleAdd(fecha) {
    setEditingEvento({ fecha });
  }

  function irHoy() {
    setSemanaInicio(inicioDeSemana(new Date()));
  }
  function semanaAnterior() {
    const d = new Date(semanaInicio);
    d.setDate(d.getDate() - 7);
    setSemanaInicio(d);
  }
  function semanaSiguiente() {
    const d = new Date(semanaInicio);
    d.setDate(d.getDate() + 7);
    setSemanaInicio(d);
  }

  const rangoLabel = (() => {
    const inicio = new Date(dias[0] + "T00:00:00");
    const fin = new Date(dias[6] + "T00:00:00");
    const f = (x) => x.toLocaleDateString("es-ES", { day: "2-digit", month: "short" });
    return `${f(inicio)} — ${f(fin)}`;
  })();

  return (
    <>
      <div className="topbar" style={{ marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button className="btn btn-secondary" onClick={semanaAnterior}>← Semana anterior</button>
          <button className="btn btn-secondary" onClick={irHoy}>Hoy</button>
          <button className="btn btn-secondary" onClick={semanaSiguiente}>Semana siguiente →</button>
          <span className="muted" style={{ fontSize: 13, marginLeft: 6 }}>{rangoLabel}</span>
        </div>
        <div className="topbar-actions">
          <button className="btn btn-primary" onClick={() => setEditingEvento({})}>
            + Agregar evento
          </button>
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
      {loading ? (
        <div>Cargando calendario...</div>
      ) : (
        <CalendarioSemana
          dias={dias}
          eventosPorDia={eventosPorDia}
          onToggleDone={handleToggleDone}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onAdd={handleAdd}
        />
      )}

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
