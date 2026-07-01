const generarTemplateReserva = (tipo, datos) => {
  // Colores de la marca
  const colorFondo = "#070707";
  const colorAcento = "#f7a000";
  const colorBlanco = "#ffffff";
  const colorTexto = "#333333";
  const colorFondoTarjeta = "#f9f9f9";

  const titulo = tipo === "rancho" ? "Nueva Reserva en el Rancho" : "Nueva Reserva de Parrillada a Domicilio";

  // Función para formatear servicios adicionales o menús
  const formatearServicios = (servicios) => {
    if (!servicios || servicios.length === 0) return "Ninguno";
    return servicios.map(s => `<li>${s.nombre || s.nombre_Menu}</li>`).join("");
  };

  return `
    <div style="font-family: 'Arial', sans-serif; background-color: ${colorFondo}; padding: 40px 20px; margin: 0; color: ${colorBlanco};">
      <div style="max-width: 600px; margin: 0 auto; background-color: ${colorBlanco}; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.5);">
        
        <!-- Header -->
        <div style="background-color: ${colorFondo}; padding: 30px; text-align: center; border-bottom: 4px solid ${colorAcento};">
          <img src="https://parrilladacorrales.com/test/assets/logo.png" alt="Rancho Los Corrales" style="width: 120px; filter: brightness(0) invert(1);" />
          <h1 style="color: ${colorAcento}; margin: 20px 0 0 0; font-size: 24px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
            ${titulo}
          </h1>
        </div>

        <!-- Body -->
        <div style="padding: 30px; color: ${colorTexto}; background-color: ${colorFondoTarjeta};">
          <p style="font-size: 16px; line-height: 1.5; margin-bottom: 25px;">
            Se ha recibido una nueva solicitud de reserva. A continuación, se detallan los datos ingresados por el cliente:
          </p>

          <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
            <tbody>
              <tr>
                <td style="padding: 12px; border-bottom: 1px solid #ddd; font-weight: bold; width: 40%;">Cliente:</td>
                <td style="padding: 12px; border-bottom: 1px solid #ddd;">${datos.nombreClienteReserva || datos.nombreCliente || datos.nombre_Cliente_Domicilio}</td>
              </tr>
              <tr>
                <td style="padding: 12px; border-bottom: 1px solid #ddd; font-weight: bold;">Correo:</td>
                <td style="padding: 12px; border-bottom: 1px solid #ddd;">${datos.correoClienteReserva || datos.correoCliente || datos.correo_Cliente_Domicilio}</td>
              </tr>
              <tr>
                <td style="padding: 12px; border-bottom: 1px solid #ddd; font-weight: bold;">Teléfono:</td>
                <td style="padding: 12px; border-bottom: 1px solid #ddd;">${datos.telClienteReserva || datos.telCliente || datos.tel_Cliente_Dom}</td>
              </tr>
              <tr>
                <td style="padding: 12px; border-bottom: 1px solid #ddd; font-weight: bold;">Fecha:</td>
                <td style="padding: 12px; border-bottom: 1px solid #ddd;">${datos.fecha || datos.fecha_Evento}</td>
              </tr>
              <tr>
                <td style="padding: 12px; border-bottom: 1px solid #ddd; font-weight: bold;">Hora del Evento:</td>
                <td style="padding: 12px; border-bottom: 1px solid #ddd;">${datos.horaEvento || datos.hora_Evento}</td>
              </tr>
              ${datos.hora_Servicio ? `
              <tr>
                <td style="padding: 12px; border-bottom: 1px solid #ddd; font-weight: bold;">Hora del Servicio:</td>
                <td style="padding: 12px; border-bottom: 1px solid #ddd;">${datos.hora_Servicio}</td>
              </tr>
              ` : ''}
              ${datos.direccion_Exacta ? `
              <tr>
                <td style="padding: 12px; border-bottom: 1px solid #ddd; font-weight: bold;">Dirección Exacta:</td>
                <td style="padding: 12px; border-bottom: 1px solid #ddd;">${datos.direccion_Exacta}</td>
              </tr>
              ` : ''}
              <tr>
                <td style="padding: 12px; border-bottom: 1px solid #ddd; font-weight: bold;">Personas:</td>
                <td style="padding: 12px; border-bottom: 1px solid #ddd;">${datos.numPersonas || datos.num_Personas}</td>
              </tr>
              ${datos.tipoEvento || datos.tipo_Evento ? `
              <tr>
                <td style="padding: 12px; border-bottom: 1px solid #ddd; font-weight: bold;">Tipo de Evento:</td>
                <td style="padding: 12px; border-bottom: 1px solid #ddd;">${datos.tipoEvento || datos.tipo_Evento}</td>
              </tr>
              ` : ''}
              ${datos.Menu || datos.Menu_A_Domicilio || datos.MenuADomicilio ? `
              <tr>
                <td style="padding: 12px; border-bottom: 1px solid #ddd; font-weight: bold;">Menú Seleccionado:</td>
                <td style="padding: 12px; border-bottom: 1px solid #ddd;">${datos.Menu?.nombre_Menu || datos.Menu_A_Domicilio?.nombre_Menu_A_Domicilio || datos.MenuADomicilio?.nombre_Menu_A_Domicilio || datos.MenuADomicilio?.nombre_Menu || 'Menú no especificado'}</td>
              </tr>
              ` : ''}
            </tbody>
          </table>

          <div style="margin-bottom: 25px;">
            <h3 style="color: ${colorFondo}; border-bottom: 2px solid ${colorAcento}; padding-bottom: 5px;">Servicios Adicionales</h3>
            <ul style="padding-left: 20px; margin-top: 10px;">
              ${formatearServicios(datos.ServicioAdicionals || datos.servicio_Adicionals)}
            </ul>
          </div>

          ${datos.especificaciones ? `
          <div style="margin-bottom: 25px;">
            <h3 style="color: ${colorFondo}; border-bottom: 2px solid ${colorAcento}; padding-bottom: 5px;">Especificaciones</h3>
            <p style="background-color: #fff; padding: 15px; border-radius: 8px; border: 1px solid #ddd;">${datos.especificaciones}</p>
          </div>
          ` : ''}

          <div style="text-align: center; margin-top: 40px;">
            <a href="https://parrilladacorrales.com/test/panel" style="background-color: ${colorAcento}; color: ${colorBlanco}; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
              Ir al Panel de Administrador
            </a>
          </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #f1f1f1; padding: 20px; text-align: center; color: #888; font-size: 12px;">
          <p style="margin: 0;">Este es un mensaje automático generado por el sistema de reservas de Rancho Los Corrales.</p>
          <p style="margin: 5px 0 0 0;">© ${new Date().getFullYear()} Rancho Los Corrales. Todos los derechos reservados.</p>
        </div>
      </div>
    </div>
  `;
};

const generarTemplateReservaDomicilio = (datos) => {
  const colorFondo = "#070707";
  const colorAcento = "#f7a000";
  const colorBlanco = "#ffffff";
  const colorTexto = "#333333";
  const colorFondoTarjeta = "#f9f9f9";

  return `
    <div style="font-family: 'Arial', sans-serif; background-color: ${colorFondo}; padding: 40px 20px; margin: 0; color: ${colorBlanco};">
      <div style="max-width: 600px; margin: 0 auto; background-color: ${colorBlanco}; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.5);">
        <div style="background-color: ${colorFondo}; padding: 30px; text-align: center; border-bottom: 4px solid ${colorAcento};">
          <img src="https://parrilladacorrales.com/test/assets/logo-parrillada-corrales-BYPalIbl.webp" alt="Rancho Los Corrales" style="width: 120px; filter: brightness(0) invert(1);" />
          <h1 style="color: ${colorAcento}; margin: 20px 0 0 0; font-size: 24px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
            Nueva Reserva de Parrillada a Domicilio
          </h1>
        </div>
        <div style="padding: 30px; color: ${colorTexto}; background-color: ${colorFondoTarjeta};">
          <p style="font-size: 16px; line-height: 1.5; margin-bottom: 25px;">
            Se ha recibido una nueva solicitud de reserva a domicilio. A continuación, se detallan los datos:
          </p>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
            <tbody>
              <tr>
                <td style="padding: 12px; border-bottom: 1px solid #ddd; font-weight: bold; width: 40%;">Cliente:</td>
                <td style="padding: 12px; border-bottom: 1px solid #ddd;">${datos.nombre_Cliente_Domicilio || 'No especificado'}</td>
              </tr>
              <tr>
                <td style="padding: 12px; border-bottom: 1px solid #ddd; font-weight: bold;">Correo:</td>
                <td style="padding: 12px; border-bottom: 1px solid #ddd;">${datos.correo_Cliente_Domicilio || 'No especificado'}</td>
              </tr>
              <tr>
                <td style="padding: 12px; border-bottom: 1px solid #ddd; font-weight: bold;">Teléfono:</td>
                <td style="padding: 12px; border-bottom: 1px solid #ddd;">${datos.tel_Cliente_Dom || 'No especificado'}</td>
              </tr>
              <tr>
                <td style="padding: 12px; border-bottom: 1px solid #ddd; font-weight: bold;">Fecha:</td>
                <td style="padding: 12px; border-bottom: 1px solid #ddd;">${datos.fecha_Evento || 'No especificada'}</td>
              </tr>
              <tr>
                <td style="padding: 12px; border-bottom: 1px solid #ddd; font-weight: bold;">Hora del Evento:</td>
                <td style="padding: 12px; border-bottom: 1px solid #ddd;">${datos.hora_Evento || 'No especificada'}</td>
              </tr>
              <tr>
                <td style="padding: 12px; border-bottom: 1px solid #ddd; font-weight: bold;">Hora del Servicio:</td>
                <td style="padding: 12px; border-bottom: 1px solid #ddd;">${datos.hora_Servicio || 'No especificada'}</td>
              </tr>
              <tr>
                <td style="padding: 12px; border-bottom: 1px solid #ddd; font-weight: bold;">Dirección Exacta:</td>
                <td style="padding: 12px; border-bottom: 1px solid #ddd;">${datos.direccion_Exacta || 'No especificada'}</td>
              </tr>
              <tr>
                <td style="padding: 12px; border-bottom: 1px solid #ddd; font-weight: bold;">Personas:</td>
                <td style="padding: 12px; border-bottom: 1px solid #ddd;">${datos.num_Personas || 'No especificado'}</td>
              </tr>
              <tr>
                <td style="padding: 12px; border-bottom: 1px solid #ddd; font-weight: bold;">Tipo de Evento:</td>
                <td style="padding: 12px; border-bottom: 1px solid #ddd;">${datos.tipo_Evento || 'No especificado'}</td>
              </tr>
              <tr>
                <td style="padding: 12px; border-bottom: 1px solid #ddd; font-weight: bold;">Menú Seleccionado:</td>
                <td style="padding: 12px; border-bottom: 1px solid #ddd;">${(datos.Menu_A_Domicilio && datos.Menu_A_Domicilio.nombre_Menu_A_Domicilio) ? datos.Menu_A_Domicilio.nombre_Menu_A_Domicilio : 'Menú no especificado'}</td>
              </tr>
            </tbody>
          </table>
          <div style="margin-bottom: 25px;">
            <h3 style="color: ${colorFondo}; border-bottom: 2px solid ${colorAcento}; padding-bottom: 5px;">Especificaciones</h3>
            <p style="background-color: #fff; padding: 15px; border-radius: 8px; border: 1px solid #ddd;">${datos.especificaciones || 'Ninguna especificación adicional.'}</p>
          </div>
          <div style="text-align: center; margin-top: 40px;">
            <a href="https://parrilladacorrales.com/test/panel" style="background-color: ${colorAcento}; color: ${colorBlanco}; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
              Ir al Panel de Administrador
            </a>
          </div>
        </div>
      </div>
    </div>
  `;
};

module.exports = { generarTemplateReserva, generarTemplateReservaDomicilio };
