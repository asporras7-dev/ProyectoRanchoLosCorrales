import React from "react";
import "../styles/PanelAdministrador.css";
import Calendario from "../components/Calendario";
import CalendarioReservasADomicilio from "../components/CalendarioReservasADomicilio";
import CalendarioFiltro from "../components/CalendarioFiltro";
import { getReservasRancho, deleteReservaRancho, updateReservaRancho, patchReservaRancho } from "../services/servicesReservas";
import { getFechasBloqueadas, bloquearFecha, desbloquearFecha } from "../services/services";
import { exportarTabla, mapearReservasRancho } from "../utils/exportarReservas";
import Swal from "sweetalert2";
import {
  FaBars,
  FaHome,
  FaClipboardList,
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
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import Sidebar from "./Sidebar";
import PanelReservasADomicilio from "./PanelReservasADomicilio";
import PanelGestionUsuarios from "./PanelGestionUsuarios";
import logo from '../img/logo.png';

const PanelAdministrador = () => {
  const [reservas, setReservas] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState('Todos');
  const [filtroRango, setFiltroRango] = useState({ inicio: null, fin: null });
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [showCalendarFilter, setShowCalendarFilter] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [vistaActiva, setVistaActiva] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [reservaSeleccionada, setReservaSeleccionada] = useState(null);
  const [rolUsuario, setRolUsuario] = useState('');
  const exportMenuRef = useRef(null);
  const navigate = useNavigate();

    const fetchReservas = async () => {
      try {
        const data = await getReservasRancho();
        setReservas(data);
      } catch (error) {
        console.error('Error al obtener las reservas', error);
      }
    }

    const handleRemoveReserva = async (id) => {
      try {
        await deleteReservaRancho(id);
        fetchReservas();
      } catch (error) {
        console.error('Error al eliminar reserva', error);
      }
    }

    const handlePatchReserva = async (id, data) => {
      try {
        const reserva = reservas.find(r => r.idReserva === id);

        // Si se está aprobando la reserva, verificar si la fecha ya está bloqueada
        if (data.estado === 'Aprobada') {
          if (reserva) {
            const fechasBloqueadas = await getFechasBloqueadas();
            if (fechasBloqueadas.includes(reserva.fecha)) {
              Swal.fire({
                icon: 'error',
                title: 'Fecha no disponible',
                text: 'Esta fecha ya está reservada. No es posible aprobar esta reserva.',
                background: '#171212',
                color: '#fff',
                confirmButtonColor: '#8b0000',
              });
              return;
            }
            // Aprobar la reserva y bloquear la fecha en el calendario
            await patchReservaRancho(id, data);
            await bloquearFecha(reserva.fecha);
            fetchReservas();
            return;
          }
        }

        // Si la reserva estaba Aprobada y ahora se marca como Pendiente o Rechazada,
        // desbloquear la fecha en el calendario
        if (
          reserva &&
          reserva.estado === 'Aprobada' &&
          (data.estado === 'Pendiente' || data.estado === 'Rechazada')
        ) {
          await patchReservaRancho(id, data);
          try {
            await desbloquearFecha(reserva.fecha);
            
            // Mostrar SweetAlert informando que la fecha se desbloqueó
            const dateUTC = new Date(reserva.fecha + 'T12:00:00Z');
            const dia = dateUTC.getDate();
            const mes = dateUTC.toLocaleDateString('es-ES', { month: 'long' });
            const anio = dateUTC.getFullYear();
            const fechaFormateada = `${dia} de ${mes} del ${anio}`;
            
            Swal.fire({
              icon: 'info',
              title: 'Fecha desbloqueada',
              text: `La fecha de la reserva (${fechaFormateada}) ha sido desbloqueada en el calendario.`,
              background: '#171212',
              color: '#fff',
              confirmButtonColor: '#ff9800',
            });
            
          } catch (e) {
            console.warn('No se pudo desbloquear la fecha (puede que ya estuviera libre):', e);
          }
          fetchReservas();
          return;
        }

        await patchReservaRancho(id, data);
        fetchReservas();
      } catch (error) {
        console.error('Error al actualizar reserva', error);
      }
    }

    const handleUpdateReserva = async (id, data) => {
      try {
        await updateReservaRancho(id, data);
        fetchReservas();
      } catch (error) {
        console.error('Error al actualizar reserva', error);
      }
    }

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
      const filas = mapearReservasRancho(reservasFiltradas);
      exportarTabla(filas, `Reservas_rancho_${sufijo}`, formato);
      setShowExportMenu(false);
    };

    useEffect(() => {
      fetchReservas();
      const fetchRol = async () => {
        try {
          const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, { credentials: 'include' });
          const data = await res.json();
          if (data.usuario && data.usuario.rolNombre) {
            setRolUsuario(data.usuario.rolNombre);
          }
        } catch(e) { console.error(e); }
      };
      fetchRol();
    }, []);

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
          ? (reserva.fecha >= filtroRango.inicio && reserva.fecha <= filtroRango.fin)
          : true;
        return matchEstado && matchFecha;
      })
      .sort((a, b) => b.idReserva - a.idReserva);

    const totalPages = Math.ceil(reservasFiltradas.length / itemsPerPage) || 1;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentReservas = reservasFiltradas.slice(indexOfFirstItem, indexOfLastItem);

    return (
    <div className={`admin-container${sidebarOpen ? '' : ' sidebar-collapsed'}`}>
      {/* SIDEBAR */}
      <Sidebar vistaActiva={vistaActiva} setVistaActiva={setVistaActiva} rolUsuario={rolUsuario} />

      {/* CONTENT */}
      <div className="main-content">
        {/* HEADER */}
        <header className="topbar">
          <div className="left-topbar">
            <button
              type="button"
              className="menu-toggle-btn"
              onClick={() => setSidebarOpen((prev) => !prev)}
              aria-label={sidebarOpen ? 'Esconder menú' : 'Mostrar menu'}
              aria-expanded={sidebarOpen}
            >
              <FaBars className="menu-icon" />
              <span className="menu-toggle-tooltip" role="tooltip">
                {sidebarOpen ? 'Esconder menú' : 'Mostrar menu'}
              </span>
            </button>
          </div>

          <div className="right-topbar">
            <div className="admin-user">
              <img
                src={logo}
                alt="Rancho Los Corrales"
                className="admin-user-logo"
              />
              <span>Administrador</span>
            </div>
          </div>
        </header>

        {/* BODY */}
        {vistaActiva === 'dashboard' ? (
          <main className="dashboard">
            <div className="dashboard-header">
              <div className="dashboard-header-text">
                <h1>Reservas del rancho</h1>
                <p>Gestiona todas las reservas de tu restaurante</p>
              </div>

              <button
                type="button"
                className="calendar-btn"
                onClick={() => setVistaActiva('calendario')}
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
                    className="filter-select filter-select-paginator"
                  >
                    <option value="" disabled>Filtro registros por página</option>
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
                    <th>ID Reserva</th>
                    <th>Cliente</th>
                    <th>Correo</th>
                    <th>Teléfono</th>
                    <th>Fecha</th>
                    <th>Hora</th>
                    <th>Personas</th>
                    <th>Detalles Reserva</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>

                <tbody>
                  {currentReservas.length > 0 ? (
                    currentReservas.map(reserva => (
                      <tr key={reserva.idReserva}>
                        <td>{reserva.idReserva}</td>
                        <td>{reserva.nombreClienteReserva}</td>
                        <td>{reserva.correoClienteReserva}</td>
                        <td>{reserva.telClienteReserva}</td>
                        <td>{reserva.fecha}</td>
                        <td>{reserva.horaEvento}</td>
                        <td>{reserva.numPersonas}</td>
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
                            onClick={() => handlePatchReserva(reserva.idReserva, { estado: reserva.estado === 'Aprobada' ? 'Pendiente' : 'Aprobada' })}
                            title={reserva.estado === 'Aprobada' ? 'Marcar como Pendiente' : 'Aprobar'}
                          >
                            {reserva.estado === 'Aprobada' ? <FaExclamationCircle /> : <FaCheck />}
                          </button>

                          <button 
                            className={`reject ${reserva.estado === 'Rechazada' ? 'active' : ''}`} 
                            onClick={() => handlePatchReserva(reserva.idReserva, { estado: reserva.estado === 'Rechazada' ? 'Pendiente' : 'Rechazada' })}
                            title={reserva.estado === 'Rechazada' ? 'Marcar como Pendiente' : 'Rechazar'}
                          >
                            {reserva.estado === 'Rechazada' ? <FaExclamationCircle /> : <FaTimes />}
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="10" className="empty-table-message">
                        No hay reservas registradas.
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
                        <strong className="text-green">{reservaSeleccionada.idReserva}</strong>
                      </div>
                    </div>
                    <div className="detalle-item">
                      <FaEnvelope className="detalle-icon" />
                      <div className="detalle-text">
                        <span>Correo electrónico</span>
                        <strong>{reservaSeleccionada.correoClienteReserva}</strong>
                      </div>
                    </div>
                    <div className="detalle-item">
                      <FaCalendarCheck className="detalle-icon" />
                      <div className="detalle-text">
                        <span>Tipo de evento</span>
                        <strong>{reservaSeleccionada.tipoEvento}</strong>
                      </div>
                    </div>
                    <div className="detalle-item">
                      <FaUser className="detalle-icon" />
                      <div className="detalle-text">
                        <span>Nombre del cliente</span>
                        <strong>{reservaSeleccionada.nombreClienteReserva}</strong>
                      </div>
                    </div>
                    <div className="detalle-item">
                      <FaUsers className="detalle-icon" />
                      <div className="detalle-text">
                        <span>No. de personas</span>
                        <strong>{reservaSeleccionada.numPersonas}</strong>
                      </div>
                    </div>
                    <div className="detalle-item">
                      <FaUtensils className="detalle-icon" />
                      <div className="detalle-text">
                        <span>Tipo de menú</span>
                        <strong>{reservaSeleccionada.Menu?.nombre_Menu || 'Sin menú'}</strong>
                      </div>
                    </div>
                    <div className="detalle-item">
                      <FaPhone className="detalle-icon" />
                      <div className="detalle-text">
                        <span>Teléfono</span>
                        <strong>{reservaSeleccionada.telClienteReserva}</strong>
                      </div>
                    </div>
                    <div className="detalle-item">
                      <FaClock className="detalle-icon" />
                      <div className="detalle-text">
                        <span>Hora del evento</span>
                        <strong>{reservaSeleccionada.horaEvento}</strong>
                      </div>
                    </div>
                    <div className="detalle-item">
                      <FaListUl className="detalle-icon" />
                      <div className="detalle-text">
                        <span>Servicios adicionales</span>
                        <strong>{(reservaSeleccionada.servicio_Adicionals || reservaSeleccionada.servicio_Adicionals || reservaSeleccionada.ServicioAdicionals || []).length} servicios</strong>
                      </div>
                    </div>
                    <div className="detalle-item">
                      <FaCalendarAlt className="detalle-icon" />
                      <div className="detalle-text">
                        <span>Fecha</span>
                        <strong>{reservaSeleccionada.fecha}</strong>
                      </div>
                    </div>
                  </div>

                  <hr className="detalles-divider" />

                  <div className="detalles-section">
                    <h3>Servicios adicionales</h3>
                    <div className="servicios-badges">
                      {(reservaSeleccionada.servicio_Adicionals || reservaSeleccionada.servicio_Adicionals || reservaSeleccionada.ServicioAdicionals || []).length > 0 ? (
                        (reservaSeleccionada.servicio_Adicionals || reservaSeleccionada.servicio_Adicionals || reservaSeleccionada.ServicioAdicionals).map(servicio => (
                          <span key={servicio.idservicio_Adicional} className="badge-green">
                            <FaCheck className="badge-icon" /> {servicio.nombre}
                          </span>
                        ))
                      ) : (
                        <span>No hay servicios adicionales</span>
                      )}
                    </div>
                  </div>

                  <div className="detalles-section">
                    <h3>Especificaciones</h3>
                    <p>{reservaSeleccionada.especificaciones || 'Ninguna especificación.'}</p>
                  </div>

                  <button className="detalles-btn-cerrar" onClick={() => setReservaSeleccionada(null)}>Cerrar</button>
                </div>
              </div>
            )}
          </main>
        ) : vistaActiva === 'calendario' ? (
          <main className="dashboard dashboard-calendario">
             <Calendario modo="admin" />
          </main>
        ) : vistaActiva === 'calendarioDomicilio' ? (
          <main className="dashboard dashboard-calendario">
             <CalendarioReservasADomicilio modo="admin" />
          </main>
        ) : vistaActiva === 'reservasDomicilio' ? (
          <PanelReservasADomicilio onVisualizarCalendario={() => setVistaActiva('calendarioDomicilio')} />
        ) : vistaActiva === 'gestionUsuarios' ? (
          <PanelGestionUsuarios />
        ) : null}
      </div>
    </div>
  );
};

export default PanelAdministrador;