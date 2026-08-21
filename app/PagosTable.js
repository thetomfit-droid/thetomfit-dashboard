"use client";
import { useMemo, useState } from "react";

const ESTADO_PAGO_CLASS = { Pagado: "alta", "En cuotas": "mediaalta", "Falta pago": "baja2" };
const CLIENTE_ESTADO_CLASS = { "Cliente Actual": "alta", Pausa: "media", "Ex cliente": "baja" };

const FILTROS = [
  { label: "Falta pago", campo: "estado_pago", valor: "Falta pago" },
  { label: "En cuotas", campo: "estado_pago", valor: "En cuotas" },
  { label: "Cliente actual", campo: "cliente_estado", valor: "Cliente Actual" },
  { label: "Pausa", campo: "cliente_estado", valor: "Pausa" },
  { label: "Vencimiento", campo: null, valor: null },
];

function formatoFecha(f) {
  return f ? new Date(f + "T00:00:00").toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" }) : "—";
}

export default function PagosTable({ pagos, onEdit, onRegistrarPago }) {
  const [busqueda, setBusqueda] = useState("");
  const [filtroActivo, setFiltroActivo] = useState(null);

  const filas = useMemo(() => {
    let t = [...pagos];

    if (filtroActivo && filtroActivo !== "Vencimiento") {
      const f = FILTROS.find((x) => x.label === filtroActivo);
      if (f && f.campo) t = t.filter((row) => row[f.campo] === f.valor);
    }

    if (busqueda.trim()) {
      const q = busqueda.trim().toLowerCase();
      t = t.filter((row) => [row.nombre, row.correo, row.servicio, row.notas].filter(Boolean).some((v) => v.toLowerCase().includes(q)));
    }

    if (filtroActivo === "Vencimiento") {
      // El que está más pronto a vencer aparece primero; sin fecha, al final.
      t.sort((a, b) => {
        const A = a.vencimiento || "";
        const B = b.vencimiento || "";
        if (!A && !B) return 0;
        if (!A) return 1;
        if (!B) return -1;
        return A.localeCompare(B);
      });
    } else {
      // Orden por defecto: quien pagó (inició) más recientemente aparece primero.
      t.sort((a, b) => {
        const A = a.inicio_pago || "";
        const B = b.inicio_pago || "";
        if (!A && !B) return 0;
        if (!A) return 1;
        if (!B) return -1;
        return B.localeCompare(A);
      });
    }

    return t;
  }, [pagos, busqueda, filtroActivo]);

  function toggleFiltro(label) {
    setFiltroActivo((actual) => (actual === label ? null : label));
  }

  return (
    <>
      <div className="toolbar">
        <input type="text" placeholder="Buscar por nombre, correo, servicio, notas..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
        {FILTROS.map((f) => (
          <button key={f.label} className={"filter-btn" + (filtroActivo === f.label ? " active" : "")} onClick={() => toggleFiltro(f.label)}>
            {f.label}
          </button>
        ))}
      </div>

      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Cliente</th>
            <th>Correo</th>
            <th>Servicio</th>
            <th>Cuotas</th>
            <th>Dinero recolectado</th>
            <th>Método</th>
            <th>Vencimiento</th>
            <th>Estado</th>
            <th>Notas</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {filas.map((row) => (
            <tr key={row.id}>
              <td className="name-cell">{row.nombre}</td>
              <td>
                <span className={"pill " + (CLIENTE_ESTADO_CLASS[row.cliente_estado] || "baja")}>{row.cliente_estado || "—"}</span>
              </td>
              <td className="muted">{row.correo || "—"}</td>
              <td>{row.servicio || "—"}</td>
              <td>{row.cuotas || "—"}</td>
              <td>{row.dinero_recolectado || "—"}</td>
              <td>{row.metodo_pago || "—"}</td>
              <td>{formatoFecha(row.vencimiento)}</td>
              <td>
                <span className={"pill " + (ESTADO_PAGO_CLASS[row.estado_pago] || "baja")}>{row.estado_pago || "—"}</span>
              </td>
              <td style={{ maxWidth: 260 }}>{row.notas ? <span className="muted">{row.notas}</span> : <span className="muted">—</span>}</td>
              <td>
                <button className="edit-link" onClick={() => onEdit(row)}>Editar</button>
                {" · "}
                <button className="edit-link" onClick={() => onRegistrarPago(row)}>+ Pago</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="note-count">{filas.length} de {pagos.length} registros</div>
    </>
  );
}
