"use client";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "../../../lib/supabaseClient";

const MESES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

function euro(v) {
  return "€" + Number(v || 0).toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function mesKey(fecha) {
  return fecha ? fecha.slice(0, 7) : null;
}

function diasDelMes(anio, mesIndex) {
  return new Date(anio, mesIndex + 1, 0).getDate();
}

function GraficoIngresosGastos({ meses, onSelect }) {
  const max = Math.max(1, ...meses.flatMap((m) => [m.ingresos, m.gastos]));
  const W = 640, H = 250, padBottom = 46, padTop = 12;
  const chartH = H - padBottom - padTop;
  const groupW = W / meses.length;
  const barW = Math.min(26, groupW / 2 - 10);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="grafico-resumen" style={{ width: "100%", height: "auto", display: "block" }}>
      {meses.map((m, idx) => {
        const cx = idx * groupW + groupW / 2;
        const hIng = (m.ingresos / max) * chartH;
        const hGas = (m.gastos / max) * chartH;
        return (
          <g key={m.key} onClick={() => onSelect(m)} style={{ cursor: "pointer" }}>
            <rect
              x={cx - barW - 3}
              y={padTop + chartH - hIng}
              width={barW}
              height={Math.max(hIng, 0)}
              rx={3}
              fill="var(--brand-green)"
            >
              <title>{`${m.label} · Ingresos: ${euro(m.ingresos)}`}</title>
            </rect>
            <rect
              x={cx + 3}
              y={padTop + chartH - hGas}
              width={barW}
              height={Math.max(hGas, 0)}
              rx={3}
              fill="var(--brand-red)"
            >
              <title>{`${m.label} · Gastos: ${euro(m.gastos)}`}</title>
            </rect>
            <text
              x={cx}
              y={H - padBottom + 14}
              textAnchor="middle"
              className="chart-label"
              fontWeight="700"
              fill={m.beneficio >= 0 ? "var(--brand-green)" : "var(--brand-red)"}
            >
              {euro(m.beneficio)}
            </text>
            <text x={cx} y={H - padBottom + 30} textAnchor="middle" className="chart-label">
              {m.label.split(" ")[0].slice(0, 3)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function categoriasDeMes(gastos, mes) {
  return [
    ...gastos.filter((x) => x.tipo === "mensual").map((x) => ({ nombre: x.concepto, monto: Number(x.monto || 0) })),
    ...gastos.filter((x) => x.tipo === "diario").map((x) => ({ nombre: x.concepto, monto: Number(x.monto || 0) * mes.dias })),
    ...(mes.isCurrent ? gastos.filter((x) => x.tipo === "variable").map((x) => ({ nombre: x.concepto, monto: Number(x.monto || 0) })) : []),
  ].sort((p1, p2) => p2.monto - p1.monto);
}

export default function ResumenFinanciero() {
  const [pagos, setPagos] = useState([]);
  const [gastos, setGastos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [mesSeleccionado, setMesSeleccionado] = useState(null);

  const cargar = useCallback(async () => {
    setCargando(true);
    setError("");
    const [p, g] = await Promise.all([
      supabase.from("pagos_historial").select("*"),
      supabase.from("gastos_empresa").select("*"),
    ]);
    setCargando(false);
    if (p.error) {
      setError("No se pudieron cargar los pagos: " + p.error.message);
      return;
    }
    if (g.error) {
      setError("No se pudieron cargar los gastos: " + g.error.message);
      return;
    }
    setPagos(p.data || []);
    setGastos(g.data || []);
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  if (cargando) return <div>Calculando resumen...</div>;
  if (error) return <div className="login-error">{error}</div>;

  const totalMensual = gastos.filter((x) => x.tipo === "mensual").reduce((acc, x) => acc + Number(x.monto || 0), 0);
  const totalDiarioPorDia = gastos.filter((x) => x.tipo === "diario").reduce((acc, x) => acc + Number(x.monto || 0), 0);
  const totalVariable = gastos.filter((x) => x.tipo === "variable").reduce((acc, x) => acc + Number(x.monto || 0), 0);

  const ingresosPorMes = {};
  pagos.forEach((p) => {
    const k = mesKey(p.fecha);
    if (k) ingresosPorMes[k] = (ingresosPorMes[k] || 0) + Number(p.monto || 0);
  });

  const hoy = new Date();
  const meses = [];
  for (let i = 5; i >= 0; i--) {
    const fecha = new Date(hoy.getFullYear(), hoy.getMonth() - i, 1);
    const key = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, "0")}`;
    const dias = diasDelMes(fecha.getFullYear(), fecha.getMonth());
    const gastosRecurrentes = totalMensual + totalDiarioPorDia * dias;
    const esMesActual = i === 0;
    const gastosTotales = esMesActual ? gastosRecurrentes + totalVariable : gastosRecurrentes;
    const ingresos = ingresosPorMes[key] || 0;
    meses.push({
      key,
      label: `${MESES[fecha.getMonth()]} ${fecha.getFullYear()}`,
      ingresos,
      gastos: gastosTotales,
      beneficio: ingresos - gastosTotales,
      isCurrent: esMesActual,
      dias,
    });
  }
  const actual = meses[meses.length - 1];

  const categoriasModal = mesSeleccionado ? categoriasDeMes(gastos, mesSeleccionado) : [];
  const maxCategoriaModal = Math.max(1, ...categoriasModal.map((c) => c.monto));

  return (
    <>
      <p className="subtitle" style={{ marginTop: -8 }}>
        Estimación mensual: ingresos reales de Finanzas menos gastos fijos + variables conocidos.
      </p>

      <div className="cards" style={{ gridTemplateColumns: "repeat(3, 1fr)", maxWidth: 700 }}>
        <div className="card alta">
          <div className="label">Ingresos {actual.label}</div>
          <div className="value">{euro(actual.ingresos)}</div>
        </div>
        <div className="card baja2">
          <div className="label">Gastos {actual.label}</div>
          <div className="value">{euro(actual.gastos)}</div>
        </div>
        <div className={"card " + (actual.beneficio >= 0 ? "cliente" : "baja2")}>
          <div className="label">Beneficio neto estimado</div>
          <div className="value">{euro(actual.beneficio)}</div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 20, maxWidth: 900 }}>
        <div className="label" style={{ marginBottom: 12 }}>Ingresos vs Gastos (últimos 6 meses)</div>
        <GraficoIngresosGastos meses={meses} onSelect={setMesSeleccionado} />
        <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
          <span className="muted" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: "var(--brand-green)", display: "inline-block" }} />
            Ingresos
          </span>
          <span className="muted" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: "var(--brand-red)", display: "inline-block" }} />
            Gastos
          </span>
          <span className="muted" style={{ fontSize: 12 }}>· Haz clic en un mes para ver el detalle</span>
        </div>
      </div>

      {mesSeleccionado && (
        <div className="modal-backdrop" onClick={() => setMesSeleccionado(null)}>
          <div className="modal-card" style={{ width: 440 }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ textTransform: "capitalize" }}>{mesSeleccionado.label}</h2>

            <div className="cards" style={{ gridTemplateColumns: "1fr", gap: 10, marginBottom: 22 }}>
              <div className="card alta">
                <div className="label">Ingresos</div>
                <div className="value">{euro(mesSeleccionado.ingresos)}</div>
              </div>
              <div className="card baja2">
                <div className="label">Gastos recurrentes</div>
                <div className="value">{euro(mesSeleccionado.gastos)}</div>
              </div>
              <div className={"card " + (mesSeleccionado.beneficio >= 0 ? "cliente" : "baja2")}>
                <div className="label">Beneficio estimado</div>
                <div className="value">{euro(mesSeleccionado.beneficio)}</div>
              </div>
            </div>

            <div className="label" style={{ marginBottom: 10 }}>Desglose de gastos</div>
            {categoriasModal.map((cat) => (
              <div key={cat.nombre} className="gasto-cat-row">
                <div className="gasto-cat-info">
                  <span>{cat.nombre}</span>
                  <span style={{ fontWeight: 700 }}>{euro(cat.monto)}</span>
                </div>
                <div className="gasto-cat-track">
                  <div className="gasto-cat-fill" style={{ width: (cat.monto / maxCategoriaModal) * 100 + "%" }} />
                </div>
              </div>
            ))}

            <div className="modal-actions">
              <button type="button" className="btn btn-secondary" onClick={() => setMesSeleccionado(null)}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      <p className="note-count" style={{ marginTop: 16 }}>
        Los ingresos se calculan sumando cada pago individual registrado (no el total acumulado de cada
        cliente), para que las cuotas cuenten solo en el mes en que se pagaron. Los pagos de Stripe se
        registran solos; los que recibas por transferencia u otro medio regístralos con el botón
        &quot;+ Pago&quot; en Clientes totales. Las comisiones de Stripe solo están sumadas en el mes
        actual por ahora.
      </p>
    </>
  );
}
