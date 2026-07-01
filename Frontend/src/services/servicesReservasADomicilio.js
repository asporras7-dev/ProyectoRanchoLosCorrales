const API_URL = import.meta.env.VITE_API_URL;

export const getReservasADomicilio = async () => {
    
    const response = await fetch(`${API_URL}/reservas-a-domicilio`, { credentials: 'include',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
    if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    return response.json();
}

export const deleteReservaADomicilio = async (id) => {
    const response = await fetch(`${API_URL}/reservas-a-domicilio/${id}`, { credentials: 'include',
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        }
    });
    return response.json();
}

export const getReservaADomicilioPorId = async (id) => {
    const response = await fetch(`${API_URL}/reservas-a-domicilio/${id}`, { credentials: 'include',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
    return response.json();
}

export const updateReservaADomicilio = async (id, data) => {
    const response = await fetch(`${API_URL}/reservas-a-domicilio/${id}`, { credentials: 'include',
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });
    return response.json();
}

export const patchReservaADomicilio = async (id, data) => {
    const response = await fetch(`${API_URL}/reservas-a-domicilio/${id}`, { credentials: 'include',
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });
    return response.json();
}