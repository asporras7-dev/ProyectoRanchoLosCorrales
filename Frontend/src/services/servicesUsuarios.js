const API_URL = import.meta.env.VITE_API_URL;

export const getUsuarios = async () => {
    const response = await fetch(`${API_URL}/usuarios`, { credentials: 'include',
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

export const createUsuario = async (data) => {
    const response = await fetch(`${API_URL}/usuarios`, { credentials: 'include',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    return response.json();
}

export const deleteUsuario = async (id) => {
    const response = await fetch(`${API_URL}/usuarios/${id}`, { credentials: 'include',
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        }
    });
    if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    return response.json();
}

export const getRoles = async () => {
    const response = await fetch(`${API_URL}/roles`, { credentials: 'include',
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
