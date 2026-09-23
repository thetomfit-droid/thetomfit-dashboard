"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoMark from "./LogoMark";
import ThemeToggle from "./ThemeToggle";

const ITEMS = [
  { href: "/dashboard", label: "📊 Dashboard", enabled: true, matchPrefix: "/dashboard" },
  { href: "/ventas/videollamadas", label: "📋 Ventas", enabled: true, matchPrefix: "/ventas" },
  { href: "/setting", label: "⚙️ Setting", enabled: true, matchPrefix: "/setting" },
  { href: "/finanzas/clientes-totales", label: "💶 Finanzas", enabled: true, matchPrefix: "/finanzas" },
  { href: "/clientes/notas", label: "👥 Clientes", enabled: true, matchPrefix: "/clientes" },
  { href: "/tareas", label: "✅ Mis tareas", enabled: true, matchPrefix: "/tareas" },
  { href: "/enlaces", label: "🔗 Enlaces de interés", enabled: true },
  { href: "/onboarding/admin", label: "🎯 Onboarding", enabled: true, matchPrefix: "/onboarding" },
  { href: null, label: "🗂️ Manuales", enabled: false },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="sidebar">
      <div className="logo-block">
        <LogoMark size={34} variant="white" />
        <div className="logo">THETOMFIT</div>
      </div>
      <div className="logo-sub">Panel de control</div>
      <div className="pride-bar" />
      <nav>
        {ITEMS.map((item) => {
          const activo = pathname === item.href || (item.matchPrefix && pathname.startsWith(item.matchPrefix));
          return item.enabled ? (
            <Link key={item.label} href={item.href} className={"item" + (activo ? " active" : "")}>
              {item.label}
            </Link>
          ) : (
            <div key={item.label} className="item disabled">
              {item.label} <span className="badge-soon">pronto</span>
            </div>
          );
        })}
      </nav>
      <div className="sidebar-footer">
        <ThemeToggle />
      </div>
    </aside>
  );
}
