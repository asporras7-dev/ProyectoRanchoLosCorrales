import React from "react";
import "../styles/PanelAdministrador.css";
import CalendarioFiltro from "../components/CalendarioFiltro";
import { getReservasADomicilio, deleteReservaADomicilio, patchReservaADomicilio } from "../services/servicesReservasADomicilio";
import { exportarTabla, mapearReservasDomicilio } from "../utils/exportarReservas";
import Swal from "sweetalert2";
import {
  FaCalendarAlt,
  FaRegCalendarAlt,
  FaCheck,
  FaTimes,
  FaExclamationCircle,
  FaTicketAlt,
  FaEnvelope,
  FaCalendarCheck,
  FaUser,
  FaUsers,
  FaUtensils,
  FaPhone,
  FaClock,
  FaListUl,
  FaFileExcel
} from "react-icons/fa";
import { useState, useEffect, useRef } from "react";

const PanelReservasADomicilio = ({ onVisualizarCalendario }) => {

  const [reservas, setReservas] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState('Todos');
  const [filtroRango, setFiltroRango] = useState({ inicio: null, fin: null });
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [showCalendarFilter, setShowCalendarFilter] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [fotoAmpliada, setFotoAmpliada] = useState(null);
  const [reservaSeleccionada, setReservaSeleccionada] = useState(null);
  const exportMenuRef = useRef(null);


  const fetchReservas = async () => {
    try {
      const data = await getReservasADomicilio();
      setReservas(data);
    } catch (error) {
      console.error('Error al obtener las reservas a domicilio', error);
    }
  };

  const handleRemoveReserva = async (id) => {
    try {
      await deleteReservaADomicilio(id);
      fetchReservas();
    } catch (error) {
      console.error('Error al eliminar reserva', error);
    }
  };

  const handlePatchReserva = async (id, data) => {
    try {
      await patchReservaADomicilio(id, data);
      fetchReservas();
    } catch (error) {
      console.error('Error al actualizar reserva', error);
    }
  }

  useEffect(() => {
    fetchReservas();
  }, []);

  const handleExportar = (formato) => {
    if (reservasFiltradas.length === 0) {
      setShowExportMenu(false);
      Swal.fire({
        icon: 'error',
        title: 'Sin registros',
        text: 'Para exportar la información se necesita que haya al menos una reserva en los resultados actuales.',
        background: '#171212',
        color: '#fff',
        confirmButtonColor: '#8b0000',
      });
      return;
    }
    const sufijo = filtroRango.inicio && filtroRango.fin
      ? filtroRango.inicio === filtroRango.fin
        ? filtroRango.inicio
        : `${filtroRango.inicio} - ${filtroRango.fin}`
      : 'todos';
    const filas = mapearReservasDomicilio(reservasFiltradas);
    exportarTabla(filas, `Reservas_domicilio_${sufijo}`, formato);
    setShowExportMenu(false);
  };

  useEffect(() => {
    if (!showExportMenu) return;
    const handleClickOutside = (e) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(e.target)) {
        setShowExportMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showExportMenu]);

  const reservasPendientes = reservas.filter(r => r.estado === 'Pendiente').length;
  const reservasAprobadas = reservas.filter(r => r.estado === 'Aprobada').length;
  const reservasRechazadas = reservas.filter(r => r.estado === 'Rechazada').length;

  const reservasFiltradas = reservas
    .filter(reserva => {
      const matchEstado = filtroEstado === 'Todos' || reserva.estado === filtroEstado;
      const matchFecha = (filtroRango.inicio && filtroRango.fin)
        ? (reserva.fecha_Evento >= filtroRango.inicio && reserva.fecha_Evento <= filtroRango.fin)
        : true;
      return matchEstado && matchFecha;
    })
    .sort((a, b) => b.icReserva_A_Domicilio - a.icReserva_A_Domicilio);

  const totalPages = Math.ceil(reservasFiltradas.length / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentReservas = reservasFiltradas.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <>
        <main className="dashboard">
          <div className="dashboard-header">
            <div className="dashboard-header-text">
              <h1>Reservas a Domicilio</h1>
              <p>Gestiona todas las reservas a domicilio</p>
            </div>

            <button
              type="button"
              className="calendar-btn"
              onClick={onVisualizarCalendario}
            >
              <span>Visualizar calendario</span>
              <FaRegCalendarAlt className="calendar-btn-icon" />
            </button>
          </div>

          {/* STATS */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-card-icon stat-card-icon-blue">
                <FaCalendarAlt />
              </div>
              <div className="stat-card-body">
                <h3>Total reservas</h3>
                <h2>{reservas.length}</h2>
                <span>Todas las solicitudes</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-card-icon stat-card-icon-yellow">
                <FaCalendarAlt />
              </div>
              <div className="stat-card-body">
                <h3>Pendientes</h3>
                <h2>{reservasPendientes}</h2>
                <span>Por aprobar</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-card-icon stat-card-icon-green">
                <FaCheck />
              </div>
              <div className="stat-card-body">
                <h3>Aprobadas</h3>
                <h2>{reservasAprobadas}</h2>
                <span>Confirmadas</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-card-icon stat-card-icon-red">
                <FaTimes />
              </div>
              <div className="stat-card-body">
                <h3>Rechazadas</h3>
                <h2>{reservasRechazadas}</h2>
                <span>No aprobadas</span>
              </div>
            </div>
          </div>

          {/* TABLE */}
          <div className="table-container">
            <div className="table-header">
              <h2>Todas las solicitudes</h2>

              <div className="filters">
                <select 
                  value={filtroEstado} 
                  onChange={(e) => {
                    setFiltroEstado(e.target.value);
                    setCurrentPage(1);
                  }}
                  className={`filter-select ${filtroEstado === 'Todos' ? 'todos' : filtroEstado.toLowerCase()}`}
                >
                  <option value="Todos">Todos los estados</option>
                  <option value="Pendiente">Pendientes</option>
                  <option value="Aprobada">Aprobadas</option>
                  <option value="Rechazada">Rechazadas</option>
                </select>

                <div className="filter-date-wrapper">
                  <input 
                    type="text" 
                    placeholder="Rango de fechas"
                    value={
                      filtroRango.inicio && filtroRango.fin
                        ? filtroRango.inicio === filtroRango.fin
                          ? new Date(filtroRango.inicio + 'T12:00:00Z').toLocaleDateString('es-CR', { timeZone: 'UTC' })
                          : `${new Date(filtroRango.inicio + 'T12:00:00Z').toLocaleDateString('es-CR', { timeZone: 'UTC' })} – ${new Date(filtroRango.fin + 'T12:00:00Z').toLocaleDateString('es-CR', { timeZone: 'UTC' })}`
                        : ""
                    }
                    readOnly
                    onClick={() => setShowCalendarFilter(!showCalendarFilter)}
                    className="filter-date-input"
                  />
                  {showCalendarFilter && (
                    <div className="filter-calendar-popup">
                      <CalendarioFiltro
                        fechaInicio={filtroRango.inicio}
                        fechaFin={filtroRango.fin}
                        onRangoSeleccionado={(rango) => {
                          setFiltroRango(rango ? { inicio: rango.inicio, fin: rango.fin } : { inicio: null, fin: null });
                          if (rango) setShowCalendarFilter(false);
                          setCurrentPage(1);
                        }}
                      />
                      <div
                        onClick={() => setShowCalendarFilter(false)}
                        className="filter-calendar-backdrop"
                      />
                    </div>
                  )}
                </div>

                <select
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="filter-select"
                  >
                    <option value={10}>10 registros</option>
                    <option value={25}>25 registros</option>
                    <option value={50}>50 registros</option>
                    <option value={100}>100 registros</option>
                  </select>

                  {/* BOTÓN EXPORTAR */}
                  <div className="export-wrapper" ref={exportMenuRef}>
                    <button
                      className="btn-exportar"
                      onClick={() => setShowExportMenu((prev) => !prev)}
                      title="Exportar registros filtrados"
                    >
                      <FaFileExcel />
                      Exportar ({reservasFiltradas.length})
                    </button>
                    {showExportMenu && (
                      <div className="export-menu">
                        <button onClick={() => handleExportar('csv')}>
                          <span className="export-menu-icon">📄</span> Exportar CSV
                        </button>
                        <button onClick={() => handleExportar('xlsx')}>
                          <span className="export-menu-icon">📊</span> Exportar Excel (.xlsx)
                        </button>
                      </div>
                    )}
                  </div>
                </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Cliente</th>
                  <th>Correo</th>
                  <th>Teléfono</th>
                  <th>Fecha</th>
                  <th>Hora Evento</th>
                  <th>Hora Servicio</th>
                  <th>Número de Personas</th>
                  <th>Detalles</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {currentReservas.length > 0 ? (
                  currentReservas.map(reserva => (
                    <tr key={reserva.icReserva_A_Domicilio}>
                      <td>{reserva.icReserva_A_Domicilio}</td>
                      <td>{reserva.nombre_Cliente_Domicilio}</td>
                      <td>{reserva.correo_Cliente_Domicilio}</td>
                      <td>{reserva.tel_Cliente_Dom}</td>
                      <td>{reserva.fecha_Evento}</td>
                      <td>{reserva.hora_Evento}</td>
                      <td>{reserva.hora_Servicio}</td>
                      <td>{reserva.num_Personas}</td>
                      <td>
                        <button 
                          className="btn-detalles" 
                          onClick={() => setReservaSeleccionada(reserva)}
                        >
                          Detalles
                        </button>
                      </td>
                      <td>
                        <span className={`status ${reserva.estado ? reserva.estado.toLowerCase() : 'pendiente'}`}>
                          {reserva.estado || 'Pendiente'}
                        </span>
                      </td>
                      <td className="actions">
                        <button 
                          className={`approve ${reserva.estado === 'Aprobada' ? 'active' : ''}`} 
                          onClick={() => handlePatchReserva(reserva.icReserva_A_Domicilio, { estado: reserva.estado === 'Aprobada' ? 'Pendiente' : 'Aprobada' })}
                          title={reserva.estado === 'Aprobada' ? 'Marcar como Pendiente' : 'Aprobar'}
                        >
                          {reserva.estado === 'Aprobada' ? <FaExclamationCircle /> : <FaCheck />}
                        </button>

                        <button 
                          className={`reject ${reserva.estado === 'Rechazada' ? 'active' : ''}`} 
                          onClick={() => handlePatchReserva(reserva.icReserva_A_Domicilio, { estado: reserva.estado === 'Rechazada' ? 'Pendiente' : 'Rechazada' })}
                          title={reserva.estado === 'Rechazada' ? 'Marcar como Pendiente' : 'Rechazar'}
                        >
                          {reserva.estado === 'Rechazada' ? <FaExclamationCircle /> : <FaTimes />}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="11" className="empty-table-message">
                      No hay reservas a domicilio registradas.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            {totalPages > 1 && (
                <div className="pagination">
                  <button 
                    disabled={currentPage === 1} 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  >
                    Anterior
                  </button>
                  <span className="page-info">
                    Página {currentPage} de {totalPages}
                  </span>
                  <button 
                    disabled={currentPage === totalPages} 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  >
                    Siguiente
                  </button>
                </div>
              )}
          </div>
        </main>

        {/* MODAL DETALLES RESERVA */}
        {reservaSeleccionada && (
          <div className="foto-modal-backdrop" onClick={() => setReservaSeleccionada(null)}>
            <div className="detalles-modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="detalles-modal-header">
                <h2>Detalles de la reserva</h2>
                <button className="detalles-close-btn" onClick={() => setReservaSeleccionada(null)}><FaTimes /></button>
              </div>
              
              <div className="detalles-grid">
                <div className="detalle-item">
                  <FaTicketAlt className="detalle-icon" />
                  <div className="detalle-text">
                    <span>ID Reserva</span>
                    <strong className="text-green">{reservaSeleccionada.icReserva_A_Domicilio}</strong>
                  </div>
                </div>
                <div className="detalle-item">
                  <FaEnvelope className="detalle-icon" />
                  <div className="detalle-text">
                    <span>Correo electrónico</span>
                    <strong>{reservaSeleccionada.correo_Cliente_Domicilio}</strong>
                  </div>
                </div>
                <div className="detalle-item">
                  <FaCalendarCheck className="detalle-icon" />
                  <div className="detalle-text">
                    <span>Tipo de evento</span>
                    <strong>{reservaSeleccionada.tipo_Evento}</strong>
                  </div>
                </div>
                <div className="detalle-item">
                  <FaUser className="detalle-icon" />
                  <div className="detalle-text">
                    <span>Nombre del cliente</span>
                    <strong>{reservaSeleccionada.nombre_Cliente_Domicilio}</strong>
                  </div>
                </div>
                <div className="detalle-item">
                  <FaUsers className="detalle-icon" />
                  <div className="detalle-text">
                    <span>No. de personas</span>
                    <strong>{reservaSeleccionada.num_Personas}</strong>
                  </div>
                </div>
                <div className="detalle-item">
                  <FaUtensils className="detalle-icon" />
                  <div className="detalle-text">
                    <span>Tipo de menú</span>
                    <strong>{reservaSeleccionada.Menu_A_Domicilio?.nombre_Menu_A_Domicilio || 'Sin menú'}</strong>
                  </div>
                </div>
                <div className="detalle-item">
                  <FaPhone className="detalle-icon" />
                  <div className="detalle-text">
                    <span>Teléfono</span>
                    <strong>{reservaSeleccionada.tel_Cliente_Dom}</strong>
                  </div>
                </div>
                <div className="detalle-item">
                  <FaClock className="detalle-icon" />
                  <div className="detalle-text">
                    <span>Hora del evento</span>
                    <strong>{reservaSeleccionada.hora_Evento}</strong>
                  </div>
                </div>
                <div className="detalle-item">
                  <FaClock className="detalle-icon" />
                  <div className="detalle-text">
                    <span>Hora de servicio</span>
                    <strong>{reservaSeleccionada.hora_Servicio}</strong>
                  </div>
                </div>
                <div className="detalle-item">
                  <FaCalendarAlt className="detalle-icon" />
                  <div className="detalle-text">
                    <span>Fecha</span>
                    <strong>{reservaSeleccionada.fecha_Evento}</strong>
                  </div>
                </div>
              </div>

              <hr className="detalles-divider" />

              <div className="detalles-section">
                <h3>Dirección y especificaciones</h3>
                <p><strong>Dirección:</strong> {reservaSeleccionada.direccion_Exacta}</p>
                <p><strong>Especificaciones:</strong> {reservaSeleccionada.especificaciones || 'Ninguna especificación.'}</p>
                {reservaSeleccionada.Foto_Area_De_Trabajo && (
                  <div style={{marginTop: '15px'}}>
                    <strong>Foto del área de trabajo:</strong><br/>
                    <div className="foto-area-wrapper" title="Ver foto" onClick={() => setFotoAmpliada(reservaSeleccionada.Foto_Area_De_Trabajo)} style={{marginTop: '10px'}}>
                      <img src={reservaSeleccionada.Foto_Area_De_Trabajo} alt="Área de trabajo" width={100} height={100} />
                      <div className="foto-hover-overlay">Ver foto</div>
                    </div>
                  </div>
                )}
              </div>

              <button className="detalles-btn-cerrar" onClick={() => setReservaSeleccionada(null)}>Cerrar</button>
            </div>
          </div>
        )}

        {/* MODAL FOTO AMPLIADA */}
        {fotoAmpliada && (
          <div className="foto-modal-backdrop" onClick={() => setFotoAmpliada(null)}>
            <div className="foto-modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="foto-modal-close" onClick={() => setFotoAmpliada(null)}>&times;</button>
              <img src={fotoAmpliada} alt="Área de trabajo ampliada" />
            </div>
          </div>
        )}
    </>
  );
};

export default PanelReservasADomicilio;
