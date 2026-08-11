"use client";import{useEffect as T,useState as c,useCallback as L,useMemo as b}from"react";import{supabase as m}from"../../../lib/supabaseClient";import P from"../../CalendarioSemana";import A from"../../EventoCalendarioForm";const _=[{tipo:"trabajo",label:"Trabajo / videollamadas"},{tipo:"descanso",label:"Descanso"},{tipo:"mensajes",label:"Mensajes"},{tipo:"stories",label:"Stories"},{tipo:"skool",label:"Skool"},{tipo:"calendly",label:"Calendly"},{tipo:"personalizado",label:"Personal"}];function x(o){return o.toISOString().slice(0,10)}function D(o){const a=new Date(o),r=a.getDay(),d=r===0?-6:1-r;return a.setDate(a.getDate()+d),a.setHours(0,0,0,0),a}export default function z(){const[o,a]=c(()=>D(new Date)),[r,d]=c([]),[y,u]=c(!1),[f,g]=c(""),[p,i]=c(null);const n=b(()=>{const e=[];for(let t=0;t<7;t++){const s=new Date(o);s.setDate(s.getDate()+t),e.push(x(s))}return e},[o]);const l=L(async()=>{u(!0),g("");const{data:e,error:t}=await m.from("calendario_eventos").select("*").gte("fecha",n[0]).lte("fecha",n[6]).order("hora_inicio",{ascending:!0});if(u(!1),t){g("No se pudo cargar el calendario: "+t.message);return}d(e||[])},[n]);T(()=>{l()},[l]);const v=b(()=>{const e={};return r.forEach(t=>{e[t.fecha]||(e[t.fecha]=[]),e[t.fecha].push(t)}),e},[r]);async function h(e){const{error:t}=await m.from("calendario_eventos").update({completado:!e.completado}).eq("id",e.id);if(t){alert("No se pudo actualizar: "+t.message);return}l()}async function N(e){if(!confirm(`¿Eliminar "${e.titulo}"?`))return;const{error:t}=await m.from("calendario_eventos").delete().eq("id",e.id);if(t){alert("No se pudo eliminar: "+t.message);return}l()}function S(){a(D(new Date))}function w(){const e=new Date(o);e.setDate(e.getDate()-7),a(e)}function C(){const e=new Date(o);e.setDate(e.getDate()+7),a(e)}const E=(()=>{const e=new Date(n[0]+"T00:00:00"),t=new Date(n[6]+"T00:00:00"),s=k=>k.toLocaleDateString("es-ES",{day:"2-digit",month:"short"});return`${s(e)} — ${s(t)}`})();return<>
      <div className="topbar"style={{marginBottom:10}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <button className="btn btn-secondary"onClick={w}>← Semana anterior</button>
          <button className="btn btn-secondary"onClick={S}>Hoy</button>
          <button className="btn btn-secondary"onClick={C}>Semana siguiente →</button>
          <span className="muted"style={{fontSize:13,marginLeft:6}}>{E}</span>
        </div>
        <div className="topbar-actions">
          <button className="btn btn-primary"onClick={()=>i({})}>
            + Agregar evento
          </button>
        </div>
      </div>

      <div className="cal-legend">
        {_.map(e=><span key={e.tipo}>
            <span className={"dot cal-item-"+e.tipo}/>
            {e.label}
          </span>)}
      </div>

      {f&&<div className="login-error"style={{marginBottom:12}}>{f}</div>}
      {y?<div>Cargando calendario...</div>:<P dias={n}eventosPorDia={v}onToggleDone={h}onEdit={e=>i(e)}onDelete={N}onAdd={e=>i({fecha:e})}/>}

      {p!==null&&<A initial={p}onClose={()=>i(null)}onSaved={()=>{i(null),l()}}/>}
    </>}
