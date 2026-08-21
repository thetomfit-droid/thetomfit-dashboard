"use client";import P from"next/link";import{usePathname as g}from"next/navigation";import N from"./LogoMark";const k=[{href:"/dashboard",label:"📊 Dashboard",enabled:!0,matchPrefix:"/dashboard"},{href:"/ventas/videollamadas",label:"📋 Ventas",enabled:!0,matchPrefix:"/ventas"},{href:"/finanzas/clientes-totales",label:"💶 Finanzas",enabled:!0,matchPrefix:"/finanzas"},{href:"/clientes/notas",label:"👥 Clientes",enabled:!0,matchPrefix:"/clientes"},{href:"/tareas",label:"✅ Mis tareas",enabled:!0,matchPrefix:"/tareas"},{href:"/enlaces",label:"🔗 Enlaces de interés",enabled:!0},{href:"/onboarding/admin",label:"🎯 Onboarding",enabled:!0,matchPrefix:"/onboarding"},{href:null,label:"🗂️ Manuales",enabled:!1}];export default function M(){const a=g();return<aside className="sidebar">
      <div className="logo-block">
        <N size={34}variant="white"/>
        <div className="logo">THETOMFIT</div>
      </div>
      <div className="logo-sub">Panel de control</div>
      <div className="pride-bar"/>
      <nav>
        {k.map(e=>{const l=a===e.href||e.matchPrefix&&a.startsWith(e.matchPrefix);return e.enabled?<P key={e.label}href={e.href}className={"item"+(l?" active":"")}>
              {e.label}
            </P>:<div key={e.label}className="item disabled">
              {e.label} <span className="badge-soon">pronto</span>
            </div>})}
      </nav>
    </aside>}
