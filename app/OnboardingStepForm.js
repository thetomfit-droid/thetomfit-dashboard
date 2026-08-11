"use client";
import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

const EMPTY = { orden: "", titulo: "", resumen: "", video_url: "", boton_texto: "" };

export default function OnboardingStepForm({ initial, onClose, onSaved }) {
  const isEdit = !!(initial && initial.id);
  const [form, setForm] = useState(() => ({ ...EMPTY, ...(initial || {}) }));
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setErr("");
    const payload = { ...form };
    delete payload.id;
    delete payload.created_at;
    payload.orden = parseInt(payload.orden, 10) || 0;
    payload.video_url = payload.video_url || null;
    payload.boton_texto = payload.boton_texto || null;

    const req = isEdit
      ? supabase.from("onboarding_pasos").update(payload).eq("id", initial.id)
      : supabase.from("onboarding_pasos").insert(payload);

    const { error } = await req;
    setSaving(false);
    if (error) {
      setErr("No se pudo guardar: " + error.message);
      return;
    }
    onSaved();
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h2>{isEdit ? "Editar paso" : "Agregar paso"}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <label>
              Orden
              <input type="number" value={form.orden} onChange={(e) => set("orden", e.target.value)} required />
            </label>
            <label className="full">
              Título
              <input value={form.titulo} onChange={(e) => set("titulo", e.target.value)} required />
            </label>
            <label className="full">
              Resumen
              <textarea value={form.resumen || ""} onChange={(e) => set("resumen", e.target.value)} />
            </label>
            <label>
              Enlace (opcional)
              <input
                value={form.video_url || ""}
                onChange={(e) => set("video_url", e.target.value)}
                placeholder="https://..."
              />
            </label>
            <label>
              Texto del botón (opcional)
              <input
                value={form.boton_texto || ""}
                onChange={(e) => set("boton_texto", e.target.value)}
                placeholder="Abrir WhatsApp"
              />
            </label>
          </div>

          {err && <div className="login-error">{err}</div>}

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
