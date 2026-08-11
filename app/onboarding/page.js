"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

const FASES = [
  {
    titulo: "Incorporación de hábitos",
    texto: "Empezar a conocer, tanto yo como tú, qué alimentos y entrenamiento te van gustando para ir incorporando el hábito desde el día 1 del entrenamiento y la alimentación pauteada.",
  },
  {
    titulo: "Aprender de entrenamiento y nutrición",
    texto: "Una vez se tenga el punto número 1 afianzado, se comenzará a implementar conocimientos necesarios de entrenamiento y nutrición.",
  },
  {
    titulo: "Obtener resultados al 100%",
    texto: "Luego que se aprenda la teoría de esos conocimientos, automatizaremos esa información en la práctica para rendir al 100% teniendo mejores resultados.",
  },
  {
    titulo: "Mantener los resultados a largo plazo",
    texto: "Cuando ya hemos conseguido nuestro objetivo al 100%, llega el momento de conocer cómo mantener esos resultados a largo plazo.",
  },
];

const COMPROMISOS = [
  { titulo: "Cumple con el plan", texto: "Tus resultados dependen de tus acciones." },
  { titulo: "Registra tus datos correctamente", texto: "Las repeticiones, la carga, las sensaciones, el seguimiento semanal, la antropometría." },
  { titulo: "Comunicación honesta", texto: "Avísame de todo lo que sientas necesario comunicarme (dolores, molestias, un mal día, problemas con cumplir, etc.), de lo contrario no podré ayudarte." },
  { titulo: "Ten paciencia con el proceso", texto: "No busques soluciones mágicas, no vas a lograr en poco tiempo lo que llevas arrastrando años. Ten paciencia contigo, sé amable contigo." },
  { titulo: "No modifiques el programa sin avisar", texto: "Ni volumen, ni intensidad, ni ejercicios nuevos, sin comentármelo antes." },
  { titulo: "La responsabilidad de tus resultados es compartida", texto: "El equipo @TheTomFit guía, tú ejecutas." },
];

export default function OnboardingPage() {
  const [pasos, setPasos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
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
    }
    load();
  }, []);

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px", fontFamily: "var(--font-heading)" }}>
      <h1 style={{ textAlign: "center", fontSize: 30, fontWeight: 800, color: "#2e1c3d" }}>
        ¡Te damos la bienvenida al equipo @TheTomFit!
      </h1>
      <p style={{ textAlign: "center", fontSize: 15, color: "#6b5b73", maxWidth: 640, margin: "12px auto 40px" }}>
        Este no es solo un programa de entrenamiento y nutrición, sino es un espacio seguro donde
        conseguirás estar mejor físicamente y mentalmente, confía en ti y en los pasos que tomas para
        acercarte cada vez más a tu objetivo.
      </p>

      <h2 style={{ fontSize: 22, fontWeight: 800, color: "#2e1c3d", marginBottom: 6 }}>Tu plan de acción</h2>
      <p style={{ fontSize: 14, color: "#6b5b73", marginBottom: 28 }}>
        Antes que nada quiero que sepas qué conseguirás exactamente, cuáles son las fases del proceso y
        cuál es tu compromiso conmigo. Está realizado de esta forma para que en ningún momento te
        sientas saturade de información.
      </p>

      <h3 style={{ fontSize: 17, fontWeight: 700, color: "#2e1c3d", marginBottom: 14 }}>Las 4 fases de tu proceso</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 36 }}>
        {FASES.map((f, i) => (
          <div key={i} className="card" style={{ padding: 16 }}>
            <div className="label" style={{ marginBottom: 6 }}>Fase {i + 1}</div>
            <div style={{ fontWeight: 700, fontSize: 14, color: "#2e1c3d", marginBottom: 6 }}>{f.titulo}</div>
            <div style={{ fontSize: 12.5, color: "#6b5b73" }}>{f.texto}</div>
          </div>
        ))}
      </div>

      <h3 style={{ fontSize: 17, fontWeight: 700, color: "#2e1c3d", marginBottom: 14 }}>Tu compromiso y deberes</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 44 }}>
        {COMPROMISOS.map((c, i) => (
          <div key={i} className="card" style={{ padding: 16 }}>
            <div style={{ fontWeight: 700, fontSize: 13.5, color: "#2e1c3d", marginBottom: 6 }}>{c.titulo}</div>
            <div style={{ fontSize: 12.5, color: "#6b5b73" }}>{c.texto}</div>
          </div>
        ))}
      </div>

      <h3 style={{ fontSize: 17, fontWeight: 700, color: "#2e1c3d", marginBottom: 16 }}>Tus pasos, en orden</h3>

      {loading && <div>Cargando pasos...</div>}
      {error && <div className="login-error">{error}</div>}
      {!loading && !error && pasos.length === 0 && (
        <div className="muted">Todavía no hay pasos de bienvenida publicados. Vuelve pronto.</div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {pasos.map((p) => (
          <div key={p.id} className="card" style={{ padding: 20 }}>
            <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
              <div
                style={{
                  flexShrink: 0,
                  width: 34,
                  height: 34,
                  borderRadius: 8,
                  background: "var(--brand-gradient)",
                  color: "#fff",
                  fontWeight: 800,
                  fontSize: 14,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {String(p.orden).padStart(2, "0")}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 15, color: "#2e1c3d", marginBottom: 4 }}>
                  {p.titulo}
                </div>
                <div style={{ fontSize: 13.5, color: "#6b5b73", marginBottom: p.video_url ? 12 : 0 }}>
                  {p.resumen}
                </div>
                {p.video_url && (
                  <a className="btn btn-primary" href={p.video_url} target="_blank" rel="noreferrer">
                    {p.boton_texto || "Abrir enlace"}
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
