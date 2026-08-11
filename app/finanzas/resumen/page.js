"use client";import{useEffect as C,useState as l,useCallback as D}from"react";import{supabase as F}from"../../../lib/supabaseClient";const w=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];function Y(a){if(!a)return 0;const o=String(a).match(/\d+([.,]\d+)?/g);return o?o.reduce((r,c)=>r+parseFloat(c.replace(",",".")),0):0}function t(a){return"€"+Number(a||0).toLocaleString("es-ES",{minimumFractionDigits:2,maximumFractionDigits:2})}function L(a){return a?a.slice(0,7):null}function T(a,o){return new Date(a,o+1,0).getDate()}export default function x(){const[a,o]=l([]),[r,c]=l([]),[S,m]=l(!1),[g,d]=l("");const p=D(async()=>{m(!0),d("");const[e,s]=await Promise.all([F.from("pagos_historial").select("*"),F.from("gastos_empresa").select("*")]);if(m(!1),e.error){d("No se pudieron cargar los pagos: "+e.error.message);return}if(s.error){d("No se pudieron cargar los gastos: "+s.error.message);return}o(e.data||[]),c(s.data||[])},[]);if(C(()=>{p()},[p]),S)return<div>Calculando resumen...</div>;if(g)return<div className="login-error">{g}</div>;const q=r.filter(e=>e.tipo==="mensual").reduce((e,s)=>e+Number(s.monto||0),0),j=r.filter(e=>e.tipo==="diario").reduce((e,s)=>e+Number(s.monto||0),0),E=r.filter(e=>e.tipo==="variable").reduce((e,s)=>e+Number(s.monto||0),0),f=r.filter(e=>e.tipo==="puntual"||e.tipo==="anual"),u={};a.forEach(e=>{const s=L(e.fecha);s&&(u[s]=(u[s]||0)+Number(e.monto||0))});const b=new Date,i=[];for(let e=5;e>=0;e--){const s=new Date(b.getFullYear(),b.getMonth()-e,1),v=`${s.getFullYear()}-${String(s.getMonth()+1).padStart(2,"0")}`,k=T(s.getFullYear(),s.getMonth()),h=q+j*k,N=e===0,y=N?h+E:h,M=u[v]||0;i.push({key:v,label:`${w[s.getMonth()]} ${s.getFullYear()}`,ingresos:M,gastos:y,beneficio:M-y,isCurrent:N})}const n=i[i.length-1];return<>
      <p className="subtitle"style={{marginTop:-8}}>
        Estimación mensual: ingresos reales de Finanzas menos gastos fijos + variables conocidos.
      </p>

      <div className="cards"style={{gridTemplateColumns:"repeat(3, 1fr)",maxWidth:700}}>
        <div className="card alta">
          <div className="label">Ingresos {n.label}</div>
          <div className="value">{t(n.ingresos)}</div>
        </div>
        <div className="card baja2">
          <div className="label">Gastos {n.label}</div>
          <div className="value">{t(n.gastos)}</div>
        </div>
        <div className={"card "+(n.beneficio>=0?"cliente":"baja2")}>
          <div className="label">Beneficio neto estimado</div>
          <div className="value">{t(n.beneficio)}</div>
        </div>
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
          {i.map(e=><tr key={e.key}>
              <td className="name-cell">{e.label}{e.isCurrent?" (actual)":""}</td>
              <td>{t(e.ingresos)}</td>
              <td>{t(e.gastos)}</td>
              <td style={{fontWeight:700,color:e.beneficio>=0?"#345640":"#8a2c2c"}}>
                {t(e.beneficio)}
              </td>
            </tr>)}
        </tbody>
      </table>

      {f.length>0&&<div className="card"style={{marginTop:20,maxWidth:620}}>
          <div className="label">Gastos puntuales / anuales (no incluidos arriba)</div>
          {f.map(e=><div key={e.id}style={{fontSize:13,marginTop:8}}>
              <strong>{e.concepto}</strong> — {t(e.monto)}
              {e.notas&&<span className="muted"> · {e.notas}</span>}
            </div>)}
        </div>}

      <p className="note-count"style={{marginTop:16}}>
        Los ingresos se calculan sumando cada pago individual registrado (no el total acumulado de cada
        cliente), para que las cuotas cuenten solo en el mes en que se pagaron. Los pagos de Stripe se
        registran solos; los que recibas por transferencia u otro medio regístralos con el botón
        &quot;+ Pago&quot; en Clientes totales. Meses anteriores a esta corrección pueden verse en €0 si
        no tienen pagos registrados en el historial todavía — dime si quieres que reconstruyamos algunos
        meses pasados con los datos que me des. Las comisiones de Stripe solo están sumadas en el mes
        actual por ahora.
      </p>
    </>}
