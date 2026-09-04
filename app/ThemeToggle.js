"use client";
import { useEffect, useState } from "react";

const STORAGE_KEY = "thetomfit-theme";

export default function ThemeToggle() {
  const [oscuro, setOscuro] = useState(false);

  useEffect(() => {
    const actual = document.documentElement.getAttribute("data-theme");
    setOscuro(actual === "dark");
  }, []);

  function toggle() {
    const nuevo = !oscuro;
    setOscuro(nuevo);
    if (nuevo) {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem(STORAGE_KEY, "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
      localStorage.setItem(STORAGE_KEY, "light");
    }
  }

  return (
    <button type="button" className="theme-toggle" onClick={toggle}>
      {oscuro ? "☀️ Modo claro" : "🌙 Modo noche"}
    </button>
  );
}
