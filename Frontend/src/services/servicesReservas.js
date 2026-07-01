const API_URL = import.meta.env.VITE_API_URL;

export const getReservasRancho = async () => {
    
    const response = await fetch(`${API_URL}/reservas`, { credentials: 'include',
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

export const deleteReservaRancho = async (id) => {
    const response = await fetch(`${API_URL}/reservas/${id}`, { credentials: 'include',
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        }
    });
    return response.json();
}

export const getReservaRancho = async (id) => {
    const response = await fetch(`${API_URL}/reservas/${id}`, { credentials: 'include',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
    return response.json();
}

export const updateReservaRancho = async (id, data) => {
    const response = await fetch(`${API_URL}/reservas/${id}`, { credentials: 'include',
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });
    return response.json();
}

export const patchReservaRancho = async (id, data) => {
    const response = await fetch(`${API_URL}/reservas/${id}`, { credentials: 'include',
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });
    return response.json();
}