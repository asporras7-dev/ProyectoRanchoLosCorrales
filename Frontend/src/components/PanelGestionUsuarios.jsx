import React, { useState, useEffect } from "react";
import "../styles/PanelAdministrador.css";
import { getUsuarios, createUsuario, deleteUsuario, getRoles } from "../services/servicesUsuarios";
import { FaUsers, FaUser, FaTimes, FaUserPlus, FaEnvelope, FaLock, FaUserTag } from "react-icons/fa";
import Swal from "sweetalert2";

const PanelGestionUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [filtroRol, setFiltroRol] = useState('Todos');
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [nuevoUsuario, setNuevoUsuario] = useState({
    correo: '',
    contrasenia: '',
    Rol_idRol: ''
  });

  const fetchUsuariosData = async () => {
    setCargando(true);
    try {
      const [usuariosData, rolesData] = await Promise.all([
        getUsuarios(),
        getRoles()
      ]);
      setUsuarios(usuariosData);
      setRoles(rolesData);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      Swal.fire('Error', 'No se pudieron cargar los datos.', 'error');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    fetchUsuariosData();
  }, []);

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e63946',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, borrar usuario',
      cancelButtonText: 'Cancelar'
    });

    if (confirm.isConfirmed) {
      try {
        await deleteUsuario(id);
        Swal.fire('¡Eliminado!', 'El usuario ha sido eliminado.', 'success');
        fetchUsuariosData();
      } catch (error) {
        console.error('Error al eliminar usuario:', error);
        Swal.fire('Error', 'No se pudo eliminar el usuario.', 'error');
      }
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createUsuario(nuevoUsuario);
      Swal.fire('¡Éxito!', 'Usuario creado exitosamente.', 'success');
      setModalVisible(false);
      setNuevoUsuario({ correo: '', contrasenia: '', Rol_idRol: '' });
      fetchUsuariosData();
    } catch (error) {
      console.error('Error al crear usuario:', error);
      Swal.fire('Error', 'No se pudo crear el usuario. Verifica los datos.', 'error');
    }
  };

  // Filtrado y paginación
  const usuariosFiltrados = usuarios
    .filter(u => filtroRol === 'Todos' || u.Rol?.nombre_Rol === filtroRol)
    .sort((a, b) => b.idUsuario - a.idUsuario);

  const totalPages = Math.ceil(usuariosFiltrados.length / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsuarios = usuariosFiltrados.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <>
      <main className="dashboard">
        <div className="dashboard-header">
          <div className="dashboard-header-text">
            <h1>Gestión de Usuarios</h1>
            <p>Administra los usuarios del sistema</p>
          </div>
        </div>

        {/* STATS */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-card-icon stat-card-icon-blue">
              <FaUsers />
            </div>
            <div className="stat-card-body">
              <h3>Total Usuarios</h3>
              <h2>{usuarios.length}</h2>
              <span>Todos los usuarios</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-card-icon stat-card-icon-green">
              <FaUser />
            </div>
            <div className="stat-card-body">
              <h3>Administradores</h3>
              <h2>{usuarios.filter(u => ['Administrador', 'Admin'].includes(u.Rol?.nombre_Rol)).length}</h2>
              <span>Acceso total</span>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-card-icon stat-card-icon-yellow">
              <FaUserTag />
            </div>
            <div className="stat-card-body">
              <h3>Moderadores</h3>
              <h2>{usuarios.filter(u => u.Rol?.nombre_Rol === 'Moderador').length}</h2>
              <span>Gestión de reservas</span>
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="table-container">
          <div className="table-header">
            <h2>Todos los usuarios</h2>

            <div className="filters">
              <select
                value={filtroRol}
                onChange={(e) => {
                  setFiltroRol(e.target.value);
                  setCurrentPage(1);
                }}
                className="filter-select"
              >
                <option value="Todos">Todos los roles</option>
                {roles.map(rol => (
                  <option key={rol.idRol} value={rol.nombre_Rol}>{rol.nombre_Rol}</option>
                ))}
              </select>

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
              </select>

              <button
                type="button"
                style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#1db954' }}
                onClick={() => setModalVisible(true)}
              >
                <FaUserPlus /> Agregar Usuario
              </button>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Correo</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {cargando ? (
                <tr>
                  <td colSpan="4" className="empty-table-message">
                    Cargando usuarios...
                  </td>
                </tr>
              ) : currentUsuarios.length > 0 ? (
                currentUsuarios.map(usuario => (
                  <tr key={usuario.idUsuario}>
                    <td>{usuario.idUsuario}</td>
                    <td>{usuario.correo}</td>
                    <td>
                      <span className={`status ${usuario.Rol?.nombre_Rol === 'Administrador' ? 'approved' : 'pending'}`}>
                        {usuario.Rol?.nombre_Rol || 'Desconocido'}
                      </span>
                    </td>
                    <td className="actions">
                      <button
                        className="reject"
                        onClick={() => handleDelete(usuario.idUsuario)}
                        title="Eliminar usuario"
                      >
                        <FaTimes />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="empty-table-message">
                    No hay usuarios registrados.
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

      {/* MODAL AGREGAR USUARIO */}
      {modalVisible && (
        <div className="foto-modal-backdrop" onClick={() => setModalVisible(false)}>
          <div className="detalles-modal-content" style={{ width: '500px' }} onClick={(e) => e.stopPropagation()}>
            <div className="detalles-modal-header">
              <h2>Agregar Nuevo Usuario</h2>
              <button className="detalles-close-btn" onClick={() => setModalVisible(false)}><FaTimes /></button>
            </div>
            
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500'}}>Correo Electrónico</label>
                <input
                  type="email"
                  value={nuevoUsuario.correo}
                  onChange={(e) => setNuevoUsuario({...nuevoUsuario, correo: e.target.value})}
                  required
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #ddd', backgroundColor: 'white', color: 'black' }}
                  placeholder="ejemplo@correo.com"
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Contraseña</label>
                <input
                  type="password"
                  value={nuevoUsuario.contrasenia}
                  onChange={(e) => setNuevoUsuario({...nuevoUsuario, contrasenia: e.target.value})}
                  required
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #ddd', backgroundColor: 'white', color: 'black'}}
                  placeholder="Mínimo 6 caracteres"
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Rol</label>
                <select
                  value={nuevoUsuario.Rol_idRol}
                  onChange={(e) => setNuevoUsuario({...nuevoUsuario, Rol_idRol: e.target.value})}
                  required
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #ddd', backgroundColor: 'white', color: 'black'}}
                >
                  <option value="" disabled>Seleccione un rol</option>
                  {roles.map(rol => (
                    <option key={rol.idRol} value={rol.idRol}>{rol.nombre_Rol}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="submit" style={{ flex: 1, padding: '12px', background: '#f7a000', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>
                  Guardar Usuario
                </button>
                <button type="button" onClick={() => setModalVisible(false)} style={{ flex: 1, padding: '12px', background: '#f5f5f5', color: '#333', border: '1px solid #ddd', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default PanelGestionUsuarios;
