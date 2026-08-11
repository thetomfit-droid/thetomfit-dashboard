"use client";import{useState as r}from"react";import{supabase as b}from"../lib/supabaseClient";const N=[{value:"mensual",label:"Recurrente mensual"},{value:"diario",label:"Recurrente diario"},{value:"anual",label:"Recurrente anual"},{value:"puntual",label:"Puntual (una sola vez)"},{value:"variable",label:"Variable (ej. comisiones)"}],y={concepto:"",tipo:"mensual",monto:"",notas:"",fecha:""};export default function C({initial:l,onClose:s,onSaved:g}){var p;const u=!!(l&&l.id),[t,f]=r(()=>({...y,...l||{}})),[c,i]=r(!1),[d,m]=r("");function o(e,a){f(n=>({...n,[e]:a}))}async function h(e){e.preventDefault(),i(!0),m("");const a={...t};delete a.id,delete a.created_at,a.monto=parseFloat(String(a.monto).replace(",","."))||0,a.fecha||(a.fecha=null);const n=u?b.from("gastos_empresa").update(a).eq("id",l.id):b.from("gastos_empresa").insert(a),{error:v}=await n;if(i(!1),v){m("No se pudo guardar: "+v.message);return}g()}return<div className="modal-backdrop"onClick={s}>
      <div className="modal-card"onClick={e=>e.stopPropagation()}>
        <h2>{u?"Editar gasto":"Agregar gasto"}</h2>
        <form onSubmit={h}>
          <div className="form-grid">
            <label className="full">
              Concepto
              <input value={t.concepto}onChange={e=>o("concepto",e.target.value)}required/>
            </label>
            <label>
              Tipo
              <select value={t.tipo||""}onChange={e=>o("tipo",e.target.value)}>
                {N.map(e=><option key={e.value}value={e.value}>{e.label}</option>)}
              </select>
            </label>
            <label>
              Monto (€)
              <input value={(p=t.monto)!=null?p:""}onChange={e=>o("monto",e.target.value)}required/>
            </label>
            <label>
              Fecha (opcional)
              <input type="date"value={t.fecha||""}onChange={e=>o("fecha",e.target.value)}/>
            </label>
            <label className="full">
              Notas
              <textarea value={t.notas||""}onChange={e=>o("notas",e.target.value)}/>
            </label>
          </div>

          {d&&<div className="login-error">{d}</div>}

          <div className="modal-actions">
            <button type="button"className="btn btn-secondary"onClick={s}>
              Cancelar
            </button>
            <button type="submit"className="btn btn-primary"disabled={c}>
              {c?"Guardando...":"Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>}
