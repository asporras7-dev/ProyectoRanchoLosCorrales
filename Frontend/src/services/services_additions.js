
// ======================================================
// FECHAS BLOQUEADAS
// ======================================================

/**
 * Obtiene todas las fechas bloqueadas.
 * Respuesta esperada del backend: array de strings "YYYY-MM-DD"
 * Ejemplo: ["2025-07-04", "2025-12-25"]
 */


export const getFechasBloqueadas = async () => {
    try {
        const response = await fetch(`${API_URL}/fechas-bloqueadas`);
        const data = await response.json();
        // Normaliza: acepta array de strings o array de objetos { fecha: "YYYY-MM-DD" }
        if (Array.isArray(data) && data.length > 0 && typeof data[0] === "object") {
            return data.map((item) => item.fecha);
        }
        return data;
    } catch (error) {
        console.error("Error al obtener las fechas bloqueadas:", error);
        return [];
    }
};

/**
 * Bloquea una fecha.
 * @param {string} fecha - "YYYY-MM-DD"
 */
export const bloquearFecha = async (fecha) => {
    try {
        const response = await fetch(`${API_URL}/fechas-bloqueadas`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ fecha }),
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || "Error al bloquear la fecha.");
        }
        return data;
    } catch (error) {
        console.error("Error al bloquear fecha:", error);
        throw error;
    }
};

/**
 * Desbloquea una fecha.
 * @param {string} fecha - "YYYY-MM-DD"
 */
export const desbloquearFecha = async (fecha) => {
    try {
        const response = await fetch(`${API_URL}/fechas-bloqueadas/${fecha}`, {
            method: "DELETE",
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || "Error al desbloquear la fecha.");
        }
        return data;
    } catch (error) {
        console.error("Error al desbloquear fecha:", error);
        throw error;
    }
};
