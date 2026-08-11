"use client";const l={mensual:"Mensual",diario:"Diario",anual:"Anual",puntual:"Puntual",variable:"Variable"},s={mensual:"alta",diario:"mediaalta",anual:"media",puntual:"baja",variable:"cliente"};function c(a){return a?new Date(a+"T00:00:00").toLocaleDateString("es-ES",{day:"2-digit",month:"2-digit",year:"numeric"}):"—"}function d(a){return"€"+Number(a||0).toLocaleString("es-ES",{minimumFractionDigits:2,maximumFractionDigits:2})}export default function r({gastos:a,onEdit:e,onDelete:n}){const o=[...a].sort((t,i)=>t.concepto.localeCompare(i.concepto));return<table>
      <thead>
        <tr>
          <th>Concepto</th>
          <th>Tipo</th>
          <th>Monto</th>
          <th>Fecha</th>
          <th>Notas</th>
          <th/>
        </tr>
      </thead>
      <tbody>
        {o.map(t=><tr key={t.id}>
            <td className="name-cell">{t.concepto}</td>
            <td>
              <span className={"pill "+(s[t.tipo]||"baja")}>
                {l[t.tipo]||t.tipo}
              </span>
            </td>
            <td>{d(t.monto)}</td>
            <td>{c(t.fecha)}</td>
            <td style={{maxWidth:340}}>
              {t.notas?<span className="muted">{t.notas}</span>:<span className="muted">—</span>}
            </td>
            <td>
              <button className="edit-link"onClick={()=>e(t)}>
                Editar
              </button>
              {" · "}
              <button className="edit-link"onClick={()=>n(t)}>
                Eliminar
              </button>
            </td>
          </tr>)}
      </tbody>
    </table>}
