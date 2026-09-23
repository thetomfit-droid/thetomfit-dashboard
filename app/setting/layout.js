"use client";
import { supabase } from "../../lib/supabaseClient";
import AuthGate from "../AuthGate";
import Sidebar from "../Sidebar";
import SettingTabs from "../SettingTabs";

export default function SettingLayout({ children }) {
  return (
    <AuthGate>
      <div className="shell">
        <Sidebar />
        <main className="main">
          <div className="topbar">
            <div>
              <h1>Setting</h1>
              <p className="subtitle">Bienvenidas, mensajes y rendimiento de ads.</p>
            </div>
            <div className="topbar-actions">
              <button className="btn btn-secondary" onClick={() => supabase.auth.signOut()}>
                Cerrar sesión
              </button>
            </div>
          </div>
          <SettingTabs />
          {children}
        </main>
      </div>
    </AuthGate>
  );
}
