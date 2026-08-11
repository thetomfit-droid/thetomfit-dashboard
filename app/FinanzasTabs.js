"use client";import L from"next/link";import{usePathname as N}from"next/navigation";const T=[{href:"/finanzas/clientes-totales",label:"Clientes totales"},{href:"/finanzas/gastos",label:"Gastos de empresa"},{href:"/finanzas/resumen",label:"Resumen"}];export default function g(){const a=N();return<div className="ventas-tabs">
      {T.map(e=><L key={e.href}href={e.href}className={"ventas-tab"+(a===e.href?" active":"")}>
          {e.label}
        </L>)}
    </div>}
