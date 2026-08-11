"use client";import{useMemo as N,useState as c}from"react";const f={Pagado:"alta","En cuotas":"mediaalta","Falta pago":"baja2"},C={"Cliente Actual":"alta",Pausa:"media","Ex cliente":"baja"},m={"Falta pago":0,"En cuotas":1,Pagado:2};function v(a){return a?new Date(a+"T00:00:00").toLocaleDateString("es-ES",{day:"2-digit",month:"2-digit",year:"numeric"}):"—"}export default function E({pagos:a,onEdit:i,onRegistrarPago:u}){const[s,h]=c(""),[n,b]=c("Todos"),r=N(()=>{let t=[...a];if(n!=="Todos"&&(t=t.filter(o=>o.estado_pago===n)),s.trim()){const o=s.trim().toLowerCase();t=t.filter(e=>[e.nombre,e.correo,e.servicio,e.notas].filter(Boolean).some(d=>d.toLowerCase().includes(o)))}return t.sort((o,e)=>{var d,l;return((d=m[o.estado_pago])!=null?d:9)-((l=m[e.estado_pago])!=null?l:9)}),t},[a,s,n]),g=["Todos","Falta pago","En cuotas","Pagado"];return<>
      <div className="toolbar">
        <input type="text"placeholder="Buscar por nombre, correo, servicio, notas..."value={s}onChange={t=>h(t.target.value)}/>
        {g.map(t=><button key={t}className={"filter-btn"+(n===t?" active":"")}onClick={()=>b(t)}>
            {t}
          </button>)}
      </div>

      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Cliente</th>
            <th>Correo</th>
            <th>Servicio</th>
            <th>Cuotas</th>
            <th>Dinero recolectado</th>
            <th>Método</th>
            <th>Vencimiento</th>
            <th>Estado</th>
            <th>Notas</th>
            <th/>
          </tr>
        </thead>
        <tbody>
          {r.map(t=><tr key={t.id}>
              <td className="name-cell">{t.nombre}</td>
              <td>
                <span className={"pill "+(C[t.cliente_estado]||"baja")}>
                  {t.cliente_estado||"—"}
                </span>
              </td>
              <td className="muted">{t.correo||"—"}</td>
              <td>{t.servicio||"—"}</td>
              <td>{t.cuotas||"—"}</td>
              <td>{t.dinero_recolectado||"—"}</td>
              <td>{t.metodo_pago||"—"}</td>
              <td>{v(t.vencimiento)}</td>
              <td>
                <span className={"pill "+(f[t.estado_pago]||"baja")}>
                  {t.estado_pago||"—"}
                </span>
              </td>
              <td style={{maxWidth:260}}>
                {t.notas?<span className="muted">{t.notas}</span>:<span className="muted">—</span>}
              </td>
              <td>
                <button className="edit-link"onClick={()=>i(t)}>
                  Editar
                </button>
                {" · "}
                <button className="edit-link"onClick={()=>u(t)}>
                  + Pago
                </button>
              </td>
            </tr>)}
        </tbody>
      </table>
      <div className="note-count">{r.length} de {a.length} registros</div>
    </>}
