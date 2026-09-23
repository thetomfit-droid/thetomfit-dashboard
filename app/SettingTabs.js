"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/ventas/setting", label: "Setting" },
  { href: "/ventas/setting/ads", label: "Ads" },
];

export default function SettingTabs() {
  const pathname = usePathname();
  return (
    <div className="ventas-tabs" style={{ marginTop: -10 }}>
      {TABS.map((tab) => (
        <Link key={tab.href} href={tab.href} className={"ventas-tab" + (pathname === tab.href ? " active" : "")}>
          {tab.label}
        </Link>
      ))}
    </div>
  );
}
