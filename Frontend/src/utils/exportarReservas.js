import * as XLSX from "xlsx";

/**
 * exportarTabla
 *
 * Exporta un array de objetos planos a CSV o XLSX y dispara la descarga.
 *
 * @param {Object[]} filas       - Array de objetos { "Columna": valor, ... }
 * @param {string}   nombreBase  - Nombre completo del archivo sin extensión
 * @param {"csv"|"xlsx"} formato - Formato de exportación
 */
export function exportarTabla(filas, nombreBase, formato) {
  if (!filas || filas.length === 0) return;

  const hoja = XLSX.utils.json_to_sheet(filas);
  const libro = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(libro, hoja, "Reservas");

  if (formato === "csv") {
    XLSX.writeFile(libro, `${nombreBase}.csv`, { bookType: "csv" });
  } else {
    XLSX.writeFile(libro, `${nombreBase}.xlsx`, { bookType: "xlsx" });
  }
}


/**
 * mapearReservasRancho
 *
 * Convierte el array crudo de reservas del rancho a objetos planos
 * con nombres de columna en español, listos para exportar.
 *
 * @param {Object[]} reservas
 * @returns {Object[]}
 */
export function mapearReservasRancho(reservas) {
  return reservas.map((r) => ({
    "ID Reserva": r.idReserva ?? "",
    "Nombre Cliente": r.nombreClienteReserva ?? "",
    "Correo": r.correoClienteReserva ?? "",
    "Teléfono": r.telClienteReserva ?? "",
    "Fecha": r.fecha ?? "",
    "Hora Evento": r.horaEvento ?? "",
    "Número de Personas": r.numPersonas ?? "",
    "Tipo de Evento": r.tipoEvento ?? "",
    "Menú": r.Menu?.nombre_Menu ?? "Sin menú",
    "Servicios Adicionales": (
      r.servicio_Adicionals?.length
        ? r.servicio_Adicionals.map((s) => s.nombre).join(", ")
        : r.ServicioAdicionals?.length
        ? r.ServicioAdicionals.map((s) => s.nombre).join(", ")
        : "Ninguno"
    ),
    "Decoración Temática": r.Decoracion_Tematica?.nombre ?? "Sin decoración",
    "Especificaciones": r.especificaciones ?? "",
    "Estado": r.estado ?? "Pendiente",
  }));
}

/**
 * mapearReservasDomicilio
 *
 * Convierte el array crudo de reservas a domicilio a objetos planos
 * con nombres de columna en español, listos para exportar.
 *
 * @param {Object[]} reservas
 * @returns {Object[]}
 */
export function mapearReservasDomicilio(reservas) {
  return reservas.map((r) => ({
    "ID": r.icReserva_A_Domicilio ?? "",
    "Nombre Cliente": r.nombre_Cliente_Domicilio ?? "",
    "Correo": r.correo_Cliente_Domicilio ?? "",
    "Teléfono": r.tel_Cliente_Dom ?? "",
    "Fecha Evento": r.fecha_Evento ?? "",
    "Hora Evento": r.hora_Evento ?? "",
    "Hora Servicio": r.hora_Servicio ?? "",
    "Número de Personas": r.num_Personas ?? "",
    "Tipo de Evento": r.tipo_Evento ?? "",
    "Menú": r.Menu_A_Domicilio?.nombre_Menu_A_Domicilio ?? "Sin menú",
    "Dirección": r.direccion_Exacta ?? "",
    "Ubicación GPS": r.ubicacion_Gps_Opcional ?? "",
    "Especificaciones": r.especificaciones ?? "",
    "Foto Área de Trabajo (URL)": r.Foto_Area_De_Trabajo ?? "",
    "Estado": r.estado ?? "Pendiente",
  }));
}
