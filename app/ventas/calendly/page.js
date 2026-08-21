"use client";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "../../../lib/supabaseClient";

const PRIORIDAD_CLASS = { Alta: "alta", "Media-Alta": "mediaalta", Media: "media", Baja: "baja", "Cliente activo": "cliente" };

function hoyISO() {
  const d = new Date();
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
}

function formatoFecha(fecha, hora) {
  if (!fecha) return "—";
  const texto = new Date(fecha + "T00:00:00").toLocaleDateString("es-ES", { weekday: "short", day: "2-digit", month: "2-digit" });
  return hora ? texto + " · " + hora.slice(0, 5) : texto;
}

export default function CalendlyPage() {
  const [proximas, setProximas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const cargar = useCallback(async () => {
    setLoading(true);
    setError("");

    const { data: eventos, error: errEventos } = await supabase
      .from("calendario_eventos")
      .select("*")
      .eq("tipo", "calendly")
      .gte("fecha", hoyISO())
      .order("fecha", { ascending: true })
      .order("hora_inicio", { ascending: true });

    if (errEventos) {
      setLoading(false);
      setError("No se pudieron cargar las reservas: " + errEventos.message);
      return;
    }

    const { data: leads, error: errLeads } = await supabase
      .from("leads")
      .select("calendly_uri, telefono, correo, instagram, estado, prioridad")
      .not("calendly_uri", "is", null);

    if (errLeads) {
      setLoading(false);
      setError("No se pudieron cargar los datos del lead: " + errLeads.message);
      return;
    }

    const leadsPorUri = {};
    (leads || []).forEach((l) => {
      leadsPorUri[l.calendly_uri] = l;
    });

    const combinado = (eventos || []).map((ev) => ({
      ...ev,
      lead: ev.calendly_uri ? leadsPorUri[ev.calendly_uri] : null,
    }));

    setLoading(false);
    setProximas(combinado);
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  return (
    <>
      <div className="topbar" style={{ marginBottom: 4 }}>
        <p className="subtitle" style={{ margin: 0 }}>
          Próximas reservas de Calendly — se sincronizan solas cada hora.
        </p>
        <div className="topbar-actions">
          <a className="btn btn-secondary" href="https://calendly.com/thetomfit" target="_blank" rel="noreferrer">
            Abrir Calendly
          </a>
        </div>
      </div>

      <div className="cards" style={{ gridTemplateColumns: "repeat(1, 1fr)", maxWidth: 220 }}>
        <div className="card alta">
          <div className="label">Próximas reservas</div>
          <div className="value">{proximas.length}</div>
        </div>
      </div>

      {error && <div className="login-error" style={{ marginBottom: 12 }}>{error}</div>}

      {loading ? (
        <div>Cargando reservas...</div>
      ) : proximas.length === 0 ? (
        <div className="note-count">No hay reservas próximas de Calendly.</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Fecha y hora (Vancouver)</th>
              <th>Nombre</th>
              <th>Contacto</th>
              <th>Estado</th>
              <th>Prioridad</th>
            </tr>
          </thead>
          <tbody>
            {proximas.map((ev) => (
              <tr key={ev.id}>
                <td className="name-cell">{formatoFecha(ev.fecha, ev.hora_inicio)}</td>
                <td>{ev.titulo ? ev.titulo.replace("Videollamada — ", "") : "—"}</td>
                <td>
                  <div>{ev.lead?.telefono || <span className="muted">—</span>}</div>
                  <div className="muted">{ev.lead?.correo || "—"}</div>
                </td>
                <td>{ev.lead?.estado || <span className="muted">Reserva</span>}</td>
                <td>
                  {ev.lead?.prioridad ? (
                    <span className={"pill " + (PRIORIDAD_CLASS[ev.lead.prioridad] || "baja")}>{ev.lead.prioridad}</span>
                  ) : (
                    <span className="muted">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="note-count">El detalle completo (objeciones, plan, notas) se edita en Datos de videollamadas.</div>
    </>
  );
}
