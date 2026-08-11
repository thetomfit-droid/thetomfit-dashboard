"use client";import{useMemo as u,useState as p}from"react";function l(e){return e?new Date(e+"T00:00:00").toLocaleDateString("es-ES",{day:"2-digit",month:"2-digit",year:"numeric"}):"—"}export default function b({clientes:e,onEdit:s,onDelete:r}){const[o,d]=p("");const i=u(()=>{let t=[...e];if(o.trim()){const n=o.trim().toLowerCase();t=t.filter(a=>[a.nombre,a.notas,a.fase_objetivos].filter(Boolean).some(m=>m.toLowerCase().includes(n)))}return t.sort((n,a)=>n.nombre.localeCompare(a.nombre)),t},[e,o]);return<>
      <div className="toolbar">
        <input type="text"placeholder="Buscar por nombre o nota..."value={o}onChange={t=>d(t.target.value)}/>
      </div>

      <table>
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Fase y objetivos</th>
            <th>Notas pendientes</th>
            <th>Plazo</th>
            <th/>
          </tr>
        </thead>
        <tbody>
          {i.map(t=><tr key={t.id}>
              <td className="name-cell">{t.nombre}</td>
              <td>{t.fase_objetivos||<span className="muted">—</span>}</td>
              <td style={{maxWidth:420}}>
                {t.notas?t.notas:<span className="muted">Sin notas pendientes</span>}
              </td>
              <td>
                {t.plazo_inicio||t.plazo_fin?`${l(t.plazo_inicio)} → ${l(t.plazo_fin)}`:<span className="muted">—</span>}
              </td>
              <td><button className="edit-link"onClick={()=>s(t)}>Editar</button>{" · "}<button className="edit-link"onClick={()=>r(t)}>Eliminar</button></td>
            </tr>)}
        </tbody>
      </table>
      <div className="note-count">{i.length} de {e.length} clientes</div>
    </>}
