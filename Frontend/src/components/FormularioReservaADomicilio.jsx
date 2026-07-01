import { useState, useEffect, useRef, useCallback } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { postReservaADomicilio } from "../services/services";
import "../styles/FormularioReservaADomicilio.css";
import CalendarioReservasADomicilio from "../components/CalendarioReservasADomicilio";
import Swal from "sweetalert2";
import calendarioIcon from "../img/Calendario.jpeg";
import fotoAreaIcon from "../img/FotoAreaDeTrabajo.jpeg";
import PinUbicacion from "../img/Point.jpeg";
import mapaIcon from "../img/Mapa.jpeg";
import ubicacionIcon from "../img/UbicaciónActual.jpeg";

// Fix del icono por defecto de Leaflet (problema conocido con webpack/vite)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const formatearFecha = (isoString) => {
  if (!isoString) return "";
  const partes = isoString.split("-");
  if (partes.length !== 3) return isoString;
  return `${partes[2]}/${partes[1]}/${partes[0]}`;
};

const tiposMenu = ["Parrillada Tradicional", "Parrillada Deluxe (Cerdo, Res y Pollo)", "Parrillada Personalizada"];
const horasEvento = [
  "12:00 AM", "1:00 AM", "2:00 AM", "3:00 AM", "4:00 AM", "5:00 AM",
  "6:00 AM", "7:00 AM", "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM",
  "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM",
  "6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM", "10:00 PM", "11:00 PM",
];
const tiposEventoADomicilio = [
  "Boda",
  "Quinceaños",
  "Cumpleaños",
  "Primera comunión",
  "Bautizo",
  "Corporativo",
  "Team building o capacitación",
  "Fiesta de Empresa",
  "Fiestas infantiles",
  "Actividades wellness"
];
const horasServicio = [...horasEvento];

// ─── Subcomponente: mueve el mapa cuando cambia el centro ───────────────────
function MapController({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.setView(center, 15);
  }, [center, map]);
  return null;
}

// ─── Subcomponente: captura clics en el mapa ────────────────────────────────
function MapClickHandler({ onMapClick }) {
  useMapEvents({ click: (e) => onMapClick(e.latlng) });
  return null;
}

// ─── Subcomponente: piker de ubicación con mapa ─────────────────────────────
function UbicacionGpsPicker({ value, onChange }) {
  const [query, setQuery] = useState("");
  const [sugerencias, setSugerencias] = useState([]);
  const [cargandoSugerencias, setCargandoSugerencias] = useState(false);
  const [mostrarMapa, setMostrarMapa] = useState(false);
  const [posicion, setPosicion] = useState(null);   // { lat, lng }
  const [mapCenter, setMapCenter] = useState(null);
  const [cargandoGps, setCargandoGps] = useState(false);
  const debounceRef = useRef(null);
  const sugerenciasRef = useRef(null);

  // Cierra sugerencias al hacer clic afuera
  useEffect(() => {
    const handler = (e) => {
      if (sugerenciasRef.current && !sugerenciasRef.current.contains(e.target)) {
        setSugerencias([]);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Geocodificación directa: búsqueda de texto → coordenadas (Nominatim)
  const buscarSugerencias = useCallback(async (texto) => {
    if (texto.trim().length < 3) { setSugerencias([]); return; }
    setCargandoSugerencias(true);
    try {
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(texto)}&format=json&limit=5&addressdetails=1`;
      const res = await fetch(url, { headers: { "Accept-Language": "es" } });
      const data = await res.json();
      setSugerencias(data);
    } catch {
      setSugerencias([]);
    } finally {
      setCargandoSugerencias(false);
    }
  }, []);

  const handleQueryChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => buscarSugerencias(val), 400);
  };

  const seleccionarSugerencia = (item) => {
    const lat = parseFloat(item.lat);
    const lng = parseFloat(item.lon);
    const label = item.display_name;
    setPosicion({ lat, lng });
    setMapCenter({ lat, lng });
    setQuery(label);
    setSugerencias([]);
    setMostrarMapa(true);
    onChange(label);
  };

  // Geocodificación inversa: coordenadas → texto legible (Nominatim)
  const geocodificarInverso = async (lat, lng) => {
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`;
      const res = await fetch(url, { headers: { "Accept-Language": "es" } });
      const data = await res.json();
      return data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    } catch {
      return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    }
  };

  const handleMapClick = async ({ lat, lng }) => {
    setPosicion({ lat, lng });
    const label = await geocodificarInverso(lat, lng);
    setQuery(label);
    onChange(label);
  };

  const handleMarkerDrag = async (e) => {
    const { lat, lng } = e.target.getLatLng();
    setPosicion({ lat, lng });
    const label = await geocodificarInverso(lat, lng);
    setQuery(label);
    onChange(label);
  };

  // GPS del dispositivo
  const usarMiUbicacion = () => {
    if (!navigator.geolocation) {
      Swal.fire({
        icon: "warning",
        title: "GPS no disponible",
        text: "Tu navegador no soporta geolocalización.",
        background: "#171212",
        color: "#fff",
        confirmButtonColor: "#8b0000",
      });
      return;
    }
    setCargandoGps(true);
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const lat = coords.latitude;
        const lng = coords.longitude;
        setPosicion({ lat, lng });
        setMapCenter({ lat, lng });
        const label = await geocodificarInverso(lat, lng);
        setQuery(label);
        onChange(label);
        setMostrarMapa(true);
        setCargandoGps(false);
      },
      () => {
        setCargandoGps(false);
        Swal.fire({
          icon: "error",
          title: "No se pudo obtener la ubicación",
          text: "Asegurate de permitir el acceso al GPS.",
          background: "#171212",
          color: "#fff",
          confirmButtonColor: "#8b0000",
        });
      }
    );
  };

  const limpiarUbicacion = () => {
    setQuery("");
    setPosicion(null);
    setMostrarMapa(false);
    setSugerencias([]);
    onChange("");
  };

  return (
    <div className="frd-gps-picker">
      <div className="frd-gps-search-row" ref={sugerenciasRef}>
        <div className="frd-gps-input-wrapper">
          <div className="frd-gps-icon-left">
            <img src={PinUbicacion} alt="Ubicación" className="frd-foto-icon-img" />
          </div>
          <input
            type="text"
            className="frd-input frd-gps-text-input"
            placeholder="Ubicación GPS (opcional)"
            value={query}
            onChange={handleQueryChange}
          />
          <div className="frd-gps-inside-actions">
            {query && (
              <button type="button" className="frd-gps-clear-inside" onClick={limpiarUbicacion} title="Limpiar">
                ✕
              </button>
            )}
            <span
              className={`frd-gps-inside-icon ${cargandoGps ? "frd-btn-gps-loading" : "frd-btn-gps"}`}
              onClick={usarMiUbicacion}
              title="Usar mi ubicación actual"
            >
              {cargandoGps ? <span className="frd-gps-spinner-small" /> : <img src={ubicacionIcon} alt="Ubicación actual" className="frd-gps-icon-img" />}
            </span>
            <span
              className="frd-gps-inside-icon frd-cursor-pointer"
              onClick={() => setMostrarMapa((v) => !v)}
              title={mostrarMapa ? "Ocultar mapa" : "Ver mapa"}
            >
              <img src={mapaIcon} alt="Mapa" className="frd-gps-icon-img" />
            </span>
          </div>
        </div>
      </div>

      {/* ── Lista de sugerencias ── */}
      {sugerencias.length > 0 && (
        <ul className="frd-gps-sugerencias">
          {cargandoSugerencias && (
            <li className="frd-gps-sugerencia-loading">Buscando…</li>
          )}
          {sugerencias.map((item) => (
            <li
              key={item.place_id}
              className="frd-gps-sugerencia-item"
              onMouseDown={() => seleccionarSugerencia(item)}
            >
              <span className="frd-gps-sug-icon">📌</span>
              <span className="frd-gps-sug-text">{item.display_name}</span>
            </li>
          ))}
        </ul>
      )}

      {/* ── Botón para mostrar/ocultar mapa (removido, ahora está arriba) ── */}

      {/* ── Mapa Leaflet ── */}
      {mostrarMapa && (
        <div className="frd-gps-map-container">
          <p className="frd-gps-map-hint">
            Hacé clic en el mapa o arrastrá el pin para ajustar la posición exacta.
          </p>
          <MapContainer
            center={posicion ? [posicion.lat, posicion.lng] : [9.9281, -84.0907]}
            zoom={posicion ? 15 : 10}
            className="frd-gps-map"
            scrollWheelZoom={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapController center={mapCenter ? [mapCenter.lat, mapCenter.lng] : (posicion ? [posicion.lat, posicion.lng] : [9.9281, -84.0907])} />
            <MapClickHandler onMapClick={handleMapClick} />
            {posicion && (
              <Marker
                position={[posicion.lat, posicion.lng]}
                draggable
                eventHandlers={{ dragend: handleMarkerDrag }}
              />
            )}
          </MapContainer>
        </div>
      )}
    </div>
  );
}

// ─── Componente principal ────────────────────────────────────────────────────
export default function FormularioReservaADomicilio({ onCerrar }) {
  const [formDomicilio, setFormDomicilio] = useState({
    nombre: "",
    correo: "",
    telefono: "",
    fecha: "",
    horaEvento: "",
    horaServicio: "",
    tipoEvento: "",
    noPersonas: "",
    tipoMenu: "",
    ubicacionGps: "",
    fotoLugar: null,
    fotoLugarPreview: "",
    fotoLugarNombre: "",
    direccion: "",
    especificaciones: "",
    estado: "Pendiente",
  });

  const [isOpenHoraEvento, setIsOpenHoraEvento] = useState(false);
  const [isOpenHoraServicio, setIsOpenHoraServicio] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormDomicilio((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      Swal.fire({ icon: "warning", title: "Archivo no válido", text: "Por favor seleccioná una imagen (JPG, PNG, WEBP, etc.)", background: "#171212", color: "#fff", confirmButtonColor: "#8b0000" });
      return;
    }
    const MAX_SIZE_MB = 5;
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      Swal.fire({ icon: "warning", title: "Imagen muy grande", text: `El archivo no debe superar los ${MAX_SIZE_MB} MB.`, background: "#171212", color: "#fff", confirmButtonColor: "#8b0000" });
      return;
    }
    const previewUrl = URL.createObjectURL(file);
    setFormDomicilio((prev) => ({ ...prev, fotoLugar: file, fotoLugarPreview: previewUrl, fotoLugarNombre: file.name }));
  };

  const handleRemoverFoto = () => {
    if (formDomicilio.fotoLugarPreview) URL.revokeObjectURL(formDomicilio.fotoLugarPreview);
    setFormDomicilio((prev) => ({ ...prev, fotoLugar: null, fotoLugarPreview: "", fotoLugarNombre: "" }));
    const inputFile = document.getElementById("fotoLugarInput");
    if (inputFile) inputFile.value = "";
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formDomicilio.nombre.trim()) newErrors.nombre = "Campo requerido";
    if (!formDomicilio.correo.trim()) {
      newErrors.correo = "Campo requerido";
    } else if (!formDomicilio.correo.includes("@") || !/^[^@]+@[^@]+\.[^@]+$/.test(formDomicilio.correo)) {
      newErrors.correo = "Ingresa un correo válido (ejemplo@dominio.com)";
    }
    if (!formDomicilio.telefono.trim()) newErrors.telefono = "Campo requerido";
    if (!formDomicilio.fecha) newErrors.fecha = "Campo requerido";
    if (!formDomicilio.horaEvento) newErrors.horaEvento = "Campo requerido";
    if (!formDomicilio.horaServicio) newErrors.horaServicio = "Campo requerido";
    if (!formDomicilio.tipoEvento.trim()) newErrors.tipoEvento = "Campo requerido";
    if (!formDomicilio.noPersonas) newErrors.noPersonas = "Campo requerido";
    if (!formDomicilio.tipoMenu) newErrors.tipoMenu = "Campo requerido";
    if (!formDomicilio.direccion.trim()) newErrors.direccion = "Campo requerido";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitReservaADomicilio = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      // Pasamos formDomicilio completo, postReservaADomicilio se encargará de hacer el FormData si trae fotoLugar
      await postReservaADomicilio(formDomicilio);

      if (formDomicilio.fotoLugarPreview) URL.revokeObjectURL(formDomicilio.fotoLugarPreview);
      Swal.fire({ icon: "success", title: "Solicitud enviada", text: "Pronto te contactaremos", background: "#171212", color: "#fff", confirmButtonColor: "#8b0000" });
      onCerrar && onCerrar();
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({ icon: "error", title: "Error al enviar la solicitud", text: "Por favor intenta de nuevo.", background: "#171212", color: "#fff", confirmButtonColor: "#8b0000" });
    }
  };

  return (
    <form className="frd-wrapper" onSubmit={handleSubmitReservaADomicilio}>
      <div className="frd-header">
        <h2 className="frd-titulo">Información de Cliente</h2>

        {/* Fila 1 */}
        <div className="frd-grid-3">
          <div className="frd-input-group">
            <input className={`frd-input ${errors.nombre ? "frd-input-error" : ""}`} type="text" name="nombre" placeholder="Nombre Completo" value={formDomicilio.nombre} onChange={handleChange} />
            {errors.nombre && <span className="frd-error-text">{errors.nombre}</span>}
          </div>
          <div className="frd-input-group">
            <input className={`frd-input ${errors.correo ? "frd-input-error" : ""}`} type="email" name="correo" placeholder="Correo Electrónico" value={formDomicilio.correo} onChange={handleChange} required />
            {errors.correo && <span className="frd-error-text">{errors.correo}</span>}
          </div>
          <div className="frd-input-group">
            <input className={`frd-input ${errors.telefono ? "frd-input-error" : ""}`} type="tel" name="telefono" placeholder="Teléfono" value={formDomicilio.telefono} onChange={(e) => { e.target.setCustomValidity(""); handleChange(e); }} onInvalid={(e) => e.target.setCustomValidity("El teléfono debe tener exactamente 8 números")} minLength={8} maxLength={8} pattern="[0-9]{8}" />
            {errors.telefono && <span className="frd-error-text">{errors.telefono}</span>}
          </div>
        </div>

        {/* Fila 2 — fechas/horas */}
        <div className="frd-grid-3">
          {/* Calendario */}
          <div className="frd-input-group filter-date-wrapper">
            <input
              className={`frd-input frd-cursor-pointer ${errors.fecha ? "frd-input-error" : ""}`}
              type="text"
              name="fecha"
              placeholder="Fecha"
              value={formatearFecha(formDomicilio.fecha)}
              readOnly
              onClick={() => setShowCalendar(!showCalendar)}
            />
            <span
              className="frd-calendar-icon filter-calendar-icon"
              onClick={() => setShowCalendar(!showCalendar)}
            >
              <img src={calendarioIcon} alt="Calendario" className="frd-calendar-img" />
            </span>
            {errors.fecha && (
              <span className="frd-error-text filter-error-text">{errors.fecha}</span>
            )}
            {showCalendar && (
              <div className="frd-calendar-popup filter-calendar-popup">
                <CalendarioReservasADomicilio
                  modo="usuario"
                  fechaSeleccionada={formDomicilio.fecha}
                  onFechaSeleccionada={(iso) => {
                    setFormDomicilio((prev) => ({ ...prev, fecha: iso }));
                    setShowCalendar(false);
                  }}
                />
                <div
                  className="filter-calendar-backdrop"
                  onClick={() => setShowCalendar(false)}
                />
              </div>
            )}
          </div>

          {/* Hora evento */}
          <div className="frd-input-group frd-relative">
            <div
              className={`frd-input frd-select frd-custom-select ${!formDomicilio.horaEvento ? "frd-select-placeholder" : ""} ${errors.horaEvento ? "frd-input-error" : ""}`}
              onClick={() => setIsOpenHoraEvento(!isOpenHoraEvento)}
            >
              {formDomicilio.horaEvento || "Hora de Evento"}
            </div>
            {errors.horaEvento && <span className="frd-error-text">{errors.horaEvento}</span>}
            {isOpenHoraEvento && (
              <>
                <div className="frd-backdrop" onClick={() => setIsOpenHoraEvento(false)} />
                <div className="frd-dropdown-options">
                  {horasEvento.map((h) => (
                    <div key={h} className={`frd-dropdown-item ${formDomicilio.horaEvento === h ? "selected" : ""}`}
                      onClick={() => { setFormDomicilio((prev) => ({ ...prev, horaEvento: h })); setErrors((prev) => ({ ...prev, horaEvento: "" })); setIsOpenHoraEvento(false); }}>
                      {h}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Hora servicio */}
          <div className="frd-input-group frd-relative">
            <div
              className={`frd-input frd-select frd-custom-select ${!formDomicilio.horaServicio ? "frd-select-placeholder" : ""} ${errors.horaServicio ? "frd-input-error" : ""}`}
              onClick={() => setIsOpenHoraServicio(!isOpenHoraServicio)}
            >
              {formDomicilio.horaServicio || "Hora de Servicio"}
            </div>
            {errors.horaServicio && <span className="frd-error-text">{errors.horaServicio}</span>}
            {isOpenHoraServicio && (
              <>
                <div className="frd-backdrop" onClick={() => setIsOpenHoraServicio(false)} />
                <div className="frd-dropdown-options">
                  {horasServicio.map((h) => (
                    <div key={h} className={`frd-dropdown-item ${formDomicilio.horaServicio === h ? "selected" : ""}`}
                      onClick={() => { setFormDomicilio((prev) => ({ ...prev, horaServicio: h })); setErrors((prev) => ({ ...prev, horaServicio: "" })); setIsOpenHoraServicio(false); }}>
                      {h}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Fila 3 */}
        <div className="frd-grid-3">
          <div className="frd-input-group">
            <select className={`frr-input frr-select ${!formDomicilio.tipoEvento ? 'frr-select-placeholder' : ''} ${errors.tipoEvento ? 'frr-input-error' : ''}`} name="tipoEvento" value={formDomicilio.tipoEvento} onChange={handleChange}>
              <option value="">Tipo de evento</option>
              {tiposEventoADomicilio.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            {errors.tipoEvento && <span className="frd-error-text">{errors.tipoEvento}</span>}
          </div>
          <div className="frd-input-group">
            <input className={`frd-input ${errors.noPersonas ? "frd-input-error" : ""}`} type="number" name="noPersonas" placeholder="No. Personas" min="1" value={formDomicilio.noPersonas} onChange={handleChange} />
            {errors.noPersonas && <span className="frd-error-text">{errors.noPersonas}</span>}
          </div>
          <div className="frd-input-group">
            <select className={`frd-input frd-select ${!formDomicilio.tipoMenu ? "frd-select-placeholder" : ""} ${errors.tipoMenu ? "frd-input-error" : ""}`} name="tipoMenu" value={formDomicilio.tipoMenu} onChange={handleChange}>
              <option value="">Tipo de Menú</option>
              {tiposMenu.map((m) => (<option key={m} value={m}>{m}</option>))}
            </select>
            {errors.tipoMenu && <span className="frd-error-text">{errors.tipoMenu}</span>}
          </div>
        </div>

        {/* Fila 4 */}
        <div className="frd-grid-2">
          {/* ── CAMPO MODIFICADO: Ubicación GPS con mapa ── */}
          <div className="frd-input-group frd-gps-field">
            <UbicacionGpsPicker
              value={formDomicilio.ubicacionGps}
              onChange={(val) => setFormDomicilio((prev) => ({ ...prev, ubicacionGps: val }))}
            />
          </div>

          {/* Foto del área de trabajo */}
          <div className="frd-input-group">
            <input id="fotoLugarInput" type="file" accept="image/*" className="frd-d-none" onChange={handleFotoChange} />
            {!formDomicilio.fotoLugarPreview ? (
              <label htmlFor="fotoLugarInput" className="frd-input frd-foto-label" title="Seleccionar foto del área de trabajo">
                <span className="frd-foto-icon"><img src={fotoAreaIcon} alt="Foto" className="frd-foto-icon-img" /></span>
                <span className="frd-foto-placeholder">Foto Área de Trabajo (opc.)</span>
              </label>
            ) : (
              <div className="frd-foto-preview-wrapper">
                <img src={formDomicilio.fotoLugarPreview} alt="Vista previa" className="frd-foto-preview" />
                <div className="frd-foto-preview-info">
                  <span className="frd-foto-nombre" title={formDomicilio.fotoLugarNombre}>{formDomicilio.fotoLugarNombre}</span>
                  <div className="frd-foto-acciones">
                    <label htmlFor="fotoLugarInput" className="frd-foto-btn-cambiar" title="Cambiar imagen">Cambiar</label>
                    <button type="button" className="frd-foto-btn-eliminar" onClick={handleRemoverFoto} title="Eliminar imagen">✕</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Dirección completa */}
        <div className="frd-input-group">
          <input className={`frd-input ${errors.direccion ? "frd-input-error" : ""}`} type="text" name="direccion" placeholder="Dirección completa" value={formDomicilio.direccion} onChange={handleChange} />
          {errors.direccion && <span className="frd-error-text">{errors.direccion}</span>}
        </div>

        {/* Especificaciones */}
        <textarea className="frd-input frd-textarea" name="especificaciones" placeholder="Especifique aquí cualquier información necesaria para garantizar su experiencia única" value={formDomicilio.especificaciones} onChange={handleChange} rows={3} />

        <div className="frd-enviar-wrapper">
          <button type="submit" className="frd-btn-enviar">Enviar</button>
        </div>
      </div>
    </form>
  );
}
