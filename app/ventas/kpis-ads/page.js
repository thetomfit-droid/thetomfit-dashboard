"use client";const s="https://docs.google.com/spreadsheets/d/1xLXUyTiwUp1r2i-4KJT_mDhelHZzx4fb1vtCVgdLG28/edit?gid=1134018679",o=["29-5","6-12","13-19","20-26","27-31"],r=[{m:"Bienvenidas dadas",v:[114,56,41,55,0],t:"266"},{m:"Conversaciones iniciadas",v:[0,0,0,14,0],t:"14"},{m:"Agendas",v:[5,8,2,2,0],t:"17"},{m:"Llamadas realizadas",v:[3,8,0,0,0],t:"11"},{m:"Canceladas",v:[2,0,0,1,0],t:"3"},{m:"No show",v:[0,0,0,0,0],t:"0"},{m:"Nº ventas",v:["-","-","-","-","-"],t:"-"},{m:"Facturado total (€)",v:["€0,00","€0,00","€0,00","€0,00","€0,00"],t:"€0,00"},{m:"Cash cobrado (€)",v:["€0,00","€0,00","€0,00","€0,00","€0,00"],t:"€0,00"},{m:"Pendiente por cobrar (€)",v:["€0,00","€0,00","€0,00","€0,00","€0,00"],t:"€0,00"},{m:"Inversión ads (€)",v:["€35,00","€35,00","€35,00","€35,00","€0,00"],t:"€140,00"},{m:"Coste por conversación (€)",v:["€0,00","€0,00","€0,00","€2,50","€0,00"],t:"€10,00"},{m:"Coste por agenda (€)",v:["€7,00","€4,38","€17,50","€17,50","€0,00"],t:"€8,24"},{m:"Coste por llamada realizada (€)",v:["€11,67","€4,38","€0,00","€0,00","€0,00"],t:"€12,73"},{m:"Coste por venta (€)",v:["€0,00","€0,00","€0,00","€0,00","€0,00"],t:"€0,00"},{m:"ROAS facturado",v:["0,00x","0,00x","0,00x","0,00x","0,00x"],t:"0,00x"},{m:"ROAS cash",v:["0,00x","0,00x","0,00x","0,00x","0,00x"],t:"0,00x"},{m:"Tasa conversación (%)",v:["0,0%","0,0%","0,0%","25,5%","0,0%"],t:"5,3%"},{m:"Tasa agenda (%)",v:["0,0%","0,0%","0,0%","14,3%","0,0%"],t:"121,4%"},{m:"Show rate (%)",v:["100,0%","100,0%","0,0%","0,0%","0,0%"],t:"78,6%"},{m:"Tasa cierre (%)",v:["0,0%","0,0%","0,0%","0,0%","0,0%"],t:"0,0%"}];export default function d(){return<>
      <div className="topbar"style={{marginBottom:12}}>
        <p className="subtitle"style={{margin:0}}>Resumen Ads — foto de tu Google Sheet.</p>
        <div className="topbar-actions">
          <a className="btn btn-secondary"href={s}target="_blank"rel="noreferrer">
            Abrir en Google Sheets
          </a>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Métrica</th>
            {o.map((t,a)=><th key={t}>Semana {a+1} ({t})</th>)}
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {r.map(t=><tr key={t.m}>
              <td className="name-cell">{t.m}</td>
              {t.v.map((a,e)=><td key={e}>{a}</td>)}
              <td style={{fontWeight:700}}>{t.t}</td>
            </tr>)}
        </tbody>
      </table>
    </>}
