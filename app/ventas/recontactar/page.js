"use client";import{useEffect as u,useState as a,useCallback as g}from"react";import{supabase as v}from"../../../lib/supabaseClient";import N from"../../LeadsTable";import S from"../../LeadForm";export default function b(){const[s,c]=a([]),[m,o]=a(!1),[l,e]=a(null),[d,i]=a("");const t=g(async()=>{o(!0),i("");const{data:r,error:n}=await v.from("leads").select("*").in("estado",["Seguimiento","Reagendar"]).order("volver_a_contactar",{ascending:!0});if(o(!1),n){i("No se pudo cargar: "+n.message);return}c(r||[])},[]);return u(()=>{t()},[t]),<>
      <p className="subtitle"style={{marginTop:-8}}>
        Leads con estado "Seguimiento" o "Reagendar".
      </p>

      <div className="cards"style={{gridTemplateColumns:"repeat(2, 1fr)",maxWidth:300}}>
        <div className="card mediaalta">
          <div className="label">Para recontactar</div>
          <div className="value">{s.length}</div>
        </div>
      </div>

      {d&&<div className="login-error"style={{marginBottom:12}}>{d}</div>}
      {m?<div>Cargando...</div>:<N leads={s}onEdit={r=>e(r)}/>}

      {l!==null&&<S initial={l}onClose={()=>e(null)}onSaved={()=>{e(null),t()}}/>}
    </>}
