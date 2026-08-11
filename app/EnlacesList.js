"use client";import{useState as s}from"react";export default function u({enlaces:o,onEdit:e,onDelete:n}){const[l,a]=s(null);async function d(t){try{await navigator.clipboard.writeText(t.url),a(t.id),setTimeout(()=>a(i=>i===t.id?null:i),1500)}catch{alert("No se pudo copiar. Copia manualmente: "+t.url)}}if(o.length===0)return<div className="muted">Todavía no has guardado ningún enlace.</div>;const r=[...o].sort((t,i)=>t.titulo.localeCompare(i.titulo));return<div style={{display:"flex",flexDirection:"column",gap:10}}>
      {r.map(t=><div key={t.id}style={{display:"flex",alignItems:"center",justifyContent:"space-between",background:"#fff",borderRadius:12,padding:"14px 18px",boxShadow:"0 1px 2px rgba(90, 45, 130, 0.06)",gap:16}}>
          <div style={{minWidth:0}}>
            <div className="name-cell">{t.titulo}</div>
            <a href={t.url}target="_blank"rel="noreferrer"className="fathom-link"style={{display:"inline-block",maxWidth:480,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",verticalAlign:"bottom"}}>
              {t.url}
            </a>
          </div>
          <div style={{display:"flex",gap:8,flexShrink:0}}>
            <button className="btn btn-secondary"onClick={()=>d(t)}>
              {l===t.id?"¡Copiado!":"Copiar"}
            </button>
            <button className="btn btn-secondary"onClick={()=>e(t)}>
              Editar
            </button>
            <button className="btn btn-secondary"onClick={()=>n(t)}>
              Eliminar
            </button>
          </div>
        </div>)}
    </div>}
