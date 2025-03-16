import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';


const ProtectedRoutes = () => {

    const rolePermissions = {
        admin: ['/', '/business', '/business/add-business', '/business/add-photos', '/categories', '/categories/add-category', '/users', '/users/add-user', '/advertisements', '/advertisements/add-advertisements', '/cities', '/cities/add-cities', '/profile'],
        technician: ['/' ,'/categories', '/advertisements', '/cities', '/profile'],
        reviewer: ['/' ,'/business', '/profile']
      };

    const { authToken , userRole } = useAuth();

    if (!authToken) return <Navigate to='/login' />;

    const allowedRoutes = rolePermissions[userRole] || [];
    if (!allowedRoutes.includes(location.pathname)) {
        return <Navigate to='/' />;
    }

    return <Outlet />;
};

export default ProtectedRoutes;
