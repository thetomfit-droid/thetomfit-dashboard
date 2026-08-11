"use client";import{useEffect as G,useState as o,useCallback as H}from"react";import{supabase as l}from"../../lib/supabaseClient";import K from"../AuthGate";import Q from"../Sidebar";import U from"../DashboardChart";import W from"../RecordatoriosList";import{displayEstado as J}from"../TareasTable";const X=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];function Z(t){if(!t)return 0;const s=String(t).match(/\d+([.,]\d+)?/g);return s?s.reduce((i,n)=>i+parseFloat(n.replace(",",".")),0):0}function y(t){return"€"+Number(t||0).toLocaleString("es-ES",{minimumFractionDigits:2,maximumFractionDigits:2})}function ee(t){return t?t.slice(0,7):null}function ae(t,s){return new Date(t,s+1,0).getDate()}function te(t){return t?new Date(t+"T00:00:00").toLocaleDateString("es-ES",{day:"2-digit",month:"2-digit",year:"numeric"}):"—"}function Me(){return new Date().toISOString().slice(0,10)}function se(t){if(!t)return null;const s=new Date(t+"T00:00:00"),i=new Date;i.setHours(0,0,0,0);let n=new Date(i.getFullYear(),s.getMonth(),s.getDate());return n<i&&(n=new Date(i.getFullYear()+1,s.getMonth(),s.getDate())),n.toISOString().slice(0,10)}function ie(t){const s=new Date(t+"T00:00:00"),i=new Date;return i.setHours(0,0,0,0),Math.round((s-i)/864e5)}const oe={Cumpleaños:"media","Pago pendiente":"baja2",Renovación:"mediaalta",Recontactar:"cliente",Tarea:"alta","Check-in":"mediaalta"};function Ne(){const[t,s]=o([]),[i,n]=o([]),[g,F]=o([]),[N,R]=o([]),[j,k]=o([]),[P,z]=o([]),[I,S]=o(!0),[w,T]=o(""),C=H(async()=>{S(!0),T("");const[e,a,c,h,m,u]=await Promise.all([l.from("tareas").select("*"),l.from("leads").select("*"),l.from("pagos_clientes").select("*"),l.from("gastos_empresa").select("*"),l.from("pagos_historial").select("*"),l.from("recordatorios").select("*").order("created_at",{ascending:!1})]);S(!1);const p=[e,a,c,h,m,u].find(b=>b.error);if(p){T("No se pudo cargar el dashboard: "+p.error.message);return}s(e.data||[]),n(a.data||[]),F(c.data||[]),R(h.data||[]),k(m.data||[]),z(u.data||[])},[]);if(G(()=>{C()},[C]),I)return<main className="main">
        <div>Cargando dashboard...</div>
      </main>;if(w)return<main className="main">
        <div className="login-error">{w}</div>
      </main>;const L=N.filter(e=>e.tipo==="mensual").reduce((e,a)=>e+Number(a.monto||0),0),$=N.filter(e=>e.tipo==="diario").reduce((e,a)=>e+Number(a.monto||0),0),O=N.filter(e=>e.tipo==="variable").reduce((e,a)=>e+Number(a.monto||0),0),D={};j.forEach(e=>{const a=ee(e.fecha);a&&(D[a]=(D[a]||0)+Number(e.monto||0))});const _=new Date,f=[];for(let e=5;e>=0;e--){const a=new Date(_.getFullYear(),_.getMonth()-e,1),c=`${a.getFullYear()}-${String(a.getMonth()+1).padStart(2,"0")}`,h=ae(a.getFullYear(),a.getMonth()),m=L+$*h,u=e===0,p=u?m+O:m,b=D[c]||0;f.push({key:c,label:`${X[a.getMonth()]} ${a.getFullYear()}`,ingresos:b,gastos:p,beneficio:b-p,isCurrent:u})}const d=f[f.length-1],v=t.map(e=>({...e,_display:J(e)})),x=v.filter(e=>e._display==="Pendiente").length,E=v.filter(e=>e._display==="En proceso").length,V=v.filter(e=>e._display==="Vencida").length,B=v.filter(e=>e._display==="Terminada").length,r=[];t.forEach(e=>{!e.fecha_limite||e.estado==="Terminada"||r.push({fecha:e.fecha_limite,tipo:"Tarea",label:e.titulo})}),i.forEach(e=>{e.volver_a_contactar&&["Seguimiento","Reagendar"].includes(e.estado)&&r.push({fecha:e.volver_a_contactar,tipo:"Recontactar",label:`Contactar a ${e.nombre}`})}),g.forEach(e=>{e.cumpleanos&&r.push({fecha:se(e.cumpleanos),tipo:"Cumpleaños",label:`Cumpleaños de ${e.nombre}`}),e.vencimiento&&e.estado_pago!=="Pagado"&&r.push({fecha:e.vencimiento,tipo:"Pago pendiente",label:`Vence pago de ${e.nombre}`}),e.renovacion&&r.push({fecha:e.renovacion,tipo:"Renovación",label:`Renovación de ${e.nombre}`}),e.videollamada_mensual&&r.push({fecha:e.videollamada_mensual,tipo:"Check-in",label:`Videollamada mensual con ${e.nombre}`})});const M=r.filter(e=>e.fecha).map(e=>({...e,dias:ie(e.fecha)})).filter(e=>e.dias>=-14&&e.dias<=45).sort((e,a)=>e.fecha.localeCompare(a.fecha)).slice(0,12),Y=g.filter(e=>e.cliente_estado==="Cliente Actual").length,A=g.reduce((e,a)=>e+Z(a.dinero_recolectado),0);return<main className="main">
      <div className="topbar">
        <div>
          <h1>Dashboard</h1>
          <p className="subtitle">Lo más importante de tu negocio, de un vistazo.</p>
        </div>
        <div className="topbar-actions">
          <button className="btn btn-secondary"onClick={()=>l.auth.signOut()}>
            Cerrar sesión
          </button>
        </div>
      </div>

      <div className="cards">
        <div className="card alta">
          <div className="label">Ingresos {d.label}</div>
          <div className="value">{y(d.ingresos)}</div>
        </div>
        <div className="card baja2">
          <div className="label">Gastos {d.label}</div>
          <div className="value">{y(d.gastos)}</div>
        </div>
        <div className={"card "+(d.beneficio>=0?"cliente":"baja2")}>
          <div className="label">Beneficio neto del mes</div>
          <div className="value">{y(d.beneficio)}</div>
        </div>
        <div className="card mediaalta">
          <div className="label">Clientes actuales</div>
          <div className="value">{Y}</div>
        </div>
        <div className="card media">
          <div className="label">Tareas pendientes</div>
          <div className="value">{x+E}</div>
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1.4fr 1fr",gap:20,marginBottom:20,alignItems:"start"}}>
        <div className="card"style={{padding:20}}>
          <div className="label"style={{marginBottom:10}}>Tendencia de los últimos 6 meses</div>
          <U meses={f}/>
          <div style={{display:"flex",gap:16,marginTop:8,fontSize:11,color:"#8a7d92",flexWrap:"wrap"}}>
            <span>
              <span style={{display:"inline-block",width:9,height:9,background:"#4c7351",borderRadius:2,marginRight:4}}/>
              Ingresos
            </span>
            <span>
              <span style={{display:"inline-block",width:9,height:9,background:"#ad3a3a",borderRadius:2,marginRight:4}}/>
              Gastos
            </span>
            <span>El número arriba de cada mes es el beneficio neto.</span>
          </div>
        </div>

        <div className="card"style={{padding:20}}>
          <div className="label"style={{marginBottom:10}}>Tareas por estado</div>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:13}}>
              <span>Pendientes</span>
              <strong>{x}</strong>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:13}}>
              <span>En proceso</span>
              <strong>{E}</strong>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:13}}>
              <span>Vencidas</span>
              <strong style={{color:"#8a2c2c"}}>{V}</strong>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:13}}>
              <span>Terminadas</span>
              <strong>{B}</strong>
            </div>
          </div>
          <a href="/tareas"className="fathom-link"style={{display:"inline-block",marginTop:14}}>
            Ver todas las tareas →
          </a>
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1.4fr 1fr",gap:20,alignItems:"start"}}>
        <div className="card"style={{padding:20}}>
          <div className="label"style={{marginBottom:10}}>Lo que se viene (próximos 45 días)</div>
          {M.length===0?<div className="muted">No tienes nada agendado en las próximas semanas.</div>:<table>
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Tipo</th>
                  <th>Qué</th>
                </tr>
              </thead>
              <tbody>
                {M.map((e,a)=><tr key={a}>
                    <td className="name-cell">
                      {te(e.fecha)}
                      {e.dias<0&&<span style={{color:"#8a2c2c",fontSize:11}}> (vencido)</span>}
                      {e.dias===0&&<span style={{color:"#96650b",fontSize:11}}> (hoy)</span>}
                    </td>
                    <td>
                      <span className={"pill "+(oe[e.tipo]||"baja")}>{e.tipo}</span>
                    </td>
                    <td>{e.label}</td>
                  </tr>)}
              </tbody>
            </table>}
        </div>

        <div className="card"style={{padding:20}}>
          <div className="label"style={{marginBottom:10}}>Recordatorios del negocio</div>
          <W recordatorios={P}onChanged={C}/>
        </div>
      </div>

      <p className="note-count"style={{marginTop:20}}>
        Total histórico recolectado: {y(A)} · {g.length} registros en Finanzas. El
        calendario junta tareas, seguimientos de Ventas, cumpleaños, vencimientos y renovaciones de
        Finanzas. Los pagos de Stripe no muestran la fecha exacta del próximo cobro salvo que le pongas
        vencimiento al cliente en Clientes totales.
      </p>
    </main>}export default function Ce(){return<K>
      <div className="shell">
        <Q/>
        <Ne/>
      </div>
    </K>}
