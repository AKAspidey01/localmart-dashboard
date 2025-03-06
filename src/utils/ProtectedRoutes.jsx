import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';


const ProtectedRoutes = () => {
    const { authToken } = useAuth();

    return authToken ? <Outlet /> : <Navigate to='/login' />;
};

export default ProtectedRoutes;
