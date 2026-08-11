"use client";const c={Pendiente:"media","En proceso":"mediaalta",Terminada:"alta",Vencida:"baja2",Siempre:"cliente"};function r(e){return e?new Date(e+"T00:00:00").toLocaleDateString("es-ES",{day:"2-digit",month:"2-digit",year:"numeric"}):"—"}function hoyLocal(){const e=new Date(),t=String(e.getMonth()+1).padStart(2,"0"),o=String(e.getDate()).padStart(2,"0");return`${e.getFullYear()}-${t}-${o}`}export function displayEstado(e){if(e.estado==="Siempre")return"Siempre";if(e.estado==="Terminada")return"Terminada";const a=hoyLocal();return e.fecha_limite&&e.fecha_limite<a?"Vencida":e.estado}export default function l({tareas:e,onEdit:a,onDelete:i}){const d=[...e].sort((t,n)=>{const s=t.fecha_limite||"9999-99-99",o=n.fecha_limite||"9999-99-99";return s.localeCompare(o)});return<table>
      <thead>
        <tr>
          <th>Título</th>
          <th>Descripción</th>
          <th>Fecha límite</th>
          <th>Estado</th>
          <th/>
        </tr>
      </thead>
      <tbody>
        {d.map(t=>{const n=displayEstado(t);return<tr key={t.id}>
              <td className="name-cell">{t.titulo}</td>
              <td style={{maxWidth:340}}>
                {t.descripcion?<span className="muted">{t.descripcion}</span>:<span className="muted">—</span>}
              </td>
              <td>{r(t.fecha_limite)}</td>
              <td>
                <span className={"pill "+(c[n]||"baja")}>{n}</span>
              </td>
              <td>
                <button className="edit-link"onClick={()=>a(t)}>
                  Editar
                </button>
                {" · "}
                <button className="edit-link"onClick={()=>i(t)}>
                  Eliminar
                </button>
              </td>
            </tr>})}
      </tbody>
    </table>}
