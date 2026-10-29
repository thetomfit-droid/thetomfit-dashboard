"use client";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const VAPID_PUBLIC = "BNim1rYjcWJss45dZEyIIG-pfhMZJmrpY3H3fWBA5yEMYfdjfOHJQ77IopVPFci_hCV9Ho14JpE02_9rU0zOI0w";

function urlBase64ToUint8Array(base64) {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const b64 = (base64 + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(b64);
  const out = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
}

export default function AvisosCumples() {
  const [estado, setEstado] = useState("cargando");
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    async function revisar() {
      const esIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const instalada = window.navigator.standalone === true || window.matchMedia("(display-mode: standalone)").matches;
      if (esIOS && !instalada) return setEstado("instalar");
      if (!("serviceWorker" in navigator) || !("PushManager" in window) || !("Notification" in window)) {
        return setEstado("no-soportado");
      }
      if (Notification.permission === "denied") return setEstado("bloqueado");
      try {
        const reg = await navigator.serviceWorker.register("/sw.js");
        await navigator.serviceWorker.ready;
        const sub = await reg.pushManager.getSubscription();
        setEstado(sub && Notification.permission === "granted" ? "activo" : "inactivo");
      } catch (e) {
        setEstado("no-soportado");
      }
    }
    revisar();
  }, []);

  async function enviarPrueba() {
    const { data, error } = await supabase.functions.invoke("send-birthday-push", { body: { test: true } });
    if (error || (data && data.error)) return setMensaje("No se pudo enviar la prueba.");
    if (data && data.enviados === 0) return setMensaje("No llegó: reactiva los avisos.");
    setMensaje("Prueba enviada ✔");
  }

  async function activar() {
    setMensaje("");
    try {
      const permiso = await Notification.requestPermission();
      if (permiso !== "granted") return setEstado(permiso === "denied" ? "bloqueado" : "inactivo");
      const reg = await navigator.serviceWorker.register("/sw.js");
      await navigator.serviceWorker.ready;
      let sub = await reg.pushManager.getSubscription();
      if (!sub) {
        sub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC),
        });
      }
      const json = sub.toJSON();
      const { error } = await supabase.from("push_subscriptions").upsert(
        {
          endpoint: json.endpoint,
          p256dh: json.keys.p256dh,
          auth: json.keys.auth,
          user_agent: navigator.userAgent.slice(0, 200),
        },
        { onConflict: "endpoint" }
      );
      if (error) throw error;
      setEstado("activo");
      await enviarPrueba();
    } catch (e) {
      setMensaje("No se pudo activar: " + (e && e.message ? e.message : "error"));
    }
  }

  const base = { marginBottom: 8 };
  const nota = { fontSize: 11, color: "#d9cbe6", marginTop: -2, marginBottom: 8, lineHeight: 1.35 };

  if (estado === "cargando") return null;
  if (estado === "instalar")
    return <div style={nota}>🔔 Para activar avisos, abre la app desde el ícono de tu pantalla de inicio.</div>;
  if (estado === "no-soportado") return <div style={nota}>🔔 Este navegador no admite avisos.</div>;
  if (estado === "bloqueado")
    return <div style={nota}>🔔 Avisos bloqueados. Actívalos en Ajustes del teléfono &gt; Notificaciones &gt; THETOMFIT.</div>;

  return (
    <>
      <button type="button" className="theme-toggle" style={base} onClick={estado === "activo" ? enviarPrueba : activar}>
        {estado === "activo" ? "🔔 Avisos activos (probar)" : "🔔 Activar avisos de cumpleaños"}
      </button>
      {mensaje && <div style={nota}>{mensaje}</div>}
    </>
  );
}
