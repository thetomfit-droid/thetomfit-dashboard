"use client";
export default function OnboardingAdminList({ pasos, onEdit, onDelete }) {
  if (pasos.length === 0) {
    return <div className="muted">Todavía no hay pasos creados.</div>;
  }
  return (
    <table>
      <thead>
        <tr>
          <th>Orden</th>
          <th>Título</th>
          <th>Resumen</th>
          <th>Enlace</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {pasos.map((p) => (
          <tr key={p.id}>
            <td className="name-cell">{p.orden}</td>
            <td>{p.titulo}</td>
            <td style={{ maxWidth: 340 }}>
              <span className="muted">{p.resumen}</span>
            </td>
            <td>
              {p.video_url ? (
                <a className="fathom-link" href={p.video_url} target="_blank" rel="noreferrer">
                  {p.boton_texto || "Ver enlace"}
                </a>
              ) : (
                <span className="muted">—</span>
              )}
            </td>
            <td>
              <button className="edit-link" onClick={() => onEdit(p)}>
                Editar
              </button>
              {" · "}
              <button className="edit-link" onClick={() => onDelete(p)}>
                Eliminar
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
