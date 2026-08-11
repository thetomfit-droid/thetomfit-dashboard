"use client";import{useState as n}from"react";import{supabase as b}from"../lib/supabaseClient";const h=["Pendiente","En proceso","Terminada"],N={titulo:"",descripcion:"",estado:"Pendiente",fecha_limite:""};export default function y({initial:o,onClose:i,onSaved:f}){const s=!!(o&&o.id),[t,v]=n(()=>({...N,...o||{}})),[c,d]=n(!1),[u,m]=n("");function l(e,a){v(r=>({...r,[e]:a}))}async function g(e){e.preventDefault(),d(!0),m("");const a={...t};delete a.id,delete a.created_at,a.fecha_limite||(a.fecha_limite=null);const r=s?b.from("tareas").update(a).eq("id",o.id):b.from("tareas").insert(a),{error:p}=await r;if(d(!1),p){m("No se pudo guardar: "+p.message);return}f()}return<div className="modal-backdrop"onClick={i}>
      <div className="modal-card"onClick={e=>e.stopPropagation()}>
        <h2>{s?"Editar tarea":"Agregar tarea"}</h2>
        <form onSubmit={g}>
          <div className="form-grid">
            <label className="full">
              Título
              <input value={t.titulo}onChange={e=>l("titulo",e.target.value)}required/>
            </label>
            <label>
              Estado
              <select value={t.estado||""}onChange={e=>l("estado",e.target.value)}>
                {h.map(e=><option key={e}value={e}>{e}</option>)}
              </select>
            </label>
            <label>
              Fecha límite (opcional)
              <input type="date"value={t.fecha_limite||""}onChange={e=>l("fecha_limite",e.target.value)}/>
            </label>
            <label className="full">
              Descripción
              <textarea value={t.descripcion||""}onChange={e=>l("descripcion",e.target.value)}/>
            </label>
          </div>

          {u&&<div className="login-error">{u}</div>}

          <div className="modal-actions">
            <button type="button"className="btn btn-secondary"onClick={i}>
              Cancelar
            </button>
            <button type="submit"className="btn btn-primary"disabled={c}>
              {c?"Guardando...":"Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>}
