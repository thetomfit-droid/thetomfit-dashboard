"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/ventas/videollamadas", label: "Datos de videollamadas" },
  { href: "/ventas/recontactar", label: "Recontactar" },
  { href: "/ventas/calendly", label: "Calendly" },
];

export default function VentasTabs() {
  const pathname = usePathname();
  return (
    <div className="ventas-tabs">
      {TABS.map((tab) => (
        <Link key={tab.href} href={tab.href} className={"ventas-tab" + (pathname === tab.href ? " active" : "")}>
          {tab.label}
        </Link>
      ))}
    </div>
  );
}
