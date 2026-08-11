"use client";import L from"next/link";import{usePathname as T}from"next/navigation";const N=[{href:"/tareas",label:"Lista de tareas"},{href:"/tareas/calendario",label:"Calendario"}];export default function x(){const e=T();return<div className="ventas-tabs">
      {N.map(a=><L key={a.href}href={a.href}className={"ventas-tab"+(e===a.href?" active":"")}>
          {a.label}
        </L>)}
    </div>}
