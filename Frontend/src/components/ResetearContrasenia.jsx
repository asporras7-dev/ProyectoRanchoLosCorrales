import { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import "../styles/RecuperarContrasenia.css";
import logo from '../img/logo.png';

export default function ResetearContrasenia() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Las contraseñas no coinciden.",
        confirmButtonColor: "#f7a000",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });
      const data = await res.json();

      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "¡Contraseña actualizada!",
          text: data.msg || "Tu contraseña ha sido cambiada exitosamente.",
          confirmButtonColor: "#f7a000",
        });
        setTimeout(() => navigate("/ingreso"), 2000);
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: data.msg || "No se pudo actualizar la contraseña.",
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
          <FaLock className="rc-icon" />
        </div>

        <h1 className="rc-title">Cambiar contraseña</h1>
        <p className="rc-subtitle">
          Crea una nueva contraseña segura<br />para tu cuenta
        </p>

        <form onSubmit={handleReset}>
          <div className="rc-input-group">
            <label className="rc-label">Nueva contraseña</label>
            <div className="rc-input-container">
              <FaLock className="rc-input-icon" />
              <input
                type={showNew ? "text" : "password"}
                placeholder="Ingresa tu nueva contraseña"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="rc-input"
              />
              <span className="rc-eye-icon" onClick={() => setShowNew((p) => !p)}>
                {showNew ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          <div className="rc-input-group">
            <label className="rc-label">Confirmar nueva contraseña</label>
            <div className="rc-input-container">
              <FaLock className="rc-input-icon" />
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Confirma tu nueva contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="rc-input"
              />
              <span className="rc-eye-icon" onClick={() => setShowConfirm((p) => !p)}>
                {showConfirm ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          <button type="submit" className="rc-btn" disabled={loading}>
            {loading ? "Actualizando..." : "Actualizar contraseña"}
          </button>
        </form>

        <p className="rc-footer-text rc-back-link">
          <Link to="/ingreso" className="rc-link">
            ← Volver al inicio de sesión
          </Link>
        </p>
      </div>

      <footer className="rc-page-footer">
        <p>© 2024 Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}