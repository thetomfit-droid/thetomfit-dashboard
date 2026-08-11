"use client";const k=["Lunes","Martes","Miércoles","Jueves","Viernes","Sábado","Domingo"];function s(o){return o?o.slice(0,5):""}function b(){return new Date().toISOString().slice(0,10)}export default function g({dias:o,eventosPorDia:e,onToggleDone:c,onEdit:l,onDelete:r,onAdd:d}){const m=b();return<div className="cal-week">
      {o.map((n,u)=>{const i=(e[n]||[]).slice().sort((a,t)=>{const y=a.hora_inicio||"99:99",h=t.hora_inicio||"99:99";return y.localeCompare(h)}),p=n===m,N=new Date(n+"T00:00:00");return<div className={"cal-day"+(p?" today":"")}key={n}>
            <div className="cal-day-header">
              <span>{k[u]}</span>
              <span className="num">{N.getDate()}</span>
            </div>

            {i.length===0&&<div className="muted"style={{fontSize:11}}>Sin eventos</div>}

            {i.map(a=><div key={a.id}className={"cal-item cal-item-"+(a.tipo||"personalizado")+(a.completado?" done":"")}onClick={()=>l(a)}>
                {(a.hora_inicio||a.hora_fin)&&<span className="cal-time">
                    {s(a.hora_inicio)}
                    {a.hora_fin?" – "+s(a.hora_fin):""}
                  </span>}
                <span className="cal-title">{a.titulo}</span>
                <div className="cal-item-actions">
                  <button className="edit-link"onClick={t=>{t.stopPropagation(),c(a)}}>
                    {a.completado?"Deshacer":"Hecho"}
                  </button>
                  <button className="edit-link"onClick={t=>{t.stopPropagation(),r(a)}}>
                    Eliminar
                  </button>
                </div>
              </div>)}

            <button className="cal-add-day"onClick={()=>d(n)}>
              + Agregar
            </button>
          </div>})}
    </div>}
