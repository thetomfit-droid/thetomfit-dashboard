"use client";import{useState as r}from"react";import{supabase as b}from"../lib/supabaseClient";const y=[{value:"personalizado",label:"Personal"},{value:"tarea",label:"Tarea"},{value:"trabajo",label:"Trabajo / videollamadas"},{value:"descanso",label:"Descanso"},{value:"mensajes",label:"Mensajes"},{value:"stories",label:"Stories"},{value:"skool",label:"Skool"},{value:"calendly",label:"Calendly"},{value:"google",label:"Google Calendar"}];function _(){return new Date().toISOString().slice(0,10)}export default function C({initial:t,onClose:s,onSaved:m}){const n=!!(t&&t.id),f={titulo:"",fecha:_(),tipo:"personalizado",hora_inicio:"",hora_fin:"",descripcion:""},[e,h]=r(()=>({...f,...t||{}})),[u,c]=r(!1),[d,v]=r("");function o(a,l){h(i=>({...i,[a]:l}))}async function g(a){a.preventDefault(),c(!0),v("");const l={titulo:e.titulo,fecha:e.fecha,tipo:e.tipo,hora_inicio:e.hora_inicio||null,hora_fin:e.hora_fin||null,descripcion:e.descripcion||null};n||(l.origen="manual",l.completado=!1);const i=n?b.from("calendario_eventos").update(l).eq("id",t.id):b.from("calendario_eventos").insert(l),{error:p}=await i;if(c(!1),p){v("No se pudo guardar: "+p.message);return}m()}return<div className="modal-backdrop"onClick={s}>
      <div className="modal-card"onClick={a=>a.stopPropagation()}>
        <h2>{n?"Editar evento":"Agregar evento"}</h2>
        <form onSubmit={g}>
          <div className="form-grid">
            <label className="full">
              Título
              <input value={e.titulo}onChange={a=>o("titulo",a.target.value)}required autoFocus/>
            </label>
            <label>
              Fecha
              <input type="date"value={e.fecha||""}onChange={a=>o("fecha",a.target.value)}required/>
            </label>
            <label>
              Tipo
              <select value={e.tipo||""}onChange={a=>o("tipo",a.target.value)}>
                {y.map(a=><option key={a.value}value={a.value}>{a.label}</option>)}
              </select>
            </label>
            <label>
              Hora de inicio (opcional)
              <input type="time"value={e.hora_inicio||""}onChange={a=>o("hora_inicio",a.target.value)}/>
            </label>
            <label>
              Hora de fin (opcional)
              <input type="time"value={e.hora_fin||""}onChange={a=>o("hora_fin",a.target.value)}/>
            </label>
            <label className="full">
              Notas
              <textarea value={e.descripcion||""}onChange={a=>o("descripcion",a.target.value)}/>
            </label>
          </div>

          {d&&<div className="login-error">{d}</div>}

          <div className="modal-actions">
            <button type="button"className="btn btn-secondary"onClick={s}>
              Cancelar
            </button>
            <button type="submit"className="btn btn-primary"disabled={u}>
              {u?"Guardando...":"Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>}
