"use client";const n="https://docs.google.com/spreadsheets/d/1ntyyDkJ9Gx0rbXr2EGl9wJoZY42NuQBF/edit?gid=509999329",s=[{fecha:"10/06/2026",bienvenidas:14,respondidas:6,pct:"43%",mensaje:"N1",notas:""},{fecha:"14/06/2026",bienvenidas:52,respondidas:16,pct:"31%",mensaje:"N1",notas:""},{fecha:"15/06/2026",bienvenidas:9,respondidas:4,pct:"44%",mensaje:"N1",notas:""},{fecha:"16/06/2026",bienvenidas:2,respondidas:null,pct:"0%",mensaje:"N1",notas:""},{fecha:"17/06/2026",bienvenidas:7,respondidas:null,pct:"0%",mensaje:"N1",notas:""},{fecha:"18/06/2026",bienvenidas:4,respondidas:null,pct:"0%",mensaje:"N1",notas:""},{fecha:"24/06/2026",bienvenidas:43,respondidas:null,pct:"0%",mensaje:"N1",notas:""},{fecha:"25/06/2026",bienvenidas:7,respondidas:null,pct:"0%",mensaje:"N1",notas:""},{fecha:"26/06/2026",bienvenidas:9,respondidas:null,pct:"0%",mensaje:"N1",notas:""},{fecha:"29/06/2026",bienvenidas:46,respondidas:null,pct:"0%",mensaje:"N1",notas:""},{fecha:"30/06/2026",bienvenidas:21,respondidas:null,pct:"0%",mensaje:"N1",notas:""},{fecha:"01/07/2026",bienvenidas:18,respondidas:null,pct:"0%",mensaje:"N1",notas:""},{fecha:"02/07/2026",bienvenidas:17,respondidas:null,pct:"0%",mensaje:"N1",notas:""},{fecha:"03/07/2026",bienvenidas:12,respondidas:null,pct:"0%",mensaje:"N1",notas:""},{fecha:"06/07/2026",bienvenidas:26,respondidas:null,pct:"0%",mensaje:"N1",notas:""},{fecha:"07/07/2026",bienvenidas:5,respondidas:null,pct:"0%",mensaje:"N1",notas:""},{fecha:"08/07/2026",bienvenidas:8,respondidas:null,pct:"0%",mensaje:"N1",notas:""},{fecha:"09/07/2026",bienvenidas:12,respondidas:null,pct:"0%",mensaje:"N1",notas:""},{fecha:"10/07/2026",bienvenidas:5,respondidas:null,pct:"0%",mensaje:"N2",notas:""},{fecha:"13/07/2026",bienvenidas:25,respondidas:null,pct:"0%",mensaje:"N2",notas:""},{fecha:"14/07/2026",bienvenidas:8,respondidas:null,pct:"0%",mensaje:"N2",notas:""},{fecha:"15/07/2026",bienvenidas:2,respondidas:null,pct:"—",mensaje:"N3",notas:"Número 4"},{fecha:"16/07/2026",bienvenidas:6,respondidas:null,pct:"—",mensaje:"—",notas:"Número 4"},{fecha:"20/07/2026",bienvenidas:28,respondidas:null,pct:"—",mensaje:"—",notas:"Número 4"},{fecha:"21/07/2026",bienvenidas:10,respondidas:null,pct:"—",mensaje:"—",notas:"Número 4"},{fecha:"22/07/2026",bienvenidas:8,respondidas:null,pct:"0%",mensaje:"N1",notas:""},{fecha:"23/07/2026",bienvenidas:8,respondidas:null,pct:"0%",mensaje:"N1",notas:""},{fecha:"24/07/2026",bienvenidas:1,respondidas:null,pct:"0%",mensaje:"N1",notas:""},{fecha:"27/07/2026",bienvenidas:13,respondidas:null,pct:"—",mensaje:"—",notas:"Número 4"},{fecha:"29/07/2026",bienvenidas:13,respondidas:null,pct:"0%",mensaje:"N1",notas:""}],d=s.reduce((e,a)=>e+a.bienvenidas,0),t=s.reduce((e,a)=>e+(a.respondidas||0),0);export default function i(){return<>
      <div className="topbar"style={{marginBottom:12}}>
        <p className="subtitle"style={{margin:0}}>
          Setting Instagram — registro de bienvenidas y follow-ups (10 jun — 29 jul 2026).
        </p>
        <div className="topbar-actions">
          <a className="btn btn-secondary"href={n}target="_blank"rel="noreferrer">
            Abrir en Google Sheets
          </a>
        </div>
      </div>

      <div className="cards"style={{gridTemplateColumns:"repeat(2, 1fr)",maxWidth:460}}>
        <div className="card alta">
          <div className="label">Bienvenidas dadas (total)</div>
          <div className="value">{d}</div>
        </div>
        <div className="card mediaalta">
          <div className="label">Respondidas registradas</div>
          <div className="value">{t}</div>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Bienvenidas</th>
            <th>Respondidas "B"</th>
            <th>% B</th>
            <th>Mensaje (N1/N2/N3)</th>
            <th>Notas</th>
          </tr>
        </thead>
        <tbody>
          {s.map(e=>{var a;return<tr key={e.fecha}>
              <td className="name-cell">{e.fecha}</td>
              <td>{e.bienvenidas}</td>
              <td>{(a=e.respondidas)!=null?a:<span className="muted">—</span>}</td>
              <td>{e.pct}</td>
              <td>{e.mensaje}</td>
              <td className="muted">{e.notas||"—"}</td>
            </tr>})}
        </tbody>
      </table>
      <div className="note-count">
        Snapshot leído directamente de tu Google Sheet (no está sincronizado en vivo). Las columnas de
        Follow-up (FUP) están vacías en la hoja por ahora — en cuanto empieces a registrar respuestas de
        seguimiento, dime y las agrego a esta vista. "Número 4" son notas que dejaste en la celda de
        respondidas, no una cifra — las mantuve tal cual para que no se pierda la referencia.
      </div>
    </>}
