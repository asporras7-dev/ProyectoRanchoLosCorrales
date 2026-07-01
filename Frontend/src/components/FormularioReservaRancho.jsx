import { useState, useEffect } from "react";
import "../styles/FormularioReservaRancho.css";
import Calendario from "../components/Calendario";
import calendarioIcon from "../img/Calendario.jpeg";
import Swal from "sweetalert2";
import {
  postReservaRancho,
  getCategorias,
  getServiciosAdicionales,
  getMenus,
  getDecoracionesTematicas
} from "../services/services";

// Mapeo de nombre de decoración → archivo PDF en /pdfs/
const pdfMap = {
  "Paquete Básico":       "Img_Paquete_Basico.jpeg",
  "Paquete Deluxe":       "Img_Paquete_Deluxe.jpeg",
  "Fiesta de fin de año": "Img_Fiesta_fin_de_annio.jpeg",
  "Paquete Neón":         "Img_Fiesta_Neon.jpeg",
  "Fiesta Vaquera":       "Img_Fiesta_Vaquera.jpeg",
};

const formatearFecha = (isoString) => {
  if (!isoString) return "";
  const partes = isoString.split("-");
  if (partes.length !== 3) return isoString;
  return `${partes[2]}/${partes[1]}/${partes[0]}`;
};

const tiposEvento = [
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

const horasEvento = [
  "12:00 AM","1:00 AM","2:00 AM","3:00 AM","4:00 AM","5:00 AM",
  "6:00 AM","7:00 AM","8:00 AM","9:00 AM","10:00 AM","11:00 AM",
  "12:00 PM","1:00 PM","2:00 PM","3:00 PM","4:00 PM","5:00 PM",
  "6:00 PM","7:00 PM","8:00 PM","9:00 PM","10:00 PM","11:00 PM",
];

export default function FormularioReservaRancho({ onCerrar }) {
  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    telefono: "",
    fecha: "",
    tipoEvento: "",
    noPersonas: "",
    horaEvento: "",
    informacion: "",
  });

  const [categorias, setCategorias] = useState([]);
  const [serviciosAdicionales, setServiciosAdicionales] = useState([]);
  const [menus, setMenus] = useState([]);
  const [decoraciones, setDecoraciones] = useState([]);

  const [mostrarAdicionales, setMostrarAdicionales] = useState(true);
  const [serviciosSeleccionadosIds, setServiciosSeleccionadosIds] = useState([]);
  const [menuSeleccionadoId, setMenuSeleccionadoId] = useState("");
  const [decoracionSeleccionadaId, setDecoracionSeleccionadaId] = useState("");
  const [isOpenHoras, setIsOpenHoras] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [errors, setErrors] = useState({});

  // Estado del modal PDF
  const [pdfModal, setPdfModal] = useState({ open: false, url: "", nombre: "" });

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [cats, servicios, menusData, decosData] = await Promise.all([
          getCategorias(),
          getServiciosAdicionales(),
          getMenus(),
          getDecoracionesTematicas()
        ]);
        setCategorias(cats || []);
        setServiciosAdicionales(servicios || []);
        setMenus(menusData || []);
        setDecoraciones(decosData || []);
      } catch (error) {
        console.error("Error cargando datos iniciales:", error);
      }
    };
    cargarDatos();
  }, []);

  const abrirPdf = (deco) => {
    const archivo = pdfMap[deco.nombre_Deco];
    if (!archivo) return;
    setPdfModal({ open: true, url: `${import.meta.env.BASE_URL}imgDecoracionesTematicas/${archivo}`, nombre: deco.nombre_Deco });
  };

  const cerrarPdf = () => setPdfModal({ open: false, url: "", nombre: "" });

  const seleccionarDesdeModal = (deco) => {
    setDecoracionSeleccionadaId(String(deco.idDeco_Tem));
    cerrarPdf();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleMenuChange = (e) => {
    setMenuSeleccionadoId(e.target.value);
    if (errors.menuSeleccionadoId) setErrors((prev) => ({ ...prev, menuSeleccionadoId: "" }));
  };

  const toggleServicio = (idServicio) => {
    setServiciosSeleccionadosIds((prev) =>
      prev.includes(idServicio)
        ? prev.filter((id) => id !== idServicio)
        : [...prev, idServicio]
    );
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.nombre.trim()) newErrors.nombre = "Campo requerido";
    if (!form.correo.trim()) {
      newErrors.correo = "Campo requerido";
    } else if (!form.correo.includes("@") || !/^[^@]+@[^@]+\.[^@]+$/.test(form.correo)) {
      newErrors.correo = "Ingresa un correo válido (ejemplo@dominio.com)";
    }
    if (!form.telefono.trim()) newErrors.telefono = "Campo requerido";
    if (!form.fecha) newErrors.fecha = "Campo requerido";
    if (!form.tipoEvento) newErrors.tipoEvento = "Campo requerido";
    if (!form.noPersonas) newErrors.noPersonas = "Campo requerido";
    if (!form.horaEvento) newErrors.horaEvento = "Campo requerido";
    if (!menuSeleccionadoId) newErrors.menuSeleccionadoId = "Campo requerido";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await postReservaRancho({
        nombre: form.nombre,
        correo: form.correo,
        telefono: form.telefono,
        fecha: form.fecha,
        tipoEvento: form.tipoEvento,
        noPersonas: form.noPersonas,
        horaEvento: form.horaEvento,
        informacion: form.informacion,
        Menu_idMenu: menuSeleccionadoId ? parseInt(menuSeleccionadoId) : 1,
        decoracionTematicaId: decoracionSeleccionadaId ? parseInt(decoracionSeleccionadaId) : null,
        serviciosAdicionalesIds: serviciosSeleccionadosIds,
        estado: "Pendiente"
      });

      Swal.fire({
        icon: "success",
        title: "Reserva enviada",
        text: "Gracias por reservar en el rancho.",
        background: "#171212",
        color: "#fff",
        confirmButtonColor: "#8b0000",
      });
      onCerrar && onCerrar();
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Error al enviar la reserva",
        text: "Por favor intenta de nuevo.",
        background: "#171212",
        color: "#fff",
        confirmButtonColor: "#8b0000",
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleBookingSubmit(e);
  };

  // Decoración actualmente en el modal (para el botón Seleccionar)
  const decoEnModal = decoraciones.find((d) => d.nombre_Deco === pdfModal.nombre);

  return (
    <>
      <form onSubmit={handleSubmit} className="frr-form">
        <div className="frr-wrapper">

          {/* ── Sección superior: formulario ── */}
          <div className="frr-header">
            <h2 className="frr-titulo">Completa el formulario</h2>

            <div className="frr-grid-3">
              <div className="frr-input-group">
                <input className={`frr-input ${errors.nombre ? 'frr-input-error' : ''}`} type="text" name="nombre" placeholder="Nombre Completo" value={form.nombre} onChange={handleChange} />
                {errors.nombre && <span className="frr-error-text">{errors.nombre}</span>}
              </div>
              <div className="frr-input-group">
                <input className={`frr-input ${errors.correo ? 'frr-input-error' : ''}`} type="email" name="correo" placeholder="Correo Electrónico" value={form.correo} onChange={handleChange} required />
                {errors.correo && <span className="frr-error-text">{errors.correo}</span>}
              </div>
              <div className="frr-input-group">
                <input className={`frr-input ${errors.telefono ? 'frr-input-error' : ''}`} type="tel" name="telefono" placeholder="Teléfono" value={form.telefono} onChange={(e) => { e.target.setCustomValidity(""); handleChange(e); }} onInvalid={(e) => e.target.setCustomValidity("El teléfono debe tener exactamente 8 números")} minLength={8} maxLength={8} pattern="[0-9]{8}" required />
                {errors.telefono && <span className="frr-error-text">{errors.telefono}</span>}
              </div>
            </div>

            <div className="frr-input-group filter-date-wrapper">
              <input
                className={`frr-input frr-cursor-pointer ${errors.fecha ? "frr-input-error" : ""}`}
                type="text"
                name="fecha"
                placeholder="Fecha"
                value={formatearFecha(form.fecha)}
                readOnly
                onClick={() => setShowCalendar(!showCalendar)}
              />
              <span className="frr-calendar-icon filter-calendar-icon" onClick={() => setShowCalendar(!showCalendar)}>
                <img src={calendarioIcon} alt="Calendario" className="frr-calendar-img" />
              </span>
              {errors.fecha && <span className="frr-error-text filter-error-text">{errors.fecha}</span>}
              {showCalendar && (
                <div className="frr-calendar-popup filter-calendar-popup">
                  <Calendario
                    modo="usuario"
                    fechaSeleccionada={form.fecha}
                    onFechaSeleccionada={(iso) => {
                      setForm((prev) => ({ ...prev, fecha: iso }));
                      setShowCalendar(false);
                    }}
                  />
                  <div className="frr-backdrop filter-calendar-backdrop" onClick={() => setShowCalendar(false)} />
                </div>
              )}
            </div>

            <div className="frr-grid-2">
              <div className="frr-input-group">
                <select className={`frr-input frr-select ${!form.tipoEvento ? 'frr-select-placeholder' : ''} ${errors.tipoEvento ? 'frr-input-error' : ''}`} name="tipoEvento" value={form.tipoEvento} onChange={handleChange}>
                  <option value="">Tipo de evento</option>
                  {tiposEvento.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
                {errors.tipoEvento && <span className="frr-error-text">{errors.tipoEvento}</span>}
              </div>
              <div className="frr-input-group">
                <input className={`frr-input ${errors.noPersonas ? 'frr-input-error' : ''}`} type="number" name="noPersonas" placeholder="No. Personas" min="1" value={form.noPersonas} onChange={handleChange} />
                {errors.noPersonas && <span className="frr-error-text">{errors.noPersonas}</span>}
              </div>
            </div>

            <div className="frd-grid-2">
              <div className="frr-input-group filter-date-wrapper">
                <div
                  className={`frr-input frr-select frr-custom-select ${!form.horaEvento ? 'frr-select-placeholder' : ''} ${errors.horaEvento ? 'frr-input-error' : ''}`}
                  onClick={() => setIsOpenHoras(!isOpenHoras)}
                >
                  {form.horaEvento || "Hora de servicio"}
                </div>
                {errors.horaEvento && <span className="frr-error-text">{errors.horaEvento}</span>}
                {isOpenHoras && (
                  <>
                    <div className="frr-backdrop" onClick={() => setIsOpenHoras(false)} />
                    <div className="frr-dropdown-options">
                      {horasEvento.map((h) => (
                        <div
                          key={h}
                          className={`frr-dropdown-item ${form.horaEvento === h ? 'selected' : ''}`}
                          onClick={() => {
                            setForm((prev) => ({ ...prev, horaEvento: h }));
                            setErrors((prev) => ({ ...prev, horaEvento: "" }));
                            setIsOpenHoras(false);
                          }}
                        >
                          {h}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
              <div className="frr-input-group">
                <select
                  className={`frr-input frr-select ${!menuSeleccionadoId ? 'frr-select-placeholder' : ''} ${errors.menuSeleccionadoId ? 'frr-input-error' : ''}`}
                  value={menuSeleccionadoId}
                  onChange={handleMenuChange}
                >
                  <option value="">Tipo de Menú</option>
                  {menus.map((m) => (
                    <option key={m.idMenu} value={m.idMenu}>{m.nombre_Menu}</option>
                  ))}
                </select>
                {errors.menuSeleccionadoId && <span className="frr-error-text">{errors.menuSeleccionadoId}</span>}
              </div>
            </div>

            <textarea
              className="frr-input frr-textarea"
              name="informacion"
              placeholder="Especifique aquí cualquier información necesaria para garantizar una experiencia única"
              value={form.informacion}
              onChange={handleChange}
              rows={3}
            />
          </div>

          {/* ── Sección "Este servicio incluye" ── */}
          <div className="frr-incluye">
            <h3 className="frr-incluye-titulo">Que te gustaría incluir :</h3>
          </div>

          {/* ── Panel de servicios adicionales ── */}
          {mostrarAdicionales && (
            <div className="frr-adicionales">
              <div className="frr-categorias-grid">
                {categorias.map((categoria) => {
                  const serviciosDeCategoria = serviciosAdicionales.filter(
                    (s) => s.categoriaId === categoria.idCategoria
                  );
                  return (
                    <div key={categoria.idCategoria} className="frr-categoria">
                      <h4 className="frr-categoria-titulo">{categoria.nombre_Cat}</h4>
                      <div className="frr-chips">
                        {serviciosDeCategoria.map((servicio) => (
                          <button
                            key={servicio.idservicio_Adicional}
                            type="button"
                            className={`frr-chip ${serviciosSeleccionadosIds.includes(servicio.idservicio_Adicional) ? "frr-chip--activo" : ""}`}
                            onClick={() => toggleServicio(servicio.idservicio_Adicional)}
                          >
                            {servicio.nombre}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* ── Decoración temática ── */}
              <div className="frr-decoracion-tematica">
                <h4 className="frr-decoracion-titulo">Decoración temática</h4>
                <p className="frr-decoracion-sub">Elija su estilo de decoración</p>
                <div className="frr-paquetes">
                  {decoraciones.map((deco) => {
                    const tienePdf = !!pdfMap[deco.nombre_Deco];
                    const estaSeleccionada = parseInt(decoracionSeleccionadaId) === deco.idDeco_Tem;
                    return (
                      <div key={deco.idDeco_Tem} className="frr-paquete-wrapper">
                        <button
                          type="button"
                          className={`frr-paquete-btn ${estaSeleccionada ? "frr-paquete-btn--activo" : ""}`}
                          onClick={() => {
                            if (estaSeleccionada) {
                              // Si ya está seleccionada, al darle click se deselecciona
                              setDecoracionSeleccionadaId("");
                            } else if (tienePdf) {
                              // Si no está seleccionada y tiene PDF, abre el modal
                              abrirPdf(deco);
                            } else {
                              // Si no tiene PDF, se selecciona directamente
                              setDecoracionSeleccionadaId(String(deco.idDeco_Tem));
                            }
                          }}
                        >
                          {deco.nombre_Deco}
                        </button>

                        {deco.desc_Deco && (
                          <div className="frr-paquete-tooltip">{deco.desc_Deco}</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="frr-enviar-wrapper">
                <button type="submit" className="frr-btn-enviar">Enviar</button>
              </div>
            </div>
          )}
        </div>
      </form>

      {/* ── Modal de vista previa PDF ── */}
      {pdfModal.open && (
        <div className="frr-pdf-overlay" onClick={cerrarPdf}>
          <div className="frr-pdf-modal" onClick={(e) => e.stopPropagation()}>

            {/* Header del modal */}
            <div className="frr-pdf-modal-header">
              <div className= "frr-pdf-modal-title-box">
                <h3 className="frr-pdf-modal-titulo">{pdfModal.nombre}</h3>
                <span className="frr-pdf-modal-label">Vista previa del documento</span>
              </div>
              <button type="button" className="frr-pdf-modal-cerrar" onClick={cerrarPdf}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            {/* Vista previa del PDF */}
            <div className="frr-pdf-modal-body">
              <embed
                src={pdfModal.url}
                type="application/pdf"
                width="100%"
                height="100%"
              />
            </div>

            {/* Botones de acción */}
            <div className="frr-pdf-modal-footer">
              <button
                type="button"
                className="frr-pdf-btn-seleccionar"
                onClick={() => decoEnModal && seleccionarDesdeModal(decoEnModal)}
              >
                ✓ Seleccionar
              </button>
              <a
                href={pdfModal.url}
                type="button"
                download
                className="frr-pdf-btn-descargar"
              >
                ↓ Descargar
              </a>
              <button
                type="button"
                className="frr-pdf-btn-cancelar"
                onClick={cerrarPdf}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
