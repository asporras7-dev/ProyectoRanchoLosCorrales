const API_URL = import.meta.env.VITE_API_URL;

export const postReservaRancho = async (reserva) => {
    try {
        let horaEvento = "00:00";
        if (reserva.horaEvento) {
            const partes = reserva.horaEvento.split(" - ");
            if (partes.length === 1) {
                horaEvento = partes[0];
            }
        }

        let menuId = 1;
        if (reserva.tipoMenu === "Menú Estándar") menuId = 2;
        else if (reserva.tipoMenu === "Menú Premium") menuId = 3;
        else if (reserva.tipoMenu === "Menú Personalizado") menuId = 4;

        let tipoE = reserva.tipoEvento;
        const validTipos = ["Boda",
            "Quinceaños",
            "Cumpleaños",
            "Primera comunión",
            "Bautizo",
            "Corporativo",
            "Team building o capacitación",
            "Fiesta de Empresa",
            "Fiestas infantiles",
            "Actividades wellness"];
        if (!validTipos.includes(tipoE)) tipoE = "Otro";

        const datosReserva = {
            nombreClienteReserva: reserva.nombre,
            correoClienteReserva: reserva.correo,
            telClienteReserva: reserva.telefono,
            fecha: reserva.fecha,
            tipoEvento: tipoE,
            numPersonas: reserva.noPersonas ? parseInt(reserva.noPersonas) : 1,
            horaEvento: horaEvento,
            Menu_idMenu: reserva.Menu_idMenu ? parseInt(reserva.Menu_idMenu) : menuId,
            especificaciones: reserva.informacion || "",
            servicios_Adicionales: reserva.serviciosAdicionalesIds ? reserva.serviciosAdicionalesIds.length : 0,
            decoracionTematicaId: reserva.decoracionTematicaId ? parseInt(reserva.decoracionTematicaId) : null,
            serviciosAdicionalesIds: reserva.serviciosAdicionalesIds || [],
            estado: "Pendiente"
        }
        const response = await fetch(`${API_URL}/reservas`, { credentials: 'include',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datosReserva)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Error al registrar el usuario.');
        }

        return data;

    } catch (error) {
        console.error("Error al reservar en el rancho", error);
    }
}



export const postReservaADomicilio = async (reservaADomicilio) => {
    try {
        // Función reutilizable de conversión 12h → 24h
        const convertirA24h = (hora12h) => {
            if (!hora12h) return "00:00:00";
            const [time, modifier] = hora12h.split(" ");
            let [hours, minutes] = time.split(":");
            hours = parseInt(hours);
            if (modifier === "AM" && hours === 12) hours = 0;
            if (modifier === "PM" && hours !== 12) hours += 12;
            return `${hours.toString().padStart(2, "0")}:${minutes || "00"}:00`;
        };

        // Conversión de ambas horas
        const horaEvento = convertirA24h(reservaADomicilio.horaEvento);
        const horaServicio = convertirA24h(reservaADomicilio.horaServicio);

        let menuId = 1;
        if (reservaADomicilio.tipoMenu === "Menú Estándar") menuId = 2;
        else if (reservaADomicilio.tipoMenu === "Menú Premium") menuId = 3;
        else if (reservaADomicilio.tipoMenu === "Menú Personalizado") menuId = 4;

        let tipoE = reservaADomicilio.tipoEvento;
        if (!tipoE) tipoE = "Otro";

        // Subir foto a Cloudinary directamente desde el frontend (si existe)
        let fotoUrl = "";
        if (reservaADomicilio.fotoLugar) {
            try {
                const cloudFormData = new FormData();
                cloudFormData.append('file', reservaADomicilio.fotoLugar);
                cloudFormData.append('upload_preset', 'reservas_parrillada');
                cloudFormData.append('folder', 'reservas_parrillada');

                const cloudRes = await fetch(
                    'https://api.cloudinary.com/v1_1/de1x3uhbn/image/upload',
                    { method: 'POST', body: cloudFormData }
                );
                const cloudData = await cloudRes.json();
                if (cloudData.secure_url) {
                    fotoUrl = cloudData.secure_url;
                }
            } catch (cloudError) {
                console.error("Error subiendo imagen a Cloudinary:", cloudError);
            }
        }

        // Enviar siempre como JSON al backend (ya no se usa FormData)
        const reqBody = JSON.stringify({
            fecha_Evento: reservaADomicilio.fecha,
            tipo_Evento: tipoE,
            num_Personas: reservaADomicilio.noPersonas ? parseInt(reservaADomicilio.noPersonas) : 1,
            hora_Evento: horaEvento,
            hora_Servicio: horaServicio,
            especificaciones: reservaADomicilio.especificaciones || "",
            Menu_A_Domicilio_idMenu_A_Domicilio: menuId,
            ubicacion_Gps_Opcional: reservaADomicilio.ubicacionGps || "",
            Foto_Area_De_Trabajo: fotoUrl,
            direccion_Exacta: reservaADomicilio.direccion || "No especificada",
            nombre_Cliente_Domicilio: reservaADomicilio.nombre,
            correo_Cliente_Domicilio: reservaADomicilio.correo || "",
            tel_Cliente_Dom: reservaADomicilio.telefono || "",
            estado: "Pendiente"
        });

        const response = await fetch(`${API_URL}/reservas-a-domicilio`, { credentials: 'include',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: reqBody
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Error al registrar la reserva a domicilio.');
        }

        return data;

    } catch (error) {
        console.error("Error al reservar a domicilio", error);
    }
};

export const getServiciosAdicionales = async () => {
    try {
        const response = await fetch(`${API_URL}/servicios-adicionales`, { credentials: 'include' });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error al obtener los servicios adicionales:", error);
    }
}

export const getCategorias = async () => {
    try {
        const response = await fetch(`${API_URL}/categorias`, { credentials: 'include' });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error al obtener las categorias:", error);
    }
}

export const getMenus = async () => {
    try {
        const response = await fetch(`${API_URL}/menus`, { credentials: 'include' });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error al obtener los menús:", error);
    }
}

export const getDecoracionesTematicas = async () => {
    try {
        const response = await fetch(`${API_URL}/decoraciones-tematicas`, { credentials: 'include' });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error al obtener las decoraciones temáticas:", error);
    }
}

export const login = async (correo, contrasenia) => {
    try {
        const response = await fetch(`${API_URL}/auth/login`, { credentials: 'include',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ correo, contrasenia })
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error al iniciar sesión:", error);
    }
}

export const getFechasBloqueadas = async () => {
    try {
        const response = await fetch(`${API_URL}/fechas-bloqueadas`, { credentials: 'include' });
        const data = await response.json();
        if (response.ok) {
            // Mapear los objetos devueltos por la BD a un array de strings ["YYYY-MM-DD"]
            return data.map(f => {
                // Asegurar que la fecha se formatea correctamente a ISO independientemente del timezone
                const dateObj = new Date(f.fecha);
                return dateObj.toISOString().split('T')[0];
            });
        }
        return [];
    } catch (error) {
        console.error("Error al obtener las fechas bloqueadas:", error);
        return [];
    }
}

export const bloquearFecha = async (isoString) => {
    try {
        const response = await fetch(`${API_URL}/fechas-bloqueadas`, { credentials: 'include',
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ fecha: isoString })
        });
        if (!response.ok) {
            throw new Error('Error al bloquear la fecha');
        }
        return await response.json();
    } catch (error) {
        console.error("Error al bloquear fecha:", error);
        throw error;
    }
}

export const desbloquearFecha = async (isoString) => {
    try {
        const response = await fetch(`${API_URL}/fechas-bloqueadas/fecha/${isoString}`, { credentials: 'include',
            method: 'DELETE',
            headers: {
            }
        });
        if (!response.ok) {
            throw new Error('Error al desbloquear la fecha');
        }
        return await response.json();
    } catch (error) {
        console.error("Error al desbloquear fecha:", error);
        throw error;
    }
}

export const getFechasBloqueadasADomicilio = async () => {
    try {
        const response = await fetch(`${API_URL}/fechas-bloqueadas-a-domicilio`, { credentials: 'include' });
        const data = await response.json();
        if (response.ok) {
            // Mapear los objetos devueltos por la BD a un array de strings ["YYYY-MM-DD"]
            return data.map(f => {
                // Asumiendo que el campo es fecha_Bloqueada
                const dateObj = new Date(f.fecha_Bloqueada);
                return dateObj.toISOString().split('T')[0];
            });
        }
        return [];
    } catch (error) {
        console.error("Error al obtener las fechas bloqueadas a domicilio:", error);
        return [];
    }
}

export const bloquearFechaADomicilio = async (isoString) => {
    try {
        const response = await fetch(`${API_URL}/fechas-bloqueadas-a-domicilio`, { credentials: 'include',
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ fecha_Bloqueada: isoString }) // Revisar payload según el controlador
        });
        if (!response.ok) {
            throw new Error('Error al bloquear la fecha a domicilio');
        }
        return await response.json();
    } catch (error) {
        console.error("Error al bloquear fecha a domicilio:", error);
        throw error;
    }
}

export const desbloquearFechaADomicilio = async (isoString) => {
    try {
        const response = await fetch(`${API_URL}/fechas-bloqueadas-a-domicilio/fecha/${isoString}`, { credentials: 'include',
            method: 'DELETE',
            headers: {
            }
        });
        if (!response.ok) {
            throw new Error('Error al desbloquear la fecha a domicilio');
        }
        return await response.json();
    } catch (error) {
        console.error("Error al desbloquear fecha a domicilio:", error);
        throw error;
    }
}
