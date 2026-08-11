"use client";import{useState as s}from"react";import{supabase as d}from"../lib/supabaseClient";export default function p({recordatorios:r,onChanged:i}){const[a,o]=s(""),[l,n]=s(!1);async function u(e){if(e.preventDefault(),!a.trim())return;n(!0);const{error:t}=await d.from("recordatorios").insert({texto:a.trim()});if(n(!1),t){alert("No se pudo guardar: "+t.message);return}o(""),i()}async function f(e){const{error:t}=await d.from("recordatorios").delete().eq("id",e.id);if(t){alert("No se pudo eliminar: "+t.message);return}i()}return<div>
      <form onSubmit={u}style={{display:"flex",gap:8,marginBottom:12}}>
        <input type="text"placeholder="Agregar un recordatorio..."value={a}onChange={e=>o(e.target.value)}style={{flex:1,padding:"9px 12px",border:"1px solid #ecdfe8",borderRadius:8,fontSize:13,fontFamily:"var(--font-heading)"}}/>
        <button className="btn btn-primary"type="submit"disabled={l}>
          + Agregar
        </button>
      </form>
      {r.length===0?<div className="muted">No tienes recordatorios guardados.</div>:<div style={{display:"flex",flexDirection:"column",gap:8}}>
          {r.map(e=><div key={e.id}style={{display:"flex",justifyContent:"space-between",alignItems:"center",background:"#fbf6fa",borderRadius:8,padding:"9px 12px",fontSize:13,gap:10}}>
              <span>{e.texto}</span>
              <button className="edit-link"style={{flexShrink:0}}onClick={()=>f(e)}>
                Eliminar
              </button>
            </div>)}
        </div>}
    </div>}
