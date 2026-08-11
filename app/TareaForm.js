"use client";
import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

const ESTADOS = ["Pendiente", "En proceso", "Terminada"];

const DIAS_SEMANA = [
  { value: 1, label: "Lunes" },
  { value: 2, label: "Martes" },
  { value: 3, label: "Miércoles" },
  { value: 4, label: "Jueves" },
  { value: 5, label: "Viernes" },
  { value: 6, label: "Sábado" },
  { value: 7, label: "Domingo" },
];

const REPETICIONES = [
  { value: "ninguna", label: "No se repite" },
  { value: "diaria", label: "Todos los días" },
  { value: "semanal", label: "Cada semana (elige el día)" },
];

const DEFAULTS = {
  titulo: "",
  descripcion: "",
  estado: "Pendiente",
  fecha_limite: "",
  hora: "",
  repeticion: "ninguna",
  dia_semana: "",
};

export default function TareaForm({ initial, onClose, onSaved }) {
  const isEdit = !!(initial && initial.id);
  const [form, setForm] = useState(() => ({ ...DEFAULTS, ...(initial || {}) }));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = { ...form };
    delete payload.id;
    delete payload.created_at;
    payload.fecha_limite = payload.fecha_limite || null;
    payload.hora = payload.hora || null;
    payload.dia_semana = payload.repeticion === "semanal" && payload.dia_semana ? Number(payload.dia_semana) : null;

    const op = isEdit
      ? supabase.from("tareas").update(payload).eq("id", initial.id)
      : supabase.from("tareas").insert(payload);

    const { error: err } = await op;
    setSaving(false);
    if (err) {
      setError("No se pudo guardar: " + err.message);
      return;
    }
    onSaved();
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h2>{isEdit ? "Editar tarea" : "Agregar tarea"}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <label className="full">
              Título
              <input value={form.titulo} onChange={(e) => set("titulo", e.target.value)} required autoFocus />
            </label>

            <label>
              Estado
              <select value={form.estado || ""} onChange={(e) => set("estado", e.target.value)}>
                {ESTADOS.map((e) => (
                  <option key={e} value={e}>{e}</option>
                ))}
              </select>
            </label>

            <label>
              Fecha límite (opcional)
              <input type="date" value={form.fecha_limite || ""} onChange={(e) => set("fecha_limite", e.target.value)} />
            </label>

            <label>
              Hora (opcional)
              <input type="time" value={form.hora || ""} onChange={(e) => set("hora", e.target.value)} />
            </label>

            <label>
              Repetición
              <select value={form.repeticion || "ninguna"} onChange={(e) => set("repeticion", e.target.value)}>
                {REPETICIONES.map((r) => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </label>

            {form.repeticion === "semanal" && (
              <label>
                Día de la semana
                <select value={form.dia_semana || ""} onChange={(e) => set("dia_semana", e.target.value)} required>
                  <option value="" disabled>Elige un día</option>
                  {DIAS_SEMANA.map((d) => (
                    <option key={d.value} value={d.value}>{d.label}</option>
                  ))}
                </select>
              </label>
            )}

            <label className="full">
              Descripción
              <textarea value={form.descripcion || ""} onChange={(e) => set("descripcion", e.target.value)} />
            </label>
          </div>

          {(form.repeticion === "diaria" || form.repeticion === "semanal") && (
            <p className="muted" style={{ fontSize: 12, marginTop: -6, marginBottom: 10 }}>
              Esta tarea se agregará sola al calendario los días que correspondan (próximos 21 días, se va renovando). Cada aparición se marca "Hecho" por separado, sin afectar el estado general de la tarea.
            </p>
          )}

          {error && <div className="login-error">{error}</div>}

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
