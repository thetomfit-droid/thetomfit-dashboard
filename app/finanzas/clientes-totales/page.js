"use client";import{useEffect as f,useState as s,useCallback as S}from"react";import{supabase as N}from"../../../lib/supabaseClient";import C from"../../PagosTable";import P from"../../PagoForm";import E from"../../RegistrarPagoForm";function d(e,t,l){return e.filter(o=>o[t]===l).length}function F(e){if(!e)return 0;const t=String(e).match(/\d+([.,]\d+)?/g);return t?t.reduce((l,o)=>l+parseFloat(o.replace(",",".")),0):0}export default function R(){const[e,t]=s([]),[l,o]=s(!1),[u,r]=s(null),[g,c]=s(null),[m,p]=s("");const n=S(async()=>{o(!0),p("");const{data:a,error:i}=await N.from("pagos_clientes").select("*").order("nombre",{ascending:!0});if(o(!1),i){p("No se pudieron cargar los pagos: "+i.message);return}t(a||[])},[]);f(()=>{n()},[n]);const v=e.reduce((a,i)=>a+F(i.dinero_recolectado),0),b=[{label:"Total de registros",value:e.length,cls:""},{label:"Total recolectado",value:"€"+v.toLocaleString("es-ES"),cls:"alta"},{label:"Falta pago",value:d(e,"estado_pago","Falta pago"),cls:"baja2"},{label:"En cuotas",value:d(e,"estado_pago","En cuotas"),cls:"mediaalta"},{label:"Clientes actuales",value:d(e,"cliente_estado","Cliente Actual"),cls:"cliente"}];return<>
      <div className="topbar"style={{marginBottom:4}}>
        <div/>
        <div className="topbar-actions">
          <button className="btn btn-primary"onClick={()=>r({})}>
            + Agregar pago
          </button>
        </div>
      </div>

      <div className="cards">
        {b.map(a=><div className={"card "+a.cls}key={a.label}>
            <div className="label">{a.label}</div>
            <div className="value">{a.value}</div>
          </div>)}
      </div>

      {m&&<div className="login-error"style={{marginBottom:12}}>{m}</div>}
      {l?<div>Cargando pagos...</div>:<C pagos={e}onEdit={a=>r(a)}onRegistrarPago={a=>c(a)}/>}

      {u!==null&&<P initial={u}onClose={()=>r(null)}onSaved={()=>{r(null),n()}}/>}

      {g!==null&&<E pago={g}onClose={()=>c(null)}onSaved={()=>{c(null),n()}}/>}
    </>}
