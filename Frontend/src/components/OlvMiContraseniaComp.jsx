import { useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { FaEnvelope } from "react-icons/fa";
import "../styles/RecuperarContrasenia.css";
import logo from '../img/logo.png';

export default function OlvMiContraseniaComp() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "¡Correo enviado!",
          text: data.msg || "Revisa tu bandeja de entrada.",
          confirmButtonColor: "#f7a000",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: data.msg || "No se pudo enviar el correo.",
          confirmButtonColor: "#f7a000",
        });
      }
    } catch {
      Swal.fire({
        icon: "error",
        title: "Error de conexión",
        text: "No se pudo conectar con el servidor.",
        confirmButtonColor: "#f7a000",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rc-page">
      <div className="rc-overlay"></div>

      <header className="rc-header">
        <div className="rc-logo-container">
          <img
            src={logo}
            alt="logo"
          />
        </div>
      </header>

      <div className="rc-card">
        {/* Ícono superior */}
        <div className="rc-icon-circle">
          <FaEnvelope className="rc-icon" />
        </div>

        <h1 className="rc-title">Recuperar contraseña</h1>
        <p className="rc-subtitle">
          Ingresa tu correo electrónico y te enviaremos<br />un código de verificación
        </p>

        <form onSubmit={handleSubmit}>
          <div className="rc-input-group">
            <label className="rc-label">Correo electrónico</label>
            <div className="rc-input-container">
              <FaEnvelope className="rc-input-icon" />
              <input
                type="email"
                placeholder="ejemplo@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="rc-input"
              />
            </div>
          </div>

          <button type="submit" className="rc-btn" disabled={loading}>
            {loading ? "Enviando..." : "Enviar código"}
          </button>
        </form>

        <p className="rc-footer-text">
          ¿Recordaste tu contraseña?{" "}
          <Link to="/ingreso" className="rc-link">
            Iniciar sesión
          </Link>
        </p>
      </div>

      <footer className="rc-page-footer">
        <p>© 2024 Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}