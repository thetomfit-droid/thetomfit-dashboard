"use client";import{useState as o}from"react";import{supabase as b}from"../lib/supabaseClient";function _(){return new Date().toISOString().slice(0,10)}function f(e){if(!e)return 0;const a=String(e).match(/\d+([.,]\d+)?/g);return a?a.reduce((i,r)=>i+parseFloat(r.replace(",",".")),0):0}export default function C({pago:e,onClose:a,onSaved:i}){const[r,v]=o(""),[l,h]=o(_()),[u,N]=o(""),[d,c]=o(!1),[m,n]=o("");async function S(t){t.preventDefault(),n("");const s=parseFloat(String(r).replace(",","."));if(!s||s<=0){n("Ingresa un monto válido.");return}c(!0);const{error:g}=await b.from("pagos_historial").insert({pago_cliente_id:e.id,nombre:e.nombre,correo:e.correo||null,monto:s,fecha:l,notas:u||null});if(g){c(!1),n("No se pudo registrar: "+g.message);return}const y=f(e.dinero_recolectado)+s,{error:p}=await b.from("pagos_clientes").update({dinero_recolectado:String(y),fecha_pago:l}).eq("id",e.id);if(c(!1),p){n("Se registró el pago pero no se pudo actualizar el total: "+p.message);return}i()}return<div className="modal-backdrop"onClick={a}>
      <div className="modal-card"onClick={t=>t.stopPropagation()}>
        <h2>Registrar pago — {e.nombre}</h2>
        <p className="note-count"style={{marginTop:-8,marginBottom:14}}>
          Total recolectado hasta ahora: €{f(e.dinero_recolectado).toLocaleString("es-ES")}.
          Este pago se suma a ese total y queda registrado en el historial mensual.
        </p>
        <form onSubmit={S}>
          <div className="form-grid">
            <label>
              Monto (€) de esta cuota/pago
              <input value={r}onChange={t=>v(t.target.value)}required autoFocus/>
            </label>
            <label>
              Fecha del pago
              <input type="date"value={l}onChange={t=>h(t.target.value)}required/>
            </label>
            <label className="full">
              Notas (opcional, ej. "Cuota 2 de 3")
              <input value={u}onChange={t=>N(t.target.value)}/>
            </label>
          </div>

          {m&&<div className="login-error">{m}</div>}

          <div className="modal-actions">
            <button type="button"className="btn btn-secondary"onClick={a}>
              Cancelar
            </button>
            <button type="submit"className="btn btn-primary"disabled={d}>
              {d?"Guardando...":"Registrar pago"}
            </button>
          </div>
        </form>
      </div>
    </div>}
