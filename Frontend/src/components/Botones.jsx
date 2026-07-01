import { useState } from "react";
import FormularioReservaRancho from "./FormularioReservaRancho";
import FormularioReservaADomicilio from "./FormularioReservaADomicilio";
import "../styles/Botones.css";
import iconClose from "../img/icon-close.png";

export default function Botones() {
  const [modalAbierto, setModalAbierto] = useState(null); // "rancho" | "domicilio" | null

  const abrirModal = (tipo) => setModalAbierto(tipo);
  const cerrarModal = () => setModalAbierto(null);

  return (
    <>
      <div className="botones-contenedor">
        <button
          className="btn-reserva btn-rancho"
          onClick={() => abrirModal("rancho")}
        >
          🏡 Reserva Rancho
        </button>
        <button
          className="btn-reserva btn-domicilio"
          onClick={() => abrirModal("domicilio")}
        >
          🛵 Reserva a Domicilio
        </button>
      </div>

      {/* Modal Rancho */}
      {modalAbierto === "rancho" && (
        <div className="modal-overlay" onClick={cerrarModal}>
          <div
            className="modal-contenido"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal-cerrar" onClick={cerrarModal}>
              <img src={iconClose} alt="Cerrar" className="btn-cerrar-foto" />
            </button>
            <FormularioReservaRancho onCerrar={cerrarModal} />
          </div>
        </div>
      )}

      {/* Modal Domicilio */}
      {modalAbierto === "domicilio" && (
        <div className="modal-overlay" onClick={cerrarModal}>
          <div
            className="modal-contenido"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal-cerrar" onClick={cerrarModal}>
              <img src={iconClose} alt="Cerrar" className="btn-cerrar-foto" />
            </button>
            <FormularioReservaADomicilio onCerrar={cerrarModal} />
          </div>
        </div>
      )}
    </>
  );
}
