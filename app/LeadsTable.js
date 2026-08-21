"use client";
import { useMemo, useState } from "react";

const PRIORIDAD_CLASS = { Alta: "alta", "Media-Alta": "mediaalta", Media: "media", Baja: "baja", "Cliente activo": "cliente" };

function formatoFecha(f) {
  return f ? new Date(f + "T00:00:00").toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" }) : "—";
}

export default function LeadsTable({ leads, onEdit }) {
  const [busqueda, setBusqueda] = useState("");
  const [filtro, setFiltro] = useState("Todas");

  const filas = useMemo(() => {
    let t = [...leads];
    if (filtro !== "Todas") t = t.filter((l) => l.prioridad === filtro);
    if (busqueda.trim()) {
      const q = busqueda.trim().toLowerCase();
      t = t.filter((l) => [l.nombre, l.instagram, l.pais, l.objeciones, l.observaciones].filter(Boolean).some((v) => v.toLowerCase().includes(q)));
    }
    // Siempre en orden cronológico: la videollamada más reciente primero.
    t.sort((a, b) => {
      const A = a.fecha_llamada || "";
      const B = b.fecha_llamada || "";
      if (!A && !B) return 0;
      if (!A) return 1;
      if (!B) return -1;
      return B.localeCompare(A);
    });
    return t;
  }, [leads, busqueda, filtro]);

  const filtros = ["Todas", "Alta", "Media-Alta", "Media", "Baja", "Cliente activo"];

  return (
    <>
      <div className="toolbar">
        <input type="text" placeholder="Buscar por nombre, Instagram, país, objeción..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
        {filtros.map((f) => (
          <button key={f} className={"filter-btn" + (filtro === f ? " active" : "")} onClick={() => setFiltro(f)}>
            {f}
          </button>
        ))}
      </div>

      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Contacto</th>
            <th>País</th>
            <th>Fecha llamada</th>
            <th>Estado</th>
            <th>Objeción / Notas</th>
            <th>Plan</th>
            <th>Volver a contactar</th>
            <th>Prioridad</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {filas.map((row) => (
            <tr key={row.id}>
              <td className="name-cell">{row.nombre}</td>
              <td>
                <div>{row.telefono || <span className="muted">—</span>}</div>
                <div className="muted">{row.instagram || "—"}</div>
                {row.fathom_url && (
                  <a className="fathom-link" href={row.fathom_url} target="_blank" rel="noreferrer">
                    Ver grabación
                  </a>
                )}
              </td>
              <td>{row.pais || "—"}</td>
              <td>{formatoFecha(row.fecha_llamada)}</td>
              <td>{row.estado || "—"}</td>
              <td style={{ maxWidth: 320 }}>
                {row.objeciones && <div>{row.objeciones}</div>}
                {row.observaciones && <div className="muted">{row.observaciones}</div>}
                {!row.objeciones && !row.observaciones && <span className="muted">—</span>}
              </td>
              <td>{row.plan_acordado || <span className="muted">—</span>}</td>
              <td>{formatoFecha(row.volver_a_contactar)}</td>
              <td>
                <span className={"pill " + (PRIORIDAD_CLASS[row.prioridad] || "baja")}>{row.prioridad}</span>
              </td>
              <td>
                <button className="edit-link" onClick={() => onEdit(row)}>Editar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="note-count">{filas.length} de {leads.length} leads</div>
    </>
  );
}
