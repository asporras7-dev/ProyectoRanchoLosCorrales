import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const [isAuthorized, setIsAuthorized] = useState(null);

    useEffect(() => {
        const verifySession = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
                    credentials: 'include'
                });

                if (!response.ok) {
                    throw new Error('No autorizado');
                }

                const data = await response.json();
                const rol = data.usuario.rolNombre;

                if (allowedRoles && !allowedRoles.includes(rol)) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Acceso Denegado',
                        text: 'No se puede acceder a el panel porque el usuario logueado no tiene permisos.',
                        confirmButtonColor: '#d33'
                    });
                    setIsAuthorized(false);
                    return;
                }

                setIsAuthorized(true);
            } catch (error) {
                Swal.fire({
                    icon: 'warning',
                    title: 'No autenticado',
                    text: 'Debes iniciar sesión para acceder al panel.',
                    confirmButtonColor: '#3085d6'
                });
                setIsAuthorized(false);
            }
        };

        verifySession();
    }, [allowedRoles]);

    if (isAuthorized === null) {
        return null; // Esperando a que el efecto termine
    }

    if (!isAuthorized) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
