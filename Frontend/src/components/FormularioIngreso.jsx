import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import "../styles/FormularioIngreso.css";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import logo from '../img/logo.png';

const FormularioIngreso = () => {
  const [correo, setCorreo] = useState("");
  const [contrasenia, setContrasenia] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();


  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ correo, contrasenia }),
      });

      const data = await response.json();

      if (response.ok) {

        Swal.fire({
          icon: "success",
          title: "¡Bienvenido!",
          text: data.message,
          timer: 1500,
          showConfirmButton: false,
        });

        // Guardar token y redirigir
        localStorage.setItem('token', data.token);
        navigate("/panel");
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: data.message || "Credenciales incorrectas",
        });
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      Swal.fire({
        icon: "error",
        title: "Error de conexión",
        text: "No se pudo conectar con el servidor",
      });
    }
  };

  return (
    <div className="login-page">
      <div className="overlay"></div>

      <header className="login-header">
        <div className="logo-container">
          <img
            src={logo}
            alt="logo"
          />
        </div>
      </header>

      <div className="login-card">
        <h1>Iniciar sesión</h1>
        <p>Accede a tu cuenta para continuar</p>

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>Correo electrónico</label>

            <div className="input-container">
              <FaEnvelope className="icon" />
              <input 
                type="email" 
                placeholder="ejemplo@correo.com" 
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label>Contraseña</label>

            <div className="input-container">
              <FaLock className="icon" />
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Ingresa tu contraseña" 
                value={contrasenia}
                onChange={(e) => setContrasenia(e.target.value)}
                required
              />
              {showPassword ? (
                <FaEyeSlash className="eye-icon" onClick={() => setShowPassword(false)} style={{ cursor: 'pointer' }} />
              ) : (
                <FaEye className="eye-icon" onClick={() => setShowPassword(true)} style={{ cursor: 'pointer' }} />
              )}
            </div>
          </div>

          <div className="options">
            <Link to="/forgot-password">¿Olvidaste tu contraseña?</Link>
          </div>

          <button type="submit">Iniciar sesión</button>
        </form>
      </div>

      <footer className="login-footer">
        <p>© 2024 Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};

export default FormularioIngreso;