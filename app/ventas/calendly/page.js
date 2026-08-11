"use client";const e=[{start:"2026-07-02T14:30:00Z",nombre:"Claudia Fernandez Manero",correo:"claudia_1988_28@outlook.com",whatsapp:"+34 610 20 66 35",instagram:"Claudiafdez_33",decide:"Sí"},{start:"2026-07-02T18:30:00Z",nombre:"Mathias Denzel Mendoza Jimenez",correo:"fer05se@hotmail.com",whatsapp:"+52 222 735 2888",instagram:"@roderichden",decide:"Sí"},{start:"2026-07-04T16:00:00Z",nombre:"Sarah Herrera Hernández",correo:"sarahherrerahernandez@gmail.com",whatsapp:"+34 611 15 15 64",instagram:"With_lovesarah",decide:"Sí"},{start:"2026-07-06T17:00:00Z",nombre:"Cesar Caldes",correo:"danieltoro352@gmail.com",whatsapp:"+34 687 01 04 50",instagram:"Kid_sauce_102",decide:"Sí"},{start:"2026-07-06T18:00:00Z",nombre:"Iña Ella Gil Altamirano",correo:"ellagilalt@gmail.com",whatsapp:"+52 998 300 6262",instagram:"KeysiiiKeysiii",decide:"Sí"},{start:"2026-07-07T18:00:00Z",nombre:"May",correo:"d.calomarde92@gmail.com",whatsapp:"+34 675 80 03 90",instagram:"rebeldiasilente",decide:"Sí"},{start:"2026-07-08T14:15:00Z",nombre:"Maria Cinta",correo:"mgonel@xtec.cat",whatsapp:"+34 691 13 64 66",instagram:"Tuka",decide:"Sí"},{start:"2026-07-08T23:00:00Z",nombre:"Noah Miranda",correo:"noahmiranda2119@gmail.com",whatsapp:"+52 33 1488 2797",instagram:"noahmirandx",decide:"Sí"},{start:"2026-07-10T00:30:00Z",nombre:"Karla",correo:"kparralorena123@gmail.com",whatsapp:"+1 760-587-6335",instagram:"@its.karlaaaparraaa",decide:"Sí"},{start:"2026-07-10T06:00:00Z",nombre:"Geneve",correo:"genivie@gmail.com",whatsapp:"+34 674 05 71 90",instagram:"Geneve Albanesi",decide:"No (necesita apoyo)"},{start:"2026-07-10T14:30:00Z",nombre:"Lilith",correo:"liliia1810197@gmail.com",whatsapp:"+34 650 61 24 72",instagram:"lilithmillet",decide:"No (necesita apoyo)"},{start:"2026-07-10T18:00:00Z",nombre:"David Osorio",correo:"david_osorio_lira@hotmail.com",whatsapp:"+52 477 223 2684",instagram:"David_2495",decide:"Sí"},{start:"2026-07-15T14:00:00Z",nombre:"Juan Antonio",correo:"rubiojuanantonio955@gmail.com",whatsapp:"+34 606 99 41 10",instagram:"j.antonio021997",decide:"Sí"},{start:"2026-07-24T15:00:00Z",nombre:"Odett Ramirez Tlaxcalteco",correo:"jossuuuwu@gmail.com",whatsapp:"+52 221 744 4286",instagram:"@jossuuuwu",decide:"Sí"},{start:"2026-07-27T15:00:00Z",nombre:"Mikaela",correo:"mikaaa.hg@gmail.com",whatsapp:"+34 667 79 60 18",instagram:"Mika3d_",decide:"Sí"},{start:"2026-07-29T01:00:00Z",nombre:"Annie Elisa Mendez Osorio",correo:"annieelisa94@gmail.com",whatsapp:"+52 999 475 3476",instagram:"annieelisa94@gmail.com",decide:"Sí"},{start:"2026-08-03T19:00:00Z",nombre:"Jose gabriel Rivera",correo:"josegabrielr841@gmail.com",whatsapp:"+52 55 4033 3350",instagram:"—",decide:"Sí"},{start:"2026-08-04T18:00:00Z",nombre:"andre ordonez",correo:"sofiatekelo@gmail.com",whatsapp:"+32 469 18 12 35",instagram:"—",decide:"Sí"}];function t(a){return new Date(a).toLocaleString("es-ES",{timeZone:"America/Vancouver",day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit"})}export default function r(){return<>
      <div className="topbar"style={{marginBottom:4}}>
        <p className="subtitle"style={{margin:0}}>Calendly conectado — @TheTomFit.</p>
        <div className="topbar-actions">
          <a className="btn btn-secondary"href="https://calendly.com/thetomfit"target="_blank"rel="noreferrer">
            Abrir Calendly
          </a>
        </div>
      </div>

      <div className="cards"style={{gridTemplateColumns:"repeat(2, 1fr)",maxWidth:400}}>
        <div className="card alta">
          <div className="label">Llamadas agendadas (snapshot)</div>
          <div className="value">{e.length}</div>
        </div>
        <div className="card mediaalta">
          <div className="label">Próximas</div>
          <div className="value">0</div>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Fecha y hora (Vancouver)</th>
            <th>Nombre</th>
            <th>WhatsApp</th>
            <th>Instagram</th>
            <th>¿Decide?</th>
            <th>Correo</th>
          </tr>
        </thead>
        <tbody>
          {e.map(a=><tr key={a.start+a.correo}>
              <td className="name-cell">{t(a.start)}</td>
              <td>{a.nombre}</td>
              <td>{a.whatsapp}</td>
              <td className="muted">{a.instagram}</td>
              <td>{a.decide}</td>
              <td className="muted">{a.correo}</td>
            </tr>)}
        </tbody>
      </table>
      <div className="note-count">Snapshot manual — dime "actualiza Calendly".</div>
    </>}
