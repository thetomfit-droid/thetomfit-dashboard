"use client";import{useState as o}from"react";import{supabase as b}from"../lib/supabaseClient";const h={titulo:"",url:""};export default function y({initial:a,onClose:s,onSaved:f}){const n=!!(a&&a.id),[l,v]=o(()=>({...h,...a||{}})),[u,i]=o(!1),[c,d]=o("");function m(e,t){v(r=>({...r,[e]:t}))}async function g(e){e.preventDefault(),i(!0),d("");let t=l.url.trim();t&&!/^https?:\/\//i.test(t)&&(t="https://"+t);const r={titulo:l.titulo,url:t},N=n?b.from("enlaces").update(r).eq("id",a.id):b.from("enlaces").insert(r),{error:p}=await N;if(i(!1),p){d("No se pudo guardar: "+p.message);return}f()}return<div className="modal-backdrop"onClick={s}>
      <div className="modal-card"onClick={e=>e.stopPropagation()}>
        <h2>{n?"Editar enlace":"Agregar enlace"}</h2>
        <form onSubmit={g}>
          <div className="form-grid">
            <label className="full">
              Título (qué es este enlace)
              <input value={l.titulo}onChange={e=>m("titulo",e.target.value)}required/>
            </label>
            <label className="full">
              Enlace (URL)
              <input value={l.url}onChange={e=>m("url",e.target.value)}placeholder="https://..."required/>
            </label>
          </div>

          {c&&<div className="login-error">{c}</div>}

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
