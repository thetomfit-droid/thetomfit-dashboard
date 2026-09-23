"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/setting", label: "Setting" },
  { href: "/setting/ads", label: "Ads" },
];

export default function SettingTabs() {
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
