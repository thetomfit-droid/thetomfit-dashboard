"use client";import{useState as i}from"react";import{supabase as f}from"../lib/supabaseClient";const N={nombre:"",notas:"",fase_objetivos:"",plazo_inicio:"",plazo_fin:""};export default function h({initial:l,onClose:s,onSaved:v}){const r=!!(l&&l.id),[o,g]=i(()=>({...N,...l||{}})),[u,d]=i(!1),[c,b]=i("");function t(e,a){g(n=>({...n,[e]:a}))}async function _(e){e.preventDefault(),d(!0),b("");const a={...o};delete a.id,delete a.created_at,["plazo_inicio","plazo_fin"].forEach(p=>{a[p]||(a[p]=null)});const n=r?f.from("clientes_notas").update(a).eq("id",l.id):f.from("clientes_notas").insert(a),{error:m}=await n;if(d(!1),m){b("No se pudo guardar: "+m.message);return}v()}return<div className="modal-backdrop"onClick={s}>
      <div className="modal-card"onClick={e=>e.stopPropagation()}>
        <h2>{r?"Editar clienta/e":"Agregar clienta/e"}</h2>
        <form onSubmit={_}>
          <div className="form-grid">
            <label className="full">
              Nombre
              <input value={o.nombre}onChange={e=>t("nombre",e.target.value)}required/>
            </label>
            <label>
              Fase y objetivos
              <input value={o.fase_objetivos||""}onChange={e=>t("fase_objetivos",e.target.value)}/>
            </label>
            <label>
              Plazo inicio
              <input type="date"value={o.plazo_inicio||""}onChange={e=>t("plazo_inicio",e.target.value)}/>
            </label>
            <label>
              Plazo fin
              <input type="date"value={o.plazo_fin||""}onChange={e=>t("plazo_fin",e.target.value)}/>
            </label>
            <label className="full">
              Notas (lo que me pide que modifique o haga)
              <textarea rows={6}value={o.notas||""}onChange={e=>t("notas",e.target.value)}/>
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
