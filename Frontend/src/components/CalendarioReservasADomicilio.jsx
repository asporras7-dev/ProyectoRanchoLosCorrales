import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../styles/CalendarioReservasADomicilio.css";
import {
  getFechasBloqueadasADomicilio,
  bloquearFechaADomicilio,
  desbloquearFechaADomicilio,
} from "../services/services";

const HOY = new Date();
HOY.setHours(0, 0, 0, 0);

const FECHA_MAX = new Date("2028-12-31");
FECHA_MAX.setHours(23, 59, 59, 999);

// Convierte un Date a string "YYYY-MM-DD" en hora local (evita problemas de UTC)
const toLocalISO = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

/**
 * CalendarioReservasADomicilio.jsx
 *
 * Props:
 *  - modo: "admin" | "usuario"
 *      "admin"   → puede bloquear/desbloquear fechas haciendo clic
 *      "usuario" → solo selecciona; las fechas bloqueadas están deshabilitadas
 *
 *  - onFechaSeleccionada: (fechaISO: string) => void
 *      Callback que se llama cuando el usuario selecciona una fecha válida.
 *      Solo se usa en modo "usuario".
 *
 *  - fechaSeleccionada: string (ISO "YYYY-MM-DD")
 *      Fecha actualmente seleccionada (controlado desde el padre).
 *      Solo se usa en modo "usuario".
 */
export default function CalendarioReservasADomicilio({
  modo = "usuario",
  onFechaSeleccionada,
  fechaSeleccionada,
}) {
  const [fechasBloqueadas, setFechasBloqueadas] = useState([]); // array de strings "YYYY-MM-DD"
  const [cargando, setCargando] = useState(true);
  const [procesando, setProcesando] = useState(false); // evita doble clic
  const [mensaje, setMensaje] = useState(null); // { tipo: "ok"|"error", texto }

  // Fecha activa en el calendario (solo modo usuario)
  const [valorCalendario, setValorCalendario] = useState(null);

  // Cargar fechas bloqueadas al montar
  useEffect(() => {
    cargarFechas();
  }, []);

  // Sincronizar valor del calendario cuando el padre cambia fechaSeleccionada
  useEffect(() => {
    if (modo === "usuario" && fechaSeleccionada) {
      const [y, m, d] = fechaSeleccionada.split("-").map(Number);
      setValorCalendario(new Date(y, m - 1, d));
    }
  }, [fechaSeleccionada, modo]);

  const cargarFechas = async () => {
    setCargando(true);
    try {
      const data = await getFechasBloqueadasADomicilio();
      setFechasBloqueadas(data || []);
    } catch {
      mostrarMensaje("error", "Error al cargar fechas bloqueadas.");
    } finally {
      setCargando(false);
    }
  };

  const mostrarMensaje = (tipo, texto) => {
    setMensaje({ tipo, texto });
    setTimeout(() => setMensaje(null), 3000);
  };

  const esBloqueada = (date) => {
    return fechasBloqueadas.includes(toLocalISO(date));
  };

  // --- MODO ADMIN: clic en día → bloquear o desbloquear ---
  const handleClickAdmin = async (date) => {
    if (procesando) return;
    const iso = toLocalISO(date);
    const bloqueada = fechasBloqueadas.includes(iso);
    setProcesando(true);
    try {
      if (bloqueada) {
        await desbloquearFechaADomicilio(iso);
        setFechasBloqueadas((prev) => prev.filter((f) => f !== iso));
        mostrarMensaje("ok", `Fecha ${iso} desbloqueada.`);
      } else {
        await bloquearFechaADomicilio(iso);
        setFechasBloqueadas((prev) => [...prev, iso]);
        mostrarMensaje("ok", `Fecha ${iso} bloqueada.`);
      }
    } catch {
      mostrarMensaje("error", "Error al actualizar la fecha.");
    } finally {
      setProcesando(false);
    }
  };

  // --- MODO USUARIO: clic en día → seleccionar si no está bloqueada ---
  const handleClickUsuario = (date) => {
    if (esBloqueada(date)) return;
    const iso = toLocalISO(date);
    setValorCalendario(date);
    onFechaSeleccionada && onFechaSeleccionada(iso);
  };

  // Clases personalizadas por tile
  const tileClassName = ({ date, view }) => {
    if (view !== "month") return null;
    const clases = [];
    if (esBloqueada(date)) clases.push("cal-bloqueada");
    if (
      modo === "usuario" &&
      valorCalendario &&
      toLocalISO(date) === toLocalISO(valorCalendario)
    ) {
      clases.push("cal-seleccionada");
    }
    return clases.join(" ") || null;
  };

  // Deshabilitar tiles
  const tileDisabled = ({ date, view }) => {
    if (view !== "month") return false;
    // Días pasados siempre deshabilitados
    if (date < HOY) return true;
    // En modo usuario: deshabilitar bloqueadas
    if (modo === "usuario" && esBloqueada(date)) return true;
    return false;
  };

  // Contenido extra dentro del tile (ícono de candado en admin)
  const tileContent = ({ date, view }) => {
    if (view !== "month") return null;
    if (modo === "admin" && esBloqueada(date)) {
      return <span className="cal-lock-icon" aria-label="Bloqueada">🔒</span>;
    }
    return null;
  };

  return (
    <div className={`cal-contenedor cal-modo-${modo}`}>
      {/* Encabezado */}
      <div className="cal-encabezado">
        <div className="cal-encabezado-info">
          {modo === "admin" ? (
            <>
              <h3 className="cal-titulo">Gestión de fechas para servicios a domicilio</h3>
              <p className="cal-subtitulo">
                Hacé clic en una fecha para bloquearla o desbloquearla.
              </p>
            </>
          ) : (
            <p className="cal-subtitulo">
              Seleccioná la fecha de tu evento. Las fechas en rojo no están disponibles.
            </p>
          )}
        </div>
        {modo === "admin" && (
          <button
            className="cal-btn-recargar"
            onClick={cargarFechas}
            disabled={cargando || procesando}
            title="Recargar fechas"
          >
            ↺ Recargar
          </button>
        )}
      </div>

      {/* Mensaje de feedback */}
      {mensaje && (
        <div className={`cal-mensaje cal-mensaje--${mensaje.tipo}`}>
          {mensaje.texto}
        </div>
      )}

      {/* Leyenda */}
      <div className="cal-leyenda">
        {modo === "admin" ? (
          <>
            <span className="cal-leyenda-item">
              <span className="cal-leyenda-dot cal-leyenda-dot--libre" />
              Disponible
            </span>
            <span className="cal-leyenda-item">
              <span className="cal-leyenda-dot cal-leyenda-dot--bloqueada" />
              Bloqueada
            </span>
            <span className="cal-leyenda-item">
              <span className="cal-leyenda-dot cal-leyenda-dot--pasada" />
              Pasada
            </span>
          </>
        ) : (
          <>
            <span className="cal-leyenda-item">
              <span className="cal-leyenda-dot cal-leyenda-dot--libre" />
              Disponible
            </span>
            <span className="cal-leyenda-item">
              <span className="cal-leyenda-dot cal-leyenda-dot--bloqueada" />
              No disponible
            </span>
            <span className="cal-leyenda-item">
              <span className="cal-leyenda-dot cal-leyenda-dot--seleccionada" />
              Seleccionada
            </span>
          </>
        )}
      </div>

      {/* Calendario */}
      {cargando ? (
        <div className="cal-cargando">Cargando calendario...</div>
      ) : (
        <Calendar
          locale="es-CR"
          minDate={HOY}
          maxDate={FECHA_MAX}
          value={modo === "usuario" ? valorCalendario : null}
          onClickDay={modo === "admin" ? handleClickAdmin : handleClickUsuario}
          tileClassName={tileClassName}
          tileDisabled={tileDisabled}
          tileContent={tileContent}
          showNeighboringMonth={false}
          prev2Label={null}
          next2Label={null}
          formatMonthYear={(locale, date) => {
            const month = date.toLocaleString(locale, { month: 'long' });
            const year = date.getFullYear();
            return `${month.charAt(0).toUpperCase() + month.slice(1)} ${year}`;
          }}
        />
      )}

      {/* Leyenda: ahora debajo del calendario */}
      {!cargando && (
        <div className="cal-leyenda">
          {modo === "admin" ? (
            <>
              <span className="cal-leyenda-item">
                <span className="cal-leyenda-dot cal-leyenda-dot--libre" />
                Disponible
              </span>
              <span className="cal-leyenda-item">
                <span className="cal-leyenda-dot cal-leyenda-dot--bloqueada" />
                Bloqueada
              </span>
              <span className="cal-leyenda-item">
                <span className="cal-leyenda-dot cal-leyenda-dot--pasada" />
                Pasada
              </span>
            </>
          ) : (
            <>
              <span className="cal-leyenda-item">
                <span className="cal-leyenda-dot cal-leyenda-dot--libre" />
                Disponible
              </span>
              <span className="cal-leyenda-item">
                <span className="cal-leyenda-dot cal-leyenda-dot--bloqueada" />
                No disponible
              </span>
              <span className="cal-leyenda-item">
                <span className="cal-leyenda-dot cal-leyenda-dot--seleccionada" />
                Seleccionada
              </span>
            </>
          )}
        </div>
      )}
      {/* Resumen admin */}
      {modo === "admin" && !cargando && (
        <div className="cal-resumen">
          <span className="cal-resumen-num">{fechasBloqueadas.length}</span>
          {fechasBloqueadas.length === 1
            ? " fecha bloqueada"
            : " fechas bloqueadas"}
        </div>
      )}

      {/* Fecha seleccionada (modo usuario) */}
      {modo === "usuario" && valorCalendario && (
        <div className="cal-fecha-elegida">
          Fecha seleccionada:{" "}
          <strong>
            {valorCalendario.toLocaleDateString("es-CR", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </strong>
        </div>
      )}
    </div>
  );
}
