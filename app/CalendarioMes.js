"use client";

const DIAS_HEADER = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

export default function CalendarioMes({ dias, hoy, seleccionado, diasConItems, onSelectDay }) {
  return (
    <div className="cal-month">
      <div className="cal-month-weekdays">
        {DIAS_HEADER.map((d) => (
          <div key={d} className="cal-month-weekday">{d}</div>
        ))}
      </div>
      <div className="cal-month-grid">
        {dias.map((d) => {
          const classes =
            "cal-month-day" +
            (d.enMes ? "" : " out") +
            (d.fecha === hoy ? " today" : "") +
            (d.fecha === seleccionado ? " selected" : "");
          return (
            <button key={d.fecha} type="button" className={classes} onClick={() => onSelectDay(d.fecha)}>
              <span className="num">{d.numero}</span>
              {diasConItems.has(d.fecha) && <span className="dot" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
