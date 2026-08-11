"use client";import A from"next/link";import{usePathname as I}from"next/navigation";const L=[{href:"/ventas/videollamadas",label:"Datos de videollamadas"},{href:"/ventas/instagram",label:"Setting Instagram"},{href:"/ventas/kpis-ads",label:"KPI's Ads"},{href:"/ventas/recontactar",label:"Recontactar"},{href:"/ventas/calendly",label:"Calendly"}];export default function N(){const e=I();return<div className="ventas-tabs">
      {L.map(a=><A key={a.href}href={a.href}className={"ventas-tab"+(e===a.href?" active":"")}>
          {a.label}
        </A>)}
    </div>}
