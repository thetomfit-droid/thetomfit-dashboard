"use client";import{useMemo as v,useState as l}from"react";const f={Alta:"alta","Media-Alta":"mediaalta",Media:"media",Baja:"baja","Cliente activo":"cliente"},m={Alta:0,"Media-Alta":1,Media:2,Baja:3,"Cliente activo":4};function h(e){return e?new Date(e+"T00:00:00").toLocaleDateString("es-ES",{day:"2-digit",month:"2-digit",year:"numeric"}):"—"}export default function N({leads:e,onEdit:s}){const[o,u]=l(""),[r,b]=l("Todas"),n=v(()=>{let t=[...e];if(r!=="Todas"&&(t=t.filter(i=>i.prioridad===r)),o.trim()){const i=o.trim().toLowerCase();t=t.filter(a=>[a.nombre,a.instagram,a.pais,a.objeciones,a.observaciones].filter(Boolean).some(d=>d.toLowerCase().includes(i)))}return t.sort((i,a)=>{var d,c;return((d=m[i.prioridad])!=null?d:9)-((c=m[a.prioridad])!=null?c:9)}),t},[e,o,r]),p=["Todas","Alta","Media-Alta","Media","Baja","Cliente activo"];return<>
      <div className="toolbar">
        <input type="text"placeholder="Buscar por nombre, Instagram, país, objeción..."value={o}onChange={t=>u(t.target.value)}/>
        {p.map(t=><button key={t}className={"filter-btn"+(r===t?" active":"")}onClick={()=>b(t)}>
            {t}
          </button>)}
      </div>

      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Contacto</th>
            <th>País</th>
            <th>Fecha llamada</th>
            <th>Estado</th>
            <th>Objeción / Notas</th>
            <th>Plan</th>
            <th>Volver a contactar</th>
            <th>Prioridad</th>
            <th/>
          </tr>
        </thead>
        <tbody>
          {n.map(t=><tr key={t.id}>
              <td className="name-cell">{t.nombre}</td>
              <td>
                <div>{t.telefono||<span className="muted">—</span>}</div>
                <div className="muted">{t.instagram||"—"}</div>
                {t.fathom_url&&<a className="fathom-link"href={t.fathom_url}target="_blank"rel="noreferrer">
                    Ver grabación
                  </a>}
              </td>
              <td>{t.pais||"—"}</td>
              <td>{h(t.fecha_llamada)}</td>
              <td>{t.estado||"—"}</td>
              <td style={{maxWidth:320}}>
                {t.objeciones&&<div>{t.objeciones}</div>}
                {t.observaciones&&<div className="muted">{t.observaciones}</div>}
                {!t.objeciones&&!t.observaciones&&<span className="muted">—</span>}
              </td>
              <td>{t.plan_acordado||<span className="muted">—</span>}</td>
              <td>{h(t.volver_a_contactar)}</td>
              <td>
                <span className={"pill "+(f[t.prioridad]||"baja")}>
                  {t.prioridad}
                </span>
              </td>
              <td>
                <button className="edit-link"onClick={()=>s(t)}>
                  Editar
                </button>
              </td>
            </tr>)}
        </tbody>
      </table>
      <div className="note-count">{n.length} de {e.length} leads</div>
    </>}
