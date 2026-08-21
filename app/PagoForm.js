"use client";import{useState as r}from"react";import{supabase as b}from"../lib/supabaseClient";const h=["Cliente Actual","Pausa","Ex cliente"],y=["Pagado","En cuotas","Falta pago"],S=["Plan Trimestral","Plan Semestral","Plan Anual"],E=["Stripe","Transferencia"],N=["inicio_pago","vencimiento","fecha_pago","renovacion","videollamada_mensual","cumpleanos"],P={nombre:"",cliente_estado:"Cliente Actual",correo:"",estado_pago:"Falta pago",oferta:"",servicio:"Plan Semestral",cuotas:"",dinero_recolectado:"",metodo_pago:"Stripe",numero_renovaciones:"",notas:"",inicio_pago:"",vencimiento:"",fecha_pago:"",renovacion:"",videollamada_mensual:"",cumpleanos:""};export default function A({initial:t,onClose:i,onSaved:_}){var v;const u=!!(t&&t.id),[a,f]=r(()=>({...P,...t||{}})),[c,s]=r(!1),[d,p]=r("");function o(e,l){f(n=>({...n,[e]:l}))}async function C(e){e.preventDefault(),s(!0),p("");const l={...a};delete l.id,delete l.created_at,N.forEach(m=>{l[m]||(l[m]=null)}),l.numero_renovaciones===""&&(l.numero_renovaciones=null);const n=u?b.from("pagos_clientes").update(l).eq("id",t.id):b.from("pagos_clientes").insert(l),{error:g}=await n;if(s(!1),g){p("No se pudo guardar: "+g.message);return}_()}return<div className="modal-backdrop"onClick={i}>
      <div className="modal-card"onClick={e=>e.stopPropagation()}>
        <h2>{u?"Editar pago":"Agregar pago"}</h2>
        <form onSubmit={C}>
          <div className="form-grid">
            <label className="full">
              Nombre
              <input value={a.nombre}onChange={e=>o("nombre",e.target.value)}required/>
            </label>
            <label>
              Correo
              <input value={a.correo||""}onChange={e=>o("correo",e.target.value)}/>
            </label>
            <label>
              Cliente
              <select value={a.cliente_estado||""}onChange={e=>o("cliente_estado",e.target.value)}>
                {h.map(e=><option key={e}value={e}>{e}</option>)}
              </select>
            </label>
            <label>
              Servicio
              <select value={a.servicio||""}onChange={e=>o("servicio",e.target.value)}>
                {S.map(e=><option key={e}value={e}>{e}</option>)}
              </select>
            </label>
            <label>
              Estado de pago
              <select value={a.estado_pago||""}onChange={e=>o("estado_pago",e.target.value)}>
                {y.map(e=><option key={e}value={e}>{e}</option>)}
              </select>
            </label>
            <label>
              Método de pago
              <select value={a.metodo_pago||""}onChange={e=>o("metodo_pago",e.target.value)}>
                {E.map(e=><option key={e}value={e}>{e}</option>)}
              </select>
            </label>
            <label>
              Oferta
              <input value={a.oferta||""}onChange={e=>o("oferta",e.target.value)}/>
            </label>
            <label>
              Cuotas
              <input value={a.cuotas||""}onChange={e=>o("cuotas",e.target.value)}/>
            </label>
            <label>
              Dinero recolectado
              <input value={a.dinero_recolectado||""}onChange={e=>o("dinero_recolectado",e.target.value)}/>
            </label>
            <label>
              Número de renovaciones
              <input type="number"value={(v=a.numero_renovaciones)!=null?v:""}onChange={e=>o("numero_renovaciones",e.target.value)}/>
            </label>
            <label>
              Inicio de pago (cuándo pagó / inició el programa)
              <input type="date"value={a.inicio_pago||""}onChange={e=>o("inicio_pago",e.target.value)}/>
            </label>
            <label>
              Fecha de vencimiento
              <input type="date"value={a.vencimiento||""}onChange={e=>o("vencimiento",e.target.value)}/>
            </label>
            <label>
              Próxima fecha de pago (cuándo le toca pagar de nuevo)
              <input type="date"value={a.fecha_pago||""}onChange={e=>o("fecha_pago",e.target.value)}/>
            </label>
            <label>
              Renovación
              <input type="date"value={a.renovacion||""}onChange={e=>o("renovacion",e.target.value)}/>
            </label>
            <label>
              Videollamada mensual
              <input type="date"value={a.videollamada_mensual||""}onChange={e=>o("videollamada_mensual",e.target.value)}/>
            </label>
            <label>
              Cumpleaños
              <input type="date"value={a.cumpleanos||""}onChange={e=>o("cumpleanos",e.target.value)}/>
            </label>
            <label className="full">
              Notas
              <textarea value={a.notas||""}onChange={e=>o("notas",e.target.value)}/>
            </label>
          </div>

          {d&&<div className="login-error">{d}</div>}

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
