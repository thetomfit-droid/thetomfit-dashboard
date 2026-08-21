"use client";
import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

const ESTADOS = ["Seguimiento", "Reserva", "Reagendar", "No cliente", "No show", "Cliente"];
const PRIORIDADES = ["Alta", "Media-Alta", "Media", "Baja", "Cliente activo"];
const SI_NO = ["Sí", "No"];
const IN_OUT = ["In", "Out"];

const VACIO = {
  nombre: "",
  telefono: "",
  instagram: "",
  correo: "",
  pais: "",
  fecha_contacto: "",
  fecha_llamada: "",
  videocall: "",
  estado: "Seguimiento",
  venta: "No",
  inbound_outbound: "",
  de_donde_viene: "",
  que_logro_contacto: "",
  objeciones: "",
  observaciones: "",
  plan_acordado: "",
  volver_a_contactar: "",
  prioridad: "Media",
  fathom_url: "",
};

export default function LeadForm({ initial, onClose, onSaved }) {
  const esEdicion = !!(initial && initial.id);
  const [form, setForm] = useState(() => ({ ...VACIO, ...(initial || {}) }));
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  function set(campo, valor) {
    setForm((f) => ({ ...f, [campo]: valor }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setGuardando(true);
    setError("");

    const payload = { ...form };
    delete payload.id;
    delete payload.created_at;
    ["fecha_contacto", "fecha_llamada", "volver_a_contactar"].forEach((campo) => {
      if (!payload[campo]) payload[campo] = null;
    });

    const query = esEdicion
      ? supabase.from("leads").update(payload).eq("id", initial.id)
      : supabase.from("leads").insert(payload);

    const { error: err } = await query;
    setGuardando(false);
    if (err) {
      setError("No se pudo guardar: " + err.message);
      return;
    }
    onSaved();
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h2>{esEdicion ? "Editar lead" : "Agregar lead"}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <label className="full">
              Nombre
              <input value={form.nombre} onChange={(e) => set("nombre", e.target.value)} required />
            </label>
            <label>
              Teléfono
              <input value={form.telefono || ""} onChange={(e) => set("telefono", e.target.value)} />
            </label>
            <label>
              Instagram
              <input value={form.instagram || ""} onChange={(e) => set("instagram", e.target.value)} />
            </label>
            <label>
              Correo
              <input type="email" value={form.correo || ""} onChange={(e) => set("correo", e.target.value)} />
            </label>
            <label>
              País
              <input value={form.pais || ""} onChange={(e) => set("pais", e.target.value)} />
            </label>
            <label>
              Fecha de contacto
              <input type="date" value={form.fecha_contacto || ""} onChange={(e) => set("fecha_contacto", e.target.value)} />
            </label>
            <label>
              Fecha de llamada
              <input type="date" value={form.fecha_llamada || ""} onChange={(e) => set("fecha_llamada", e.target.value)} />
            </label>
            <label>
              ¿Videocall?
              <select value={form.videocall || ""} onChange={(e) => set("videocall", e.target.value)}>
                <option value="">—</option>
                {SI_NO.map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </label>
            <label>
              Estado
              <select value={form.estado || ""} onChange={(e) => set("estado", e.target.value)}>
                {ESTADOS.map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </label>
            <label>
              ¿Venta?
              <select value={form.venta || ""} onChange={(e) => set("venta", e.target.value)}>
                {SI_NO.map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </label>
            <label>
              Inbound / Outbound
              <select value={form.inbound_outbound || ""} onChange={(e) => set("inbound_outbound", e.target.value)}>
                <option value="">—</option>
                {IN_OUT.map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </label>
            <label>
              ¿De dónde viene?
              <input
                value={form.de_donde_viene || ""}
                onChange={(e) => set("de_donde_viene", e.target.value)}
                placeholder="Instagram, TikTok, WhatsApp..."
              />
            </label>
            <label>
              Prioridad
              <select value={form.prioridad || ""} onChange={(e) => set("prioridad", e.target.value)}>
                {PRIORIDADES.map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </label>
            <label>
              Volver a contactar
              <input type="date" value={form.volver_a_contactar || ""} onChange={(e) => set("volver_a_contactar", e.target.value)} />
            </label>
            <label>
              Plan / precio acordado
              <input value={form.plan_acordado || ""} onChange={(e) => set("plan_acordado", e.target.value)} />
            </label>
            <label className="full">
              ¿Qué logró el contacto?
              <input
                value={form.que_logro_contacto || ""}
                onChange={(e) => set("que_logro_contacto", e.target.value)}
                placeholder="Anuncio Instagram, AutoSetter, Bienvenida..."
              />
            </label>
            <label className="full">
              Objeción principal
              <textarea value={form.objeciones || ""} onChange={(e) => set("objeciones", e.target.value)} />
            </label>
            <label className="full">
              Observaciones
              <textarea value={form.observaciones || ""} onChange={(e) => set("observaciones", e.target.value)} />
            </label>
            <label className="full">
              Enlace de grabación (Fathom)
              <input value={form.fathom_url || ""} onChange={(e) => set("fathom_url", e.target.value)} />
            </label>
          </div>

          {error && <div className="login-error">{error}</div>}

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={guardando}>
              {guardando ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
