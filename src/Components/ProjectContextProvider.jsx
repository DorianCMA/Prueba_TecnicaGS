// src/components/PrivateRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProjectContextProvider = ({ element }) => {
    const location = useLocation();
    const authToken = localStorage.getItem('authToken');

    if (!authToken) {
        // Redirige al usuario a la página de login si no está autenticado
        return <Navigate to="/login" state={{ from: location }} />;
    }

    // Renderiza el componente si está autenticado
    return element;
};

export default ProjectContextProvider;
