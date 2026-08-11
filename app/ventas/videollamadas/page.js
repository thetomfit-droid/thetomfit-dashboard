"use client";import{useEffect as b,useState as s,useCallback as f}from"react";import{supabase as g}from"../../../lib/supabaseClient";import N from"../../LeadsTable";import L from"../../LeadForm";function i(a,d,o){return a.filter(l=>l[d]===o).length}export default function y(){const[a,d]=s([]),[o,l]=s(!1),[n,t]=s(null),[c,m]=s("");const r=f(async()=>{l(!0),m("");const{data:e,error:u}=await g.from("leads").select("*").order("fecha_llamada",{ascending:!1});if(l(!1),u){m("No se pudieron cargar los leads: "+u.message);return}d(e||[])},[]);b(()=>{r()},[r]);const v=[{label:"Total de leads",value:a.length,cls:""},{label:"Prioridad alta",value:i(a,"prioridad","Alta"),cls:"alta"},{label:"Seguimiento activo",value:i(a,"prioridad","Media-Alta"),cls:"mediaalta"},{label:"Objeción dinero",value:i(a,"prioridad","Media"),cls:"media"},{label:"Clientes activos",value:i(a,"prioridad","Cliente activo"),cls:"cliente"}];return<>
      <div className="topbar"style={{marginBottom:4}}>
        <div/>
        <div className="topbar-actions">
          <button className="btn btn-primary"onClick={()=>t({})}>
            + Agregar lead
          </button>
        </div>
      </div>

      <div className="cards">
        {v.map(e=><div className={"card "+e.cls}key={e.label}>
            <div className="label">{e.label}</div>
            <div className="value">{e.value}</div>
          </div>)}
      </div>

      {c&&<div className="login-error"style={{marginBottom:12}}>{c}</div>}
      {o?<div>Cargando leads...</div>:<N leads={a}onEdit={e=>t(e)}/>}

      {n!==null&&<L initial={n}onClose={()=>t(null)}onSaved={()=>{t(null),r()}}/>}
    </>}
