import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../styles/Calendario.css";

/**
 * CalendarioFiltro.jsx
 *
 * Calendario simplificado para filtrar reservas por rango de fechas.
 * NO tiene lógica de fechas bloqueadas: permite seleccionar cualquier fecha.
 *
 * Props:
 *  - fechaInicio: string (ISO "YYYY-MM-DD") o null
 *  - fechaFin:    string (ISO "YYYY-MM-DD") o null
 *  - onRangoSeleccionado: ({ inicio: string, fin: string } | null) => void
 */

const toLocalISO = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const isoToDate = (iso) => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
};

const formatearFecha = (iso) => {
  const date = isoToDate(iso);
  return date.toLocaleDateString("es-CR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export default function CalendarioFiltro({ fechaInicio, fechaFin, onRangoSeleccionado }) {
  // paso 1: seleccionar inicio; paso 2: seleccionar fin
  const [paso, setPaso] = useState(fechaInicio ? 2 : 1);
  // inicio temporal mientras el usuario elige el fin
  const [inicioTemp, setInicioTemp] = useState(fechaInicio || null);
  // fecha bajo el cursor para preview del rango
  const [hoverFecha, setHoverFecha] = useState(null);

  // Sincronizar estado interno cuando las props cambian desde fuera (ej: al limpiar)
  useEffect(() => {
    if (!fechaInicio && !fechaFin) {
      setPaso(1);
      setInicioTemp(null);
      setHoverFecha(null);
    } else if (fechaInicio) {
      setInicioTemp(fechaInicio);
      setPaso(fechaFin ? 1 : 2);
    }
  }, [fechaInicio, fechaFin]);

  const handleClickDay = (date) => {
    const iso = toLocalISO(date);

    if (paso === 1) {
      // Primer clic: establece fecha de inicio y avanza al paso 2
      setInicioTemp(iso);
      setHoverFecha(null);
      setPaso(2);
    } else {
      // Segundo clic: establece la fecha final y emite el rango
      let inicio = inicioTemp;
      let fin = iso;

      // Si el fin es antes del inicio, invertir
      if (fin < inicio) {
        [inicio, fin] = [fin, inicio];
      }

      onRangoSeleccionado && onRangoSeleccionado({ inicio, fin });
      setHoverFecha(null);
      setPaso(1);
    }
  };

  const handleMouseOver = (date) => {
    if (paso === 2 && inicioTemp) {
      setHoverFecha(toLocalISO(date));
    }
  };

  const tileClassName = ({ date, view }) => {
    if (view !== "month") return null;
    const iso = toLocalISO(date);

    // Rango confirmado (props del padre)
    if (fechaInicio && fechaFin) {
      if (iso === fechaInicio && iso === fechaFin) return "cal-seleccionada";
      if (iso === fechaInicio) return "cal-rango-inicio";
      if (iso === fechaFin) return "cal-rango-fin";
      if (iso > fechaInicio && iso < fechaFin) return "cal-rango-medio";
    }

    // Preview del rango mientras el usuario está en paso 2
    if (paso === 2 && inicioTemp && hoverFecha) {
      const rangoStart = inicioTemp < hoverFecha ? inicioTemp : hoverFecha;
      const rangoEnd   = inicioTemp < hoverFecha ? hoverFecha : inicioTemp;

      if (iso === rangoStart && iso === rangoEnd) return "cal-seleccionada";
      if (iso === rangoStart) return "cal-rango-inicio cal-preview";
      if (iso === rangoEnd)   return "cal-rango-fin cal-preview";
      if (iso > rangoStart && iso < rangoEnd) return "cal-rango-medio cal-preview";
    }

    // Solo el inicio ya seleccionado (paso 2, sin hover aún)
    if (paso === 2 && inicioTemp && iso === inicioTemp) {
      return "cal-seleccionada";
    }

    return null;
  };

  const hayRango = fechaInicio && fechaFin;
  const mismaFecha = hayRango && fechaInicio === fechaFin;

  const limpiarFiltro = () => {
    setPaso(1);
    setInicioTemp(null);
    setHoverFecha(null);
    onRangoSeleccionado && onRangoSeleccionado(null);
  };

  return (
    <div className="cal-contenedor cal-filtro-contenedor">
      <div className="cal-encabezado">
        <div className="cal-encabezado-info">
          <h3 className="cal-titulo">Filtrar por rango de fechas</h3>
          <p className="cal-subtitulo">
            {paso === 1
              ? "Seleccioná la fecha de inicio del rango."
              : `Inicio: ${formatearFecha(inicioTemp)}. Ahora seleccioná la fecha final.`}
          </p>
        </div>
      </div>

      {/* Indicador de paso */}
      <div className="cal-filtro-pasos">
        <span className={`cal-filtro-paso ${paso >= 1 ? "activo" : ""}`}>
          1. Fecha inicio
        </span>
        <span className="cal-filtro-paso-flecha">→</span>
        <span className={`cal-filtro-paso ${paso === 2 ? "activo" : ""}`}>
          2. Fecha final
        </span>
      </div>

      <Calendar
        locale="es-CR"
        value={
          hayRango
            ? [isoToDate(fechaInicio), isoToDate(fechaFin)]
            : inicioTemp
            ? isoToDate(inicioTemp)
            : null
        }
        onClickDay={handleClickDay}
        onMouseOver={({ activeStartDate, value, view }, event) => {
          // react-calendar pasa el evento como segundo arg en onMouseOver de tile
        }}
        tileClassName={tileClassName}
        tileContent={({ date }) => {
          // Capturar mouseover por tile para preview del rango
          return (
            <span
              style={{ position: "absolute", inset: 0 }}
              onMouseEnter={() => handleMouseOver(date)}
            />
          );
        }}
        showNeighboringMonth={false}
        prev2Label={null}
        next2Label={null}
        selectRange={false}
      />

      {/* Botón limpiar filtro */}
      {(hayRango || (paso === 2 && inicioTemp)) && (
        <button className="cal-btn-limpiar" onClick={limpiarFiltro}>
          ✕ Limpiar filtro de fecha
        </button>
      )}

      {/* Información del rango activo */}
      {hayRango && (
        <div className="cal-fecha-elegida">
          {mismaFecha ? (
            <>
              Filtrando por día específico:{" "}
              <strong>{formatearFecha(fechaInicio)}</strong>
            </>
          ) : (
            <>
              Filtrando del{" "}
              <strong>{formatearFecha(fechaInicio)}</strong>
              {" "}al{" "}
              <strong>{formatearFecha(fechaFin)}</strong>
            </>
          )}
        </div>
      )}

      {/* Ayuda: cómo filtrar un día específico */}
      {!hayRango && paso === 1 && (
        <div className="cal-filtro-ayuda">
          💡 Para filtrar un día específico, elegí la misma fecha como inicio y final.
        </div>
      )}
    </div>
  );
}
