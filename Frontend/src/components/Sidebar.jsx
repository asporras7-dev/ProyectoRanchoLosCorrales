import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaHome,
  FaCalendarAlt,
  FaTruck,
  FaUsers,
  FaSignOutAlt
} from "react-icons/fa";
import '../styles/Sidebar.css';
import logo from '../img/logo.png';



const Sidebar = ({ vistaActiva, setVistaActiva, rolUsuario }) => {
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    try {
      localStorage.removeItem('token');
      await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, { method: 'POST', credentials: 'include' });
    } catch (error) {
      console.error(error);
    }
    navigate('/ingreso');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <div className="logo">
          <img
            src={logo}
            alt="logo"
          />
        </div>

        <nav>
          <ul>
            <li 
              className={vistaActiva === 'dashboard' ? 'active' : ''} 
              onClick={() => setVistaActiva('dashboard')}
            >
              <FaHome />
              Reservas Rancho
            </li>

            <li 
              className={vistaActiva === 'calendario' ? 'active' : ''} 
              onClick={() => setVistaActiva('calendario')}
            >
              <FaCalendarAlt />
              Calendario Reservas Rancho
            </li>

            <li 
              className={vistaActiva === 'reservasDomicilio' ? 'active' : ''}
              onClick={() => setVistaActiva('reservasDomicilio')}
            >
              <FaTruck />
              Reservas domicilio
            </li>

            <li 
              className={vistaActiva === 'calendarioDomicilio' ? 'active' : ''} 
              onClick={() => setVistaActiva('calendarioDomicilio')}
            >
              <FaCalendarAlt />
              Calendario Reservas a Domicilio
            </li>

            {rolUsuario === 'Administrador' && (
              <li 
                className={vistaActiva === 'gestionUsuarios' ? 'active' : ''} 
                onClick={() => setVistaActiva('gestionUsuarios')}
              >
                <FaUsers />
                Gestión de Usuarios
              </li>
            )}

            <li onClick={handleLogout}>
              <FaSignOutAlt />
              Cerrar sesión
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
