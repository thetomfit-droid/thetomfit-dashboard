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

function GraficoIngresosGastos({ meses }) {
  const max = Math.max(1, ...meses.flatMap((m) => [m.ingresos, m.gastos]));
  const W = 640, H = 220, padBottom = 28, padTop = 12;
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
          <g key={m.key}>
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
            <text x={cx} y={H - 10} textAnchor="middle" className="chart-label">
              {m.label.split(" ")[0].slice(0, 3)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default function ResumenFinanciero() {
  const [pagos, setPagos] = useState([]);
  const [gastos, setGastos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

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
  const puntualesYAnuales = gastos.filter((x) => x.tipo === "puntual" || x.tipo === "anual");

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
    });
  }
  const actual = meses[meses.length - 1];

  const diasMesActual = diasDelMes(hoy.getFullYear(), hoy.getMonth());
  const categorias = [
    ...gastos.filter((x) => x.tipo === "mensual").map((x) => ({ nombre: x.concepto, monto: Number(x.monto || 0) })),
    ...gastos.filter((x) => x.tipo === "diario").map((x) => ({ nombre: x.concepto, monto: Number(x.monto || 0) * diasMesActual })),
    ...gastos.filter((x) => x.tipo === "variable").map((x) => ({ nombre: x.concepto, monto: Number(x.monto || 0) })),
  ].sort((p1, p2) => p2.monto - p1.monto);
  const maxCategoria = Math.max(1, ...categorias.map((c) => c.monto));

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
        <GraficoIngresosGastos meses={meses} />
        <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
          <span className="muted" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: "var(--brand-green)", display: "inline-block" }} />
            Ingresos
          </span>
          <span className="muted" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: "var(--brand-red)", display: "inline-block" }} />
            Gastos
          </span>
        </div>
      </div>

      <div className="card" style={{ marginTop: 20, maxWidth: 620 }}>
        <div className="label" style={{ marginBottom: 12 }}>Desglose de gastos de {actual.label}</div>
        {categorias.map((cat) => (
          <div key={cat.nombre} className="gasto-cat-row">
            <div className="gasto-cat-info">
              <span>{cat.nombre}</span>
              <span style={{ fontWeight: 700 }}>{euro(cat.monto)}</span>
            </div>
            <div className="gasto-cat-track">
              <div className="gasto-cat-fill" style={{ width: (cat.monto / maxCategoria) * 100 + "%" }} />
            </div>
          </div>
        ))}
      </div>

      <table>
        <thead>
          <tr>
            <th>Mes</th>
            <th>Ingresos</th>
            <th>Gastos recurrentes</th>
            <th>Beneficio estimado</th>
          </tr>
        </thead>
        <tbody>
          {meses.map((m) => (
            <tr key={m.key}>
              <td className="name-cell">{m.label}{m.isCurrent ? " (actual)" : ""}</td>
              <td>{euro(m.ingresos)}</td>
              <td>{euro(m.gastos)}</td>
              <td style={{ fontWeight: 700, color: m.beneficio >= 0 ? "#345640" : "#8a2c2c" }}>
                {euro(m.beneficio)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {puntualesYAnuales.length > 0 && (
        <div className="card" style={{ marginTop: 20, maxWidth: 620 }}>
          <div className="label">Gastos puntuales / anuales (no incluidos arriba)</div>
          {puntualesYAnuales.map((g) => (
            <div key={g.id} style={{ fontSize: 13, marginTop: 8 }}>
              <strong>{g.concepto}</strong> — {euro(g.monto)}
              {g.notas && <span className="muted"> · {g.notas}</span>}
            </div>
          ))}
        </div>
      )}

      <p className="note-count" style={{ marginTop: 16 }}>
        Los ingresos se calculan sumando cada pago individual registrado (no el total acumulado de cada
        cliente), para que las cuotas cuenten solo en el mes en que se pagaron. Los pagos de Stripe se
        registran solos; los que recibas por transferencia u otro medio regístralos con el botón
        &quot;+ Pago&quot; en Clientes totales. Meses anteriores a esta corrección pueden verse en €0 si
        no tienen pagos registrados en el historial todavía — dime si quieres que reconstruyamos algunos
        meses pasados con los datos que me des. Las comisiones de Stripe solo están sumadas en el mes
        actual por ahora.
      </p>
    </>
  );
}
