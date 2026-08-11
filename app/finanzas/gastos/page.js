"use client";import{useEffect as y,useState as i,useCallback as C}from"react";import{supabase as p}from"../../../lib/supabaseClient";import D from"../../GastosTable";import F from"../../GastoForm";function h(){const t=new Date;return new Date(t.getFullYear(),t.getMonth()+1,0).getDate()}export default function w(){const[t,f]=i([]),[b,n]=i(!1),[l,s]=i(null),[m,c]=i("");const o=C(async()=>{n(!0),c("");const{data:e,error:a}=await p.from("gastos_empresa").select("*").order("concepto",{ascending:!0});if(n(!1),a){c("No se pudieron cargar los gastos: "+a.message);return}f(e||[])},[]);y(()=>{o()},[o]);async function N(e){if(!confirm(`¿Eliminar el gasto "${e.concepto}"?`))return;const{error:a}=await p.from("gastos_empresa").delete().eq("id",e.id);if(a){alert("No se pudo eliminar: "+a.message);return}o()}const d=h(),u=t.filter(e=>e.tipo==="mensual").reduce((e,a)=>e+Number(a.monto||0),0),v=t.filter(e=>e.tipo==="diario").reduce((e,a)=>e+Number(a.monto||0)*d,0),g=t.filter(e=>e.tipo==="variable").reduce((e,a)=>e+Number(a.monto||0),0),S=u+v+g,r=e=>"€"+e.toLocaleString("es-ES",{minimumFractionDigits:2,maximumFractionDigits:2});return<>
      <div className="topbar"style={{marginBottom:4}}>
        <div/>
        <div className="topbar-actions">
          <button className="btn btn-primary"onClick={()=>s({})}>
            + Agregar gasto
          </button>
        </div>
      </div>

      <div className="cards"style={{gridTemplateColumns:"repeat(3, 1fr)",maxWidth:700}}>
        <div className="card mediaalta">
          <div className="label">Fijos + diarios este mes</div>
          <div className="value">{r(u+v)}</div>
        </div>
        <div className="card cliente">
          <div className="label">Comisiones Stripe (variable)</div>
          <div className="value">{r(g)}</div>
        </div>
        <div className="card baja2">
          <div className="label">Total recurrente estimado / mes</div>
          <div className="value">{r(S)}</div>
        </div>
      </div>
      <p className="note-count"style={{marginTop:-14,marginBottom:20}}>
        Publicidad se calcula como 5€ × {d} días de este mes. Comisiones Stripe es un snapshot que actualizo cuando lo pidas — di &quot;actualiza comisiones de Stripe&quot;. Los gastos anuales o puntuales (como Autosetter) no se cuentan en este total mensual, se muestran solo en la tabla.
      </p>

      {m&&<div className="login-error"style={{marginBottom:12}}>{m}</div>}
      {b?<div>Cargando gastos...</div>:<D gastos={t}onEdit={e=>s(e)}onDelete={N}/>}

      {l!==null&&<F initial={l}onClose={()=>s(null)}onSaved={()=>{s(null),o()}}/>}
    </>}
