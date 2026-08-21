"use client";
import { supabase } from "../../lib/supabaseClient";
import AuthGate from "../AuthGate";
import Sidebar from "../Sidebar";
import ClientesTabs from "../ClientesTabs";

export default function ClientesLayout({ children }) {
  return (
    <AuthGate>
      <div className="shell">
        <Sidebar />
        <main className="main">
          <div className="topbar">
            <div>
              <h1>Clientes</h1>
              <p className="subtitle">Notas de lo que te piden tus asesorades, y sus cumpleaños.</p>
            </div>
            <div className="topbar-actions">
              <button className="btn btn-secondary" onClick={() => supabase.auth.signOut()}>
                Cerrar sesión
              </button>
            </div>
          </div>
          <ClientesTabs />
          {children}
        </main>
      </div>
    </AuthGate>
  );
}
