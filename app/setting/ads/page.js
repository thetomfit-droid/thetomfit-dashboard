"use client";
import { useEffect, useState, useCallback, useMemo } from "react";
import { supabase } from "../../../lib/supabaseClient";

const MESES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

const CAMPOS_MANUALES = [
  { key: "bienvenidas", label: "Bienvenidas dadas" },
  { key: "conversaciones", label: "Conversaciones iniciadas" },
  { key: "agendas", label: "Agendas" },
  { key: "llamadas_realizadas", label: "Llamadas realizadas" },
  { key: "canceladas", label: "Canceladas" },
  { key: "no_show", label: "No show" },
  { key: "ventas", label: "Nº ventas" },
  { key: "facturado", label: "Facturado total (€)", moneda: true },
  { key: "cash_cobrado", label: "Cash cobrado (€)", moneda: true },
  { key: "inversion_ads", label: "Inversión ads (€)", moneda: true },
];

function euro(v) {
  return "€" + Number(v || 0).toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function pct(v) {
  return (Number(v || 0) * 100).toLocaleString("es-ES", { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + "%";
}
function vx(v) {
  return Number(v || 0).toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + "x";
}
function div(a, b) {
  return b ? a / b : 0;
}

function semanaVacia(mes, semana) {
  return {
    anio: null, mes, semana, rango: "",
    bienvenidas: 0, conversaciones: 0, agendas: 0, llamadas_realizadas: 0,
    canceladas: 0, no_show: 0, ventas: 0, facturado: 0, cash_cobrado: 0, inversion_ads: 0,
  };
}

function calcularDerivados(f) {
  const pendiente = Number(f.facturado || 0) - Number(f.cash_cobrado || 0);
  const costeConversacion = div(f.inversion_ads, f.conversaciones);
  const costeAgenda = div(f.inversion_ads, f.agendas);
  const costeLlamada = div(f.inversion_ads, f.llamadas_realizadas);
  const costeVenta = div(f.inversion_ads, f.ventas);
  const roasFacturado = div(f.facturado, f.inversion_ads);
  const roasCash = div(f.cash_cobrado, f.inversion_ads);
  const tasaConversacion = div(f.conversaciones, f.bienvenidas);
  const tasaAgenda = div(f.agendas, f.conversaciones);
  const showRate = div(f.llamadas_realizadas, Number(f.agendas || 0) - Number(f.canceladas || 0));
  const tasaCierre = div(f.ventas, f.llamadas_realizadas);
  return { pendiente, costeConversacion, costeAgenda, costeLlamada, costeVenta, roasFacturado, roasCash, tasaConversacion, tasaAgenda, showRate, tasaCierre };
}

function sumarSemanas(semanas) {
  const total = semanaVacia(null, null);
  CAMPOS_MANUALES.forEach(({ key }) => {
    total[key] = semanas.reduce((acc, s) => acc + Number(s[key] || 0), 0);
  });
  return total;
}

function diasDelMes(anio, mes) {
  return new Date(anio, mes, 0).getDate();
}

function rangoSemanaFija(anio, mes, semana) {
  const ultimo = diasDelMes(anio, mes);
  const inicios = [1, 8, 15, 22, 29];
  const fines = [7, 14, 21, 28, ultimo];
  const inicio = inicios[semana - 1];
  if (inicio > ultimo) return null;
  const fin = Math.min(fines[semana - 1], ultimo);
  return { inicio, fin };
}

function fechaISO(anio, mes, dia) {
  return `${anio}-${String(mes).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
}

export default function Ads() {
  const anioActual = new Date().getFullYear();
  const mesActualIdx = new Date().getMonth();
  const [anio, setAnio] = useState(anioActual);
  const [mesSel, setMesSel] = useState(mesActualIdx + 1);
  const [filas, setFilas] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [guardandoClave, setGuardandoClave] = useState("");
  const [autoCargando, setAutoCargando] = useState(false);

  const cargar = useCallback(async (a) => {
    setCargando(true);
    setError("");
    const { data, error: err } = await supabase.from("ads_semanal").select("*").eq("anio", a);
    setCargando(false);
    if (err) {
      setError("No se pudo cargar: " + err.message);
      return;
    }
    setFilas(data || []);
  }, []);

  useEffect(() => {
    cargar(anio);
  }, [anio, cargar]);

  const semanasDelMes = useMemo(() => {
    const resultado = [];
    for (let s = 1; s <= 5; s++) {
      const existente = filas.find((f) => f.mes === mesSel && f.semana === s);
      resultado.push(existente || semanaVacia(mesSel, s));
    }
    return resultado;
  }, [filas, mesSel]);

  const totalMes = useMemo(() => sumarSemanas(semanasDelMes), [semanasDelMes]);

  function actualizarCampo(semana, campo, valor) {
    setFilas((prev) => {
      const copia = [...prev];
      const idx = copia.findIndex((f) => f.mes === mesSel && f.semana === semana);
      if (idx >= 0) {
        copia[idx] = { ...copia[idx], [campo]: valor };
      } else {
        copia.push({ ...semanaVacia(mesSel, semana), [campo]: valor, anio });
      }
      return copia;
    });
  }

  async function guardarSemana(semana) {
    const fila = semanasDelMes.find((f) => f.semana === semana);
    const clave = `${mesSel}-${semana}`;
    setGuardandoClave(clave);
    const payload = {
      anio,
      mes: mesSel,
      semana,
      rango: fila.rango || null,
      bienvenidas: Number(fila.bienvenidas || 0),
      conversaciones: Number(fila.conversaciones || 0),
      agendas: Number(fila.agendas || 0),
      llamadas_realizadas: Number(fila.llamadas_realizadas || 0),
      canceladas: Number(fila.canceladas || 0),
      no_show: Number(fila.no_show || 0),
      ventas: Number(fila.ventas || 0),
      facturado: Number(fila.facturado || 0),
      cash_cobrado: Number(fila.cash_cobrado || 0),
      inversion_ads: Number(fila.inversion_ads || 0),
    };
    const { error: err } = await supabase.from("ads_semanal").upsert(payload, { onConflict: "anio,mes,semana" });
    setGuardandoClave("");
    if (err) setError("No se pudo guardar: " + err.message);
    else cargar(anio);
  }

  async function autocompletar() {
    setAutoCargando(true);
    setError("");
    const ultimoDia = diasDelMes(anio, mesSel);
    const desde = fechaISO(anio, mesSel, 1);
    const hasta = fechaISO(anio, mesSel, ultimoDia);

    const [bRes, pcRes, phRes] = await Promise.all([
      supabase.from("bienvenidas_diarias").select("fecha,cantidad").gte("fecha", desde).lte("fecha", hasta),
      supabase.from("pagos_clientes").select("dinero_recolectado,inicio_pago").gte("inicio_pago", desde).lte("inicio_pago", hasta),
      supabase.from("pagos_historial").select("monto,fecha").gte("fecha", desde).lte("fecha", hasta),
    ]);
    const errPrimero = bRes.error || pcRes.error || phRes.error;
    if (errPrimero) {
      setError("No se pudo autocompletar: " + errPrimero.message);
      setAutoCargando(false);
      return;
    }

    for (let s = 1; s <= 5; s++) {
      const rango = rangoSemanaFija(anio, mesSel, s);
      const actual = semanasDelMes.find((f) => f.semana === s) || semanaVacia(mesSel, s);
      if (!rango) continue;
      const desdeS = fechaISO(anio, mesSel, rango.inicio);
      const hastaS = fechaISO(anio, mesSel, rango.fin);

      const bienvenidasSemana = (bRes.data || [])
        .filter((x) => x.fecha >= desdeS && x.fecha <= hastaS)
        .reduce((acc, x) => acc + Number(x.cantidad || 0), 0);

      const ventasFilas = (pcRes.data || []).filter((x) => x.inicio_pago >= desdeS && x.inicio_pago <= hastaS);
      const facturadoSemana = ventasFilas.reduce((acc, x) => acc + Number(x.dinero_recolectado || 0), 0);
      const ventasSemana = ventasFilas.length;

      const cashSemana = (phRes.data || [])
        .filter((x) => x.fecha >= desdeS && x.fecha <= hastaS)
        .reduce((acc, x) => acc + Number(x.monto || 0), 0);

      const payload = {
        anio,
        mes: mesSel,
        semana: s,
        rango: `${rango.inicio}-${rango.fin}`,
        bienvenidas: bienvenidasSemana,
        conversaciones: Number(actual.conversaciones || 0),
        agendas: Number(actual.agendas || 0),
        llamadas_realizadas: Number(actual.llamadas_realizadas || 0),
        canceladas: Number(actual.canceladas || 0),
        no_show: Number(actual.no_show || 0),
        ventas: ventasSemana,
        facturado: facturadoSemana,
        cash_cobrado: cashSemana,
        inversion_ads: Number(actual.inversion_ads || 0),
      };
      await supabase.from("ads_semanal").upsert(payload, { onConflict: "anio,mes,semana" });
    }

    setAutoCargando(false);
    cargar(anio);
  }

  const filasPorMes = useMemo(() => {
    const mapa = {};
    for (let m = 1; m <= 12; m++) {
      const semanasMes = [];
      for (let s = 1; s <= 5; s++) {
        semanasMes.push(filas.find((f) => f.mes === m && f.semana === s) || semanaVacia(m, s));
      }
      mapa[m] = sumarSemanas(semanasMes);
    }
    return mapa;
  }, [filas]);

  const totalAnio = useMemo(() => {
    const meses = Object.values(filasPorMes);
    return sumarSemanas(meses);
  }, [filasPorMes]);

  const filasDerivadas = [
    { label: "Pendiente por cobrar (€)", key: "pendiente", formato: euro },
    { label: "Coste por conversación (€)", key: "costeConversacion", formato: euro },
    { label: "Coste por agenda (€)", key: "costeAgenda", formato: euro },
    { label: "Coste por llamada realizada (€)", key: "costeLlamada", formato: euro },
    { label: "Coste por venta (€)", key: "costeVenta", formato: euro },
    { label: "ROAS facturado", key: "roasFacturado", formato: vx },
    { label: "ROAS cash", key: "roasCash", formato: vx },
    { label: "Tasa conversación (%)", key: "tasaConversacion", formato: pct },
    { label: "Tasa agenda (%)", key: "tasaAgenda", formato: pct },
    { label: "Show rate (%)", key: "showRate", formato: pct },
    { label: "Tasa cierre (%)", key: "tasaCierre", formato: pct },
  ];

  return (
    <>
      <p className="subtitle" style={{ marginTop: -8 }}>
        Rendimiento semanal de ads: lo que escribes tú (bienvenidas, agendas, ventas, facturado...) calcula
        solo el ROAS, los costes y las tasas — igual que en tu Excel.
      </p>

      <div className="toolbar" style={{ marginBottom: 10 }}>
        <select value={anio} onChange={(e) => setAnio(Number(e.target.value))} style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #ecdfe8" }}>
          {[anioActual - 1, anioActual, anioActual + 1].map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
      </div>

      <div className="toolbar" style={{ flexWrap: "wrap" }}>
        {MESES.map((m, idx) => (
          <button
            key={m}
            className={"filter-btn" + (mesSel === idx + 1 ? " active" : "")}
            onClick={() => setMesSel(idx + 1)}
            type="button"
          >
            {m}
          </button>
        ))}
      </div>

      {error && <div className="login-error">{error}</div>}
      {cargando && <div className="muted" style={{ marginBottom: 10 }}>Cargando...</div>}

      <div className="card" style={{ marginTop: 10, overflowX: "auto" }}>
        <div className="toolbar" style={{ justifyContent: "space-between", marginBottom: 4 }}>
          <div className="label" style={{ marginBottom: 0 }}>{MESES[mesSel - 1]} {anio}</div>
          <button type="button" className="btn btn-secondary" onClick={autocompletar} disabled={autoCargando}>
            {autoCargando ? "Autocompletando..." : "🔄 Autocompletar bienvenidas / facturado / ventas / cash"}
          </button>
        </div>
        <p className="note-count" style={{ marginTop: 0, marginBottom: 12 }}>
          Trae bienvenidas desde Setting, y facturado/ventas/cash cobrado desde Clientes totales y Finanzas,
          usando semanas fijas (1-7, 8-14, 15-21, 22-28, 29-fin). No toca conversaciones, agendas, llamadas,
          canceladas, no show ni inversión en ads — esos se quedan como los escribas tú. Puedes corregir a
          mano cualquier valor después de autocompletar.
        </p>
        <table>
          <thead>
            <tr>
              <th>Métrica</th>
              {semanasDelMes.map((s) => (
                <th key={s.semana}>
                  Semana {s.semana}
                  <input
                    value={s.rango || ""}
                    onChange={(e) => actualizarCampo(s.semana, "rango", e.target.value)}
                    onBlur={() => guardarSemana(s.semana)}
                    placeholder="ej. 1-7"
                    style={{ display: "block", marginTop: 4, width: 70, fontSize: 11, fontWeight: 400, padding: "3px 5px", border: "1px solid #ecdfe8", borderRadius: 6 }}
                  />
                </th>
              ))}
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {CAMPOS_MANUALES.map((campo) => (
              <tr key={campo.key}>
                <td className="name-cell">{campo.label}</td>
                {semanasDelMes.map((s) => (
                  <td key={s.semana}>
                    <input
                      type="number"
                      step="any"
                      value={s[campo.key] === 0 ? 0 : s[campo.key] || ""}
                      onChange={(e) => actualizarCampo(s.semana, campo.key, e.target.value === "" ? 0 : Number(e.target.value))}
                      onBlur={() => guardarSemana(s.semana)}
                      style={{ width: 72, padding: "5px 6px", border: "1px solid #ecdfe8", borderRadius: 6, fontSize: 13 }}
                    />
                    {guardandoClave === `${mesSel}-${s.semana}` && <span className="muted" style={{ fontSize: 10 }}> guardando...</span>}
                  </td>
                ))}
                <td style={{ fontWeight: 700 }}>{campo.moneda ? euro(totalMes[campo.key]) : totalMes[campo.key]}</td>
              </tr>
            ))}
            {filasDerivadas.map((fd) => (
              <tr key={fd.key} className="fila-derivada">
                <td className="name-cell muted">{fd.label}</td>
                {semanasDelMes.map((s) => {
                  const d = calcularDerivados(s);
                  return <td key={s.semana} className="muted">{fd.formato(d[fd.key])}</td>;
                })}
                <td className="muted" style={{ fontWeight: 700 }}>{fd.formato(calcularDerivados(totalMes)[fd.key])}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card" style={{ marginTop: 24, overflowX: "auto" }}>
        <div className="label" style={{ marginBottom: 12 }}>Resumen anual {anio}</div>
        <table>
          <thead>
            <tr>
              <th>Mes</th>
              <th>Facturado</th>
              <th>Cash cobrado</th>
              <th>Pendiente</th>
              <th>Ads</th>
              <th>Ventas</th>
              <th>Canceladas</th>
              <th>No show</th>
              <th>ROAS fact.</th>
              <th>ROAS cash</th>
              <th>Coste venta</th>
              <th>Tasa cierre</th>
            </tr>
          </thead>
          <tbody>
            {MESES.map((m, idx) => {
              const f = filasPorMes[idx + 1];
              const d = calcularDerivados(f);
              return (
                <tr key={m}>
                  <td className="name-cell">{m}</td>
                  <td>{euro(f.facturado)}</td>
                  <td>{euro(f.cash_cobrado)}</td>
                  <td>{euro(d.pendiente)}</td>
                  <td>{euro(f.inversion_ads)}</td>
                  <td>{f.ventas}</td>
                  <td>{f.canceladas}</td>
                  <td>{f.no_show}</td>
                  <td>{vx(d.roasFacturado)}</td>
                  <td>{vx(d.roasCash)}</td>
                  <td>{euro(d.costeVenta)}</td>
                  <td>{pct(d.tasaCierre)}</td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr style={{ fontWeight: 700 }}>
              <td className="name-cell">TOTAL {anio}</td>
              <td>{euro(totalAnio.facturado)}</td>
              <td>{euro(totalAnio.cash_cobrado)}</td>
              <td>{euro(calcularDerivados(totalAnio).pendiente)}</td>
              <td>{euro(totalAnio.inversion_ads)}</td>
              <td>{totalAnio.ventas}</td>
              <td>{totalAnio.canceladas}</td>
              <td>{totalAnio.no_show}</td>
              <td>{vx(calcularDerivados(totalAnio).roasFacturado)}</td>
              <td>{vx(calcularDerivados(totalAnio).roasCash)}</td>
              <td>{euro(calcularDerivados(totalAnio).costeVenta)}</td>
              <td>{pct(calcularDerivados(totalAnio).tasaCierre)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <p className="note-count" style={{ marginTop: 16 }}>
        Escribe cada semana: bienvenidas, conversaciones, agendas, llamadas realizadas, canceladas, no show,
        nº de ventas, facturado, cash cobrado e inversión en ads. Todo lo demás (pendiente, costes, ROAS y
        tasas) se calcula solo, igual que en tu Excel. Los datos de junio a septiembre 2026 ya están
        cargados desde tu plantilla.
      </p>
    </>
  );
}
