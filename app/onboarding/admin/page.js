"use client";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "../../../lib/supabaseClient";
import AuthGate from "../../AuthGate";
import Sidebar from "../../Sidebar";
import OnboardingAdminList from "../../OnboardingAdminList";
import OnboardingStepForm from "../../OnboardingStepForm";

function OnboardingAdminInner() {
  const [pasos, setPasos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    const { data, error } = await supabase
      .from("onboarding_pasos")
      .select("*")
      .order("orden", { ascending: true });
    setLoading(false);
    if (error) {
      setError("No se pudieron cargar los pasos: " + error.message);
      return;
    }
    setPasos(data || []);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleDelete(paso) {
    if (!confirm(`¿Eliminar el paso "${paso.titulo}"?`)) return;
    const { error } = await supabase.from("onboarding_pasos").delete().eq("id", paso.id);
    if (error) {
      alert("No se pudo eliminar: " + error.message);
      return;
    }
    load();
  }

  return (
    <main className="main">
      <div className="topbar">
        <div>
          <h1>Onboarding</h1>
          <p className="subtitle">Los pasos de bienvenida que ven tus clientes nuevos.</p>
        </div>
        <div className="topbar-actions">
          <button className="btn btn-primary" onClick={() => setEditing({})}>
            + Agregar paso
          </button>
          <a className="btn btn-secondary" href="/onboarding" target="_blank" rel="noreferrer">
            Abrir página pública
          </a>
          <button className="btn btn-secondary" onClick={() => supabase.auth.signOut()}>
            Cerrar sesión
          </button>
        </div>
      </div>

      {error && (
        <div className="login-error" style={{ marginBottom: 12 }}>
          {error}
        </div>
      )}
      {loading ? (
        <div>Cargando pasos...</div>
      ) : (
        <OnboardingAdminList pasos={pasos} onEdit={(p) => setEditing(p)} onDelete={handleDelete} />
      )}

      {editing !== null && (
        <OnboardingStepForm
          initial={editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            load();
          }}
        />
      )}

      <div style={{ marginTop: 40 }}>
        <div className="label" style={{ marginBottom: 10 }}>
          Vista previa en vivo de la página pública
        </div>
        <div style={{ border: "1px solid #ecdfe8", borderRadius: 12, overflow: "hidden", background: "#fff" }}>
          <iframe
            src="/onboarding"
            title="Vista previa de Onboarding"
            style={{ width: "100%", height: 900, border: "none", display: "block" }}
          />
        </div>
      </div>
    </main>
  );
}

export default function OnboardingAdminPage() {
  return (
    <AuthGate>
      <div className="shell">
        <Sidebar />
        <OnboardingAdminInner />
      </div>
    </AuthGate>
  );
}
