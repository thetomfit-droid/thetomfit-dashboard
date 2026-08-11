"use client";import{useEffect as p,useState as n,useCallback as g}from"react";import{supabase as i}from"../../lib/supabaseClient";import C from"../AuthGate";import N from"../Sidebar";import E from"../ClientesTable";import S from"../ClienteForm";function A(){const[l,m]=n([]),[u,o]=n(!1),[r,a]=n(null),[d,c]=n("");const s=g(async()=>{o(!0),c("");const{data:e,error:t}=await i.from("clientes_notas").select("*").order("nombre",{ascending:!0});if(o(!1),t){c("No se pudieron cargar los clientes: "+t.message);return}m(e||[])},[]);p(()=>{s()},[s]);async function v(e){if(!confirm(`¿Eliminar a "${e.nombre}" de la lista de clientes?`))return;const{error:t}=await i.from("clientes_notas").delete().eq("id",e.id);if(t){alert("No se pudo eliminar: "+t.message);return}s()}const b=l.filter(e=>e.notas&&e.notas.trim()).length,f=[{label:"Total de clientes",value:l.length,cls:"cliente"},{label:"Con notas pendientes",value:b,cls:"baja2"}];return<main className="main">
      <div className="topbar">
        <div>
          <h1>Clientes</h1>
          <p className="subtitle">
            Notas de lo que te piden tus asesorades — para no olvidarte.
          </p>
        </div>
        <div className="topbar-actions">
          <button className="btn btn-primary"onClick={()=>a({})}>
            + Agregar cliente/a
          </button>
          <button className="btn btn-secondary"onClick={()=>i.auth.signOut()}>
            Cerrar sesión
          </button>
        </div>
      </div>

      <div className="cards"style={{gridTemplateColumns:"repeat(2, 1fr)",maxWidth:500}}>
        {f.map(e=><div className={"card "+e.cls}key={e.label}>
            <div className="label">{e.label}</div>
            <div className="value">{e.value}</div>
          </div>)}
      </div>

      {d&&<div className="login-error"style={{marginBottom:12}}>{d}</div>}
      {u?<div>Cargando clientes...</div>:<E clientes={l}onEdit={e=>a(e)}onDelete={v}/>}

      {r!==null&&<S initial={r}onClose={()=>a(null)}onSaved={()=>{a(null),s()}}/>}
    </main>}export default function T(){return<C>
      <div className="shell">
        <N/>
        <A/>
      </div>
    </C>}
