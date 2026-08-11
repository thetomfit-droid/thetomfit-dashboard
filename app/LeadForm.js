"use client";import{useState as r}from"react";import{supabase as p}from"../lib/supabaseClient";const _=["Seguimiento","Reserva","Reagendar","No cliente","No show","Cliente"],C=["Alta","Media-Alta","Media","Baja","Cliente activo"],N=["Sí","No"],y={nombre:"",telefono:"",instagram:"",pais:"",fecha_llamada:"",estado:"Seguimiento",venta:"No",objeciones:"",observaciones:"",plan_acordado:"",volver_a_contactar:"",prioridad:"Media",fathom_url:""};export default function S({initial:o,onClose:i,onSaved:g}){const s=!!(o&&o.id),[e,f]=r(()=>({...y,...o||{}})),[c,d]=r(!1),[u,v]=r("");function l(a,t){f(n=>({...n,[a]:t}))}async function h(a){a.preventDefault(),d(!0),v("");const t={...e};delete t.id,delete t.created_at,["fecha_llamada","volver_a_contactar"].forEach(m=>{t[m]||(t[m]=null)});const n=s?p.from("leads").update(t).eq("id",o.id):p.from("leads").insert(t),{error:b}=await n;if(d(!1),b){v("No se pudo guardar: "+b.message);return}g()}return<div className="modal-backdrop"onClick={i}>
      <div className="modal-card"onClick={a=>a.stopPropagation()}>
        <h2>{s?"Editar lead":"Agregar lead"}</h2>
        <form onSubmit={h}>
          <div className="form-grid">
            <label className="full">
              Nombre
              <input value={e.nombre}onChange={a=>l("nombre",a.target.value)}required/>
            </label>
            <label>
              Teléfono
              <input value={e.telefono||""}onChange={a=>l("telefono",a.target.value)}/>
            </label>
            <label>
              Instagram
              <input value={e.instagram||""}onChange={a=>l("instagram",a.target.value)}/>
            </label>
            <label>
              País
              <input value={e.pais||""}onChange={a=>l("pais",a.target.value)}/>
            </label>
            <label>
              Fecha de llamada
              <input type="date"value={e.fecha_llamada||""}onChange={a=>l("fecha_llamada",a.target.value)}/>
            </label>
            <label>
              Estado
              <select value={e.estado||""}onChange={a=>l("estado",a.target.value)}>
                {_.map(a=><option key={a}value={a}>{a}</option>)}
              </select>
            </label>
            <label>
              ¿Venta?
              <select value={e.venta||""}onChange={a=>l("venta",a.target.value)}>
                {N.map(a=><option key={a}value={a}>{a}</option>)}
              </select>
            </label>
            <label>
              Prioridad
              <select value={e.prioridad||""}onChange={a=>l("prioridad",a.target.value)}>
                {C.map(a=><option key={a}value={a}>{a}</option>)}
              </select>
            </label>
            <label>
              Volver a contactar
              <input type="date"value={e.volver_a_contactar||""}onChange={a=>l("volver_a_contactar",a.target.value)}/>
            </label>
            <label>
              Plan / precio acordado
              <input value={e.plan_acordado||""}onChange={a=>l("plan_acordado",a.target.value)}/>
            </label>
            <label className="full">
              Objeción principal
              <textarea value={e.objeciones||""}onChange={a=>l("objeciones",a.target.value)}/>
            </label>
            <label className="full">
              Observaciones
              <textarea value={e.observaciones||""}onChange={a=>l("observaciones",a.target.value)}/>
            </label>
            <label className="full">
              Enlace de grabación (Fathom)
              <input value={e.fathom_url||""}onChange={a=>l("fathom_url",a.target.value)}/>
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
