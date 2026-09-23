"use client";
import SettingTabs from "../../SettingTabs";

const BIENVENIDAS = [
  { fecha: "10/06/2026", n: 14 },
  { fecha: "14/06/2026", n: 52 },
  { fecha: "15/06/2026", n: 9 },
  { fecha: "16/06/2026", n: 2 },
  { fecha: "17/06/2026", n: 7 },
  { fecha: "18/06/2026", n: 4 },
  { fecha: "24/06/2026", n: 43 },
  { fecha: "25/06/2026", n: 7 },
  { fecha: "26/06/2026", n: 9 },
  { fecha: "29/06/2026", n: 46 },
  { fecha: "30/06/2026", n: 21 },
  { fecha: "01/07/2026", n: 18 },
  { fecha: "02/07/2026", n: 17 },
  { fecha: "03/07/2026", n: 12 },
  { fecha: "06/07/2026", n: 26 },
  { fecha: "07/07/2026", n: 5 },
  { fecha: "08/07/2026", n: 8 },
  { fecha: "09/07/2026", n: 12 },
  { fecha: "10/07/2026", n: 5 },
  { fecha: "13/07/2026", n: 25 },
  { fecha: "14/07/2026", n: 8 },
  { fecha: "15/07/2026", n: 2 },
  { fecha: "16/07/2026", n: 6 },
  { fecha: "20/07/2026", n: 28 },
  { fecha: "21/07/2026", n: 10 },
  { fecha: "22/07/2026", n: 8 },
  { fecha: "23/07/2026", n: 8 },
  { fecha: "24/07/2026", n: 1 },
  { fecha: "27/07/2026", n: 13 },
  { fecha: "29/07/2026", n: 13 },
  { fecha: "30/07/2026", n: 10 },
  { fecha: "31/07/2026", n: 7 },
  { fecha: "03/08/2026", n: 21 },
  { fecha: "04/08/2026", n: 7 },
  { fecha: "05/08/2026", n: 5 },
  { fecha: "06/08/2026", n: 5 },
  { fecha: "07/08/2026", n: 3 },
  { fecha: "10/08/2026", n: 26 },
  { fecha: "11/08/2026", n: 3 },
  { fecha: "13/08/2026", n: 11 },
  { fecha: "14/08/2026", n: 7 },
  { fecha: "17/08/2026", n: 73 },
  { fecha: "18/08/2026", n: 24 },
  { fecha: "19/08/2026", n: 9 },
  { fecha: "20/08/2026", n: 13 },
  { fecha: "21/08/2026", n: 12 },
  { fecha: "24/08/2026", n: 39 },
  { fecha: "25/08/2026", n: 16 },
  { fecha: "26/08/2026", n: 16 },
  { fecha: "27/08/2026", n: 9 },
  { fecha: "04/09/2026", n: 66 },
  { fecha: "08/09/2026", n: 27 },
  { fecha: "09/09/2026", n: 9 },
  { fecha: "10/09/2026", n: 6 },
  { fecha: "11/09/2026", n: 2 },
  { fecha: "16/09/2026", n: 35 },
  { fecha: "17/09/2026", n: 58 },
  { fecha: "18/09/2026", n: 63 },
];

const MENSAJES_BIENVENIDA = [
  { codigo: "N1", objetivo: "Probar unas 400 personas", texto: "Hola [NOMBRE], soy [TU NOMBRE], encantado/a! Que tal estás?\nPor mera curiosidad, ¿me sigues más por el tema de la nutrición o del entrenamiento?" },
  { codigo: "N2", objetivo: "Empezar a testear", texto: "Hola [NOMBRE], soy [TU NOMBRE], encantado/a!\nPor simple curiosidad, y para poder enfocar mejor lo que comparto, ¿estás buscando mejorar en algún aspecto en concreto ahora mismo?" },
  { codigo: "N3", objetivo: "Tercera opción de testeo y ver datos", texto: "Buenas [NOMBRE], gracias por seguirme, espero que te esté gustando lo que comparto por aquí.\n¿Quería preguntarte si te interesa más la parte de alimentación o entrenamiento?" },
  { codigo: "N4", objetivo: "Probar unas 400 personas", texto: "Hola, ¡Gracias por seguirme! 🌈\nMe encanta hablar con mis seguidores, sobre todo saber qué tipo de contenido le puede ayudar.\n¿Qué fue lo que te llamó la atención de mi perfil o hizo que te quedaras por aquí?" },
  { codigo: "N5", objetivo: "Empezar a testear", texto: "¡Buenas! ¡Qué genial tenerte por aquí!\nPara ver si puedo ayudarte y ofrecerte algo que te sirva\n¿qué tipo de contenido te gustaría ver por aquí?" },
  { codigo: "N6", objetivo: "Tercera opción de testeo y ver datos", texto: "¡Buenas! ¡Gracias por seguirme!\nMe encanta pasar por aquí de vez en cuando y hablar con las personas\n¿Desde dónde me sigues?" },
  { codigo: "N7", objetivo: "Empezar a testear", texto: "¡Buenas!\nVi que me seguiste hace poquito, y me gusta ver quién sigue de cerca el contenido.\nUn placer tenerte por aquí." },
];

const MENSAJES_FUP = [
  { codigo: "N1", objetivo: "Probar unas 400 personas", texto: "Buenas de nuevo, no sé si viste el mensaje o dijiste ya le respondo luego, ese luego que dura semanas 😅" },
  { codigo: "N2", objetivo: "Empezar a testear", texto: "Hola!! Vengo a resurgir entre los mensajes olvidados 👋 ¿Pudiste leer el último que te envié?" },
  { codigo: "N3", objetivo: "Tercera opción de testeo y ver datos", texto: "Buenaaas, ¿qué tal estás?, ¿has podido leer mi mensaje? Estoy por aquí atento, un saludo!" },
  { codigo: "N4", objetivo: "Empezar a testear", texto: "" },
];

function TablaMensajes({ titulo, mensajes }) {
  return (
    <div className="card" style={{ marginTop: 20, maxWidth: 900 }}>
      <div className="label" style={{ marginBottom: 12 }}>{titulo}</div>
      <table>
        <thead>
          <tr>
            <th style={{ width: 50 }}>Código</th>
            <th style={{ width: 220 }}>Objetivo</th>
            <th>Mensaje</th>
          </tr>
        </thead>
        <tbody>
          {mensajes.map((m) => (
            <tr key={m.codigo}>
              <td className="name-cell">{m.codigo}</td>
              <td>{m.objetivo}</td>
              <td style={{ whiteSpace: "pre-line" }}>{m.texto || <span className="muted">— sin mensaje registrado —</span>}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function Setting() {
  const total = BIENVENIDAS.reduce((acc, b) => acc + b.n, 0);

  return (
    <>
      <SettingTabs />
      <p className="subtitle" style={{ marginTop: -8 }}>
        Registro de bienvenidas enviadas por Instagram y biblioteca de mensajes de referencia.
      </p>

      <div className="cards" style={{ gridTemplateColumns: "repeat(1, 1fr)", maxWidth: 260 }}>
        <div className="card cliente">
          <div className="label">Total de bienvenidas registradas</div>
          <div className="value">{total}</div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 20, maxWidth: 420 }}>
        <div className="label" style={{ marginBottom: 12 }}>Bienvenidas por fecha</div>
        <table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Nº Bienvenidas</th>
            </tr>
          </thead>
          <tbody>
            {BIENVENIDAS.map((b) => (
              <tr key={b.fecha}>
                <td className="name-cell">{b.fecha}</td>
                <td>{b.n}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <TablaMensajes titulo="Biblioteca de mensajes — Bienvenida 👋" mensajes={MENSAJES_BIENVENIDA} />
      <TablaMensajes titulo="Biblioteca de mensajes — Follow-up 🚀" mensajes={MENSAJES_FUP} />
    </>
  );
}
