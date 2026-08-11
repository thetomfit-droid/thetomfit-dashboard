"use client";import{useEffect as p,useState as s,useCallback as b}from"react";import{supabase as o}from"../../lib/supabaseClient";import E from"../AuthGate";import N from"../Sidebar";import C from"../EnlacesList";import S from"../EnlaceForm";function A(){const[m,u]=s([]),[d,r]=s(!1),[l,t]=s(null),[i,c]=s("");const n=b(async()=>{r(!0),c("");const{data:e,error:a}=await o.from("enlaces").select("*").order("titulo",{ascending:!0});if(r(!1),a){c("No se pudieron cargar los enlaces: "+a.message);return}u(e||[])},[]);p(()=>{n()},[n]);async function f(e){if(!confirm(`¿Eliminar el enlace "${e.titulo}"?`))return;const{error:a}=await o.from("enlaces").delete().eq("id",e.id);if(a){alert("No se pudo eliminar: "+a.message);return}n()}return<main className="main">
      <div className="topbar">
        <div>
          <h1>Enlaces de interés</h1>
          <p className="subtitle">Todos los enlaces que quieres tener a mano, en un solo lugar.</p>
        </div>
        <div className="topbar-actions">
          <button className="btn btn-primary"onClick={()=>t({})}>
            + Agregar enlace
          </button>
          <button className="btn btn-secondary"onClick={()=>o.auth.signOut()}>
            Cerrar sesión
          </button>
        </div>
      </div>

      {i&&<div className="login-error"style={{marginBottom:12}}>{i}</div>}
      {d?<div>Cargando enlaces...</div>:<C enlaces={m}onEdit={e=>t(e)}onDelete={f}/>}

      {l!==null&&<S initial={l}onClose={()=>t(null)}onSaved={()=>{t(null),n()}}/>}
    </main>}export default function w(){return<E>
      <div className="shell">
        <N/>
        <A/>
      </div>
    </E>}
