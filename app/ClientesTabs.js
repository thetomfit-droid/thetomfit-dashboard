"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/clientes/notas", label: "Notas de asesorades" },
  { href: "/clientes/cumpleanos", label: "Cumpleaños de asesorades" },
];

export default function ClientesTabs() {
  const pathname = usePathname();
  return (
    <div className="ventas-tabs">
      {TABS.map((t) => (
        <Link key={t.href} href={t.href} className={"ventas-tab" + (pathname === t.href ? " active" : "")}>
          {t.label}
        </Link>
      ))}
    </div>
  );
}
