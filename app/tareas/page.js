"use client";import{useEffect as E,useState as i,useCallback as h,useMemo as C}from"react";import{supabase as u}from"../../lib/supabaseClient";import P,{displayEstado as p}from"../TareasTable";import _ from"../TareaForm";export default function V(){const[s,f]=i([]),[N,o]=i(!1),[c,t]=i(null),[m,v]=i(""),[n,b]=i("Todas");const r=h(async()=>{o(!0),v("");const{data:a,error:e}=await u.from("tareas").select("*").order("fecha_limite",{ascending:!0});if(o(!1),e){v("No se pudieron cargar las tareas: "+e.message);return}f(a||[])},[]);E(()=>{r()},[r]);async function g(a){if(!confirm(`¿Eliminar la tarea "${a.titulo}"?`))return;const{error:e}=await u.from("tareas").delete().eq("id",a.id);if(e){alert("No se pudo eliminar: "+e.message);return}r()}const l=C(()=>s.map(a=>({...a,_display:p(a)})),[s]),d={Pendiente:l.filter(a=>a._display==="Pendiente").length,"En proceso":l.filter(a=>a._display==="En proceso").length,Vencida:l.filter(a=>a._display==="Vencida").length,Terminada:l.filter(a=>a._display==="Terminada").length,Siempre:l.filter(a=>a._display==="Siempre").length},y=n==="Todas"?s:s.filter(a=>p(a)===n),T=["Todas","Pendiente","En proceso","Vencida","Terminada","Siempre"];return<>
      <div className="topbar"style={{marginBottom:4}}>
        <div/>
        <div className="topbar-actions">
          <button className="btn btn-primary"onClick={()=>t({})}>
            + Agregar tarea
          </button>
        </div>
      </div>

      <div className="cards"style={{gridTemplateColumns:"repeat(5, 1fr)",maxWidth:760}}>
        <div className="card media">
          <div className="label">Pendientes</div>
          <div className="value">{d.Pendiente}</div>
        </div>
        <div className="card mediaalta">
          <div className="label">En proceso</div>
          <div className="value">{d["En proceso"]}</div>
        </div>
        <div className="card baja2">
          <div className="label">Vencidas</div>
          <div className="value">{d.Vencida}</div>
        </div>
        <div className="card alta">
          <div className="label">Terminadas</div>
          <div className="value">{d.Terminada}</div>
        </div>
        <div className="card cliente">
          <div className="label">Siempre</div>
          <div className="value">{d.Siempre}</div>
        </div>
      </div>

      <div className="toolbar">
        {T.map(a=><button key={a}className={"filter-btn"+(n===a?" active":"")}onClick={()=>b(a)}>
            {a}
          </button>)}
      </div>

      {m&&<div className="login-error"style={{marginBottom:12}}>{m}</div>}
      {N?<div>Cargando tareas...</div>:<P tareas={y}onEdit={a=>t(a)}onDelete={g}/>}

      {c!==null&&<_ initial={c}onClose={()=>t(null)}onSaved={()=>{t(null),r()}}/>}
    </>}
